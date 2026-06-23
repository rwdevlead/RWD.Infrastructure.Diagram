namespace RWD.Infrastructure.Diagram.Core.Domain.Entities;

/// <summary>
/// Represents a custom relationship between two entities.
/// </summary>
public class Relationship : BaseEntity
{
    public string SourceType { get; set; } = string.Empty;
    public int SourceId { get; set; }
    public string TargetType { get; set; } = string.Empty;
    public int TargetId { get; set; }
    public string? Label { get; set; }
    public string? RelationshipType { get; set; } // e.g., dependency, peer, etc.
}
