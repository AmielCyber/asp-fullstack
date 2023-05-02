using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate;

// Table for order
public class Order
{
    public int Id { get; set; }
    public string BuyerId { get; set; } // User's username.
    [Required]
    public ShippingAddress ShippingAddress { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.Now;
    public List<OrderItem> OrderItems { get; set; }
    public long SubTotal { get; set; }
    public long DeliveryFee { get; set; }
    public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
    // For stripe payment intent 
    public string PaymentIntentId { get; set; }

    public long GetTotal()
    {
        return SubTotal + DeliveryFee;
    }
}