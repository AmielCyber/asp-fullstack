using System.Text;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Entities;
using API.Middleware;
using API.RequestHelpers;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

// Create a web application host.
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Ordering is not important.
// AKA Dependency injection container.

// Web API controller for routes.
builder.Services.AddControllers();
// Add Mapper service and tell where to find mapping profiles
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);
// Adding swagger dependencies for swagger content.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opt =>
{
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Put Bearer + your token in the box below",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };
    opt.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    opt.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            jwtSecurityScheme, Array.Empty<string>()
        }
    });
});
// Add DbContext 
builder.Services.AddDbContext<StoreContext>(opt =>
{
    // Specify options from our configuration.
    // SQLite
    // opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
    // Postgres
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();
// Identity Roles.
builder.Services.AddIdentityCore<User>(opt =>
// Set options for Users
    {
        opt.User.RequireUniqueEmail = true;
    })
    // Add roles
    .AddRoles<Role>()
    // Add Entity Framework implementation of identity information stores.
    .AddEntityFrameworkStores<StoreContext>();
// Add authentication configuration.
// Add JWT Bearer service
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,    // Check the lifetime of the token.
            ValidateIssuerSigningKey = true,
            IssuerSigningKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<ImageService>();

// Build application and store the result in app.
var app = builder.Build();

// Middleware:
// Ordering is important.

// Our exception handler middleware
app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
// Gives us opportunity to add middleware.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(config =>
    {
        config.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
    });
}

// Set up middleware to serve static content (React)
// Looks for an html in wwwroot.
app.UseDefaultFiles();   
// Tell our app to use static files (React)
app.UseStaticFiles();


// Redirects HTTP to HTTPS
// app.UseHttpsRedirection();
// Use cors configuration.
app.UseCors(opt =>
{
    // Allow all headers, any controller method. Allow client to pass cookies with allow credentions.
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:5173");
});

app.UseAuthentication();
app.UseAuthorization();

// Endpoints of our controllers.
// Where to send requests:
app.MapControllers();

// Endpoints of our client app
// Tell our server how to handle paths that it doesnt know of but React does.
// Our IndexController will handle these paths
app.MapFallbackToController("Index", "Fallback");

// Get hold of the context service.
var scope = app.Services.CreateScope();
// Get hold of store context service
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
// Get hold of user manager.
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
// Get hold of logger
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
try
{
    // Append any database migrations if needed.
    await context.Database.MigrateAsync();
    await DbInitializer.Initialize(context, userManager);
}
catch (Exception e)
{
    logger.LogError(e, "A problem occurred during migration.");
}

app.Run();
