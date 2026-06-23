using Microsoft.EntityFrameworkCore;
using RWD.Infrastructure.Diagram.Api.Dtos;
using RWD.Infrastructure.Diagram.Core.Domain.Entities;
using RWD.Infrastructure.Diagram.Core.Domain.Interfaces;
using RWD.Infrastructure.Diagram.Infrastructure.Persistence;

namespace RWD.Infrastructure.Diagram.Api.Endpoints;

/// <summary>
/// Registers map layout and relationship endpoints at <c>/api/map</c>.
/// </summary>
public static class MapEndpoints
{
    /// <summary>
    /// Maps map-layout and relationship routes onto the provided <see cref="IEndpointRouteBuilder"/>.
    /// </summary>
    public static IEndpointRouteBuilder MapMapEndpoints(this IEndpointRouteBuilder app)
    {
        var map = app.MapGroup("/api/map").WithTags("Map");

        // --- Layout ---
        map.MapGet("/layout", async (IRepository<MapLayout> repo, CancellationToken ct) =>
        {
            var items = await repo.GetAllAsync(ct);
            return Results.Ok(ApiResponse<IEnumerable<MapLayoutResponse>>.Ok(items.Select(ToLayoutResponse)));
        })
        .WithSummary("Get all node layout positions");

        map.MapPost("/layout", async (MapLayoutRequest req, AppDbContext db, IUnitOfWork uow, CancellationToken ct) =>
        {
            // Upsert: update existing position if found, else create
            var existing = await db.MapLayouts
                .FirstOrDefaultAsync(m => m.NodeType == req.NodeType && m.NodeId == req.NodeId, ct);

            if (existing is null)
            {
                existing = new MapLayout
                {
                    NodeType = req.NodeType,
                    NodeId = req.NodeId,
                    X = req.X,
                    Y = req.Y,
                    Locked = req.Locked
                };
                db.MapLayouts.Add(existing);
            }
            else
            {
                existing.X = req.X;
                existing.Y = req.Y;
                existing.Locked = req.Locked;
            }

            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<MapLayoutResponse>.Ok(ToLayoutResponse(existing)));
        })
        .WithSummary("Save or update a node position on the map");

        map.MapDelete("/layout/{id:int}", async (int id, IRepository<MapLayout> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<string>.Fail($"MapLayout {id} not found."));

            await repo.DeleteAsync(id, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<string>.Ok("Deleted successfully."));
        })
        .WithSummary("Remove a node layout position");

        // --- Relationships ---
        map.MapGet("/relationships", async (IRepository<Relationship> repo, CancellationToken ct) =>
        {
            var items = await repo.GetAllAsync(ct);
            return Results.Ok(ApiResponse<IEnumerable<RelationshipResponse>>.Ok(items.Select(ToRelationshipResponse)));
        })
        .WithSummary("Get all custom entity relationships");

        map.MapPost("/relationships", async (RelationshipRequest req, IRepository<Relationship> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = new Relationship
            {
                SourceType = req.SourceType,
                SourceId = req.SourceId,
                TargetType = req.TargetType,
                TargetId = req.TargetId,
                Label = req.Label,
                RelationshipType = req.RelationshipType
            };
            await repo.AddAsync(entity, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Created($"/api/map/relationships/{entity.Id}", ApiResponse<RelationshipResponse>.Ok(ToRelationshipResponse(entity)));
        })
        .WithSummary("Create a new entity relationship");

        map.MapDelete("/relationships/{id:int}", async (int id, IRepository<Relationship> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<string>.Fail($"Relationship {id} not found."));

            await repo.DeleteAsync(id, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<string>.Ok("Deleted successfully."));
        })
        .WithSummary("Delete a relationship");

        return app;
    }

    private static MapLayoutResponse ToLayoutResponse(MapLayout m) => new(
        m.Id, m.NodeType, m.NodeId, m.X, m.Y, m.Locked, m.CreatedAt, m.UpdatedAt);

    private static RelationshipResponse ToRelationshipResponse(Relationship r) => new(
        r.Id, r.SourceType, r.SourceId, r.TargetType, r.TargetId, r.Label,
        r.RelationshipType, r.CreatedAt, r.UpdatedAt);
}
