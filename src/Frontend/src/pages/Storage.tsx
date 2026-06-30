import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { apiService } from '../api/client';
import { StorageRequest, Storage } from '../api/types';

const STORAGE_TYPES  = ['ZFS', 'BTRFS', 'Ext4', 'NTFS', 'XFS', 'NFS', 'Other'];
const RAID_TYPES     = ['None', 'RAID 0', 'RAID 1', 'RAID 5', 'RAID 6', 'RAID 10', 'ZFS RAIDZ1', 'ZFS RAIDZ2', 'ZFS Mirror'];

const StoragePage: React.FC = () => {
  const { storage, hardware, vms, fetchStorage, fetchHardware, fetchVMs, loading, errors } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStorage, setEditingStorage] = useState<Storage | null>(null);
  const [formData, setFormData] = useState<StorageRequest>({
    name: '',
    storageType: null,
    raidType: null,
    usableSpaceTb: null,
    notes: null,
    hardwareId: null,
    virtualMachineId: null,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStorage();
    fetchHardware();
    fetchVMs();
  }, [fetchStorage, fetchHardware, fetchVMs]);

  const openAddModal = () => {
    setEditingStorage(null);
    setFormData({ name: '', storageType: null, raidType: null, usableSpaceTb: null, notes: null, hardwareId: null, virtualMachineId: null });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (s: Storage) => {
    setEditingStorage(s);
    setFormData({ name: s.name, storageType: s.storageType, raidType: s.raidType, usableSpaceTb: s.usableSpaceTb, notes: s.notes, hardwareId: s.hardwareId, virtualMachineId: s.virtualMachineId });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingStorage(null); setFormError(null); };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const intFields = ['hardwareId', 'virtualMachineId'];
    const floatFields = ['usableSpaceTb'];
    setFormData(prev => ({
      ...prev,
      [name]: intFields.includes(name)
        ? value === '' ? null : parseInt(value, 10)
        : floatFields.includes(name)
          ? value === '' ? null : parseFloat(value)
          : value === '' ? null : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { setFormError('Name is required'); return; }
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingStorage) {
        await apiService.updateStorage(editingStorage.id, formData);
      } else {
        await apiService.createStorage(formData);
      }
      await fetchStorage();
      closeModal();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Delete storage pool "${name}"?`)) {
      try { await apiService.deleteStorage(id); await fetchStorage(); }
      catch (err: any) { alert(err.message || 'Failed to delete.'); }
    }
  };

  const hostLabel = (s: Storage) => {
    if (s.virtualMachineId) return `VM: ${vms.find(v => v.id === s.virtualMachineId)?.name ?? `VM #${s.virtualMachineId}`}`;
    if (s.hardwareId) return `Host: ${hardware.find(h => h.id === s.hardwareId)?.name ?? `Host #${s.hardwareId}`}`;
    return 'Standalone';
  };

  const totalTb = storage.reduce((acc, s) => acc + (s.usableSpaceTb ?? 0), 0);

  const filtered = storage.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.storageType ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.raidType ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Storage Pools</h1>
          <p>Document ZFS pools, RAID arrays, NFS mounts, and disk configurations.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Pool
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-icon">💿</div>
          <div className="stat-info">
            <div className="stat-value">{storage.length}</div>
            <div className="stat-label">Storage Pools</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{totalTb.toFixed(1)} TB</div>
            <div className="stat-label">Total Usable Space</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">🔧</div>
          <div className="stat-info">
            <div className="stat-value">{new Set(storage.map(s => s.storageType).filter(Boolean)).size}</div>
            <div className="stat-label">Storage Types</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="search-container">
          <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search by name, type, RAID..." className="search-input" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {errors['storage'] && (
        <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid var(--accent-danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', color: 'var(--accent-danger)' }}>
          <strong>Error: </strong>{errors['storage']}
        </div>
      )}

      {loading['storage'] && storage.length === 0 ? (
        <div className="flex-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ border: '3px solid var(--border-color)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', marginRight: '1rem' }} />
          Loading storage pools...
          <style>{`@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex-center" style={{ padding: '4rem', flexDirection: 'column', color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💿</span>
          <h3>No Storage Pools Found</h3>
          <p style={{ marginTop: '0.25rem' }}>{searchTerm ? 'No results match your query.' : 'Add your first storage pool or volume.'}</p>
          {!searchTerm && <button className="btn btn-primary mt-4" onClick={openAddModal}>Add Pool</button>}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Pool Name</th>
                <th>Attached To</th>
                <th>Filesystem</th>
                <th>RAID Config</th>
                <th>Usable Space</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</td>
                  <td><span className="badge badge-info">{hostLabel(s)}</span></td>
                  <td>
                    {s.storageType
                      ? <span className="badge badge-success">{s.storageType}</span>
                      : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td>
                    {s.raidType
                      ? <span className="badge badge-warning">{s.raidType}</span>
                      : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>
                    {s.usableSpaceTb != null ? `${s.usableSpaceTb} TB` : '—'}
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{editingStorage ? 'Edit Storage Pool' : 'Add Storage Pool'}</h2>
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
                  <label>Pool Name *</label>
                  <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required placeholder="e.g. tank, data-pool, backup-vol" />
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label>Hosted on VM (optional)</label>
                    <select name="virtualMachineId" className="form-control" value={formData.virtualMachineId ?? ''} onChange={handleInputChange}>
                      <option value="">— None —</option>
                      {vms.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Hosted on Hardware (optional)</label>
                    <select name="hardwareId" className="form-control" value={formData.hardwareId ?? ''} onChange={handleInputChange}>
                      <option value="">— None —</option>
                      {hardware.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label>Storage Type</label>
                    <select name="storageType" className="form-control" value={formData.storageType ?? ''} onChange={handleInputChange}>
                      <option value="">— Select type —</option>
                      {STORAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>RAID Configuration</label>
                    <select name="raidType" className="form-control" value={formData.raidType ?? ''} onChange={handleInputChange}>
                      <option value="">— Select RAID —</option>
                      {RAID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Usable Space (TB)</label>
                  <input type="number" name="usableSpaceTb" className="form-control" value={formData.usableSpaceTb ?? ''} onChange={handleInputChange} step={0.1} min={0} placeholder="e.g. 7.2" />
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea name="notes" className="form-control" value={formData.notes ?? ''} onChange={handleInputChange} placeholder="Disk model info, share paths, quota configs..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingStorage ? 'Save Changes' : 'Add Pool'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoragePage;
