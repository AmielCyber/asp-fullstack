namespace API.Entities
{
    public class Cart
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        // May be replaced with an ordered list.
        // Many to One Relationship.
        public List<CartItem> Items { get; set; } = new();

        public void AddItem(Product product, int quantity)
        {
            // If is not in our list already.
            if (Items.All(item => item.ProductId != product.Id))
            {
                Items.Add(new CartItem { Product = product, Quantity = quantity });
            }
            var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
            }
        }

        public void RemoveItem(int productId, int quantity)
        {
            var item = Items.FirstOrDefault(item => item.ProductId == productId);
            if (item == null) return;
            item.Quantity -= quantity;
            if (item.Quantity < 1)
            {
                Items.Remove(item);
            }
        }

    }
}