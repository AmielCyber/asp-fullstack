using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class CartController : BaseApiController
    {
        private readonly StoreContext _context;
        public CartController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            // Cart will be stored in a cookie
            Cart cart = await RetrieveCart();

            if (cart == null)
            {
                return NotFound();
            }
            return new CartDto
            {
                Id = cart.Id,
                BuyerId = cart.BuyerId,
                Items = cart.Items.Select(item => new CartItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity,

                }).ToList()
            };
        }


        // Query string must match the parameter name.
        [HttpPost]  // /api/carts?productId=3&quantity=2
        public async Task<ActionResult> AddItemToCart(int productId, int quantity)
        {
            // Get cart.
            var cart = await RetrieveCart();
            // Check if cart does not exist
            if (cart == null)
            {
                // Create cart if needed.
                cart = CreateCart();
            }
            // Get products.
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return NotFound();
            }
            // Add item.
            cart.AddItem(product, quantity);
            // Save changes.
            // Returns an integer of how many changes have been committed.
            int result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return StatusCode(201);
            }
            return BadRequest(new ProblemDetails { Title = "Problem saving item to cart." });
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveCartItem(int productId, int quantity)
        {
            // Get Cart.
            Cart cart = await RetrieveCart();
            if(cart == null)
            {
                return NotFound();
            }
            // Remove item or reduce quantity.
            cart.RemoveItem(productId, quantity);
            // Save Changes.
            int result = await _context.SaveChangesAsync();
            if(result < 1){
                return BadRequest(new ProblemDetails{Title = "Problem removing item from the cart."});
            }

            return Ok();
        }

        private async Task<Cart> RetrieveCart()
        {
            return await _context.Carts
                            .Include(i => i.Items)
                            .ThenInclude(p => p.Product)
                            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }

        private Cart CreateCart()
        {
            // Create a random id.
            var buyerId = Guid.NewGuid().ToString();
            // Create cookie and set cookie options.
            var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            // Create cart.
            var cart = new Cart { BuyerId = buyerId };
            // Make the entity framework trace this cart now.
            _context.Carts.Add(cart);
            return cart;
        }
    }
}