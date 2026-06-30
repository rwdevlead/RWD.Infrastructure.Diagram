import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">H</div>
        <span className="brand-name">Homelab Hub</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          end
        >
          <svg className="nav-item-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
          </svg>
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/hardware" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <svg className="nav-item-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect width="20" height="6" x="2" y="3" rx="1" />
            <rect width="20" height="6" x="2" y="15" rx="1" />
            <circle cx="6" cy="6" r="1" />
            <circle cx="6" cy="18" r="1" />
            <path strokeLinecap="round" d="M14 6h4M14 18h4" />
          </svg>
          <span>Hardware Hosts</span>
        </NavLink>

        <NavLink 
          to="/vms" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <svg className="nav-item-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.5m18 0L12 3L3 7.5m18 0l-9 4.5m-9-4.5l9 4.5m0 0V20" />
          </svg>
          <span>Virtual Machines</span>
        </NavLink>

        <NavLink 
          to="/apps" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <svg className="nav-item-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A11.952 11.952 0 0 1 12 16.5c-2.998 0-5.74-1.1-7.843-2.918m0 0A8.959 8.959 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
          </svg>
          <span>Services & Apps</span>
        </NavLink>

        <NavLink 
          to="/storage" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <svg className="nav-item-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75" />
          </svg>
          <span>Storage Pools</span>
        </NavLink>

        <NavLink 
          to="/shares" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <svg className="nav-item-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
          </svg>
          <span>Network Shares</span>
        </NavLink>

        <NavLink 
          to="/networks" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <svg className="nav-item-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect width="6" height="6" x="9" y="2" rx="1" />
            <rect width="6" height="6" x="2" y="16" rx="1" />
            <rect width="6" height="6" x="16" y="16" rx="1" />
            <path strokeLinecap="round" d="M12 8v5M5 16v-3h14v3" />
          </svg>
          <span>Networks</span>
        </NavLink>

        <NavLink 
          to="/map" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <svg className="nav-item-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15z" />
          </svg>
          <span>Network Diagram</span>
        </NavLink>

        <NavLink 
          to="/documents" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <svg className="nav-item-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
          </svg>
          <span>Documentation</span>
        </NavLink>

        <NavLink 
          to="/settings" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <svg className="nav-item-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div>Homelab Hub v1.0.0</div>
        <div>Active Environment</div>
      </div>
    </aside>
  );
};

export default Sidebar;
