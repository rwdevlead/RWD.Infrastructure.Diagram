namespace RWD.Infrastructure.Diagram.Core.Domain.Entities;

/// <summary>
/// Base class for all domain entities.
/// </summary>
public abstract class BaseEntity
{
    /// <summary>
    /// Unique identifier for the entity.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Timestamp when the entity was created.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Timestamp when the entity was last updated.
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
