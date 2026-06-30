import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { apiService } from '../api/client';
import { HardwareRequest, Hardware } from '../api/types';

const HardwarePage: React.FC = () => {
  const { hardware, fetchHardware, loading, errors } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHardware, setEditingHardware] = useState<Hardware | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<HardwareRequest>({
    name: '',
    hostname: '',
    ipAddress: '',
    macAddress: '',
    cpu: '',
    ramGb: 0,
    os: '',
    make: '',
    model: '',
    serialNumber: '',
    location: '',
    notes: ''
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHardware();
  }, [fetchHardware]);

  const openAddModal = () => {
    setEditingHardware(null);
    setFormData({
      name: '',
      hostname: '',
      ipAddress: '',
      macAddress: '',
      cpu: '',
      ramGb: 16,
      os: 'Debian / Proxmox VE',
      make: '',
      model: '',
      serialNumber: '',
      location: 'Server Rack A',
      notes: ''
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (h: Hardware) => {
    setEditingHardware(h);
    setFormData({
      name: h.name,
      hostname: h.hostname || '',
      ipAddress: h.ipAddress || '',
      macAddress: h.macAddress || '',
      cpu: h.cpu || '',
      ramGb: h.ramGb || 0,
      os: h.os || '',
      make: h.make || '',
      model: h.model || '',
      serialNumber: h.serialNumber || '',
      location: h.location || '',
      notes: h.notes || ''
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHardware(null);
    setFormError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ramGb' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Name is required');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      if (editingHardware) {
        await apiService.updateHardware(editingHardware.id, formData);
      } else {
        await apiService.createHardware(formData);
      }
      await fetchHardware();
      closeModal();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete hardware "${name}"?`)) {
      try {
        await apiService.deleteHardware(id);
        await fetchHardware();
      } catch (err: any) {
        alert(err.message || 'Failed to delete hardware.');
      }
    }
  };

  const filteredHardware = hardware.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.hostname && h.hostname.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (h.ipAddress && h.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (h.location && h.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Hardware Hosts</h1>
          <p>Manage physical servers, nodes, and hypervisors in your infrastructure.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Host
        </button>
      </div>

      {/* Stats Counter */}
      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-icon">💾</div>
          <div className="stat-info">
            <div className="stat-value">{hardware.length}</div>
            <div className="stat-label">Total Hosts</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <div className="stat-value">
              {hardware.reduce((sum, h) => sum + (h.ramGb || 0), 0)} GB
            </div>
            <div className="stat-label">Total RAM Pool</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-info">
            <div className="stat-value">
              {new Set(hardware.map(h => h.location).filter(Boolean)).size}
            </div>
            <div className="stat-label">Locations</div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-4 flex-between">
        <div className="search-container">
          <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search by name, IP, hostname, location..." 
            className="search-input" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Error State */}
      {errors['hardware'] && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', color: 'var(--accent-danger)' }}>
          <strong>Error: </strong> {errors['hardware']}
        </div>
      )}

      {/* Loading State */}
      {loading['hardware'] && hardware.length === 0 ? (
        <div className="flex-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ border: '3px solid var(--border-color)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', marginRight: '1rem' }} />
          <span>Loading hardware assets...</span>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : filteredHardware.length === 0 ? (
        <div className="card flex-center" style={{ padding: '4rem', flexDirection: 'column', color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🖥️</span>
          <h3>No Hardware Hosts Found</h3>
          <p style={{ marginTop: '0.25rem' }}>{searchTerm ? 'No results match your search query.' : 'Get started by creating your first physical server host!'}</p>
          {!searchTerm && (
            <button className="btn btn-primary mt-4" onClick={openAddModal}>Add First Host</button>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Hostname / IP</th>
                <th>Hardware Spec</th>
                <th>Operating System</th>
                <th>Location</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHardware.map(h => (
                <tr key={h.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    <div>{h.name}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      SN: {h.serialNumber || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontFamily: 'var(--font-mono)' }}>{h.hostname || '—'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {h.ipAddress || '—'}
                    </div>
                  </td>
                  <td>
                    <div>{h.cpu || 'Unknown CPU'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {h.ramGb ? `${h.ramGb} GB RAM` : 'Unknown RAM'}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">{h.os || 'Unknown OS'}</span>
                    {h.make && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {h.make} {h.model}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-success">{h.location || 'Default'}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-xs" onClick={() => openEditModal(h)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-xs" onClick={() => handleDelete(h.id, h.name)}>
                        Delete
                      </button>
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
              <h2 className="modal-title">{editingHardware ? 'Edit Hardware Host' : 'Add Hardware Host'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', color: 'var(--accent-danger)', fontSize: '0.9rem' }}>
                    {formError}
                  </div>
                )}
                
                <div className="form-group">
                  <label>Host Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="form-control" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="e.g. pve-node-01"
                  />
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label>Hostname</label>
                    <input 
                      type="text" 
                      name="hostname" 
                      className="form-control" 
                      value={formData.hostname || ''} 
                      onChange={handleInputChange} 
                      placeholder="pve01.local"
                    />
                  </div>
                  <div className="form-group">
                    <label>IP Address</label>
                    <input 
                      type="text" 
                      name="ipAddress" 
                      className="form-control" 
                      value={formData.ipAddress || ''} 
                      onChange={handleInputChange} 
                      placeholder="192.168.1.10"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>MAC Address</label>
                  <input 
                    type="text" 
                    name="macAddress" 
                    className="form-control" 
                    value={formData.macAddress || ''} 
                    onChange={handleInputChange} 
                    placeholder="00:11:22:33:44:55"
                  />
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label>CPU Config</label>
                    <input 
                      type="text" 
                      name="cpu" 
                      className="form-control" 
                      value={formData.cpu || ''} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Ryzen 9 5900X (12C/24T)"
                    />
                  </div>
                  <div className="form-group">
                    <label>RAM (GB)</label>
                    <input 
                      type="number" 
                      name="ramGb" 
                      className="form-control" 
                      value={formData.ramGb || 0} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Operating System</label>
                  <input 
                    type="text" 
                    name="os" 
                    className="form-control" 
                    value={formData.os || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Proxmox VE 8.1"
                  />
                </div>

                <div className="grid-3" style={{ gap: '0.75rem' }}>
                  <div className="form-group">
                    <label>Manufacturer</label>
                    <input 
                      type="text" 
                      name="make" 
                      className="form-control" 
                      value={formData.make || ''} 
                      onChange={handleInputChange} 
                      placeholder="Dell / Custom"
                    />
                  </div>
                  <div className="form-group">
                    <label>Model</label>
                    <input 
                      type="text" 
                      name="model" 
                      className="form-control" 
                      value={formData.model || ''} 
                      onChange={handleInputChange} 
                      placeholder="R730 / ATX"
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input 
                      type="text" 
                      name="location" 
                      className="form-control" 
                      value={formData.location || ''} 
                      onChange={handleInputChange} 
                      placeholder="Rack A"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Serial Number</label>
                  <input 
                    type="text" 
                    name="serialNumber" 
                    className="form-control" 
                    value={formData.serialNumber || ''} 
                    onChange={handleInputChange} 
                  />
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea 
                    name="notes" 
                    className="form-control" 
                    value={formData.notes || ''} 
                    onChange={handleInputChange} 
                    placeholder="Hardware modifications, support info..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingHardware ? 'Save Changes' : 'Add Host'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HardwarePage;
