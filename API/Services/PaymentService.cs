using API.Entities;
using Stripe;

namespace API.Services;

public class PaymentService
{
    private readonly IConfiguration _config;

    public PaymentService(IConfiguration config)
    {
        // Get the config to access stripe keys.
        _config = config;
    }

    public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Cart cart)
    {
        // Get api key from our config settings.
        StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];
        // Create new service.
        var service = new PaymentIntentService();
        // Create an payment intent from stripe
        var intent = new PaymentIntent();
        // Calculate total.
        var subtotal = cart.Items.Sum(item => item.Quantity * item.Product.Price);
        var deliveryFee = subtotal > 1000 ? 0 : 500;

        // If we need to create a new PaymentIntentId from user.
        if (string.IsNullOrEmpty(cart.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = subtotal + deliveryFee,
                Currency = "usd",
                PaymentMethodTypes = new List<string> { "card" }
            };
            // Creates a new payment intent.
            intent = await service.CreateAsync(options);
        }
        else
        {
            // Updating an existing intent id.
            var options = new PaymentIntentUpdateOptions
            {
                Amount = subtotal + deliveryFee
            };
            await service.UpdateAsync(cart.PaymentIntentId, options);
        }

        return intent;
    }
}