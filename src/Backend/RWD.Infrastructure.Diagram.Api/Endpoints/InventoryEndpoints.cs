using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using RWD.Infrastructure.Diagram.Api.Dtos;
using RWD.Infrastructure.Diagram.Infrastructure.Persistence;

namespace RWD.Infrastructure.Diagram.Api.Endpoints;

/// <summary>
/// Registers the cross-cutting inventory endpoints at <c>/api/inventory</c>:
/// search across all entities, JSON export, and JSON import.
/// </summary>
public static class InventoryEndpoints
{
    /// <summary>
    /// Maps inventory routes onto the provided <see cref="IEndpointRouteBuilder"/>.
    /// </summary>
    public static IEndpointRouteBuilder MapInventoryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/inventory").WithTags("Inventory");

        // GET /api/inventory/search?q=...
        group.MapGet("/search", async (string q, AppDbContext db, CancellationToken ct) =>
        {
            if (string.IsNullOrWhiteSpace(q))
                return Results.BadRequest(ApiResponse<object>.Fail("Search query 'q' is required."));

            var lower = q.ToLower();

            // Search across all major named entities and return a flat list of results
            var results = new List<InventorySearchResult>();

            var hardware = await db.Hardwares
                .Where(h => h.Name.ToLower().Contains(lower) ||
                            (h.Hostname != null && h.Hostname.ToLower().Contains(lower)) ||
                            (h.IpAddress != null && h.IpAddress.ToLower().Contains(lower)))
                .Select(h => new InventorySearchResult("hardware", h.Id, h.Name, h.Hostname, h.IpAddress))
                .ToListAsync(ct);
            results.AddRange(hardware);

            var vms = await db.VirtualMachines
                .Where(v => v.Name.ToLower().Contains(lower) ||
                            (v.Hostname != null && v.Hostname.ToLower().Contains(lower)) ||
                            (v.IpAddress != null && v.IpAddress.ToLower().Contains(lower)))
                .Select(v => new InventorySearchResult("vm", v.Id, v.Name, v.Hostname, v.IpAddress))
                .ToListAsync(ct);
            results.AddRange(vms);

            var apps = await db.Apps
                .Where(a => a.Name.ToLower().Contains(lower) ||
                            (a.Description != null && a.Description.ToLower().Contains(lower)))
                .Select(a => new InventorySearchResult("app", a.Id, a.Name, null, a.IpAddress))
                .ToListAsync(ct);
            results.AddRange(apps);

            var storage = await db.StoragePools
                .Where(s => s.Name.ToLower().Contains(lower))
                .Select(s => new InventorySearchResult("storage", s.Id, s.Name, null, null))
                .ToListAsync(ct);
            results.AddRange(storage);

            var networks = await db.Networks
                .Where(n => n.Name.ToLower().Contains(lower) ||
                            (n.Subnet != null && n.Subnet.ToLower().Contains(lower)))
                .Select(n => new InventorySearchResult("network", n.Id, n.Name, null, n.Subnet))
                .ToListAsync(ct);
            results.AddRange(networks);

            var documents = await db.Documents
                .Where(d => d.Title.ToLower().Contains(lower) ||
                            d.Content.ToLower().Contains(lower))
                .Select(d => new InventorySearchResult("document", d.Id, d.Title, null, null))
                .ToListAsync(ct);
            results.AddRange(documents);

            return Results.Ok(ApiResponse<IEnumerable<InventorySearchResult>>.Ok(results));
        })
        .WithSummary("Search across all inventory entities");

        // GET /api/inventory/export
        group.MapGet("/export", async (AppDbContext db, CancellationToken ct) =>
        {
            var export = new DatabaseExport
            {
                ExportedAt = DateTime.UtcNow,
                Hardware = await db.Hardwares.ToListAsync(ct),
                VirtualMachines = await db.VirtualMachines.ToListAsync(ct),
                Apps = await db.Apps.ToListAsync(ct),
                StoragePools = await db.StoragePools.ToListAsync(ct),
                NetworkShares = await db.NetworkShares.ToListAsync(ct),
                Networks = await db.Networks.ToListAsync(ct),
                NetworkMembers = await db.NetworkMembers.ToListAsync(ct),
                Relationships = await db.Relationships.ToListAsync(ct),
                MapLayouts = await db.MapLayouts.ToListAsync(ct),
                Documents = await db.Documents.ToListAsync(ct)
            };

            return Results.Ok(ApiResponse<DatabaseExport>.Ok(export));
        })
        .WithSummary("Export entire database as JSON");

        // POST /api/inventory/import
        group.MapPost("/import", async (DatabaseExport import, AppDbContext db, CancellationToken ct) =>
        {
            // Wipe existing data then re-insert, preserving IDs for relational integrity
            db.Relationships.RemoveRange(db.Relationships);
            db.MapLayouts.RemoveRange(db.MapLayouts);
            db.NetworkMembers.RemoveRange(db.NetworkMembers);
            db.NetworkShares.RemoveRange(db.NetworkShares);
            db.Documents.RemoveRange(db.Documents);
            db.StoragePools.RemoveRange(db.StoragePools);
            db.Apps.RemoveRange(db.Apps);
            db.VirtualMachines.RemoveRange(db.VirtualMachines);
            db.Networks.RemoveRange(db.Networks);
            db.Hardwares.RemoveRange(db.Hardwares);
            await db.SaveChangesAsync(ct);

            // Re-insert using the imported data
            if (import.Hardware?.Any() == true) db.Hardwares.AddRange(import.Hardware);
            if (import.VirtualMachines?.Any() == true) db.VirtualMachines.AddRange(import.VirtualMachines);
            if (import.Apps?.Any() == true) db.Apps.AddRange(import.Apps);
            if (import.StoragePools?.Any() == true) db.StoragePools.AddRange(import.StoragePools);
            if (import.Networks?.Any() == true) db.Networks.AddRange(import.Networks);
            if (import.NetworkShares?.Any() == true) db.NetworkShares.AddRange(import.NetworkShares);
            if (import.NetworkMembers?.Any() == true) db.NetworkMembers.AddRange(import.NetworkMembers);
            if (import.Relationships?.Any() == true) db.Relationships.AddRange(import.Relationships);
            if (import.MapLayouts?.Any() == true) db.MapLayouts.AddRange(import.MapLayouts);
            if (import.Documents?.Any() == true) db.Documents.AddRange(import.Documents);

            await db.SaveChangesAsync(ct);

            return Results.Ok(ApiResponse<string>.Ok("Import completed successfully."));
        })
        .WithSummary("Import entire database from a JSON export file");

        return app;
    }
}

/// <summary>
/// Represents a single result returned from a cross-entity inventory search.
/// </summary>
public record InventorySearchResult(
    string EntityType,
    int Id,
    string Name,
    string? Hostname,
    string? IpOrSubnet);

/// <summary>
/// Represents a full database snapshot used for import/export operations.
/// </summary>
public class DatabaseExport
{
    /// <summary>UTC timestamp when this export was created.</summary>
    public DateTime ExportedAt { get; set; }

    /// <inheritdoc cref="AppDbContext.Hardwares"/>
    public List<RWD.Infrastructure.Diagram.Core.Domain.Entities.Hardware>? Hardware { get; set; }

    /// <inheritdoc cref="AppDbContext.VirtualMachines"/>
    public List<RWD.Infrastructure.Diagram.Core.Domain.Entities.VirtualMachine>? VirtualMachines { get; set; }

    /// <inheritdoc cref="AppDbContext.Apps"/>
    public List<RWD.Infrastructure.Diagram.Core.Domain.Entities.App>? Apps { get; set; }

    /// <inheritdoc cref="AppDbContext.StoragePools"/>
    public List<RWD.Infrastructure.Diagram.Core.Domain.Entities.Storage>? StoragePools { get; set; }

    /// <inheritdoc cref="AppDbContext.NetworkShares"/>
    public List<RWD.Infrastructure.Diagram.Core.Domain.Entities.NetworkShare>? NetworkShares { get; set; }

    /// <inheritdoc cref="AppDbContext.Networks"/>
    public List<RWD.Infrastructure.Diagram.Core.Domain.Entities.Network>? Networks { get; set; }

    /// <inheritdoc cref="AppDbContext.NetworkMembers"/>
    public List<RWD.Infrastructure.Diagram.Core.Domain.Entities.NetworkMember>? NetworkMembers { get; set; }

    /// <inheritdoc cref="AppDbContext.Relationships"/>
    public List<RWD.Infrastructure.Diagram.Core.Domain.Entities.Relationship>? Relationships { get; set; }

    /// <inheritdoc cref="AppDbContext.MapLayouts"/>
    public List<RWD.Infrastructure.Diagram.Core.Domain.Entities.MapLayout>? MapLayouts { get; set; }

    /// <inheritdoc cref="AppDbContext.Documents"/>
    public List<RWD.Infrastructure.Diagram.Core.Domain.Entities.Document>? Documents { get; set; }
}
