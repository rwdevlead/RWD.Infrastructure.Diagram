import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { apiService } from '../api/client';
import { VirtualMachineRequest, VirtualMachine } from '../api/types';

const VirtualMachines: React.FC = () => {
  const { vms, hardware, fetchVMs, fetchHardware, loading, errors } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVM, setEditingVM] = useState<VirtualMachine | null>(null);
  const [formData, setFormData] = useState<VirtualMachineRequest>({
    hardwareId: 0,
    name: '',
    hostname: null,
    ipAddress: null,
    os: null,
    cpuCores: null,
    ramGb: null,
    diskGb: null,
    notes: null,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVMs();
    fetchHardware();
  }, [fetchVMs, fetchHardware]);

  const openAddModal = () => {
    setEditingVM(null);
    setFormData({
      hardwareId: hardware[0]?.id ?? 0,
      name: '',
      hostname: null,
      ipAddress: null,
      os: null,
      cpuCores: null,
      ramGb: null,
      diskGb: null,
      notes: null,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (vm: VirtualMachine) => {
    setEditingVM(vm);
    setFormData({
      hardwareId: vm.hardwareId,
      name: vm.name,
      hostname: vm.hostname,
      ipAddress: vm.ipAddress,
      os: vm.os,
      cpuCores: vm.cpuCores,
      ramGb: vm.ramGb,
      diskGb: vm.diskGb,
      notes: vm.notes,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVM(null);
    setFormError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = ['hardwareId', 'cpuCores', 'ramGb', 'diskGb'];
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
    if (!formData.hardwareId) { setFormError('A host machine must be selected'); return; }

    setSubmitting(true);
    setFormError(null);
    try {
      if (editingVM) {
        await apiService.updateVM(editingVM.id, formData);
      } else {
        await apiService.createVM(formData);
      }
      await fetchVMs();
      closeModal();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Delete VM "${name}"? This action cannot be undone.`)) {
      try {
        await apiService.deleteVM(id);
        await fetchVMs();
      } catch (err: any) {
        alert(err.message || 'Failed to delete VM.');
      }
    }
  };

  const hostName = (id: number) => hardware.find(h => h.id === id)?.name ?? `Host #${id}`;

  const filtered = vms.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.hostname ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.ipAddress ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.os ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRam  = vms.reduce((s, v) => s + (v.ramGb  ?? 0), 0);
  const totalDisk = vms.reduce((s, v) => s + (v.diskGb ?? 0), 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Virtual Machines</h1>
          <p>Manage VM instances and LXC containers running on your physical hosts.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} disabled={hardware.length === 0}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add VM
        </button>
      </div>

      {hardware.length === 0 && !loading['hardware'] && (
        <div style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid var(--accent-warning)', padding: '0.9rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', color: 'var(--accent-warning)' }}>
          ⚠️ No hardware hosts found. <a href="/hardware">Register a physical host</a> before adding VMs.
        </div>
      )}

      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <div className="stat-value">{vms.length}</div>
            <div className="stat-label">Total VMs</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <div className="stat-value">{totalRam} GB</div>
            <div className="stat-label">Total VM RAM</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">💾</div>
          <div className="stat-info">
            <div className="stat-value">{totalDisk} GB</div>
            <div className="stat-label">Total VM Disk</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">🖥️</div>
          <div className="stat-info">
            <div className="stat-value">{new Set(vms.map(v => v.hardwareId)).size}</div>
            <div className="stat-label">Hosts Used</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="search-container">
          <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, hostname, IP, OS..."
            className="search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {errors['vms'] && (
        <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid var(--accent-danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', color: 'var(--accent-danger)' }}>
          <strong>Error: </strong>{errors['vms']}
        </div>
      )}

      {loading['vms'] && vms.length === 0 ? (
        <div className="flex-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ border: '3px solid var(--border-color)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', marginRight: '1rem' }} />
          Loading virtual machines...
          <style>{`@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex-center" style={{ padding: '4rem', flexDirection: 'column', color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📦</span>
          <h3>No Virtual Machines Found</h3>
          <p style={{ marginTop: '0.25rem' }}>{searchTerm ? 'No results match your query.' : 'Add your first VM to get started.'}</p>
          {!searchTerm && <button className="btn btn-primary mt-4" onClick={openAddModal}>Add VM</button>}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>VM Name</th>
                <th>Host Machine</th>
                <th>Hostname / IP</th>
                <th>Resources</th>
                <th>Operating System</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(vm => (
                <tr key={vm.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{vm.name}</td>
                  <td>
                    <span className="badge badge-info">{hostName(vm.hardwareId)}</span>
                  </td>
                  <td>
                    <div style={{ fontFamily: 'var(--font-mono)' }}>{vm.hostname || '—'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{vm.ipAddress || '—'}</div>
                  </td>
                  <td>
                    <div>{vm.cpuCores != null ? `${vm.cpuCores} vCPU` : '—'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {vm.ramGb != null ? `${vm.ramGb} GB RAM` : '—'}
                      {vm.diskGb != null ? ` · ${vm.diskGb} GB disk` : ''}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-success">{vm.os || 'Unknown OS'}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-xs" onClick={() => openEditModal(vm)}>Edit</button>
                      <button className="btn btn-danger btn-xs" onClick={() => handleDelete(vm.id, vm.name)}>Delete</button>
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
              <h2 className="modal-title">{editingVM ? 'Edit Virtual Machine' : 'Add Virtual Machine'}</h2>
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
                  <label>Host Machine *</label>
                  <select name="hardwareId" className="form-control" value={formData.hardwareId ?? ''} onChange={handleInputChange} required>
                    <option value="">— Select a host —</option>
                    {hardware.map(h => (
                      <option key={h.id} value={h.id}>{h.name} ({h.hostname || h.ipAddress || 'no address'})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>VM Name *</label>
                  <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required placeholder="e.g. ubuntu-22-docker" />
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label>Hostname</label>
                    <input type="text" name="hostname" className="form-control" value={formData.hostname ?? ''} onChange={handleInputChange} placeholder="ubuntu.local" />
                  </div>
                  <div className="form-group">
                    <label>IP Address</label>
                    <input type="text" name="ipAddress" className="form-control" value={formData.ipAddress ?? ''} onChange={handleInputChange} placeholder="192.168.1.20" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Operating System</label>
                  <input type="text" name="os" className="form-control" value={formData.os ?? ''} onChange={handleInputChange} placeholder="Ubuntu 22.04 LTS" />
                </div>

                <div className="grid-3" style={{ gap: '0.75rem' }}>
                  <div className="form-group">
                    <label>vCPU Cores</label>
                    <input type="number" name="cpuCores" className="form-control" value={formData.cpuCores ?? ''} onChange={handleInputChange} min={1} placeholder="4" />
                  </div>
                  <div className="form-group">
                    <label>RAM (GB)</label>
                    <input type="number" name="ramGb" className="form-control" value={formData.ramGb ?? ''} onChange={handleInputChange} min={1} placeholder="8" />
                  </div>
                  <div className="form-group">
                    <label>Disk (GB)</label>
                    <input type="number" name="diskGb" className="form-control" value={formData.diskGb ?? ''} onChange={handleInputChange} min={1} placeholder="100" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea name="notes" className="form-control" value={formData.notes ?? ''} onChange={handleInputChange} placeholder="Migration notes, snapshot schedules..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingVM ? 'Save Changes' : 'Add VM'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualMachines;
