using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class CartController : BaseApiController
{
    private readonly StoreContext _context;
    public CartController(StoreContext context)
    {
        _context = context;
    }

    // Give this route the name
    [HttpGet(Name = "GetBasket")]
    public async Task<ActionResult<CartDto>> GetCart()
    {
        // Cart will be stored in a cookie
        var cart = await RetrieveCart(GetBuyerId());

        if (cart == null)
        {
            return NotFound();
        }

        return cart.MapCartToDto();
    }


    // Query string must match the parameter name.
    [HttpPost]  // /api/carts?productId=3&quantity=2
    public async Task<ActionResult<CartDto>> AddItemToCart(int productId, int quantity)
    {
        // Get cart.
        // Check if cart does not exist
        // Create cart if needed.
        var cart = await RetrieveCart(GetBuyerId()) ?? CreateCart();

        // Get products.
        var product = await _context.Products.FindAsync(productId);

        if (product == null)
        {
            return BadRequest(new ProblemDetails { Title = "Product Not Found" });
        }
        // Add item.
        cart.AddItem(product, quantity);
        // Save changes.
        // Returns an integer of how many changes have been committed.
        var result = await _context.SaveChangesAsync();

        if (result > 0)
        {
            // Send a 201 code and the location of the url used to create in the header.
            return CreatedAtRoute("GetBasket", cart.MapCartToDto());
        }
        return BadRequest(new ProblemDetails { Title = "Problem saving item to cart." });
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveCartItem(int productId, int quantity)
    {
        // Get Cart.
        var cart = await RetrieveCart(GetBuyerId());

        if (cart == null)
        {
            return NotFound();
        }
        // Remove item or reduce quantity.
        cart.RemoveItem(productId, quantity);
        // Save Changes.
        var result = await _context.SaveChangesAsync();
        if (result < 1)
        {
            return BadRequest(new ProblemDetails { Title = "Problem removing item from the cart." });
        }

        return Ok();
    }

    private async Task<Cart> RetrieveCart(string buyerId)
    {
        if (!string.IsNullOrEmpty(buyerId))
            return await _context.Carts
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        Response.Cookies.Delete("buyerId");
        return null;
    }

    private string GetBuyerId()
    {
        // We are going to have our username or cookie.
        return User.Identity?.Name ?? Request.Cookies["buyerId"];
    }

    private Cart CreateCart()
    {
        // Create a random id.
        var buyerId = User.Identity?.Name;
        if (string.IsNullOrEmpty(buyerId))
        {
            buyerId = Guid.NewGuid().ToString();
            // Create cookie and set cookie options.
            var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
        }
        // Create cart.
        var cart = new Cart { BuyerId = buyerId };
        // Make the entity framework trace this cart now.
        _context.Carts.Add(cart);
        return cart;
    }


}