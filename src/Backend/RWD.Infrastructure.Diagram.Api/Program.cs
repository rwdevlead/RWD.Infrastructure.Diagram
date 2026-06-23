using Microsoft.EntityFrameworkCore;
using RWD.Infrastructure.Diagram.Api.Endpoints;
using RWD.Infrastructure.Diagram.Core.Domain.Interfaces;
using RWD.Infrastructure.Diagram.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------------
// Connection String — supports Flask-style sqlite:/// prefix and raw paths
// ---------------------------------------------------------------------------
var databaseUrl = builder.Configuration["DATABASE_URL"] ?? "sqlite:///data/homelab-hub.db";
var connectionString = databaseUrl;
if (databaseUrl.StartsWith("sqlite:///"))
{
    connectionString = $"Data Source={databaseUrl.Substring(10)}";
}
else if (!databaseUrl.Contains("Data Source=") && !databaseUrl.Contains("Filename="))
{
    connectionString = $"Data Source={databaseUrl}";
}

// Ensure the directory for the SQLite file exists
var csBuilder = new Microsoft.Data.Sqlite.SqliteConnectionStringBuilder(connectionString);
var dbPath = csBuilder.DataSource;
if (!string.IsNullOrEmpty(dbPath) && dbPath != ":memory:")
{
    var dbDirectory = Path.GetDirectoryName(dbPath);
    if (!string.IsNullOrEmpty(dbDirectory) && !Directory.Exists(dbDirectory))
        Directory.CreateDirectory(dbDirectory);
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// CORS — allow the Vite dev server and same-origin production requests
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddHealthChecks();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------
var app = builder.Build();

// Apply pending migrations on startup
using (var scope = app.Services.CreateScope())
{
    try
    {
        var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        ctx.Database.Migrate();
    }
    catch (Exception ex)
    {
        var log = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        log.LogError(ex, "Database migration failed on startup.");
    }
}

// ---------------------------------------------------------------------------
// Middleware pipeline
// ---------------------------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "RWD Infrastructure Diagram API v1"));
    app.UseCors("DevCors");
}

app.UseHttpsRedirection();

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------
app.MapHealthChecks("/health")
   .WithTags("Health")
   .WithSummary("Health check")
   .WithDescription("Returns service health status.");

app.MapHardwareEndpoints();
app.MapVirtualMachineEndpoints();
app.MapAppEndpoints();
app.MapStorageEndpoints();
app.MapNetworkShareEndpoints();
app.MapNetworkEndpoints();
app.MapDocumentEndpoints();
app.MapMapEndpoints();
app.MapInventoryEndpoints();

app.Run();
