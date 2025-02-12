using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Neo.Models
{
    public class User
    {
         [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public  required string Name { get; set;}

        public  string? Password { get; set;}

        public  string? Email { get; set;}

        [JsonIgnore]

        //public List<User>? Friends {get; set;} //ima prijatelje [videcemo da li ovo]

        public List<Restaurant>? Favourites {get; set;}

    
        
    }
}