using RWD.Infrastructure.Diagram.Api.Dtos;
using RWD.Infrastructure.Diagram.Core.Domain.Entities;
using RWD.Infrastructure.Diagram.Core.Domain.Interfaces;

namespace RWD.Infrastructure.Diagram.Api.Endpoints;

/// <summary>
/// Registers all CRUD endpoints for <see cref="Network"/> and <see cref="NetworkMember"/>
/// resources at <c>/api/networks</c> and <c>/api/network-members</c>.
/// </summary>
public static class NetworkEndpoints
{
    /// <summary>
    /// Maps network and network-member routes onto the provided <see cref="IEndpointRouteBuilder"/>.
    /// </summary>
    public static IEndpointRouteBuilder MapNetworkEndpoints(this IEndpointRouteBuilder app)
    {
        // --- Networks ---
        var networks = app.MapGroup("/api/networks").WithTags("Networks");

        networks.MapGet("/", async (IRepository<Network> repo, CancellationToken ct) =>
        {
            var items = await repo.GetAllAsync(ct);
            return Results.Ok(ApiResponse<IEnumerable<NetworkResponse>>.Ok(items.Select(ToNetworkResponse)));
        })
        .WithSummary("List all networks");

        networks.MapGet("/{id:int}", async (int id, IRepository<Network> repo, CancellationToken ct) =>
        {
            var item = await repo.GetByIdAsync(id, ct);
            return item is null
                ? Results.NotFound(ApiResponse<NetworkResponse>.Fail($"Network {id} not found."))
                : Results.Ok(ApiResponse<NetworkResponse>.Ok(ToNetworkResponse(item)));
        })
        .WithSummary("Get a network by ID");

        networks.MapPost("/", async (NetworkRequest req, IRepository<Network> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = new Network
            {
                Name = req.Name,
                VlanId = req.VlanId,
                Subnet = req.Subnet,
                Gateway = req.Gateway,
                Color = req.Color,
                Notes = req.Notes
            };
            await repo.AddAsync(entity, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Created($"/api/networks/{entity.Id}", ApiResponse<NetworkResponse>.Ok(ToNetworkResponse(entity)));
        })
        .WithSummary("Create a new network");

        networks.MapPut("/{id:int}", async (int id, NetworkRequest req, IRepository<Network> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<NetworkResponse>.Fail($"Network {id} not found."));

            entity.Name = req.Name;
            entity.VlanId = req.VlanId;
            entity.Subnet = req.Subnet;
            entity.Gateway = req.Gateway;
            entity.Color = req.Color;
            entity.Notes = req.Notes;

            await repo.UpdateAsync(entity, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<NetworkResponse>.Ok(ToNetworkResponse(entity)));
        })
        .WithSummary("Update an existing network");

        networks.MapDelete("/{id:int}", async (int id, IRepository<Network> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<string>.Fail($"Network {id} not found."));

            await repo.DeleteAsync(id, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<string>.Ok("Deleted successfully."));
        })
        .WithSummary("Delete a network");

        // --- Network Members ---
        var members = app.MapGroup("/api/network-members").WithTags("Network Members");

        members.MapGet("/", async (IRepository<NetworkMember> repo, CancellationToken ct) =>
        {
            var items = await repo.GetAllAsync(ct);
            return Results.Ok(ApiResponse<IEnumerable<NetworkMemberResponse>>.Ok(items.Select(ToMemberResponse)));
        })
        .WithSummary("List all network members");

        members.MapGet("/{id:int}", async (int id, IRepository<NetworkMember> repo, CancellationToken ct) =>
        {
            var item = await repo.GetByIdAsync(id, ct);
            return item is null
                ? Results.NotFound(ApiResponse<NetworkMemberResponse>.Fail($"NetworkMember {id} not found."))
                : Results.Ok(ApiResponse<NetworkMemberResponse>.Ok(ToMemberResponse(item)));
        })
        .WithSummary("Get a network member by ID");

        members.MapPost("/", async (NetworkMemberRequest req, IRepository<NetworkMember> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = new NetworkMember
            {
                NetworkId = req.NetworkId,
                MemberType = req.MemberType,
                MemberId = req.MemberId,
                IpOnNetwork = req.IpOnNetwork
            };
            await repo.AddAsync(entity, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Created($"/api/network-members/{entity.Id}", ApiResponse<NetworkMemberResponse>.Ok(ToMemberResponse(entity)));
        })
        .WithSummary("Add a member to a network");

        members.MapPut("/{id:int}", async (int id, NetworkMemberRequest req, IRepository<NetworkMember> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<NetworkMemberResponse>.Fail($"NetworkMember {id} not found."));

            entity.NetworkId = req.NetworkId;
            entity.MemberType = req.MemberType;
            entity.MemberId = req.MemberId;
            entity.IpOnNetwork = req.IpOnNetwork;

            await repo.UpdateAsync(entity, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<NetworkMemberResponse>.Ok(ToMemberResponse(entity)));
        })
        .WithSummary("Update a network member");

        members.MapDelete("/{id:int}", async (int id, IRepository<NetworkMember> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<string>.Fail($"NetworkMember {id} not found."));

            await repo.DeleteAsync(id, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<string>.Ok("Deleted successfully."));
        })
        .WithSummary("Remove a member from a network");

        return app;
    }

    private static NetworkResponse ToNetworkResponse(Network n) => new(
        n.Id, n.Name, n.VlanId, n.Subnet, n.Gateway, n.Color, n.Notes,
        n.CreatedAt, n.UpdatedAt);

    private static NetworkMemberResponse ToMemberResponse(NetworkMember m) => new(
        m.Id, m.NetworkId, m.MemberType, m.MemberId, m.IpOnNetwork,
        m.CreatedAt, m.UpdatedAt);
}
