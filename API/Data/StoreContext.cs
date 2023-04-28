using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;    // To the DbContext.

namespace API.Data
{
    // We use to perform CRUD operations with the Entity Framework to perform SQL queries.
    // Replaced DbContext with IdentityDbContext<User> to use authentication with EF
    public class StoreContext : IdentityDbContext<User>
    {
        // Table for products 
        public DbSet<Product> Products { get; set; }
        public DbSet<Cart> Carts { get; set; }

        public StoreContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // When creating a migration...
            base.OnModelCreating(builder);

            // Add some data to our DB when when we create a migration.
            // Create a table for rows.
            builder.Entity<IdentityRole>()
                // Add Roles.
                .HasData(
                    new IdentityRole { Name = "Member", NormalizedName = "MEMBER" },
                    new IdentityRole { Name = "Admin", NormalizedName = "ADMIN" }
                );
        }
    }
}