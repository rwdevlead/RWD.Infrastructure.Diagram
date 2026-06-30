import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { apiService } from '../api/client';
import { DocumentRequest, Document } from '../api/types';
import ReactMarkdown from 'react-markdown';

const DocumentsPage: React.FC = () => {
  const { documents, fetchDocuments, loading, errors } = useStore();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);

  const [formData, setFormData] = useState<DocumentRequest>({
    title: '',
    content: '',
    parentId: null,
    sortOrder: 0,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  // Build a root-first tree for the sidebar
  const rootDocs = useMemo(() => documents.filter(d => d.parentId == null).sort((a, b) => a.sortOrder - b.sortOrder), [documents]);
  const childrenOf = (parentId: number) => documents.filter(d => d.parentId === parentId).sort((a, b) => a.sortOrder - b.sortOrder);

  const selectedDoc = documents.find(d => d.id === selectedId) ?? null;

  const openAddModal = (parentId?: number) => {
    setEditingDoc(null);
    setFormData({ title: '', content: '', parentId: parentId ?? null, sortOrder: documents.filter(d => d.parentId === (parentId ?? null)).length });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (doc: Document) => {
    setEditingDoc(doc);
    setFormData({ title: doc.title, content: doc.content, parentId: doc.parentId, sortOrder: doc.sortOrder });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingDoc(null); setFormError(null); };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sortOrder' ? parseInt(value, 10) || 0
        : name === 'parentId' ? (value === '' ? null : parseInt(value, 10))
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { setFormError('Title is required'); return; }
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingDoc) {
        await apiService.updateDocument(editingDoc.id, formData);
      } else {
        const newDoc = await apiService.createDocument(formData);
        setSelectedId(newDoc.id);
      }
      await fetchDocuments();
      closeModal();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`Delete document "${title}"? Child documents will become orphaned.`)) {
      try {
        await apiService.deleteDocument(id);
        if (selectedId === id) setSelectedId(null);
        await fetchDocuments();
      } catch (err: any) {
        alert(err.message || 'Failed to delete.');
      }
    }
  };

  const DocTreeItem: React.FC<{ doc: Document; depth: number }> = ({ doc, depth }) => {
    const children = childrenOf(doc.id);
    return (
      <div>
        <div
          className={`nav-item ${selectedId === doc.id ? 'active' : ''}`}
          style={{ paddingLeft: `${0.75 + depth * 1}rem`, cursor: 'pointer', fontSize: '0.9rem' }}
          onClick={() => { setSelectedId(doc.id); }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
          </svg>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</span>
        </div>
        {children.map(child => <DocTreeItem key={child.id} doc={child} depth={depth + 1} />)}
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Documentation Wiki</h1>
          <p>Hierarchical Markdown docs for setup guides, runbooks, and configurations.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openAddModal()}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Page
        </button>
      </div>

      {errors['documents'] && (
        <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid var(--accent-danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', color: 'var(--accent-danger)' }}>
          <strong>Error: </strong>{errors['documents']}
        </div>
      )}

      {loading['documents'] && documents.length === 0 ? (
        <div className="flex-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ border: '3px solid var(--border-color)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', marginRight: '1rem' }} />
          Loading documents...
          <style>{`@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

          {/* Document Tree Sidebar */}
          <div className="card" style={{ width: '240px', flexShrink: 0, padding: '0.75rem', maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 0.5rem 0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
              Pages
            </div>

            {documents.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.5rem' }}>No pages yet. Create your first page!</p>
            ) : (
              rootDocs.map(doc => <DocTreeItem key={doc.id} doc={doc} depth={0} />)
            )}
          </div>

          {/* Document Viewer / Editor */}
          <div style={{ flex: 1 }}>
            {!selectedDoc ? (
              <div className="card flex-center" style={{ padding: '5rem', flexDirection: 'column', color: 'var(--text-secondary)', height: '400px' }}>
                <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</span>
                <h3>Select a Page</h3>
                <p style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                  Choose a document from the left sidebar, or create a new one.
                </p>
                <button className="btn btn-primary mt-4" onClick={() => openAddModal()}>Create First Page</button>
              </div>
            ) : (
              <div className="card" style={{ padding: 0 }}>
                {/* Toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedDoc.title}</h2>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Updated {new Date(selectedDoc.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openAddModal(selectedDoc.id)}>+ Sub-page</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(selectedDoc)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selectedDoc.id, selectedDoc.title)}>Delete</button>
                  </div>
                </div>

                {/* Markdown Content */}
                <div style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: '60vh' }}>
                  {selectedDoc.content.trim() ? (
                    <div className="markdown-body" style={{
                      color: 'var(--text-primary)',
                      lineHeight: '1.7',
                    }}>
                      <ReactMarkdown>{selectedDoc.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No content yet. Click "Edit" to add markdown.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h2 className="modal-title">{editingDoc ? 'Edit Document' : 'New Document'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && (
                  <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid var(--accent-danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', color: 'var(--accent-danger)', fontSize: '0.9rem' }}>
                    {formError}
                  </div>
                )}

                <div className="form-group">
                  <label>Page Title *</label>
                  <input type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Proxmox Setup Guide" />
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label>Parent Page</label>
                    <select name="parentId" className="form-control" value={formData.parentId ?? ''} onChange={handleInputChange}>
                      <option value="">— Root Level —</option>
                      {documents.filter(d => d.id !== editingDoc?.id).map(d => (
                        <option key={d.id} value={d.id}>{d.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Sort Order</label>
                    <input type="number" name="sortOrder" className="form-control" value={formData.sortOrder} onChange={handleInputChange} min={0} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Content (Markdown)</label>
                  <textarea
                    name="content"
                    className="form-control"
                    value={formData.content}
                    onChange={handleInputChange}
                    style={{ minHeight: '240px', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}
                    placeholder={`# My Document\n\nWrite your content here using **Markdown** formatting.\n\n## Section 1\n\n- Item 1\n- Item 2\n\n\`\`\`bash\necho "Hello World"\n\`\`\``}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingDoc ? 'Save Changes' : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
