import React from 'react';
import { Outlet } from 'react-router-dom';
import CollapsibleTOC from '../components/CollapsibleTOC/CollapsibleTOC';
import '../assets/styles.css'; // Ensure styles are imported

const MainLayout: React.FC = () => {
  return (
    <div className="app-container">
      <CollapsibleTOC />
      <main className="main-content">
        <Outlet /> {/* Nested routes will render here */}
      </main>
    </div>
  );
};

export default MainLayout;
