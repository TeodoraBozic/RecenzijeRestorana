// using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using Neo.Models;
using Neo4j.Driver;

namespace Neo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DishController : ControllerBase
    {
        private readonly IDriver _neo4jDriver;

        // Injektovanje IDriver u kontroler
        public DishController(IDriver neo4jDriver)
        {
            _neo4jDriver = neo4jDriver;
        }
    


      

        
#region CreateDish
[HttpPost("CreateDish")]
public async Task<IActionResult> CreateDish([FromBody] Dish dish)
{
    var session = _neo4jDriver.AsyncSession();

    if (string.IsNullOrEmpty(dish.Name) || dish.Price <= 0)
    {
        return BadRequest("Dish name must be provided and price must be greater than 0.");
    }

    try
    {
        var query = @"
            CREATE (dish:Dish { 
                id: $id,
                name: $name, 
                signaturedish: $signaturedish, 
                price: $price, 
                details: $details, 
                isvegan: $isvegan, 
                calories: $calories
            })
            RETURN dish
        ";

        await using var transaction = await session.BeginTransactionAsync();
        var result = await transaction.RunAsync(query, new
        {
            id = dish.Id,
            name = dish.Name,
            price = dish.Price,
            signaturedish = dish.SignatureDish,
            details = dish.Details,
            isvegan = dish.IsVegan,
            calories = dish.Calories
        });

        // Fetchujemo rezultat da vidimo da li je čvor zaista kreiran
        var record = await result.ToListAsync();
        if (record == null)
        {
            return BadRequest("Dish was not created in the database.");
        }

        await transaction.CommitAsync(); // Potvrđujemo transakciju

        return Ok(new { Message = "Dish created successfully.", Dish = dish });
    }
    catch (Exception ex)
    {
        return BadRequest($"Error: {ex.Message}");
    }
    finally
    {
        await session.CloseAsync();
    }
}
#endregion



      [HttpGet("{restaurantName}/dishes")]
public async Task<IActionResult> GetDishesForRestaurant(string restaurantName)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        var query = @"
            MATCH (r:Restaurant {name: $restaurantName})-[:SERVES]->(d:Dish)
            RETURN d.name AS dishName, d.price AS price, d.details AS details, d.isVegan AS isvegan, d.calories AS calories, d.signatureDish as signatureDish
        ";

        var result = await session.RunAsync(query, new { restaurantName });

        var dishes = new List<object>();

        await foreach (var record in result)
        {
            dishes.Add(new
            {
                Name = record["dishName"].As<string>(),
                Price = record["price"].As<int?>(),
                Details = record["details"].As<string>(),
                isVegan = record["isvegan"].As<bool?>() ?? false,
                Calories = record["calories"].As<int>(),
                SignatureDish = record["signatureDish"].As<bool?>() ?? false


                
            });
        }

        if (dishes == null){
            return BadRequest("Ovaj restoran jos uvek nema nista na meniju");
        }

        return Ok(dishes);
    }
    catch (Exception ex)
    {
        return BadRequest($"Error: {ex.Message}");
    }
    finally
    {
        await session.CloseAsync();
    }
}



[HttpPut("update-dish/{dishName}")]
public async Task<IActionResult> UpdateDish(string dishName, [FromBody] Dish updatedDish)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        var query = @"
            MATCH (d:Dish {name: $dishName})
            SET d.name = $newName,
                d.signatureDish = $signatureDish,
                d.price = $price,
                d.details = $details,
                d.isVegan = $isVegan,
                d.calories = $calories
        ";

        await session.RunAsync(query, new
        {
            dishName,
            newName = updatedDish.Name,
            signatureDish = updatedDish.SignatureDish,
            price = updatedDish.Price,
            details = updatedDish.Details,
            isVegan = updatedDish.IsVegan,
            calories = updatedDish.Calories
        });

        return Ok($"Dish '{dishName}' updated successfully.");
    }
    catch (Exception ex)
    {
        return BadRequest($"Error: {ex.Message}");
    }
    finally
    {
        await session.CloseAsync();
    }
}



#region DeleteDish
[HttpDelete("DeleteDish/{dishName}")]
public async Task<IActionResult> DeleteDish(string dishName)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        // Prvo pronađi jelo
        var findQuery = @"
            MATCH (dish:Dish {name: $dishName})
            RETURN dish
        ";

        // Početak transakcije
        await using var transaction = await session.BeginTransactionAsync();
        
        // Prvo izvrši upit da nađe jelo
        var findResult = await transaction.RunAsync(findQuery, new { dishName });
        
        // Proveri da li je jelo pronađeno
        var records = await findResult.ToListAsync();
        if (records.Count == 0)
        {
            return NotFound("Dish not found.");
        }

        // Obriši sve veze sa jelom (npr. restoran, ocene itd.)
        var deleteRelationshipsQuery = @"
            MATCH (dish:Dish {name: $dishName})-[r]-()
            DELETE r
        ";

        // Izvrši upit za brisanje veza
        await transaction.RunAsync(deleteRelationshipsQuery, new { dishName });

        // Obriši jelo
        var deleteQuery = @"
            MATCH (dish:Dish {name: $dishName})
            DELETE dish
        ";

        // Izvrši upit za brisanje jela
        await transaction.RunAsync(deleteQuery, new { dishName });

        // Potvrdi transakciju
        await transaction.CommitAsync();

        // Uspešan odgovor
        return Ok(new { Message = "Dish and associated relationships deleted successfully." });
    }
    catch (Exception ex)
    {
        // Obrada grešaka
        return BadRequest($"Error: {ex.Message}");
    }
    finally
    {
        // Zatvori sesiju
        await session.CloseAsync();
    }
}
#endregion

[HttpGet("vegan-dishes")]
public async Task<IActionResult> GetVeganDishes()
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        var query = @"
            MATCH (d:Dish)
            WHERE d.isvegan = true
            RETURN d.name AS dishName, d.price AS price, d.details AS details, d.calories AS calories
        ";

        var result = await session.RunAsync(query);

        var veganDishes = new List<object>();

        await foreach (var record in result)
        {
            veganDishes.Add(new
            {
                Name = record["dishName"].As<string>(),
                Price = record["price"].As<double?>(),
                Details = record["details"].As<string>(),
                Calories = record["calories"].As<int?>()
            });
        }

        if (veganDishes.Count == 0)
        {
            return NotFound("No vegan dishes found.");
        }

        return Ok(veganDishes);
    }
    catch (Exception ex)
    {
        return BadRequest($"Error: {ex.Message}");
    }
    finally
    {
        await session.CloseAsync();
    }
}




[HttpPut("UpdateDish/{id}")]
public async Task<IActionResult> UpdateDishMaks(string id, [FromBody] Dish dish)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        Console.WriteLine($"Updating dish with id: {id}");

        // Provera da li postoji jelo sa datim imenom (ako je ime prosleđeno)
        if (!string.IsNullOrEmpty(dish.Name))
        {
            var nameCheckQuery = @"MATCH (dish:Dish {name: $name}) RETURN dish";
            var nameCheckResult = await session.RunAsync(nameCheckQuery, new { name = dish.Name });

            if (!await nameCheckResult.FetchAsync())
            {
                return NotFound("Dish with the provided name does not exist. Please enter a valid name.");
            }
        }

        // Priprema parametara koji će biti ažurirani
        var setClauses = new List<string>();
        var parameters = new Dictionary<string, object> { { "id", id } };

        // Proveravamo koja polja su prosleđena i dodajemo samo ta u setClauses
        if (!string.IsNullOrEmpty(dish.Name))
        {
            setClauses.Add("dish.name = $name");
            parameters["name"] = dish.Name;
        }

        if (dish.IsVegan.HasValue)
        {
            setClauses.Add("dish.isvegan = $isvegan");
            parameters["isvegan"] = dish.IsVegan.Value;
        }

        if (dish.SignatureDish.HasValue)
        {
            setClauses.Add("dish.signaturedish = $signaturedish");
            parameters["signaturedish"] = dish.SignatureDish.Value;
        }

        if (!string.IsNullOrEmpty(dish.Details))
        {
            setClauses.Add("dish.details = $details");
            parameters["details"] = dish.Details;
        }

        if (dish.Price > 0)
        {
            setClauses.Add("dish.price = $price");
            parameters["price"] = dish.Price;
        }

        if (dish.Calories > 0)
        {
            setClauses.Add("dish.calories = $calories");
            parameters["calories"] = dish.Calories;
        }

        if (setClauses.Count == 0)
        {
            return BadRequest("No fields to update.");
        }

        // Kreiramo Cypher upit sa samo onim poljima koja su promenjena
        var query = $@"
            MATCH (dish:Dish {{id: $id}})
            SET {string.Join(", ", setClauses)}
            RETURN dish
        ";

        // Pokrećemo upit
        var result = await session.RunAsync(query, parameters);
        var records = await result.ToListAsync();

        if (records.Count == 0)
        {
            return NotFound("Dish not found.");
        }

        var record = records[0];
        var jelo = record["dish"].As<INode>();

        return Ok(new
        {
            Id = jelo.Properties["id"].As<string>(),
            Name = jelo.Properties.ContainsKey("name") ? jelo.Properties["name"].As<string>() : "Unknown",
            IsVegan = jelo.Properties.ContainsKey("isvegan") ? jelo.Properties["isvegan"].As<bool>() : false,
            Details = jelo.Properties.ContainsKey("details") ? jelo.Properties["details"].As<string>() : "",
            Calories = jelo.Properties.ContainsKey("calories") ? jelo.Properties["calories"].As<int>() : 0,
            Price = jelo.Properties.ContainsKey("price") ? jelo.Properties["price"].As<int>() : 0,
            SignatureDish = jelo.Properties.ContainsKey("signaturedish") ? jelo.Properties["signaturedish"].As<bool>() : false
        });
    }
    catch (Exception ex)
    {
        return BadRequest($"Error: {ex.Message}");
    }
    finally
    {
        await session.CloseAsync();
    }
}


}
}