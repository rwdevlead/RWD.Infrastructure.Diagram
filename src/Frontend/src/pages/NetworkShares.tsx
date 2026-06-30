import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { apiService } from '../api/client';
import { NetworkShareRequest, NetworkShare } from '../api/types';

const SHARE_TYPES = ['SMB', 'NFS', 'iSCSI', 'CIFS', 'AFP', 'WebDAV', 'Other'];

const NetworkSharesPage: React.FC = () => {
  const { shares, storage, fetchShares, fetchStorage, loading, errors } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShare, setEditingShare] = useState<NetworkShare | null>(null);
  const [formData, setFormData] = useState<NetworkShareRequest>({
    storageId: 0,
    name: '',
    shareType: null,
    hostname: null,
    ip: null,
    notes: null,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchShares();
    fetchStorage();
  }, [fetchShares, fetchStorage]);

  const openAddModal = () => {
    setEditingShare(null);
    setFormData({
      storageId: storage[0]?.id ?? 0,
      name: '',
      shareType: 'SMB',
      hostname: null,
      ip: null,
      notes: null,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (s: NetworkShare) => {
    setEditingShare(s);
    setFormData({
      storageId: s.storageId,
      name: s.name,
      shareType: s.shareType,
      hostname: s.hostname,
      ip: s.ip,
      notes: s.notes,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingShare(null); setFormError(null); };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'storageId'
        ? value === '' ? 0 : parseInt(value, 10)
        : value === '' ? null : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { setFormError('Share name is required'); return; }
    if (!formData.storageId) { setFormError('A storage pool must be selected'); return; }
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingShare) {
        await apiService.updateShare(editingShare.id, formData);
      } else {
        await apiService.createShare(formData);
      }
      await fetchShares();
      closeModal();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Delete share "${name}"?`)) {
      try { await apiService.deleteShare(id); await fetchShares(); }
      catch (err: any) { alert(err.message || 'Failed to delete.'); }
    }
  };

  const storageLabel = (id: number) =>
    storage.find(s => s.id === id)?.name ?? `Pool #${id}`;

  const shareTypeColor = (type: string | null) => {
    switch (type) {
      case 'SMB':  case 'CIFS': return 'badge-info';
      case 'NFS':               return 'badge-success';
      case 'iSCSI':             return 'badge-warning';
      default:                  return 'badge-info';
    }
  };

  const filtered = shares.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.shareType ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.hostname ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.ip ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Network Shares</h1>
          <p>Manage SMB, NFS, iSCSI, and other shared folder exports across storage pools.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} disabled={storage.length === 0}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Share
        </button>
      </div>

      {storage.length === 0 && !loading['storage'] && (
        <div style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid var(--accent-warning)', padding: '0.9rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', color: 'var(--accent-warning)' }}>
          ⚠️ No storage pools found. <a href="/storage">Add a storage pool</a> before creating shares.
        </div>
      )}

      {/* Stats */}
      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-info">
            <div className="stat-value">{shares.length}</div>
            <div className="stat-label">Total Shares</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">🖧</div>
          <div className="stat-info">
            <div className="stat-value">{shares.filter(s => s.shareType === 'SMB' || s.shareType === 'CIFS').length}</div>
            <div className="stat-label">SMB / CIFS Shares</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">🐧</div>
          <div className="stat-info">
            <div className="stat-value">{shares.filter(s => s.shareType === 'NFS').length}</div>
            <div className="stat-label">NFS Exports</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">💽</div>
          <div className="stat-info">
            <div className="stat-value">{new Set(shares.map(s => s.storageId)).size}</div>
            <div className="stat-label">Pools in Use</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="search-container">
          <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search by name, type, hostname, IP..." className="search-input" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {errors['shares'] && (
        <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid var(--accent-danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', color: 'var(--accent-danger)' }}>
          <strong>Error: </strong>{errors['shares']}
        </div>
      )}

      {loading['shares'] && shares.length === 0 ? (
        <div className="flex-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ border: '3px solid var(--border-color)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', marginRight: '1rem' }} />
          Loading network shares...
          <style>{`@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex-center" style={{ padding: '4rem', flexDirection: 'column', color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📂</span>
          <h3>No Network Shares Found</h3>
          <p style={{ marginTop: '0.25rem' }}>{searchTerm ? 'No results match your query.' : 'Create a share export from an existing storage pool.'}</p>
          {!searchTerm && <button className="btn btn-primary mt-4" onClick={openAddModal}>Add Share</button>}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Share Name</th>
                <th>Storage Pool</th>
                <th>Protocol</th>
                <th>Hostname / IP</th>
                <th>Path / Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</td>
                  <td><span className="badge badge-info">{storageLabel(s.storageId)}</span></td>
                  <td>
                    {s.shareType
                      ? <span className={`badge ${shareTypeColor(s.shareType)}`}>{s.shareType}</span>
                      : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                      {s.hostname || '—'}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {s.ip || ''}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.notes || '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-xs" onClick={() => openEditModal(s)}>Edit</button>
                      <button className="btn btn-danger btn-xs" onClick={() => handleDelete(s.id, s.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{editingShare ? 'Edit Network Share' : 'Add Network Share'}</h2>
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
                  <label>Storage Pool *</label>
                  <select name="storageId" className="form-control" value={formData.storageId || ''} onChange={handleInputChange} required>
                    <option value="">— Select storage pool —</option>
                    {storage.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}{s.storageType ? ` (${s.storageType})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Share Name *</label>
                  <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required placeholder="e.g. media, backups, documents" />
                </div>

                <div className="form-group">
                  <label>Protocol</label>
                  <select name="shareType" className="form-control" value={formData.shareType ?? ''} onChange={handleInputChange}>
                    <option value="">— Select protocol —</option>
                    {SHARE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label>Hostname</label>
                    <input type="text" name="hostname" className="form-control" value={formData.hostname ?? ''} onChange={handleInputChange} placeholder="nas.local" />
                  </div>
                  <div className="form-group">
                    <label>IP Address</label>
                    <input type="text" name="ip" className="form-control" value={formData.ip ?? ''} onChange={handleInputChange} placeholder="192.168.1.50" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea name="notes" className="form-control" value={formData.notes ?? ''} onChange={handleInputChange} placeholder="Mount path, permissions, client access..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingShare ? 'Save Changes' : 'Add Share'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkSharesPage;
