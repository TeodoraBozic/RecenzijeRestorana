using Neo4j.Driver;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Register Neo4j Driver as a Singleton
builder.Services.AddSingleton<IDriver>(sp =>
{
    return GraphDatabase.Driver("bolt://localhost:7687", AuthTokens.Basic("neo4j", "janateodora"));
});

// Add CORS services with a policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins("http://localhost:5173")  // Allow your React app's frontend origin
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.UseHttpsRedirection();


app.UseCors("AllowSpecificOrigin");

// Test Neo4j connection
app.MapGet("/test", async () =>
{
    var driver = app.Services.GetRequiredService<IDriver>();
    var session = driver.AsyncSession();
    try
    {
        var result = await session.RunAsync("RETURN 'Hello, Neo4j!' AS message");
        var message = await result.SingleAsync(record => record["message"].As<string>());
        return Results.Ok(message); // Return 'Hello, Neo4j!' if the connection is successful
    }
    catch (Exception ex)
    {
        return Results.BadRequest($"Error: {ex.Message}");
    }
    finally
    {
        await session.CloseAsync();
    }
});

app.MapControllers();
app.Run();

// WeatherForecast model
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
