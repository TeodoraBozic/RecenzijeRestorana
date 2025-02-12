// using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using Neo.Models;
using Neo4j.Driver;

namespace Neo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CriticController : ControllerBase
    {
        private readonly IDriver _neo4jDriver;

        // Injektovanje IDriver u kontroler
        public CriticController(IDriver neo4jDriver)
        {
            _neo4jDriver = neo4jDriver;
        }
    


      #region AddCritic
[HttpPost("AddCritic")]
public async Task<IActionResult> AddCritic([FromBody] Critic critic)
{
    var session = _neo4jDriver.AsyncSession();

    if (string.IsNullOrEmpty(critic.Name))
    {
        return BadRequest("Critic name must be provided.");
    }

    try
    {
        var query = @"
            CREATE (critic:Critic { 
                id:$id,
                name: $name, 
                specialization: $specialization
            })
            RETURN critic
        ";

        await using var transaction = await session.BeginTransactionAsync();
        var result = await transaction.RunAsync(query, new
        {
            id = critic.Id,
            name = critic.Name,
            specialization = critic.Specialization.ToString()  // Pretpostavljam da je Specialization enum
        });

        var records = await result.ToListAsync();
        if (records.Count == 0)
        {
            return BadRequest("Critic could not be added.");
        }

        await transaction.CommitAsync();

        return Ok(new { Message = "Critic added successfully.", Critic = critic });
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

[HttpPost("{criticName}/OceniRestoran/{restaurantName}")]
public async Task<IActionResult> RateRestaurant(string criticName, string restaurantName, [FromBody] int rating)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        // Kreiranje ili ažuriranje ocene kritičara za restoran
        var rateQuery = @"
            MATCH (critic:Critic {name: $criticName}), (restaurant:Restaurant {name: $restaurantName})
            MERGE (critic)-[r:RATES]->(restaurant)
            ON CREATE SET r.rating = $rating
            ON MATCH SET r.rating = $rating
        ";

        await session.RunAsync(rateQuery, new
        {
            criticName = criticName,
            restaurantName = restaurantName,
            rating = rating
        });

        // Izračunavanje nove prosečne ocene
        var avgRateQuery = @"
            MATCH (:Critic)-[r:RATES]->(restaurant:Restaurant {name: $restaurantName})
            WITH restaurant, AVG(r.rating) AS avgRating
            SET restaurant.AvgRate = avgRating
            RETURN restaurant.AvgRate AS updatedAvgRate
        ";

        var result = await session.RunAsync(avgRateQuery, new { restaurantName = restaurantName });
        var record = await result.SingleAsync();

        if (record != null && record.ContainsKey("updatedAvgRate"))
{
    var updatedAvgRate = record["updatedAvgRate"].As<float>();
    return Ok(new { message = $"Restaurant has been rated. New average rating: {updatedAvgRate}" });
}
else
{
    return BadRequest("Error updating average rating.");
}

       
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

   





#region UpdateCritic
[HttpPut("UpdateCritic/{id}")]
public async Task<IActionResult> UpdateCritic(string id, [FromBody]Critic critic)
{
    var session = _neo4jDriver.AsyncSession();

    if (string.IsNullOrEmpty(critic.Name) && string.IsNullOrEmpty(critic.Specialization.ToString()))
    {
        return BadRequest("At least one field to update must be provided.");
    }

    try
    {
        var query = @"
            MATCH (critic:Critic {id: $id})
            SET 
                critic.name = COALESCE($name, critic.name),
                critic.specialization = COALESCE($specialization, critic.specialization)
            RETURN critic
        ";

        await using var transaction = await session.BeginTransactionAsync();
        var result = await transaction.RunAsync(query, new
        {
            id = id,
            name = critic.Name,
            specialization = critic.Specialization!.ToString()  // Pretpostavljam da je Specialization enum
        });

        var records = await result.ToListAsync();
      

        await transaction.CommitAsync();

        return Ok(new { Message = "Critic updated successfully.", Critic = critic });
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



#region DeleteCritic
[HttpDelete("DeleteCritic/{criticname}")]
public async Task<IActionResult> DeleteCritic(string criticname)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        // Prvo pronađi kritičara
        var findQuery = @"
            MATCH (critic:Critic {name: $criticname})
            RETURN critic
        ";

        // Početak transakcije
        await using var transaction = await session.BeginTransactionAsync();
        
        // Prvo izvrši upit da nađe kritičara
        var findResult = await transaction.RunAsync(findQuery, new { criticname });
        
        // Proveri da li je kritičar pronađen
        var records = await findResult.ToListAsync();
        if (records.Count == 0)
        {
            return NotFound("Critic not found.");
        }

        // Obriši sve veze sa kritičarom
        var deleteRelationshipsQuery = @"
            MATCH (critic:Critic {name: $criticname})-[r]-()
            DELETE r
        ";

        // Izvrši upit za brisanje veza
        await transaction.RunAsync(deleteRelationshipsQuery, new { criticname });

        // Obriši kritičara
        var deleteQuery = @"
            MATCH (critic:Critic {name: $criticname})
            DELETE critic
        ";

        // Izvrši upit za brisanje kritičara
        await transaction.RunAsync(deleteQuery, new { criticname });

        // Potvrdi transakciju
        await transaction.CommitAsync();

        // Uspešan odgovor
        return Ok(new { Message = "Critic and associated relationships deleted successfully." });
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




#region GetCritics
[HttpGet("GetCritics")]
public async Task<IActionResult> GetCritics()
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        var query = @"
            MATCH (critic:Critic)
            RETURN critic
        ";

        var result = await session.RunAsync(query);
        var critics = await result.ToListAsync(record => new
        {
            Id = record["critic"].As<INode>().Properties.ContainsKey("id") ? record["critic"].As<INode>().Properties["id"].ToString() : string.Empty,
            Name = record["critic"].As<INode>().Properties.ContainsKey("name") ? record["critic"].As<INode>().Properties["name"].ToString() : "Unknown",
            Specialization = record["critic"].As<INode>().Properties.ContainsKey("specialization") ? record["critic"].As<INode>().Properties["specialization"].ToString() : "Unknown"
        });

        if (critics.Count == 0)
        {
            return NotFound("No critics found.");
        }

        return Ok(critics);
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


[HttpGet("GetRestaurantsByCuisineType/{cuisineType}")]
public async Task<IActionResult> GetRestaurantsByCuisineType(string cuisineType)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        var query = @"
            MATCH (restaurant:Restaurant {cuisineType: $cuisineType})
            RETURN restaurant
        ";

        var result = await session.RunAsync(query, new { cuisineType });
        var restaurants = await result.ToListAsync(record => new
        {
            Id = record["restaurant"].As<INode>().Properties.ContainsKey("id") ? Convert.ToInt32(record["restaurant"].As<INode>().Properties["id"]) : 0,
            Name = record["restaurant"].As<INode>().Properties.ContainsKey("name") ? record["restaurant"].As<INode>().Properties["name"].ToString() : "Unknown",
            CuisineType = record["restaurant"].As<INode>().Properties.ContainsKey("cuisineType") ? record["restaurant"].As<INode>().Properties["cuisineType"].ToString() : "Unknown",
            AvgRate = record["restaurant"].As<INode>().Properties.ContainsKey("AvgRate") ? Convert.ToDouble(record["restaurant"].As<INode>().Properties["AvgRate"]) : 0.0
        });

        if (restaurants.Count == 0)
        {
            return NotFound($"No restaurants found with cuisine type '{cuisineType}'.");
        }

        return Ok(restaurants);
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
