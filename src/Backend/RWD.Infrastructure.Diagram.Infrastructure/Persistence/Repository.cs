using Microsoft.EntityFrameworkCore;
using RWD.Infrastructure.Diagram.Core.Domain.Entities;
using RWD.Infrastructure.Diagram.Core.Domain.Interfaces;

namespace RWD.Infrastructure.Diagram.Infrastructure.Persistence;

/// <summary>
/// Generic repository implementation using Entity Framework Core.
/// </summary>
/// <typeparam name="T">The entity type.</typeparam>
public class Repository<T> : IRepository<T> where T : BaseEntity
{
    /// <summary>
    /// The database context.
    /// </summary>
    protected readonly AppDbContext Context;

    /// <summary>
    /// The DB Set representing the entity table.
    /// </summary>
    protected readonly DbSet<T> DbSet;

    /// <summary>
    /// Initializes a new instance of the <see cref="Repository{T}"/> class.
    /// </summary>
    /// <param name="context">The database context.</param>
    public Repository(AppDbContext context)
    {
        Context = context;
        DbSet = context.Set<T>();
    }

    /// <inheritdoc />
    public virtual async Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await DbSet.FindAsync(new object[] { id }, cancellationToken);
    }

    /// <inheritdoc />
    public virtual async Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await DbSet.ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public virtual async Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        await DbSet.AddAsync(entity, cancellationToken);
        return entity;
    }

    /// <inheritdoc />
    public virtual Task UpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        Context.Entry(entity).State = EntityState.Modified;
        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public virtual async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await GetByIdAsync(id, cancellationToken);
        if (entity != null)
        {
            DbSet.Remove(entity);
        }
    }
}
