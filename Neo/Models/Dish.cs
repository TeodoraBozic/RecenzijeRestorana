using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Neo.Models
{
    public class Dish
    {


         [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public  required string Name { get; set;}

         public bool? SignatureDish { get; set; } // Da li je specijalitet kuće

         public int? Price { get; set; }

        public  string? Details { get; set; } // Lista sastojaka
        public bool? IsVegan { get; set; } // Vegansko
        public int? Calories { get; set; } // Broj kalorija
        
        [JsonIgnore]
         public Restaurant? Restaurant { get; set; }
        
    }
}