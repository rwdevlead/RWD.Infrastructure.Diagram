import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HardwarePage from './pages/Hardware';
import VirtualMachines from './pages/VirtualMachines';
import Applications from './pages/Applications';
import StoragePage from './pages/Storage';
import NetworkSharesPage from './pages/NetworkShares';
import Networks from './pages/Networks';
import MapPage from './pages/Map';
import DocumentsPage from './pages/Documents';
import SettingsPage from './pages/Settings';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="hardware" element={<HardwarePage />} />
          <Route path="vms" element={<VirtualMachines />} />
          <Route path="apps" element={<Applications />} />
          <Route path="storage" element={<StoragePage />} />
          <Route path="shares" element={<NetworkSharesPage />} />
          <Route path="networks" element={<Networks />} />
          <Route path="map" element={<MapPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
