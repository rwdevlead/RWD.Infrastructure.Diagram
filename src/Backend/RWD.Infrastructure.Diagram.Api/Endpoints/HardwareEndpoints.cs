using Microsoft.EntityFrameworkCore;
using RWD.Infrastructure.Diagram.Api.Dtos;
using RWD.Infrastructure.Diagram.Core.Domain.Entities;
using RWD.Infrastructure.Diagram.Core.Domain.Interfaces;
using RWD.Infrastructure.Diagram.Infrastructure.Persistence;

namespace RWD.Infrastructure.Diagram.Api.Endpoints;

/// <summary>
/// Registers all CRUD endpoints for the <see cref="Hardware"/> resource at <c>/api/hardware</c>.
/// </summary>
public static class HardwareEndpoints
{
    /// <summary>
    /// Maps hardware routes onto the provided <see cref="IEndpointRouteBuilder"/>.
    /// </summary>
    public static IEndpointRouteBuilder MapHardwareEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/hardware").WithTags("Hardware");

        // GET /api/hardware
        group.MapGet("/", async (IRepository<Hardware> repo, CancellationToken ct) =>
        {
            var items = await repo.GetAllAsync(ct);
            var result = items.Select(ToResponse);
            return Results.Ok(ApiResponse<IEnumerable<HardwareResponse>>.Ok(result));
        })
        .WithSummary("List all hardware items");

        // GET /api/hardware/{id}
        group.MapGet("/{id:int}", async (int id, IRepository<Hardware> repo, CancellationToken ct) =>
        {
            var item = await repo.GetByIdAsync(id, ct);
            return item is null
                ? Results.NotFound(ApiResponse<HardwareResponse>.Fail($"Hardware {id} not found."))
                : Results.Ok(ApiResponse<HardwareResponse>.Ok(ToResponse(item)));
        })
        .WithSummary("Get a hardware item by ID");

        // POST /api/hardware
        group.MapPost("/", async (HardwareRequest req, IRepository<Hardware> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = new Hardware
            {
                Name = req.Name,
                Hostname = req.Hostname,
                IpAddress = req.IpAddress,
                MacAddress = req.MacAddress,
                Cpu = req.Cpu,
                RamGb = req.RamGb,
                Os = req.Os,
                Make = req.Make,
                Model = req.Model,
                SerialNumber = req.SerialNumber,
                Location = req.Location,
                Notes = req.Notes
            };
            await repo.AddAsync(entity, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Created($"/api/hardware/{entity.Id}", ApiResponse<HardwareResponse>.Ok(ToResponse(entity)));
        })
        .WithSummary("Create a new hardware item");

        // PUT /api/hardware/{id}
        group.MapPut("/{id:int}", async (int id, HardwareRequest req, IRepository<Hardware> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<HardwareResponse>.Fail($"Hardware {id} not found."));

            entity.Name = req.Name;
            entity.Hostname = req.Hostname;
            entity.IpAddress = req.IpAddress;
            entity.MacAddress = req.MacAddress;
            entity.Cpu = req.Cpu;
            entity.RamGb = req.RamGb;
            entity.Os = req.Os;
            entity.Make = req.Make;
            entity.Model = req.Model;
            entity.SerialNumber = req.SerialNumber;
            entity.Location = req.Location;
            entity.Notes = req.Notes;

            await repo.UpdateAsync(entity, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<HardwareResponse>.Ok(ToResponse(entity)));
        })
        .WithSummary("Update an existing hardware item");

        // DELETE /api/hardware/{id}
        group.MapDelete("/{id:int}", async (int id, IRepository<Hardware> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<string>.Fail($"Hardware {id} not found."));

            await repo.DeleteAsync(id, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<string>.Ok("Deleted successfully."));
        })
        .WithSummary("Delete a hardware item");

        return app;
    }

    private static HardwareResponse ToResponse(Hardware h) => new(
        h.Id, h.Name, h.Hostname, h.IpAddress, h.MacAddress,
        h.Cpu, h.RamGb, h.Os, h.Make, h.Model,
        h.SerialNumber, h.Location, h.Notes,
        h.CreatedAt, h.UpdatedAt);
}
