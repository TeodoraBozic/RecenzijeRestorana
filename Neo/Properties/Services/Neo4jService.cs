using Neo4j.Driver;

public class Neo4jService
{
    private readonly IDriver _driver;

    public Neo4jService(IDriver driver)
    {
        _driver = driver;
    }

    public async Task CreatePersonAsync(string name)
    {
        var session = _driver.AsyncSession();
        try
        {
            var result = await session.RunAsync("CREATE (a:Person {name: $name}) RETURN a", new { name });
        }
        finally
        {
            await session.CloseAsync();
        }
    }

    public async Task<IEnumerable<string>> GetPersonsAsync()
    {
        var session = _driver.AsyncSession();
        try
        {
            var result = await session.RunAsync("MATCH (a:Person) RETURN a.name AS name");
            return await result.ToListAsync(record => record["name"].As<string>());
        }
        finally
        {
            await session.CloseAsync();
        }
    }
}
