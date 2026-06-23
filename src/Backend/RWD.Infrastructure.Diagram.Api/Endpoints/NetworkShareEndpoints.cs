using RWD.Infrastructure.Diagram.Api.Dtos;
using RWD.Infrastructure.Diagram.Core.Domain.Entities;
using RWD.Infrastructure.Diagram.Core.Domain.Interfaces;

namespace RWD.Infrastructure.Diagram.Api.Endpoints;

/// <summary>
/// Registers all CRUD endpoints for <see cref="NetworkShare"/> at <c>/api/shares</c>.
/// </summary>
public static class NetworkShareEndpoints
{
    /// <summary>
    /// Maps network share routes onto the provided <see cref="IEndpointRouteBuilder"/>.
    /// </summary>
    public static IEndpointRouteBuilder MapNetworkShareEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/shares").WithTags("Network Shares");

        group.MapGet("/", async (IRepository<NetworkShare> repo, CancellationToken ct) =>
        {
            var items = await repo.GetAllAsync(ct);
            return Results.Ok(ApiResponse<IEnumerable<NetworkShareResponse>>.Ok(items.Select(ToResponse)));
        })
        .WithSummary("List all network shares");

        group.MapGet("/{id:int}", async (int id, IRepository<NetworkShare> repo, CancellationToken ct) =>
        {
            var item = await repo.GetByIdAsync(id, ct);
            return item is null
                ? Results.NotFound(ApiResponse<NetworkShareResponse>.Fail($"NetworkShare {id} not found."))
                : Results.Ok(ApiResponse<NetworkShareResponse>.Ok(ToResponse(item)));
        })
        .WithSummary("Get a network share by ID");

        group.MapPost("/", async (NetworkShareRequest req, IRepository<NetworkShare> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = new NetworkShare
            {
                StorageId = req.StorageId,
                Name = req.Name,
                ShareType = req.ShareType,
                Hostname = req.Hostname,
                Ip = req.Ip,
                Notes = req.Notes
            };
            await repo.AddAsync(entity, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Created($"/api/shares/{entity.Id}", ApiResponse<NetworkShareResponse>.Ok(ToResponse(entity)));
        })
        .WithSummary("Create a new network share");

        group.MapPut("/{id:int}", async (int id, NetworkShareRequest req, IRepository<NetworkShare> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<NetworkShareResponse>.Fail($"NetworkShare {id} not found."));

            entity.StorageId = req.StorageId;
            entity.Name = req.Name;
            entity.ShareType = req.ShareType;
            entity.Hostname = req.Hostname;
            entity.Ip = req.Ip;
            entity.Notes = req.Notes;

            await repo.UpdateAsync(entity, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<NetworkShareResponse>.Ok(ToResponse(entity)));
        })
        .WithSummary("Update an existing network share");

        group.MapDelete("/{id:int}", async (int id, IRepository<NetworkShare> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<string>.Fail($"NetworkShare {id} not found."));

            await repo.DeleteAsync(id, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<string>.Ok("Deleted successfully."));
        })
        .WithSummary("Delete a network share");

        return app;
    }

    private static NetworkShareResponse ToResponse(NetworkShare s) => new(
        s.Id, s.StorageId, s.Name, s.ShareType, s.Hostname, s.Ip, s.Notes,
        s.CreatedAt, s.UpdatedAt);
}
