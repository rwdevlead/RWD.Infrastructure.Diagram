namespace RWD.Infrastructure.Diagram.Core.Domain.Entities;

/// <summary>
/// Represents a storage pool or drive.
/// </summary>
public class Storage : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? StorageType { get; set; } // e.g., SSD, HDD, NVMe
    public string? RaidType { get; set; }    // e.g., RAID 0, 1, 5, 10, ZFS
    public double? UsableSpaceTb { get; set; }
    public string? Notes { get; set; }

    public int? HardwareId { get; set; }
    public Hardware? Hardware { get; set; }

    public int? VirtualMachineId { get; set; }
    public VirtualMachine? VirtualMachine { get; set; }

    public ICollection<NetworkShare> Shares { get; set; } = new List<NetworkShare>();
}
