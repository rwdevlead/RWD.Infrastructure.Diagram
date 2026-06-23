namespace RWD.Infrastructure.Diagram.Core.Domain.Entities;

/// <summary>
/// Junction entity linking other entities to a network.
/// </summary>
public class NetworkMember : BaseEntity
{
    public int NetworkId { get; set; }
    public Network Network { get; set; } = null!;

    public string MemberType { get; set; } = string.Empty; // e.g., Hardware, VM, App, Misc
    public int MemberId { get; set; }
    public string? IpOnNetwork { get; set; }
}
