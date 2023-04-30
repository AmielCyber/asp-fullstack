using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Identity;

namespace API.Entities;

// Comes with multiple properties.
// Default of IdentityUser is to string as its primary
// Use integer to use a related property since a user address key in an integer.
public class User : IdentityUser<int>
{
    // Create a one to one relationship.
    public UserAddress Address { get; set; }
}