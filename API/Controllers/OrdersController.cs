using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class OrdersController : BaseApiController
{
    private readonly StoreContext _storeContext;

    public OrdersController(StoreContext storeContext)
    {
        _storeContext = storeContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetOrders()
    {
        return await _storeContext.Orders
            .ProjectOrderToOrderDto()
            .Where(o => o.BuyerId == User.Identity.Name)
            .ToListAsync();
    }

    [HttpGet("{id}", Name = "GetOrder")]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
    {
        return await _storeContext.Orders
            .ProjectOrderToOrderDto()
            // Match order with user id and login username and the order id equals the id
            .Where(o => o.BuyerId == User.Identity.Name && o.Id == id)
            .FirstOrDefaultAsync();
    }

    [HttpPost]
    public async Task<ActionResult<int>> CreateOrder(CreateOrderDto orderDto)
    {
        // Get the cart from our database
        var cart = await _storeContext.Carts
            .RetrieveCartWithItems(User.Identity.Name)
            .FirstOrDefaultAsync();
        // Cart not found in our DB
        if (cart == null)
        {
            return BadRequest(new ProblemDetails { Title = "Could not locate basket" });
        }

        // Create order items based on items on cart.
        var items = new List<OrderItem>();

        // Check items on our database.
        foreach (var item in cart.Items)
        {
            // Get product item from our DB.
            var productItem = await _storeContext.Products.FindAsync(item.ProductId);
            var itemOrdered = new ProductItemOrdered
            {
                ProductId = productItem.Id,
                Name = productItem.Name,
                PictureUrl = productItem.PictureUrl,
            };
            var orderItem = new OrderItem
            {
                ItemOrdered = itemOrdered,
                Price = productItem.Price,
                Quantity = item.Quantity,
            };
            items.Add(orderItem);
            productItem.QuantityInStock -= item.Quantity;
        }

        var subtotal = items.Sum(item => item.Price * item.Quantity);
        var deliveryFee = subtotal > 1000 ? 0 : 500;

        var order = new Order
        {
            OrderItems = items,
            BuyerId = User.Identity.Name,
            ShippingAddress = orderDto.ShippingAddress,
            SubTotal = subtotal,
            DeliveryFee = deliveryFee,
            PaymentIntentId = cart.PaymentIntentId,
        };

        // Add order and remove cart.
        _storeContext.Orders.Add(order);
        _storeContext.Carts.Remove(cart);

        // Save the user's address.
        if (orderDto.SaveAddress)
        {
            var user = await _storeContext.Users
                .Include(a => a.Address)
                .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            var address = new UserAddress
            {
                FullName = orderDto.ShippingAddress.FullName,
                Address1 = orderDto.ShippingAddress.Address1,
                Address2 = orderDto.ShippingAddress.Address2,
                City = orderDto.ShippingAddress.City,
                State = orderDto.ShippingAddress.State,
                Zip = orderDto.ShippingAddress.Zip,
                Country = orderDto.ShippingAddress.Country,
            };
            user.Address = address;
        }

        // Save changes.
        var result = await _storeContext.SaveChangesAsync() > 0;
        if (result)
        {
            return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);
        }

        return BadRequest("Problem creating order");
    }


}