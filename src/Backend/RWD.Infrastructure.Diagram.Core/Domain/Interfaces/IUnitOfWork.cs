namespace RWD.Infrastructure.Diagram.Core.Domain.Interfaces;

/// <summary>
/// Unit of Work interface to manage transactions.
/// </summary>
public interface IUnitOfWork : IDisposable
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
