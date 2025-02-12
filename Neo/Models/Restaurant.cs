using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Neo.Models
{
    public class Restaurant
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public required string Name { get; set;} //ime restorana

        public string? Location {get; set;} //puna lokacija

       public  string? CuisineType{ get; set;} //enum za tip kuhinje

        public decimal AvgRate { get; set; } = 0; 

        public Boolean? MichelinStar {get; set;} //cisto radi filtriranja
[JsonIgnore]
        public List<Dish>? Dishes {get; set;} //lista jela

       // public List<Rating>? Ocena {get; set;} //to ce da se izvlaci iz rating

        public string? Chef { get; set; } // Glavni kuvar
        public  string? OpeningHours { get; set; } // Radno vreme

       
    }
}