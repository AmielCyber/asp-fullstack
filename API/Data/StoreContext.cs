using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;    // To the DbContext.

namespace API.Data;
// We use to perform CRUD operations with the Entity Framework to perform SQL queries.
// Replaced DbContext with IdentityDbContext<User> to use authentication with EF
// All of our Classes are going to use an integer as their id.
public class StoreContext : IdentityDbContext<User, Role, int>
{
    // Tables in our application.
    public DbSet<Product> Products { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<Order> Orders { get; set; }

    public StoreContext(DbContextOptions options) : base(options)
    {
    }

    // Override the model creating method 
    // Create identity roles.
    protected override void OnModelCreating(ModelBuilder builder)
    {
        // Fluent configuration.

        // When creating a migration...
        base.OnModelCreating(builder);

        builder.Entity<User>()
            // Has one address.
            .HasOne(a => a.Address)
            // User has one address with one user.
            .WithOne()
            // User address as foreign key
            .HasForeignKey<UserAddress>(a => a.Id)
            // User address gets deleted.
            .OnDelete(DeleteBehavior.Cascade);

        // Add some data to our DB when when we create a migration.
        // Create a table for rows.
        builder.Entity<Role>()
            // Add Roles.
            // We need to specify the id since we are manually creating roles.
            .HasData(
                new Role { Id = 1, Name = "Member", NormalizedName = "MEMBER" },
                new Role { Id = 2, Name = "Admin", NormalizedName = "ADMIN" }
            );
    }
}