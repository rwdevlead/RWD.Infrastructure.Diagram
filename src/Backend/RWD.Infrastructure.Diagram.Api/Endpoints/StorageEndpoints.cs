using RWD.Infrastructure.Diagram.Api.Dtos;
using RWD.Infrastructure.Diagram.Core.Domain.Entities;
using RWD.Infrastructure.Diagram.Core.Domain.Interfaces;

namespace RWD.Infrastructure.Diagram.Api.Endpoints;

/// <summary>
/// Registers all CRUD endpoints for the <see cref="Storage"/> resource at <c>/api/storage</c>.
/// </summary>
public static class StorageEndpoints
{
    /// <summary>
    /// Maps storage pool routes onto the provided <see cref="IEndpointRouteBuilder"/>.
    /// </summary>
    public static IEndpointRouteBuilder MapStorageEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/storage").WithTags("Storage");

        group.MapGet("/", async (IRepository<Storage> repo, CancellationToken ct) =>
        {
            var items = await repo.GetAllAsync(ct);
            return Results.Ok(ApiResponse<IEnumerable<StorageResponse>>.Ok(items.Select(ToResponse)));
        })
        .WithSummary("List all storage pools");

        group.MapGet("/{id:int}", async (int id, IRepository<Storage> repo, CancellationToken ct) =>
        {
            var item = await repo.GetByIdAsync(id, ct);
            return item is null
                ? Results.NotFound(ApiResponse<StorageResponse>.Fail($"Storage {id} not found."))
                : Results.Ok(ApiResponse<StorageResponse>.Ok(ToResponse(item)));
        })
        .WithSummary("Get a storage pool by ID");

        group.MapPost("/", async (StorageRequest req, IRepository<Storage> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = new Storage
            {
                Name = req.Name,
                StorageType = req.StorageType,
                RaidType = req.RaidType,
                UsableSpaceTb = req.UsableSpaceTb,
                Notes = req.Notes,
                HardwareId = req.HardwareId,
                VirtualMachineId = req.VirtualMachineId
            };
            await repo.AddAsync(entity, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Created($"/api/storage/{entity.Id}", ApiResponse<StorageResponse>.Ok(ToResponse(entity)));
        })
        .WithSummary("Create a new storage pool");

        group.MapPut("/{id:int}", async (int id, StorageRequest req, IRepository<Storage> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<StorageResponse>.Fail($"Storage {id} not found."));

            entity.Name = req.Name;
            entity.StorageType = req.StorageType;
            entity.RaidType = req.RaidType;
            entity.UsableSpaceTb = req.UsableSpaceTb;
            entity.Notes = req.Notes;
            entity.HardwareId = req.HardwareId;
            entity.VirtualMachineId = req.VirtualMachineId;

            await repo.UpdateAsync(entity, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<StorageResponse>.Ok(ToResponse(entity)));
        })
        .WithSummary("Update an existing storage pool");

        group.MapDelete("/{id:int}", async (int id, IRepository<Storage> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<string>.Fail($"Storage {id} not found."));

            await repo.DeleteAsync(id, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<string>.Ok("Deleted successfully."));
        })
        .WithSummary("Delete a storage pool");

        return app;
    }

    private static StorageResponse ToResponse(Storage s) => new(
        s.Id, s.Name, s.StorageType, s.RaidType, s.UsableSpaceTb, s.Notes,
        s.HardwareId, s.VirtualMachineId, s.CreatedAt, s.UpdatedAt);
}
