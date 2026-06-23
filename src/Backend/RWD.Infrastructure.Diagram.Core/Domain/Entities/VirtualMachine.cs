namespace RWD.Infrastructure.Diagram.Core.Domain.Entities;

/// <summary>
/// Represents a virtual machine running on physical hardware.
/// </summary>
public class VirtualMachine : BaseEntity
{
    public int HardwareId { get; set; }
    public Hardware Hardware { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string? Hostname { get; set; }
    public string? IpAddress { get; set; }
    public string? Os { get; set; }
    public int? CpuCores { get; set; }
    public int? RamGb { get; set; }
    public int? DiskGb { get; set; }
    public string? Notes { get; set; }

    public ICollection<App> Apps { get; set; } = new List<App>();
    public ICollection<Storage> StoragePools { get; set; } = new List<Storage>();
}
