using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Entities;

namespace API.Controllers
{

    /* Removed since our base api controller will handle the dependency injections, is derived from BaseApiController instead of Controller Base
    // Mark as controller for dependency injection.
    [ApiController]
    [Route("api/[controller]")]
    // route will be: /api/product
    */
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;
        // Dependency injection constructor
        public ProductsController(StoreContext context)
        {
            _context = context;
        }

        // Create endpoint
        // Best practice to make all endpoint methods asynchronous.
        // /api/products
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            // Get products from our database and turn it into a list.
            return await _context.Products.ToListAsync();
        }

        // /api/products/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }
            return product;
        }

    }
}