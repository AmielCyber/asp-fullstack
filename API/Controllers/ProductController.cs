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
            // Set a query for products 
            // IQueryable provides functionality to evaluate queries on our DB.
            var query = _context.Products
                .Sort(productParams.OrderBy)
                .Search(productParams.SearchTerm)
                .Filter(productParams.Brands, productParams.Types)
                .AsQueryable(); // Convert IEnumerable into an IQueryable

            // Call the DB with the the queries and set it as a list.
            var products =
                await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

            // Add the metadata we stored in the MetaData property in PagedList
            Response.AddPaginationHeader(products.MetaData);

            // Return a list in order and filtered by the search params.
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
            // Get the distinct brands and types from our database.
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok(new { brands, types });
        }

    }
}