namespace RWD.Infrastructure.Diagram.Core.Domain.Entities;

/// <summary>
/// Represents a network share (SMB, NFS, etc.).
/// </summary>
public class NetworkShare : BaseEntity
{
    public int StorageId { get; set; }
    public Storage Storage { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string? ShareType { get; set; } // e.g., SMB, NFS, AFP
    public string? Hostname { get; set; }
    public string? Ip { get; set; }
    public string? Notes { get; set; }
}
