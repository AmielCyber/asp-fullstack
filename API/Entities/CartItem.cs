using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    // Give name of CartItems
    [Table("CartItems")]
    public class CartItem
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        // Navigation properties.
        // Make a relation.
        // We are just going to see the product id.
        // One to One relationship.
        // Entity framework convention, we need to state the relationship with id.
        public int ProductId { get; set; }
        public Product Product { get; set; }

        // Data Transfer Objects (DTO). Creates objects that shape our data. Plain Objects

        public int CartId { get; set; }
        public Cart Cart { get; set; }
    }
}