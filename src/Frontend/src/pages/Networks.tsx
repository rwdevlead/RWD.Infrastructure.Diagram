import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { apiService } from '../api/client';
import { NetworkRequest, Network } from '../api/types';

// Tailored HSL colour swatches for the colour picker
const PRESET_COLORS = [
  { label: 'Indigo',  value: '#6366f1' },
  { label: 'Cyan',   value: '#06b6d4' },
  { label: 'Emerald',value: '#10b981' },
  { label: 'Amber',  value: '#f59e0b' },
  { label: 'Rose',   value: '#f43f5e' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Teal',   value: '#14b8a6' },
];

const Networks: React.FC = () => {
  const { networks, fetchNetworks, loading, errors } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState<Network | null>(null);
  const [formData, setFormData] = useState<NetworkRequest>({
    name: '',
    vlanId: null,
    subnet: null,
    gateway: null,
    color: '#6366f1',
    notes: null,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchNetworks(); }, [fetchNetworks]);

  const openAddModal = () => {
    setEditingNetwork(null);
    setFormData({ name: '', vlanId: null, subnet: null, gateway: null, color: '#6366f1', notes: null });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (n: Network) => {
    setEditingNetwork(n);
    setFormData({ name: n.name, vlanId: n.vlanId, subnet: n.subnet, gateway: n.gateway, color: n.color ?? '#6366f1', notes: n.notes });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingNetwork(null); setFormError(null); };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vlanId'
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
      if (editingNetwork) {
        await apiService.updateNetwork(editingNetwork.id, formData);
      } else {
        await apiService.createNetwork(formData);
      }
      await fetchNetworks();
      closeModal();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Delete network "${name}"? This will also remove all member associations.`)) {
      try { await apiService.deleteNetwork(id); await fetchNetworks(); }
      catch (err: any) { alert(err.message || 'Failed to delete.'); }
    }
  };

  const filtered = networks.filter(n =>
    n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (n.subnet ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (n.gateway ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const vlanCount = networks.filter(n => n.vlanId != null).length;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Networks &amp; VLANs</h1>
          <p>Document subnets, VLAN assignments, gateways, and network routing configurations.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Network
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-icon">🔌</div>
          <div className="stat-info">
            <div className="stat-value">{networks.length}</div>
            <div className="stat-label">Total Networks</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-info">
            <div className="stat-value">{vlanCount}</div>
            <div className="stat-label">VLAN Segments</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">🌐</div>
          <div className="stat-info">
            <div className="stat-value">{networks.filter(n => n.gateway).length}</div>
            <div className="stat-label">Routed Networks</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="search-container">
          <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search by name, subnet, gateway..." className="search-input" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {errors['networks'] && (
        <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid var(--accent-danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', color: 'var(--accent-danger)' }}>
          <strong>Error: </strong>{errors['networks']}
        </div>
      )}

      {loading['networks'] && networks.length === 0 ? (
        <div className="flex-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ border: '3px solid var(--border-color)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', marginRight: '1rem' }} />
          Loading networks...
          <style>{`@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex-center" style={{ padding: '4rem', flexDirection: 'column', color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔌</span>
          <h3>No Networks Found</h3>
          <p style={{ marginTop: '0.25rem' }}>{searchTerm ? 'No results match your query.' : 'Define your first network subnet or VLAN.'}</p>
          {!searchTerm && <button className="btn btn-primary mt-4" onClick={openAddModal}>Add Network</button>}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Network Name</th>
                <th>VLAN ID</th>
                <th>Subnet</th>
                <th>Gateway</th>
                <th>Colour Tag</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(n => (
                <tr key={n.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: n.color ?? '#6366f1', display: 'inline-block', flexShrink: 0 }} />
                    {n.name}
                  </td>
                  <td>
                    {n.vlanId != null
                      ? <span className="badge badge-info">VLAN {n.vlanId}</span>
                      : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{n.subnet || '—'}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{n.gateway || '—'}</td>
                  <td>
                    {n.color
                      ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: n.color, border: '1px solid var(--border-color)', display: 'inline-block' }} />
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{n.color}</span>
                        </div>
                      ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-xs" onClick={() => openEditModal(n)}>Edit</button>
                      <button className="btn btn-danger btn-xs" onClick={() => handleDelete(n.id, n.name)}>Delete</button>
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
              <h2 className="modal-title">{editingNetwork ? 'Edit Network' : 'Add Network'}</h2>
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
                  <label>Network Name *</label>
                  <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required placeholder="e.g. LAN, IoT, Management, DMZ" />
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label>Subnet (CIDR)</label>
                    <input type="text" name="subnet" className="form-control" value={formData.subnet ?? ''} onChange={handleInputChange} placeholder="192.168.1.0/24" />
                  </div>
                  <div className="form-group">
                    <label>Gateway IP</label>
                    <input type="text" name="gateway" className="form-control" value={formData.gateway ?? ''} onChange={handleInputChange} placeholder="192.168.1.1" />
                  </div>
                </div>

                <div className="form-group">
                  <label>VLAN ID</label>
                  <input type="number" name="vlanId" className="form-control" value={formData.vlanId ?? ''} onChange={handleInputChange} min={1} max={4094} placeholder="e.g. 10, 20, 100" />
                </div>

                {/* Color Picker */}
                <div className="form-group">
                  <label>Diagram Colour Tag</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        title={c.label}
                        onClick={() => setFormData(prev => ({ ...prev, color: c.value }))}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: c.value,
                          border: formData.color === c.value ? '3px solid white' : '2px solid var(--border-color)',
                          cursor: 'pointer',
                          boxShadow: formData.color === c.value ? `0 0 8px ${c.value}` : 'none',
                          transition: 'all 0.15s ease',
                        }}
                      />
                    ))}
                    <input
                      type="color"
                      name="color"
                      value={formData.color ?? '#6366f1'}
                      onChange={handleInputChange}
                      title="Custom colour"
                      style={{ width: '28px', height: '28px', padding: '1px', borderRadius: '50%', border: '2px solid var(--border-color)', cursor: 'pointer', backgroundColor: 'transparent' }}
                    />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Used to color-code this network's nodes on the diagram map.</p>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea name="notes" className="form-control" value={formData.notes ?? ''} onChange={handleInputChange} placeholder="Firewall rules, DHCP range, purpose..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingNetwork ? 'Save Changes' : 'Add Network'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Networks;
