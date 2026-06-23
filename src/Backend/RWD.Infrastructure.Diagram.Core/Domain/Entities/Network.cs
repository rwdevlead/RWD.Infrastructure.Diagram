namespace RWD.Infrastructure.Diagram.Core.Domain.Entities;

/// <summary>
/// Represents a network definition (VLAN, Subnet).
/// </summary>
public class Network : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public int? VlanId { get; set; }
    public string? Subnet { get; set; }
    public string? Gateway { get; set; }
    public string? Color { get; set; } // For visualization
    public string? Notes { get; set; }

    public ICollection<NetworkMember> Members { get; set; } = new List<NetworkMember>();
}
