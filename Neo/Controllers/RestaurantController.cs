// using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Neo.Models;
using Neo4j.Driver;

namespace Neo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantController : ControllerBase
    {
        private readonly IDriver _neo4jDriver;

        // Injektovanje IDriver u kontroler
        public RestaurantController(IDriver neo4jDriver)
        {
            _neo4jDriver = neo4jDriver;
        }



        #region prviget
        [HttpGet("VratiImenaRestorana")]
        public async Task<IActionResult> GetAllRestaurantNames()
        {
            var session = _neo4jDriver.AsyncSession();

            try
            {
                // Cypher upit za dobijanje svih imena restorana
                var query = "MATCH (r:Restaurant) RETURN r.name AS name";
                var result = await session.RunAsync(query);

                var restaurantNames = new List<string>();

                // Iteriraj kroz rezultate i dodaj imena u listu
                await foreach (var record in result)
                {
                    var name = record["name"].As<string>();
                    restaurantNames.Add(name);
                }

                return Ok(restaurantNames);  
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
    


#region CreateRestaurant
      [HttpPost("CreateRestaurant")]
      public async Task<IActionResult> CreateRestaurant([FromBody]Restaurant r)
      {
 var session = _neo4jDriver.AsyncSession();

    try
    {
        // Cypher upit za unos novog restorana u bazu
        //proveriti ovo!!
        var query = @"
            CREATE (r:Restaurant { 
                id: $id,
                name: $name, 
                location: $location, 
                cuisineType: $cuisineType, 
                avgRate: coalesce($avgRate, 0),
                michelinStar: $michelinStar, 
                chef: $chef, 
                openingHours: $openingHours
            })
        ";

        // Pokretanje upita sa parametrima
        var result = await session.RunAsync(query, new 
        {
            id = r.Id,
            name = r.Name,
            location = r.Location,
            cuisineType = r.CuisineType, 
            avgRate = r.AvgRate,
            michelinStar = r.MichelinStar,
            chef = r.Chef,
            openingHours = r.OpeningHours
        });

        

        return Ok("Restaurant created successfully.");
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

#region DodeliJeloRestoranu

[HttpPost("{restaurantName}/DodeliJeloRestoranu/{dishName}")]
public async Task<IActionResult> AddExistingDishToRestaurant(string restaurantName, string dishName, [FromBody]int prepTime)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        // Cypher upit za povezivanje postojećeg restorana i jela
       var query = @"
    MATCH (r:Restaurant {name: $restaurantName}), (d:Dish {name: $dishName})
    MERGE (r)-[rel:SERVES {prepTime: $prepTime}]->(d)
    RETURN rel
";


        // Izvršenje upita sa parametrima
        await session.RunAsync(query, new
        {
            restaurantName = restaurantName,
            dishName = dishName,
            prepTime = prepTime
        });

        return Ok($"Dish has been linked to restaurant  with prep time  minutes.");
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

#region DeleteRestaurant
[HttpDelete("DeleteRestaurant/{restaurantName}")]
public async Task<IActionResult> DeleteRestaurant(string restaurantName)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        // Prvo pronađi restoran
        var findQuery = @"
            MATCH (restaurant:Restaurant {name: $restaurantName})
            RETURN restaurant
        ";

        // Početak transakcije
        await using var transaction = await session.BeginTransactionAsync();
        
        // Prvo izvrši upit da nađe restoran
        var findResult = await transaction.RunAsync(findQuery, new { restaurantName });
        
        // Proveri da li je restoran pronađen
        var records = await findResult.ToListAsync();
        if (records.Count == 0)
        {
            return NotFound("Restaurant not found.");
        }

        // Obriši sve veze sa restoranom (jela, ocene, specijaliteti)
        var deleteRelationshipsQuery = @"
            MATCH (restaurant:Restaurant {name: $restaurantName})-[r]-()
            DELETE r
        ";

        // Izvrši upit za brisanje veza
        await transaction.RunAsync(deleteRelationshipsQuery, new { restaurantName });

        // Obriši restoran
        var deleteQuery = @"
            MATCH (restaurant:Restaurant {name: $restaurantName})
            DELETE restaurant
        ";

        // Izvrši upit za brisanje restorana
        await transaction.RunAsync(deleteQuery, new { restaurantName });

        // Potvrdi transakciju
        await transaction.CommitAsync();

        // Uspešan odgovor
        return Ok(new { Message = "Restaurant and associated relationships deleted successfully." });
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

#region GetRestaurantById
[HttpGet("GetRestaurantById/{id}")]
public async Task<IActionResult> GetRestaurantById(string id)  // Promenjen tip parametra u double
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        // Logovanje unesenog ID-ja za debugging
        Console.WriteLine($"Looking for restaurant with id: {id}");

        // Cypher upit za pronalaženje restorana na osnovu njegovog id-a
        var query = @"
            MATCH (r:Restaurant {id: $id})
            RETURN r
        ";

        // Pokretanje upita sa parametrima
        var result = await session.RunAsync(query, new { id });

        // Koristimo ToListAsync da dobijemo sve rezultate
        var records = await result.ToListAsync();

        // Logovanje rezultata za debugging
        Console.WriteLine($"Number of records found: {records.Count}");

        // Proveri da li je restoran pronađen
        if (records.Count == 0)
        {
            return NotFound("Restaurant not found.");
        }

        // Uzmemo prvi rezultat (trebalo bi da bude samo jedan)
        var record = records[0];

        // Izvuci podatke o restoranu iz rezultata
        var restaurant = record["r"].As<INode>();

        // Kreiraj objekat koji sadrži podatke restorana
        var restaurantData = new
        {
            Id = restaurant.Properties["id"],
            Name = restaurant.Properties["name"],
            Location = restaurant.Properties["location"],
            CuisineType = restaurant.Properties["cuisineType"],
            AvgRate = restaurant.Properties["avgRate"],
            MichelinStar = restaurant.Properties["michelinStar"],
            Chef = restaurant.Properties["chef"],
            OpeningHours = restaurant.Properties["openingHours"]
        };

        return Ok(restaurantData);
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

#region UpdateMiselinova

[HttpPut("UpdateRestaurant/{id}/{miselin}")]
public async Task<IActionResult> UpdateRestaurant(string id, bool miselin)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        Console.WriteLine($"Looking for restaurant with id: {id}");

        // Cypher upit za ažuriranje restorana
        var query = @"
            MATCH (r:Restaurant {id: $id})
            SET r.michelinStar = $miselin
            RETURN r
        ";

        // Pokretanje upita sa parametrima
        var result = await session.RunAsync(query, new { id, miselin });

        var records = await result.ToListAsync();

        if (records.Count == 0)
        {
            return NotFound("Restaurant not found.");
        }

        // Pronađeni restoran
        var record = records[0];
        var restaurant = record["r"].As<INode>();

        return Ok(new
        {
            Id = restaurant.Properties["id"].As<string>(),
            Name = restaurant.Properties["name"].As<string>(),
            Michelin = restaurant.Properties["michelinStar"].As<bool>()
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
#endregion

#region UpdateRestaurant
[HttpPut("UpdateRestaurant/{id}")]
public async Task<IActionResult> UpdateRestaurant(string id, [FromBody] Restaurant res)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        Console.WriteLine($"Updating restaurant with id: {id}");

        // Priprema parametara koji će biti ažurirani
        var setClauses = new List<string>();
        var parameters = new Dictionary<string, object> { { "id", id } };

        // Proveravamo koja polja su prosleđena i dodajemo samo ta u setClauses
        if (!string.IsNullOrEmpty(res.Name))
        {
            setClauses.Add("r.name = $name");
            parameters["name"] = res.Name;
        }

        if (!string.IsNullOrEmpty(res.Chef))
        {
            setClauses.Add("r.chef = $chef");
            parameters["chef"] = res.Chef;
        }

        if (res.MichelinStar.HasValue)
        {
            setClauses.Add("r.michelinStar = $michelinStar");
            parameters["michelinStar"] = res.MichelinStar.Value;
        }

        if (!string.IsNullOrEmpty(res.CuisineType))
        {
            setClauses.Add("r.cuisineType = $cuisineType");
            parameters["cuisineType"] = res.CuisineType;
        }

        if (!string.IsNullOrEmpty(res.OpeningHours))
        {
            setClauses.Add("r.openingHours = $openingHours");
            parameters["openingHours"] = res.OpeningHours;
        }

        // Ako nisu prosleđena nikakva polja za ažuriranje
        if (setClauses.Count == 0)
        {
            return BadRequest("No fields to update.");
        }

        // Kreiramo Cypher upit sa samo onim poljima koja su promenjena
        var query = $@"
            MATCH (r:Restaurant {{id: $id}})
            SET {string.Join(", ", setClauses)}
            RETURN r
        ";

        // Pokrećemo upit
        var result = await session.RunAsync(query, parameters);
        var records = await result.ToListAsync();

        if (records.Count == 0)
        {
            return NotFound("Restaurant not found.");
        }

        var record = records[0];
        var restaurant = record["r"].As<INode>();

        return Ok(new
        {
            Id = restaurant.Properties["id"].As<string>(),
            Name = restaurant.Properties.ContainsKey("name") ? restaurant.Properties["name"].As<string>() : "Unknown",
            MichelinStar = restaurant.Properties.ContainsKey("michelinStar") ? restaurant.Properties["michelinStar"].As<bool>() : false,
            CuisineType = restaurant.Properties.ContainsKey("cuisineType") ? restaurant.Properties["cuisineType"].As<string>() : "",
            OpeningHours = restaurant.Properties.ContainsKey("openingHours") ? restaurant.Properties["openingHours"].As<string>() : "Unknown",
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

#endregion

    #region VratiSveRestorane
    [HttpGet("VratiSveRestorane")]
    public async Task<IActionResult> VratiSveRestorane()
    {
        var session = _neo4jDriver.AsyncSession();

        try
        {
            // Cypher upit za dobijanje svih informacija o restoranima
            var query = "MATCH (r:Restaurant) RETURN r";
            var result = await session.RunAsync(query);

            var restaurants = new List<object>();

            // Iteriraj kroz rezultate i dodaj sve atribute restorana u listu
            await foreach (var record in result)
            {
                var restaurant = record["r"].As<INode>();
                restaurants.Add(new
                {
                    Id = restaurant.Properties.ContainsKey("id") ? restaurant["id"].As<string>() : null,
                    name = restaurant.Properties.ContainsKey("name") ? restaurant["name"].As<string>() : null,
                    openingHours = restaurant.Properties.ContainsKey("openingHours") ? restaurant["openingHours"].As<string>() : null,
                    avgRate = restaurant.Properties.ContainsKey("avgRate") ? restaurant["avgRate"].As<decimal>() : 0,
                    chef = restaurant.Properties.ContainsKey("chef	") ? restaurant["chef"].As<string>() : null,
                    location = restaurant.Properties.ContainsKey("location") ? restaurant["location"].As<string?>() : null,
                    michelinStar = restaurant.Properties.ContainsKey("michelinStar") ? restaurant["michelinStar"].As<Boolean>() : false,

                });
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
    #endregion



#region VratiRestoraneSaVeganskimJelima

[HttpGet("RestoraniSaVeganskimJelima")]
public async Task<IActionResult> GetRestaurantsWithVeganDishes()
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        // Cypher upit za pronalaženje restorana koji služe veganska jela
        var query = @"
            MATCH (r:Restaurant)-[:SERVES]->(d:Dish {isvegan: true})
            RETURN r.name AS restaurantName, d.name AS dishName
        ";

        // Izvršenje upita
        var result = await session.RunAsync(query);

        // Prikupljanje rezultata u listu objekata
        var restaurants = new List<object>();
        
        await result.ForEachAsync(record =>
        {
            var restaurantName = record["restaurantName"].As<string>();
            var dishName = record["dishName"].As<string>();

            // Dodajemo objekat sa imenom restorana i nazivom veganskog jela
            restaurants.Add(new { restaurantName, dishName });
        });

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

#endregion




#region VratiRestoraneSaMiselinovomZvezdom

[HttpGet("RestoraniSaMiselinovomZvezdom")]
public async Task<IActionResult> GetRestaurantsWithMichelinStar()
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        // Cypher upit za pronalaženje restorana sa Mišelinovom zvezdom
        var query = @"
            MATCH (r:Restaurant {michelinStar: true})
            RETURN r.name AS restaurantName
        ";

        // Izvršenje upita
        var result = await session.RunAsync(query);

        // Prikupljanje rezultata u listu
        var restaurants = await result.ToListAsync(record => record["restaurantName"].As<string>());

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

#endregion



#region VratiRestoraneKojeJeOceniKriticar

[HttpGet("{criticName}/RestoraniKojeJeOcenio")]
public async Task<IActionResult> GetRestaurantsRatedByCritic(string criticName)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        // Cypher upit za pronalaženje restorana koje je ocenio kritičar
        var query = @"
            MATCH (:Critic {name: $name})-[r:RATES]->(restaurant:Restaurant)
            RETURN restaurant.name AS restaurantName, r.rating AS rating
        ";

        // Izvršenje upita
        var result = await session.RunAsync(query, new { name = criticName });

        // Prikupljanje rezultata u listu   
        var restaurants = await result.ToListAsync(record => new
        {
            RestaurantName = record["restaurantName"].As<string>(),
            Rating = record["rating"].As<int>()
        });

        //Neo4j.Driver.ILogger.LogInformation($"Pozvan endpoint za kritičara: {criticName}");


        return Ok(restaurants);
    }
    catch (Exception ex)
    {
        // _neo4jDriver.LogError($"Greška: {ex.Message}");
    return StatusCode(500, "Došlo je do interne greške na serveru.");
    }
    finally
    {
        await session.CloseAsync();
    }
}

#endregion


#region RestoraniSaMiselinovomZvezdomKojeJeOcenioKriticar

[HttpGet("{criticName}/RestoraniSaMiselinovomZvezdomKojeJeOcenio")]
public async Task<IActionResult> GetMichelinStarRestaurantsRatedByCritic(string criticName)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        // Cypher upit za pronalaženje restorana sa Mišelinovom zvezdom koje je ocenio kritičar
        var query = @"
            MATCH (:Critic {name: $name})-[r:RATES]->(restaurant:Restaurant {michelinStar: true})
            RETURN restaurant.name AS restaurantName, r.rating AS rating
        ";

        // Izvršenje upita
        var result = await session.RunAsync(query, new { name = criticName });

        // Prikupljanje rezultata u listu
        var restaurants = await result.ToListAsync(record => new
        {
            RestaurantName = record["restaurantName"].As<string>(),
            Rating = record["rating"].As<int>()
        });

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

#endregion

#region RestoraniSaVisokomProsecnomOcenom

[HttpGet("RestoraniSaOcjenomVecomOd/{score}")]
public async Task<IActionResult> GetRestaurantsWithHigherAvgRate(decimal score)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        // Cypher upit za pronalaženje restorana sa prosečnom ocenom većom od prosleđenog parametra
        var query = @"
            MATCH (restaurant:Restaurant)
            WHERE restaurant.AvgRate > $score
            RETURN restaurant.name AS restaurantName, restaurant.AvgRate AS avgRating
        ";

        // Izvršenje upita
        var result = await session.RunAsync(query, new { score = score });

        // Prikupljanje rezultata u listu
        var restaurants = await result.ToListAsync(record => new
        {
            RestaurantName = record["restaurantName"].As<string>(),
            AvgRating = record["avgRating"].As<decimal>()
        });

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

        #endregion

        #region RestoraniSaVisokomProsecnomOcenom
        [HttpGet("RestoraniSaVisokomProsecnomOcenom/{ocena}")]

        public async Task<IActionResult> RestoraniSaVisokomProsecnomOcenom(decimal ocena)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        // Cypher upit za pronalaženje restorana sa prosečnom ocenom većom od prosleđenog parametra
        var query = @"
            MATCH (restaurant:Restaurant)
            WHERE restaurant.AvgRate > $score
            RETURN restaurant.name AS restaurantName, restaurant.AvgRate AS avgRating
        ";

        // Izvršenje upita
        var result = await session.RunAsync(query, new { score = ocena });

        // Prikupljanje rezultata u listu
        var restaurants = await result.ToListAsync(record => new
        {
            RestaurantName = record["restaurantName"].As<string>(),
            AvgRating = record["avgRating"].As<decimal>()
        });

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

#endregion



}
}