namespace RWD.Infrastructure.Diagram.Api.Dtos;

// ---------------------------------------------------------------------------
// Hardware DTOs
// ---------------------------------------------------------------------------

/// <summary>Response model for a hardware item.</summary>
public record HardwareResponse(
    int Id,
    string Name,
    string? Hostname,
    string? IpAddress,
    string? MacAddress,
    string? Cpu,
    int? RamGb,
    string? Os,
    string? Make,
    string? Model,
    string? SerialNumber,
    string? Location,
    string? Notes,
    DateTime CreatedAt,
    DateTime UpdatedAt);

/// <summary>Request model for creating or updating a hardware item.</summary>
public record HardwareRequest(
    string Name,
    string? Hostname,
    string? IpAddress,
    string? MacAddress,
    string? Cpu,
    int? RamGb,
    string? Os,
    string? Make,
    string? Model,
    string? SerialNumber,
    string? Location,
    string? Notes);

// ---------------------------------------------------------------------------
// VirtualMachine DTOs
// ---------------------------------------------------------------------------

/// <summary>Response model for a virtual machine.</summary>
public record VirtualMachineResponse(
    int Id,
    int HardwareId,
    string Name,
    string? Hostname,
    string? IpAddress,
    string? Os,
    int? CpuCores,
    int? RamGb,
    int? DiskGb,
    string? Notes,
    DateTime CreatedAt,
    DateTime UpdatedAt);

/// <summary>Request model for creating or updating a virtual machine.</summary>
public record VirtualMachineRequest(
    int HardwareId,
    string Name,
    string? Hostname,
    string? IpAddress,
    string? Os,
    int? CpuCores,
    int? RamGb,
    int? DiskGb,
    string? Notes);

// ---------------------------------------------------------------------------
// App DTOs
// ---------------------------------------------------------------------------

/// <summary>Response model for an application or service.</summary>
public record AppResponse(
    int Id,
    string Name,
    string? Description,
    string? IpAddress,
    int? Port,
    bool Https,
    string? Url,
    string? Notes,
    int? HardwareId,
    int? VirtualMachineId,
    DateTime CreatedAt,
    DateTime UpdatedAt);

/// <summary>Request model for creating or updating an application.</summary>
public record AppRequest(
    string Name,
    string? Description,
    string? IpAddress,
    int? Port,
    bool Https,
    string? Url,
    string? Notes,
    int? HardwareId,
    int? VirtualMachineId);

// ---------------------------------------------------------------------------
// Storage DTOs
// ---------------------------------------------------------------------------

/// <summary>Response model for a storage pool.</summary>
public record StorageResponse(
    int Id,
    string Name,
    string? StorageType,
    string? RaidType,
    double? UsableSpaceTb,
    string? Notes,
    int? HardwareId,
    int? VirtualMachineId,
    DateTime CreatedAt,
    DateTime UpdatedAt);

/// <summary>Request model for creating or updating a storage pool.</summary>
public record StorageRequest(
    string Name,
    string? StorageType,
    string? RaidType,
    double? UsableSpaceTb,
    string? Notes,
    int? HardwareId,
    int? VirtualMachineId);

// ---------------------------------------------------------------------------
// NetworkShare DTOs
// ---------------------------------------------------------------------------

/// <summary>Response model for a network share.</summary>
public record NetworkShareResponse(
    int Id,
    int StorageId,
    string Name,
    string? ShareType,
    string? Hostname,
    string? Ip,
    string? Notes,
    DateTime CreatedAt,
    DateTime UpdatedAt);

/// <summary>Request model for creating or updating a network share.</summary>
public record NetworkShareRequest(
    int StorageId,
    string Name,
    string? ShareType,
    string? Hostname,
    string? Ip,
    string? Notes);

// ---------------------------------------------------------------------------
// Network DTOs
// ---------------------------------------------------------------------------

/// <summary>Response model for a network definition.</summary>
public record NetworkResponse(
    int Id,
    string Name,
    int? VlanId,
    string? Subnet,
    string? Gateway,
    string? Color,
    string? Notes,
    DateTime CreatedAt,
    DateTime UpdatedAt);

/// <summary>Request model for creating or updating a network definition.</summary>
public record NetworkRequest(
    string Name,
    int? VlanId,
    string? Subnet,
    string? Gateway,
    string? Color,
    string? Notes);

// ---------------------------------------------------------------------------
// NetworkMember DTOs
// ---------------------------------------------------------------------------

/// <summary>Response model for a network member association.</summary>
public record NetworkMemberResponse(
    int Id,
    int NetworkId,
    string MemberType,
    int MemberId,
    string? IpOnNetwork,
    DateTime CreatedAt,
    DateTime UpdatedAt);

/// <summary>Request model for creating or updating a network member.</summary>
public record NetworkMemberRequest(
    int NetworkId,
    string MemberType,
    int MemberId,
    string? IpOnNetwork);

// ---------------------------------------------------------------------------
// Document DTOs
// ---------------------------------------------------------------------------

/// <summary>Response model for a markdown document.</summary>
public record DocumentResponse(
    int Id,
    string Title,
    string Content,
    int? ParentId,
    int SortOrder,
    DateTime CreatedAt,
    DateTime UpdatedAt);

/// <summary>Request model for creating or updating a document.</summary>
public record DocumentRequest(
    string Title,
    string Content,
    int? ParentId,
    int SortOrder);

// ---------------------------------------------------------------------------
// Relationship DTOs
// ---------------------------------------------------------------------------

/// <summary>Response model for a custom entity relationship.</summary>
public record RelationshipResponse(
    int Id,
    string SourceType,
    int SourceId,
    string TargetType,
    int TargetId,
    string? Label,
    string? RelationshipType,
    DateTime CreatedAt,
    DateTime UpdatedAt);

/// <summary>Request model for creating or updating a relationship.</summary>
public record RelationshipRequest(
    string SourceType,
    int SourceId,
    string TargetType,
    int TargetId,
    string? Label,
    string? RelationshipType);

// ---------------------------------------------------------------------------
// MapLayout DTOs
// ---------------------------------------------------------------------------

/// <summary>Response model for a node map layout position.</summary>
public record MapLayoutResponse(
    int Id,
    string NodeType,
    int NodeId,
    double X,
    double Y,
    bool Locked,
    DateTime CreatedAt,
    DateTime UpdatedAt);

/// <summary>Request model for saving a node map layout position.</summary>
public record MapLayoutRequest(
    string NodeType,
    int NodeId,
    double X,
    double Y,
    bool Locked);

// ---------------------------------------------------------------------------
// Shared envelope
// ---------------------------------------------------------------------------

/// <summary>Standard API response envelope.</summary>
public record ApiResponse<T>(T? Data, string? Error)
{
    /// <summary>Creates a successful response wrapping data.</summary>
    public static ApiResponse<T> Ok(T data) => new(data, null);

    /// <summary>Creates an error response.</summary>
    public static ApiResponse<T> Fail(string error) => new(default, error);
}
