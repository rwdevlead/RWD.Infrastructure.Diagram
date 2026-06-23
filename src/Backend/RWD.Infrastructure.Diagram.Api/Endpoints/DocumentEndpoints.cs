using RWD.Infrastructure.Diagram.Api.Dtos;
using RWD.Infrastructure.Diagram.Core.Domain.Entities;
using RWD.Infrastructure.Diagram.Core.Domain.Interfaces;

namespace RWD.Infrastructure.Diagram.Api.Endpoints;

/// <summary>
/// Registers all CRUD endpoints for <see cref="Document"/> at <c>/api/documents</c>.
/// </summary>
public static class DocumentEndpoints
{
    /// <summary>
    /// Maps document routes onto the provided <see cref="IEndpointRouteBuilder"/>.
    /// </summary>
    public static IEndpointRouteBuilder MapDocumentEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/documents").WithTags("Documents");

        group.MapGet("/", async (IRepository<Document> repo, CancellationToken ct) =>
        {
            var items = await repo.GetAllAsync(ct);
            return Results.Ok(ApiResponse<IEnumerable<DocumentResponse>>.Ok(items.Select(ToResponse)));
        })
        .WithSummary("List all documents");

        group.MapGet("/{id:int}", async (int id, IRepository<Document> repo, CancellationToken ct) =>
        {
            var item = await repo.GetByIdAsync(id, ct);
            return item is null
                ? Results.NotFound(ApiResponse<DocumentResponse>.Fail($"Document {id} not found."))
                : Results.Ok(ApiResponse<DocumentResponse>.Ok(ToResponse(item)));
        })
        .WithSummary("Get a document by ID");

        group.MapPost("/", async (DocumentRequest req, IRepository<Document> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = new Document
            {
                Title = req.Title,
                Content = req.Content,
                ParentId = req.ParentId,
                SortOrder = req.SortOrder
            };
            await repo.AddAsync(entity, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Created($"/api/documents/{entity.Id}", ApiResponse<DocumentResponse>.Ok(ToResponse(entity)));
        })
        .WithSummary("Create a new document");

        group.MapPut("/{id:int}", async (int id, DocumentRequest req, IRepository<Document> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<DocumentResponse>.Fail($"Document {id} not found."));

            entity.Title = req.Title;
            entity.Content = req.Content;
            entity.ParentId = req.ParentId;
            entity.SortOrder = req.SortOrder;

            await repo.UpdateAsync(entity, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<DocumentResponse>.Ok(ToResponse(entity)));
        })
        .WithSummary("Update an existing document");

        group.MapDelete("/{id:int}", async (int id, IRepository<Document> repo, IUnitOfWork uow, CancellationToken ct) =>
        {
            var entity = await repo.GetByIdAsync(id, ct);
            if (entity is null)
                return Results.NotFound(ApiResponse<string>.Fail($"Document {id} not found."));

            await repo.DeleteAsync(id, ct);
            await uow.SaveChangesAsync(ct);
            return Results.Ok(ApiResponse<string>.Ok("Deleted successfully."));
        })
        .WithSummary("Delete a document");

        return app;
    }

    private static DocumentResponse ToResponse(Document d) => new(
        d.Id, d.Title, d.Content, d.ParentId, d.SortOrder,
        d.CreatedAt, d.UpdatedAt);
}
