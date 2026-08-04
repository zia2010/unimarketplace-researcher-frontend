import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-white">
      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-white rounded-lg shadow">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;