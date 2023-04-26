namespace API.RequestHelpers;

// Param class for our GetProducts method from products controller. 
public class ProductParams : PaginationParams
{
    public string OrderBy { get; set; }
    public string SearchTerm { get; set; }
    public string Types { get; set; }
    public string Brands { get; set; }
}