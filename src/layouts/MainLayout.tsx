import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Search, Menu, ChevronLeft } from 'lucide-react';
import CollapsibleTOC from '../components/CollapsibleTOC/CollapsibleTOC';
import LocalSearch from '../components/Search/Search';
import { useAppContext } from '../context/AppContext';
import '../assets/styles.css'; // Ensure styles are imported
import '../assets/main-layout.css'; // Import the main layout styles

const MainLayout: React.FC = () => {
  // State to track if the sidebar is collapsed
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toggleGlobalSearch } = useAppContext();

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

    // Restore theme if one was saved
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.setAttribute('data-theme', savedTheme);
    }
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar toggle button */}
      <button
        className="sidebar-toggle-btn"
        onClick={toggleSidebar}
        style={{ left: sidebarCollapsed ? '10px' : '260px' }}
        aria-label={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
      >
        {sidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
      </button>
      
      {/* Global search button */}
      <button 
        className="global-search-btn" 
        onClick={toggleGlobalSearch}
        title="Search all content (Ctrl+K / Cmd+K)"
      >
        <Search size={18} />
      </button>
      
      {/* Table of Contents with collapsed class when needed */}
      <div className={`toc-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <LocalSearch />
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
