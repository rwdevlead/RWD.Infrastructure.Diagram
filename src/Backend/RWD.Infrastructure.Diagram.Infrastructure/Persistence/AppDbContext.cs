using Microsoft.EntityFrameworkCore;
using RWD.Infrastructure.Diagram.Core.Domain.Entities;

namespace RWD.Infrastructure.Diagram.Infrastructure.Persistence;

/// <summary>
/// Database context for the RWD.Infrastructure.Diagram application.
/// </summary>
public class AppDbContext : DbContext
{
    /// <summary>
    /// Initializes a new instance of the <see cref="AppDbContext"/> class.
    /// </summary>
    /// <param name="options">The options to be used by a DbContext.</param>
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    /// <summary>
    /// Gets or sets the physical hardware servers.
    /// </summary>
    public DbSet<Hardware> Hardwares => Set<Hardware>();

    /// <summary>
    /// Gets or sets the virtual machines.
    /// </summary>
    public DbSet<VirtualMachine> VirtualMachines => Set<VirtualMachine>();

    /// <summary>
    /// Gets or sets the applications.
    /// </summary>
    public DbSet<App> Apps => Set<App>();

    /// <summary>
    /// Gets or sets the storage pools.
    /// </summary>
    public DbSet<Storage> StoragePools => Set<Storage>();

    /// <summary>
    /// Gets or sets the network shares.
    /// </summary>
    public DbSet<NetworkShare> NetworkShares => Set<NetworkShare>();

    /// <summary>
    /// Gets or sets the network definitions.
    /// </summary>
    public DbSet<Network> Networks => Set<Network>();

    /// <summary>
    /// Gets or sets the network members.
    /// </summary>
    public DbSet<NetworkMember> NetworkMembers => Set<NetworkMember>();

    /// <summary>
    /// Gets or sets the custom relationships.
    /// </summary>
    public DbSet<Relationship> Relationships => Set<Relationship>();

    /// <summary>
    /// Gets or sets the map layout positions.
    /// </summary>
    public DbSet<MapLayout> MapLayouts => Set<MapLayout>();

    /// <summary>
    /// Gets or sets the markdown documents.
    /// </summary>
    public DbSet<Document> Documents => Set<Document>();

    /// <inheritdoc />
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Hardware configuration
        modelBuilder.Entity<Hardware>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.HasMany(e => e.VirtualMachines)
                  .WithOne(v => v.Hardware)
                  .HasForeignKey(v => v.HardwareId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // VirtualMachine configuration
        modelBuilder.Entity<VirtualMachine>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
        });

        // App configuration
        modelBuilder.Entity<App>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.HasOne(e => e.Hardware)
                  .WithMany(h => h.Apps)
                  .HasForeignKey(e => e.HardwareId)
                  .OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(e => e.VirtualMachine)
                  .WithMany(v => v.Apps)
                  .HasForeignKey(e => e.VirtualMachineId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Storage configuration
        modelBuilder.Entity<Storage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.HasOne(e => e.Hardware)
                  .WithMany(h => h.StoragePools)
                  .HasForeignKey(e => e.HardwareId)
                  .OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(e => e.VirtualMachine)
                  .WithMany(v => v.StoragePools)
                  .HasForeignKey(e => e.VirtualMachineId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // NetworkShare configuration
        modelBuilder.Entity<NetworkShare>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.HasOne(e => e.Storage)
                  .WithMany(s => s.Shares)
                  .HasForeignKey(e => e.StorageId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Network configuration
        modelBuilder.Entity<Network>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.HasMany(e => e.Members)
                  .WithOne(m => m.Network)
                  .HasForeignKey(m => m.NetworkId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // NetworkMember configuration
        modelBuilder.Entity<NetworkMember>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.MemberType).IsRequired().HasMaxLength(50);
        });

        // Relationship configuration
        modelBuilder.Entity<Relationship>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.SourceType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.TargetType).IsRequired().HasMaxLength(50);
        });

        // MapLayout configuration
        modelBuilder.Entity<MapLayout>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.NodeType).IsRequired().HasMaxLength(50);
        });

        // Document configuration
        modelBuilder.Entity<Document>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.HasOne(e => e.Parent)
                  .WithMany(d => d.Children)
                  .HasForeignKey(e => e.ParentId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }

    /// <inheritdoc />
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    /// <inheritdoc />
    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is BaseEntity && (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            var baseEntity = (BaseEntity)entityEntry.Entity;
            baseEntity.UpdatedAt = DateTime.UtcNow;

            if (entityEntry.State == EntityState.Added)
            {
                baseEntity.CreatedAt = DateTime.UtcNow;
            }
        }
    }
}
