using API.Entities;

namespace API.DTOs;

// User Data Transfer object for response.
public class UserDto
{
    public string Email { get; set; }
    public string Token { get; set; }
    public CartDto Cart { get; set; }
}