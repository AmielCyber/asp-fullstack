using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;


        // RequestDelegate allows us to run the next middleware.
        // ILogger helps us log the exception.
        // IHostEnvironment to check if we are running in production/developer mode.
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        // Must have the same signature so asp net can call this method.
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Call next middleware and catch any unhandled middleware.
                await _next(context);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                context.Response.ContentType = "application/json";  // Tell it what type of response.
                context.Response.StatusCode = 500;

                // Set up response object.
                var response = new ProblemDetails
                {
                    Status = 500,
                    Detail = _env.IsDevelopment() ? e.StackTrace?.ToString() : null,
                    Title = e.Message,
                };

                // Options for the json serializer
                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                // Serialize response and along our json serialize options.
                var json = JsonSerializer.Serialize(response, options);
                await context.Response.WriteAsync(json);
            }

        }
    }
}