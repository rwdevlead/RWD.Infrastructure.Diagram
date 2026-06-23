using RWD.Infrastructure.Diagram.Api.Dtos;
using RWD.Infrastructure.Diagram.Core.Domain.Entities;
using RWD.Infrastructure.Diagram.Core.Domain.Interfaces;

namespace RWD.Infrastructure.Diagram.Api.Endpoints;

/// <summary>
/// Registers all CRUD endpoints for the <see cref="App"/> resource at <c>/api/apps</c>.
/// </summary>
public static class AppEndpoints
{
    /// <summary>
    /// Maps application/service routes onto the provided <see cref="IEndpointRouteBuilder"/>.
    /// </summary>
    public static IEndpointRouteBuilder MapAppEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/apps").WithTags("Applications");

        group.MapGet("/", async (IRepository<App> repo, CancellationToken ct) =>
        {
            var items = await repo.GetAllAsync(ct);
            return Results.Ok(ApiResponse<IEnumerable<AppResponse>>.Ok(items.Select(ToResponse)));
        })
        .WithSummary("List all applications");

        group.MapGet("/{id:int}", async (int id, IRepository<App> repo, CancellationToken ct) =>
        {
            var item = await repo.GetByIdAsync(id, ct);
            return item is null
                ? Results.NotFound(ApiResponse<AppResponse>.Fail($"App {id} not found."))
                : Results.Ok(ApiResponse<AppResponse>.Ok(ToResponse(item)));
        })
        .WithSummary("Get an application by ID");

        group.MapPost("/", async (AppRequest req, IRepository<App> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = new App
            {
                Name = req.Name,
                Description = req.Description,
                IpAddress = req.IpAddress,
                Port = req.Port,
                Https = req.Https,
                Url = req.Url,
                Notes = req.Notes,
                HardwareId = req.HardwareId,
                VirtualMachineId = req.VirtualMachineId
            };
            await repo.AddAsync(entity, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Created($"/api/apps/{entity.Id}", ApiResponse<AppResponse>.Ok(ToResponse(entity)));
        })
        .WithSummary("Create a new application");

        group.MapPut("/{id:int}", async (int id, AppRequest req, IRepository<App> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<AppResponse>.Fail($"App {id} not found."));

            entity.Name = req.Name;
            entity.Description = req.Description;
            entity.IpAddress = req.IpAddress;
            entity.Port = req.Port;
            entity.Https = req.Https;
            entity.Url = req.Url;
            entity.Notes = req.Notes;
            entity.HardwareId = req.HardwareId;
            entity.VirtualMachineId = req.VirtualMachineId;

            await repo.UpdateAsync(entity, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<AppResponse>.Ok(ToResponse(entity)));
        })
        .WithSummary("Update an existing application");

        group.MapDelete("/{id:int}", async (int id, IRepository<App> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<string>.Fail($"App {id} not found."));

            await repo.DeleteAsync(id, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<string>.Ok("Deleted successfully."));
        })
        .WithSummary("Delete an application");

        return app;
    }

    private static AppResponse ToResponse(App a) => new(
        a.Id, a.Name, a.Description, a.IpAddress, a.Port, a.Https, a.Url, a.Notes,
        a.HardwareId, a.VirtualMachineId, a.CreatedAt, a.UpdatedAt);
}
