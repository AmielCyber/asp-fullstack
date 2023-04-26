using API.Entities;
namespace API.Extensions;

// Extension methods for our product controller.
// "Extension methods enable you to "add" methods to existing types without creating a new derived type, recompiling,
// or otherwise modifying the original type." (learn.Microsoft.com).
public static class ProductExtensions
{

    // Sort query for returning sorted products by orderBy string.
    public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
    {
        if (string.IsNullOrWhiteSpace(orderBy))
        {
            return query.OrderBy(p => p.Name);
        }

        query = orderBy switch
        {
            "price" => query.OrderBy(p => p.Price),
            "priceDesc" => query.OrderByDescending(p => p.Price),
            _ => query.OrderBy(p => p.Name)// Default case.
        };
        return query;
    }

    // Search query for all products that contains the passed searchTerm.
    public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            return query;
        }

        var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

        return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));
    }

    // Filter query that returns only the brands and types of a product.
    //  Accepts a string of brands and types with "," as separators.
    public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
    {
        var brandList = new List<string>();
        var typeList = new List<string>();

        if (!string.IsNullOrEmpty(brands))
        {
            // AddRange adds the elements of a collection to the end of the list.
            brandList.AddRange(brands.ToLower().Split(",").ToList());
        }

        if (!string.IsNullOrEmpty(types))
        {
            typeList.AddRange(types.ToLower().Split(",").ToList());
        }

        query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));
        query = query.Where(p => typeList.Count == 0 || typeList.Contains(p.Type.ToLower()));

        return query;
    }
}