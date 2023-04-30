using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate;

// A snapshot of the items as it was when it was ordered.
[Owned]
public class ProductItemOrdered
{
    public int ProductId { get; set; }
    public string Name { get; set; }
    public string PictureUrl { get; set; }
}