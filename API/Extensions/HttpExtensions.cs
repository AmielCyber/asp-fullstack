using System.Text.Json;
using API.RequestHelpers;

namespace API.Extensions;

// Class to add additional headers such as adding pagination.
public static class HttpExtensions
{
    public static void AddPaginationHeader(this HttpResponse response, MetaData metaData)
    {
        // set option to set JSON as camelCase.
        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        // Add pagination header with the metadata.
        response.Headers.Add("Pagination", JsonSerializer.Serialize(metaData, options));
        // Expose headers.
        response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
    }

}