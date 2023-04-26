using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;

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
        // Query string value orderBy
        // Add attribute that the params are query
        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams)
        {
            // Get products from our database and turn it into a list.
            var query = _context.Products
                .Sort(productParams.OrderBy)
                .Search(productParams.SearchTerm)
                .Filter(productParams.Brands, productParams.Types)
                .AsQueryable();

            var products =
                await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

            // Return a sorted list.
            Response.AddPaginationHeader(products.MetaData);

            return products;
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

        [HttpGet("filters")]
        public async Task<ActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok(new { brands, types });
        }

    }
}