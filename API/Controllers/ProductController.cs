using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;

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

        private readonly IMapper _mapper;
        private readonly ImageService _imageService;

        // Dependency injection constructor
        public ProductsController(StoreContext context, IMapper mapper, ImageService imageService)
        {
            _context = context;
            _mapper = mapper;
            _imageService = imageService;
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
        [HttpGet("{id}", Name = "GetProduct")]
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
        
        // Admin endpoint.
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm]CreateProductDto productDto)
        {
            // Map product dto to Product
            var product = _mapper.Map<Product>(productDto);
            if (productDto.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(productDto.File);
                if (imageResult.Error != null)
                {
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });
                }

                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;
            }
            
            _context.Products.Add(product);
            
            var result = await _context.SaveChangesAsync() > 0;
            if (result)
            {
                return CreatedAtRoute("GetProduct", new { Id = product.Id }, product);
            }

            return BadRequest(new ProblemDetails { Title = "Problem creating new product." });
        }
        
        // Admin endpoint.
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult> UpdateProduct([FromForm]UpdateProductDto productDto)
        {
            var product = await _context.Products.FindAsync(productDto.Id);
            if (product == null)
            {
                return NotFound();
            }
            
            _mapper.Map(productDto, product);

            if (productDto.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(productDto.File);
                if (imageResult.Error != null)
                {
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });
                }

                if (!string.IsNullOrEmpty(product.PublicId))
                {
                    await _imageService.DeleteImageAsync(product.PublicId);
                }

                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;
            }

            var result = await _context.SaveChangesAsync() > 0;
            if (result)
            {
                return Ok(product);
            }

            return BadRequest(new ProblemDetails { Title = "Problem updating product" });
        }
        
        // Admin endpoint.
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }
            if (!string.IsNullOrEmpty(product.PublicId))
            {
                await _imageService.DeleteImageAsync(product.PublicId);
            }

            _context.Products.Remove(product);

            var result = await _context.SaveChangesAsync() > 0;
            if (result)
            {
                return Ok();
            }
            return BadRequest(new ProblemDetails { Title = "Problem deleting product" });
        }
    }
}