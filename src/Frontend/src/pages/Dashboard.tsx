import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { 
    hardware, vms, apps, storage, networks, documents, 
    fetchAll, loading 
  } = useStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const isLoadingAny = Object.values(loading).some(Boolean);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Homelab Hub Dashboard</h1>
          <p>Real-time view of your home network documentation and hardware configuration.</p>
        </div>
        {isLoadingAny && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <div style={{ border: '2px solid var(--border-color)', borderTop: '2px solid var(--accent-primary)', borderRadius: '50%', width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
            <span>Refreshing...</span>
          </div>
        )}
      </div>

      {/* Overview Grid */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        
        {/* Hardware Hosts */}
        <Link to="/hardware" className="card stat-card" style={{ display: 'flex', textDecoration: 'none' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>🖥️</div>
          <div className="stat-info">
            <div className="stat-value">{hardware.length}</div>
            <div className="stat-label" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Hardware Hosts</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Physical servers, nodes, hypervisors</div>
          </div>
        </Link>

        {/* Virtual Machines */}
        <Link to="/vms" className="card stat-card" style={{ display: 'flex', textDecoration: 'none' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-secondary)' }}>📦</div>
          <div className="stat-info">
            <div className="stat-value">{vms.length}</div>
            <div className="stat-label" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Virtual Machines</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Proxmox/ESXi VMs & LXC containers</div>
          </div>
        </Link>

        {/* Services & Apps */}
        <Link to="/apps" className="card stat-card" style={{ display: 'flex', textDecoration: 'none' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)' }}>🌐</div>
          <div className="stat-info">
            <div className="stat-value">{apps.length}</div>
            <div className="stat-label" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Services & Apps</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Web services, databases, Docker stacks</div>
          </div>
        </Link>

        {/* Storage Pools */}
        <Link to="/storage" className="card stat-card" style={{ display: 'flex', textDecoration: 'none' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)' }}>💿</div>
          <div className="stat-info">
            <div className="stat-value">{storage.length}</div>
            <div className="stat-label" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Storage Pools</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>ZFS pools, NFS/SMB shares, drives</div>
          </div>
        </Link>

        {/* Networks */}
        <Link to="/networks" className="card stat-card" style={{ display: 'flex', textDecoration: 'none' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>🔌</div>
          <div className="stat-info">
            <div className="stat-value">{networks.length}</div>
            <div className="stat-label" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Active Networks</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Subnets, VLANs, routing interfaces</div>
          </div>
        </Link>

        {/* Documentation */}
        <Link to="/documents" className="card stat-card" style={{ display: 'flex', textDecoration: 'none' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)' }}>📝</div>
          <div className="stat-info">
            <div className="stat-value">{documents.length}</div>
            <div className="stat-label" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Wiki Documents</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Markdown setup sheets & guides</div>
          </div>
        </Link>
      </div>

      {/* Main Panel */}
      <div className="grid-2 mt-4">
        
        {/* Quick Actions */}
        <div className="card">
          <h2 className="card-title">Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <Link to="/map" className="btn btn-primary" style={{ width: '100%' }}>
              🗺️ Open Interactive Network Map
            </Link>
            <Link to="/hardware" className="btn btn-secondary" style={{ width: '100%' }}>
              🖥️ Register New Hardware Node
            </Link>
            <Link to="/settings" className="btn btn-secondary" style={{ width: '100%' }}>
              💾 Database Backup & JSON Operations
            </Link>
          </div>
        </div>

        {/* Status Panel */}
        <div className="card">
          <h2 className="card-title">System Information</h2>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="flex-between" style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>API Status</span>
              <span className="badge badge-success">Online (Connected)</span>
            </div>
            <div className="flex-between" style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Database Engine</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>SQLite</span>
            </div>
            <div className="flex-between" style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Allocated Memory</span>
              <span>{hardware.reduce((sum, h) => sum + (h.ramGb || 0), 0) + vms.reduce((sum, v) => sum + (v.ramGb || 0), 0)} GB</span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)' }}>Server Runtime</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>.NET 10 Minimal API</span>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
