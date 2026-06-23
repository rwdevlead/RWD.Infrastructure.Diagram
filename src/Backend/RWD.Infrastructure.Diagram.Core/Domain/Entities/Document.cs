namespace RWD.Infrastructure.Diagram.Core.Domain.Entities;

/// <summary>
/// Represents a markdown document.
/// </summary>
public class Document : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int? ParentId { get; set; }
    public Document? Parent { get; set; }
    public int SortOrder { get; set; }

    public ICollection<Document> Children { get; set; } = new List<Document>();
}
