import React, { useState } from 'react';
import { apiService } from '../api/client';
import { DatabaseExport } from '../api/types';

const SettingsPage: React.FC = () => {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = async () => {
    setExporting(true);
    setMessage(null);
    try {
      const data = await apiService.exportInventory();
      // Trigger a file download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `homelab-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setMessage({ type: 'success', text: 'Backup database exported successfully.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to export database.' });
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm("WARNING: Importing a backup will completely wipe the existing database. Are you sure you want to proceed?")) {
      e.target.value = ''; // Reset file input
      return;
    }

    setImporting(true);
    setMessage(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonContent = JSON.parse(event.target?.result as string) as DatabaseExport;
        const responseText = await apiService.importInventory(jsonContent);
        setMessage({ type: 'success', text: responseText || 'Backup database imported successfully.' });
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Failed to import backup. Ensure the file is valid JSON.' });
      } finally {
        setImporting(false);
        e.target.value = ''; // Reset file input
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>System Settings</h1>
          <p>Configure Homelab Hub preferences and manage database imports/exports.</p>
        </div>
      </div>

      {message && (
        <div 
          style={{ 
            backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
            border: `1px solid ${message.type === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)'}`, 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1.5rem', 
            color: message.type === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)' 
          }}
        >
          <strong>{message.type === 'success' ? 'Success: ' : 'Error: '}</strong>
          {message.text}
        </div>
      )}

      <div className="grid-2">
        {/* Backup & Restore Card */}
        <div className="card">
          <h2 className="card-title">Database Maintenance</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Export all infrastructure details, network layouts, relationships, and wiki documents as a single JSON file. You can restore this file at any time.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>1. Export Database Backup</h3>
              <button 
                className="btn btn-primary" 
                onClick={handleExport}
                disabled={exporting || importing}
              >
                {exporting ? 'Exporting...' : 'Download JSON Backup'}
              </button>
            </div>

            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--accent-danger)' }}>2. Import Database Backup</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                Note: This will overwrite and destroy all current data in the database.
              </p>
              
              <label className="btn btn-secondary" style={{ display: 'inline-block', cursor: 'pointer' }}>
                {importing ? 'Importing...' : 'Upload JSON Backup'}
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImport} 
                  style={{ display: 'none' }}
                  disabled={exporting || importing}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="card">
          <h2 className="card-title">System Properties</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Workspace Root</span>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                RWD.Infrastructure.Diagram
              </span>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Version</span>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>1.0.0 (Release build)</span>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Developer Modes</span>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                Vite Development Server with Axios proxy middleware support.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
