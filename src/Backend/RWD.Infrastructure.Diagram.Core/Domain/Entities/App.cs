namespace RWD.Infrastructure.Diagram.Core.Domain.Entities;

/// <summary>
/// Represents an application or service.
/// </summary>
public class App : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? IpAddress { get; set; }
    public int? Port { get; set; }
    public bool Https { get; set; }
    public string? Url { get; set; }
    public string? Notes { get; set; }

    public int? HardwareId { get; set; }
    public Hardware? Hardware { get; set; }

    public int? VirtualMachineId { get; set; }
    public VirtualMachine? VirtualMachine { get; set; }
}
