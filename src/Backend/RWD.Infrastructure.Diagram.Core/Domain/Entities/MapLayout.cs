namespace RWD.Infrastructure.Diagram.Core.Domain.Entities;

/// <summary>
/// Stores coordinates for the network map visualization.
/// </summary>
public class MapLayout : BaseEntity
{
    public string NodeType { get; set; } = string.Empty;
    public int NodeId { get; set; }
    public double X { get; set; }
    public double Y { get; set; }
    public bool Locked { get; set; }
}
