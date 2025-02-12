// using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using Neo.Models;
using Neo4j.Driver;

namespace Neo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IDriver _neo4jDriver;

        // Injektovanje IDriver u kontroler
        public UserController(IDriver neo4jDriver)
        {
            _neo4jDriver = neo4jDriver;
        }


  #region CreateUser
      [HttpPost("CreateUser")]
      public async Task<IActionResult> CreateUser([FromBody]User user)
      {
 var session = _neo4jDriver.AsyncSession();

    try
    {
        // Cypher upit za unos novog restorana u bazu
        //proveriti ovo!!
        var query = @"
            CREATE (r:User { 
                id:$id,
                name: $name, 
                password: $password,
                email: $email


            })
        ";

        // Pokretanje upita sa parametrima
        await session.RunAsync(query, new 
        {
            id = user.Id,
            name = user.Name,
            password = user.Password,
            email = user.Email
        });

        return Ok("Uspesno kreiran user.");
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



[HttpPost("{restaurantName}/OmiljeniRestoran/{userName}/{comment}")]
public async Task<IActionResult> OmiljeniRestoran(string restaurantName, string userName, string comment)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        // Cypher upit za povezivanje postojećeg restorana i korisnika
        var query = @"
            MATCH (r:Restaurant {name: $restaurantName}), (u:User {name: $userName})
            CREATE (u)-[:LIKES {comment: $comment}]->(r)
        ";

        // Izvršenje upita sa parametrima
        await session.RunAsync(query, new
        {
            restaurantName = restaurantName,
            userName = userName,
            comment = comment
        });

        return Ok($"User '{userName}' je rekao da mu se dopada '{restaurantName}' i komentar je: '{comment}'.");
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


[HttpDelete("DeleteUser/{userId}")]
public async Task<IActionResult> DeleteUser(string userId)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        // Cypher upit za brisanje korisnika i svih njegovih veza
        var query = @"
            MATCH (u:User {id: $userId})
            DETACH DELETE u
        ";

        // Izvršenje upita sa parametrima
        await session.RunAsync(query, new
        {
            userId = userId
        });

        return Ok($"User sa ID-jem tim je uspešno obrisan, uključujući sve njegove veze.");
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


[HttpGet("GetAllUsers")]
public async Task<IActionResult> GetAllUsers()
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        // Cypher upit za dobavljanje korisnika i njihovih omiljenih restorana
        var query = @"
            MATCH (u:User)
            OPTIONAL MATCH (u)-[:LIKES]->(r:Restaurant)
            RETURN u.name AS userName, 
                   u.email AS userEmail, 
                   COALESCE(r.name, 'nema omiljeni restoran') AS favoriteRestaurant
        ";

        // Izvršenje upita
        var result = await session.RunAsync(query);

        // Pravljenje liste korisnika sa podacima
        var users = new List<object>();
        await foreach (var record in result)
        {
            users.Add(new
            {
                Name = record["userName"].As<string>(),
                Email = record["userEmail"].As<string>(),
                FavoriteRestaurant = record["favoriteRestaurant"].As<string>()
            });
        }

        return Ok(users);
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


[HttpGet("RestoraniSaViseOd/{n}/Komentara")]
public async Task<IActionResult> RestoraniSaViseOdKomentara(int n)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        // Cypher upit za pronalaženje restorana sa više od n komentara
        var query = @"
            MATCH (r:Restaurant)<-[l:LIKES]-()
            WITH r, COUNT(l) AS brojKomentara
            WHERE brojKomentara > $n
            RETURN r.name AS restaurantName, brojKomentara
        ";

        var result = await session.RunAsync(query, new { n });

        // Prikupljanje rezultata
        var restaurants = await result.ToListAsync(record => new
        {
            RestaurantName = record["restaurantName"].As<string>(),
            CommentCount = record["brojKomentara"].As<int>()
        });

        if (!restaurants.Any())
        {
            return Ok("Nema restorana sa više od traženog broja komentara.");
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

[HttpGet("{restaurantName}/Komentari")]
public async Task<IActionResult> VidiKomentare(string restaurantName)
{
    var session = _neo4jDriver.AsyncSession();

    try
    {
        // Cypher upit za preuzimanje komentara povezanih sa restoranom
        var query = @"
            MATCH (u:User)-[l:LIKES]->(r:Restaurant {name: $restaurantName})
            RETURN u.name AS userName, l.comment AS comment
        ";

        var result = await session.RunAsync(query, new { restaurantName });

        // Prikupljanje rezultata
        var comments = await result.ToListAsync(record => new
        {
            UserName = record["userName"].As<string>(),
            Comment = record["comment"].As<string>()
        });

        if (!comments.Any())
        {
            return Ok($"Nema komentara za restoran '{restaurantName}'.");
        }

        return Ok(comments);
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


#region UpdateUser
[HttpPut("UpdateUser/{id}")]
public async Task<IActionResult> UpdateUser(string id, [FromBody]User user)
{
     var session = _neo4jDriver.AsyncSession();

    try
    {
        Console.WriteLine($"Updating restaurant with id: {id}");

        // Priprema parametara koji će biti ažurirani
        var setClauses = new List<string>();
        var parameters = new Dictionary<string, object> { { "id", id } };

        // Proveravamo koja polja su prosleđena i dodajemo samo ta u setClauses
        if (!string.IsNullOrEmpty(user.Name))
        {
            setClauses.Add("user.name = $name");
            parameters["name"] = user.Name;
        }

        if (!string.IsNullOrEmpty(user.Email))
        {
            setClauses.Add("user.email = $email");
            parameters["email"] = user.Email;
        }

        if (!string.IsNullOrEmpty(user.Password))
        {
            setClauses.Add("user.password = $password");
            parameters["password"] = user.Password;
        }
        
        // Ako nisu prosleđena nikakva polja za ažuriranje
        if (setClauses.Count == 0)
        {
            return BadRequest("No fields to update.");
        }

        // Kreiramo Cypher upit sa samo onim poljima koja su promenjena
        var query = $@"
            MATCH (user:User {{id: $id}})
            SET {string.Join(", ", setClauses)}
            RETURN user
        ";

        // Pokrećemo upit
        var result = await session.RunAsync(query, parameters);
        var records = await result.ToListAsync();

        if (records.Count == 0)
        {
            return NotFound("User not found.");
        }

        var record = records[0];
        var korisnik = record["user"].As<INode>();

        return Ok(new
        {
            Id = korisnik.Properties["id"].As<string>(),
            Name = korisnik.Properties.ContainsKey("name") ? korisnik.Properties["name"].As<string>() : "Unknown",
            Email = korisnik.Properties.ContainsKey("email") ? korisnik.Properties["email"].As<string>() : "",
            Password = korisnik.Properties.ContainsKey("password") ? korisnik.Properties["password"].As<string>() : "Unknown",
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


    }
}