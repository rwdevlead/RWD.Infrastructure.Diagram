import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { apiService } from '../api/client';
import { AppRequest, App } from '../api/types';

const Applications: React.FC = () => {
  const { apps, hardware, vms, fetchApps, fetchHardware, fetchVMs, loading, errors } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [formData, setFormData] = useState<AppRequest>({
    name: '',
    description: null,
    ipAddress: null,
    port: null,
    https: false,
    url: null,
    notes: null,
    hardwareId: null,
    virtualMachineId: null,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchApps();
    fetchHardware();
    fetchVMs();
  }, [fetchApps, fetchHardware, fetchVMs]);

  const openAddModal = () => {
    setEditingApp(null);
    setFormData({ name: '', description: null, ipAddress: null, port: null, https: false, url: null, notes: null, hardwareId: null, virtualMachineId: null });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (app: App) => {
    setEditingApp(app);
    setFormData({
      name: app.name,
      description: app.description,
      ipAddress: app.ipAddress,
      port: app.port,
      https: app.https,
      url: app.url,
      notes: app.notes,
      hardwareId: app.hardwareId,
      virtualMachineId: app.virtualMachineId,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingApp(null); setFormError(null); };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
      return;
    }
    const numericFields = ['port', 'hardwareId', 'virtualMachineId'];
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? value === '' ? null : parseInt(value, 10)
        : value === '' ? null : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { setFormError('Name is required'); return; }

    setSubmitting(true);
    setFormError(null);
    try {
      if (editingApp) {
        await apiService.updateApp(editingApp.id, formData);
      } else {
        await apiService.createApp(formData);
      }
      await fetchApps();
      closeModal();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Delete application "${name}"?`)) {
      try { await apiService.deleteApp(id); await fetchApps(); }
      catch (err: any) { alert(err.message || 'Failed to delete.'); }
    }
  };

  const hostLabel = (app: App) => {
    if (app.virtualMachineId) {
      const vm = vms.find(v => v.id === app.virtualMachineId);
      return vm ? `VM: ${vm.name}` : `VM #${app.virtualMachineId}`;
    }
    if (app.hardwareId) {
      const hw = hardware.find(h => h.id === app.hardwareId);
      return hw ? `Host: ${hw.name}` : `Host #${app.hardwareId}`;
    }
    return 'Standalone';
  };

  const filtered = apps.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.description ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.url ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const httpsCount = apps.filter(a => a.https).length;
  const withUrl = apps.filter(a => a.url).length;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Services &amp; Applications</h1>
          <p>Document web services, databases, and application deployments across your lab.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Service
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-icon">🌐</div>
          <div className="stat-info">
            <div className="stat-value">{apps.length}</div>
            <div className="stat-label">Total Services</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">🔒</div>
          <div className="stat-info">
            <div className="stat-value">{httpsCount}</div>
            <div className="stat-label">HTTPS Enabled</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-info">
            <div className="stat-value">{withUrl}</div>
            <div className="stat-label">With Public URL</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="search-container">
          <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search by name, description, URL..." className="search-input" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {errors['apps'] && (
        <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid var(--accent-danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', color: 'var(--accent-danger)' }}>
          <strong>Error: </strong>{errors['apps']}
        </div>
      )}

      {loading['apps'] && apps.length === 0 ? (
        <div className="flex-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ border: '3px solid var(--border-color)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', marginRight: '1rem' }} />
          Loading services...
          <style>{`@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex-center" style={{ padding: '4rem', flexDirection: 'column', color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌐</span>
          <h3>No Services Found</h3>
          <p style={{ marginTop: '0.25rem' }}>{searchTerm ? 'No results match your query.' : 'Register your first application or service.'}</p>
          {!searchTerm && <button className="btn btn-primary mt-4" onClick={openAddModal}>Add Service</button>}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Hosted On</th>
                <th>Endpoint</th>
                <th>Protocol</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.name}</td>
                  <td><span className="badge badge-info">{hostLabel(app)}</span></td>
                  <td>
                    {app.url ? (
                      <a href={app.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                        {app.url}
                      </a>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                        {app.ipAddress ? `${app.ipAddress}${app.port ? `:${app.port}` : ''}` : '—'}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${app.https ? 'badge-success' : 'badge-warning'}`}>
                      {app.https ? 'HTTPS' : 'HTTP'}
                    </span>
                    {app.port && (
                      <span style={{ marginLeft: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        :{app.port}
                      </span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {app.description || '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-xs" onClick={() => openEditModal(app)}>Edit</button>
                      <button className="btn btn-danger btn-xs" onClick={() => handleDelete(app.id, app.name)}>Delete</button>
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
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h2 className="modal-title">{editingApp ? 'Edit Service' : 'Add Service'}</h2>
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
                  <label>Service Name *</label>
                  <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Nextcloud, Plex, Pi-hole" />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <input type="text" name="description" className="form-control" value={formData.description ?? ''} onChange={handleInputChange} placeholder="What does this service do?" />
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
                    <label>IP Address</label>
                    <input type="text" name="ipAddress" className="form-control" value={formData.ipAddress ?? ''} onChange={handleInputChange} placeholder="192.168.1.30" />
                  </div>
                  <div className="form-group">
                    <label>Port</label>
                    <input type="number" name="port" className="form-control" value={formData.port ?? ''} onChange={handleInputChange} placeholder="8080" />
                  </div>
                </div>

                <div className="form-group">
                  <label>URL</label>
                  <input type="text" name="url" className="form-control" value={formData.url ?? ''} onChange={handleInputChange} placeholder="https://nextcloud.local" />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="checkbox"
                    id="https-toggle"
                    name="https"
                    checked={formData.https}
                    onChange={handleInputChange}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                  />
                  <label htmlFor="https-toggle" style={{ cursor: 'pointer', marginBottom: 0 }}>HTTPS / TLS Enabled</label>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea name="notes" className="form-control" value={formData.notes ?? ''} onChange={handleInputChange} placeholder="Reverse proxy config, OAuth setup..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingApp ? 'Save Changes' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
