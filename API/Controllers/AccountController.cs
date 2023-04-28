using API.Data;
using API.DTOs;
using Microsoft.AspNetCore.Identity;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    // User Manager for injection to interact with our database.
    // Allows to create a user in our database.
    private readonly UserManager<User> _userManager;
    private readonly TokenService _tokenService;
    private readonly StoreContext _context;

    // Allows us to create a user.
    public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)
    {
        _context = context;
        // Allows us to login and register users.
        _userManager = userManager;
        _tokenService = tokenService;
    }

    // We presume we get the LoginDto is in the body
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        // Check if there is a user by name.
        var user = await _userManager.FindByNameAsync(loginDto.UserName);

        // If there is no user or password does not match.
        if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
        {
            return Unauthorized();
        }

        // Return user object.
        var userCart = await RetrieveCart(loginDto.UserName);
        var anonCart = await RetrieveCart(Request.Cookies["buyerId"]);

        // Make sure only one cart exists.
        if (anonCart != null)
        {
            if (userCart != null)
            {
                _context.Carts.Remove(userCart);
            }

            anonCart.BuyerId = user.UserName;
            Response.Cookies.Delete("buyerId");
            await _context.SaveChangesAsync();
        }

        return new UserDto
        {
            Email = user.Email,
            Token = await _tokenService.GenerateToken(user),
            Cart = anonCart != null ? anonCart.MapCartToDto() : userCart?.MapCartToDto()
        };
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto registerDto)
    {
        // Create new user.
        var user = new User { UserName = registerDto.UserName, Email = registerDto.Email };

        // Save results from our user manager that will check if email is unique, password is valid, and other options
        // stated in Program.cs
        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            // Add all error validation in the response body.
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem();
        }

        // Create new user into our database.
        await _userManager.AddToRoleAsync(user, "Member");

        return StatusCode(201);
    }

    // Protect route end point.
    [Authorize]
    [HttpGet("currentUser")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        // Get user.
        var user = await _userManager.FindByNameAsync(User.Identity.Name);
        var userCart = await RetrieveCart(User.Identity.Name);

        return new UserDto
        {
            Email = user?.Email,
            Token = await _tokenService.GenerateToken(user),
            Cart = userCart?.MapCartToDto()
        };
    }
    private async Task<Cart> RetrieveCart(string buyerId)
    {
        if (string.IsNullOrEmpty(buyerId))
        {
            Response.Cookies.Delete("buyerId");
            return null;
        }
        return await _context.Carts
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
    }

}