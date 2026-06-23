namespace RWD.Infrastructure.Diagram.Core.Domain.Entities;

/// <summary>
/// Represents a physical hardware server or machine.
/// </summary>
public class Hardware : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Hostname { get; set; }
    public string? IpAddress { get; set; }
    public string? MacAddress { get; set; }
    public string? Cpu { get; set; }
    public int? RamGb { get; set; }
    public string? Os { get; set; }
    public string? Make { get; set; }
    public string? Model { get; set; }
    public string? SerialNumber { get; set; }
    public string? Location { get; set; }
    public string? Notes { get; set; }

    public ICollection<VirtualMachine> VirtualMachines { get; set; } = new List<VirtualMachine>();
    public ICollection<App> Apps { get; set; } = new List<App>();
    public ICollection<Storage> StoragePools { get; set; } = new List<Storage>();
}
