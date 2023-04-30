using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate;

// The properties in this entity will be in the owner property
// Rather then a property living in another table.
[Owned]
public class ShippingAddress : Address
{

}