using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace RWD.Infrastructure.Diagram.Infrastructure.Persistence;

/// <summary>
/// Design-time factory for creating the <see cref="AppDbContext"/> instance.
/// This enables EF Core migrations tools to function without running the Web API application host.
/// </summary>
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    /// <inheritdoc />
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        
        // Use a default local database file name for design-time operations
        optionsBuilder.UseSqlite("Data Source=homelab-hub.db");

        return new AppDbContext(optionsBuilder.Options);
    }
}
