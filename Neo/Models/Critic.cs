using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Neo.Models
{
    public class Critic
    {
         [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public required string Name { get; set; }
        public required string Specialization { get; set; } // Specijalizacija

        // [JsonIgnore]
        // public List<Rating>? Ratings { get; set; } moze bez toga = stavila sam ga kao atribut veze
    }
}