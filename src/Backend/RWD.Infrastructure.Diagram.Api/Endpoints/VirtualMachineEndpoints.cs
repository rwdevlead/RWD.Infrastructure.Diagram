using RWD.Infrastructure.Diagram.Api.Dtos;
using RWD.Infrastructure.Diagram.Core.Domain.Entities;
using RWD.Infrastructure.Diagram.Core.Domain.Interfaces;

namespace RWD.Infrastructure.Diagram.Api.Endpoints;

/// <summary>
/// Registers all CRUD endpoints for the <see cref="VirtualMachine"/> resource at <c>/api/vms</c>.
/// </summary>
public static class VirtualMachineEndpoints
{
    /// <summary>
    /// Maps virtual machine routes onto the provided <see cref="IEndpointRouteBuilder"/>.
    /// </summary>
    public static IEndpointRouteBuilder MapVirtualMachineEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/vms").WithTags("Virtual Machines");

        group.MapGet("/", async (IRepository<VirtualMachine> repo, CancellationToken ct) =>
        {
            var items = await repo.GetAllAsync(ct);
            return Results.Ok(ApiResponse<IEnumerable<VirtualMachineResponse>>.Ok(items.Select(ToResponse)));
        })
        .WithSummary("List all virtual machines");

        group.MapGet("/{id:int}", async (int id, IRepository<VirtualMachine> repo, CancellationToken ct) =>
        {
            var item = await repo.GetByIdAsync(id, ct);
            return item is null
                ? Results.NotFound(ApiResponse<VirtualMachineResponse>.Fail($"VirtualMachine {id} not found."))
                : Results.Ok(ApiResponse<VirtualMachineResponse>.Ok(ToResponse(item)));
        })
        .WithSummary("Get a virtual machine by ID");

        group.MapPost("/", async (VirtualMachineRequest req, IRepository<VirtualMachine> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = new VirtualMachine
            {
                HardwareId = req.HardwareId,
                Name = req.Name,
                Hostname = req.Hostname,
                IpAddress = req.IpAddress,
                Os = req.Os,
                CpuCores = req.CpuCores,
                RamGb = req.RamGb,
                DiskGb = req.DiskGb,
                Notes = req.Notes
            };
            await repo.AddAsync(entity, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Created($"/api/vms/{entity.Id}", ApiResponse<VirtualMachineResponse>.Ok(ToResponse(entity)));
        })
        .WithSummary("Create a new virtual machine");

        group.MapPut("/{id:int}", async (int id, VirtualMachineRequest req, IRepository<VirtualMachine> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<VirtualMachineResponse>.Fail($"VirtualMachine {id} not found."));

            entity.HardwareId = req.HardwareId;
            entity.Name = req.Name;
            entity.Hostname = req.Hostname;
            entity.IpAddress = req.IpAddress;
            entity.Os = req.Os;
            entity.CpuCores = req.CpuCores;
            entity.RamGb = req.RamGb;
            entity.DiskGb = req.DiskGb;
            entity.Notes = req.Notes;

            await repo.UpdateAsync(entity, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<VirtualMachineResponse>.Ok(ToResponse(entity)));
        })
        .WithSummary("Update an existing virtual machine");

        group.MapDelete("/{id:int}", async (int id, IRepository<VirtualMachine> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<string>.Fail($"VirtualMachine {id} not found."));

            await repo.DeleteAsync(id, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<string>.Ok("Deleted successfully."));
        })
        .WithSummary("Delete a virtual machine");

        return app;
    }

    private static VirtualMachineResponse ToResponse(VirtualMachine v) => new(
        v.Id, v.HardwareId, v.Name, v.Hostname, v.IpAddress,
        v.Os, v.CpuCores, v.RamGb, v.DiskGb, v.Notes,
        v.CreatedAt, v.UpdatedAt);
}
