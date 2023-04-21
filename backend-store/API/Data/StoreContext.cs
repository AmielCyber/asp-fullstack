using API.Entities;
using Microsoft.EntityFrameworkCore;    // To the DbContext.

namespace API.Data
{
    // We use to perform CRUD operations with the Entity Framework to perform SQL queries.
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions options) : base(options)
        {
        }

        // Table for products 
        public DbSet<Product> Products {get; set;}
    }
}