using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class CreateProductDto
{
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        [Range(100, Double.PositiveInfinity)]
        public long Price { get; set; }
        [Required]
        public IFormFile File { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public string Brand { get; set; }
        [Range(0, 200)]
        [Required]
        public int QuantityInStock { get; set; }
    
}