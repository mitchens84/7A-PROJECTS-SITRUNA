import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import CollapsibleTOC from '../components/CollapsibleTOC/CollapsibleTOC';
import '../assets/styles.css'; // Ensure styles are imported

const MainLayout: React.FC = () => {
  // State to track if the sidebar is collapsed
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(prevState => !prevState);
    // Persist sidebar state in localStorage
    localStorage.setItem('sidebarCollapsed', (!sidebarCollapsed).toString());
  };

  // Restore sidebar state on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(savedState === 'true');
    }
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar toggle button */}
      <button 
        className="sidebar-toggle-btn" 
        onClick={toggleSidebar}
        style={{ left: sidebarCollapsed ? '10px' : '260px' }} // Adjust position based on sidebar state
      >
        {sidebarCollapsed ? '☰' : '×'}
      </button>
      
      {/* Table of Contents with collapsed class when needed */}
      <div className={`toc-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <CollapsibleTOC />
      </div>
      
      {/* Main content area that adjusts based on sidebar state */}
      <main className={`content-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Outlet /> {/* Nested routes will render here */}
      </main>
    </div>
  );
};

export default MainLayout;
