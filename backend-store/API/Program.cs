using Microsoft.EntityFrameworkCore;
using API.Data;

// Create a web application host.
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Ordering is not important.
// AKA Dependency injection container.

// Web API controller for routes.
builder.Services.AddControllers();
// Adding swagger dependencies for swagger content.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Add DbContext 
builder.Services.AddDbContext<StoreContext>(opt =>
{
    // Specify options from our configuration.
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();

// Build application and store the result in app.
var app = builder.Build();

// Middleware:
// Ordering is important.

// Configure the HTTP request pipeline.
// Gives us opportunity to add middleware.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Redirects HTTP to HTTPS
// app.UseHttpsRedirection();

// Use cors configuration.
app.UseCors(opt =>
{
    // Allow all headers, any controller method.
    opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:5173");
});

app.UseAuthorization();

// Where to send requests:
app.MapControllers();

// Get hold of the context service.
var scope = app.Services.CreateScope();
// Get hold of store context service
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
// Get hold of logger
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
try
{
    // Append any database migrations if needed.
    context.Database.Migrate();
    DbInitializer.Initialize(context);
}
catch (Exception e)
{
    logger.LogError(e, "A problem occurred during migration.");
}

app.Run();
