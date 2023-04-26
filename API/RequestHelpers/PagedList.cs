using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers;


// extend the list class with our meta data.
// When we return the list the client we can also return the pagination metadata
// Will have list and will have property metadata.
public class PagedList<T> : List<T>
{
    public MetaData MetaData { get; set; }

    public PagedList(List<T> items, int count, int pageNumber, int pageSize)
    {
        MetaData = new MetaData
        {
            TotalCount = count,
            PageSize = pageSize,
            CurrentPage = pageNumber,
            TotalPages = (int)Math.Ceiling(count / (double)(pageSize))
        };
        // Add the items in our List since we extended list.
        AddRange(items);
    }

    // Make a DB query with query parameters and limit the size to get.
    public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize)
    {
        // Get the rows in our database.
        var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        // Count how many columns in table.
        var count = await query.CountAsync();

        // Return a paged List with pagination metadata and the items list.
        return new PagedList<T>(items, count, pageNumber, pageSize);
    }

}