// This is a completely standalone auth solution with no dependencies on other components

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { contentModulesConfig as contentModules } from './content-registry';
import ContentRenderer from './ContentRenderer';
import { CollapsibleTOC } from './components/CollapsibleTOC';

// Very obvious logging
console.log("🔥🔥🔥 DIRECT AUTH APP LOADED:", new Date().toLocaleTimeString());
console.log("Registered content modules:", contentModules); // Log the modules it sees

// Register fallback module for the 'proposal' path if it doesn't exist already
if (!contentModules.some(m => m.path === 'proposal')) {
  console.log("🔥 Adding fallback proposal module");
  contentModules.push({
    id: 'proposal-fallback',
    title: 'Proposal (Fallback)',
    path: 'proposal',
    type: 'iframe',
    entryPoint: 'proposal/index.html', 
    description: 'Fallback proposal content',
    category: 'Business'
  });
}

const DirectAuthApp: React.FC = () => {
  console.log("🔥 DirectAuthApp component rendering");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPathForDebug, setCurrentPathForDebug] = useState(''); // For debugging
  
  // Debug panel to show available modules and current path
  const DebugPanel = () => (
    <div 
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '10px',
        background: 'rgba(255, 255, 200, 0.95)',
        padding: '10px',
        fontSize: '12px',
        maxWidth: '300px',
        maxHeight: '300px',
        overflow: 'auto',
        zIndex: 9999,
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <h3 style={{ margin: '0 0 8px', fontSize: '14px' }}>Debug Info</h3>
      <div><strong>ENV:</strong> {import.meta.env.MODE}</div>
      <div><strong>BASE_URL:</strong> {import.meta.env.BASE_URL}</div>
      <div><strong>Current Path:</strong> {currentPathForDebug}</div>
      <div>
        <strong>Available Modules:</strong> {contentModules.length}
      </div>
      <details>
        <summary>Module Paths</summary>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          {contentModules.map((m, i) => (
            <li key={i}>
              {m.path} → {m.type} ({m.entryPoint})
            </li>
          ))}
        </ul>
      </details>
      <div style={{ marginTop: '8px', fontSize: '10px', color: '#666' }}>
        Debug Panel v1.0 - {new Date().toLocaleTimeString()}
      </div>
    </div>
  );

  useEffect(() => {
    console.log("🔥 DirectAuthApp useEffect running");
    const authFlag = localStorage.getItem('isAuthenticated');
    console.log("🔥 Auth flag from localStorage:", authFlag);
    if (authFlag === 'true') {
      console.log("🔥 Setting authenticated to true");
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    console.log("🔥 Logging out");
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  const LoginView: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      console.log("🔥 Login attempt with:", password);

      if (password === "password123") {
        console.log("🔥 Login successful");
        localStorage.setItem('isAuthenticated', 'true');
        onLoginSuccess();
      } else {
        console.log("🔥 Login failed");
        setError('Incorrect password');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6">Enter Password</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-4"
              placeholder="Password"
            />
            <button 
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Add a component to capture and log the current location
  const LocationLogger: React.FC = () => {
    const location = useLocation();
    useEffect(() => {
      console.log("🔥 Current React Router location.pathname:", location.pathname);
      setCurrentPathForDebug(location.pathname); // Update state for display if needed
    }, [location]);
    return null;
  };

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LocationLogger /> {/* Add logger here */}
      <div className="min-h-screen bg-gray-100">
        {/* Debug panel showing current environment info - remove in production if desired */}
        <div className="bg-yellow-100 p-2 text-xs border-b border-yellow-200 text-center">
          <div>BASE_URL: {import.meta.env.BASE_URL}</div>
          <div>Current Path: {currentPathForDebug}</div>
          <div>Mode: {import.meta.env.MODE}</div>
        </div>
        
        {isAuthenticated ? (
          <>
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
              <h1 className="text-xl font-semibold">Sitruna</h1>
            </header>
            
            <div className="container mx-auto p-4 relative pb-20">
              {/* You can add this for debugging if needed: <p>Current Path: {currentPathForDebug}</p> */}
              <Routes>
                {contentModules.length > 0 ? (
                  contentModules.map((module) => (
                    <Route
                      key={module.id}
                      path={module.path} // These paths are relative to the basename
                      element={<ContentRenderer module={module} />}
                    />
                  ))
                ) : (
                  // This case should ideally not be hit if update-content works
                  <Route path="*" element={<div className="p-4 text-center">No modules available. Please run `npm run update-content` and check configuration.</div>} />
                )}

                <Route
                  path="/" // Handles the base path after login
                  element={
                    contentModules.length > 0 ? (
                      // Navigate to the first module's path
                      <Navigate to={contentModules[0].path} replace />
                    ) : (
                      <div className="p-4 text-center">Welcome to Sitruna. No content modules are currently loaded.</div>
                    )
                  }
                />
                
                {/* Fallback for any unmatched routes AFTER specific module routes and the root redirect */}
                {/* This will render if the URL doesn't match any module.path or "/" */}
                <Route path="*" element={
                  <div className="p-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">Module Not Found</h2>
                    <p className="mb-4">The requested content module could not be found at this URL.</p>
                    <p className="text-gray-600">Current path: {currentPathForDebug}</p>
                    <div className="mt-6">
                      <button 
                        onClick={() => window.location.href = import.meta.env.BASE_URL}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Return to Homepage
                      </button>
                    </div>
                  </div>
                } />

                {/* Catch-all route for undefined paths */}
                <Route path="/*" element={<div className="p-4 text-center">404 - Not Found</div>} />
              </Routes>
              
              <div className="fixed top-20 right-4 z-50">
                <CollapsibleTOC />
              </div>

              <button
                onClick={handleLogout}
                className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm shadow-lg z-50"
                aria-label="Logout"
              >
                Logout
              </button>
              
              {/* Add the debug panel */}
              <DebugPanel />
            </div>

            <DebugPanel /> {/* Add debug panel here */}
          </>
        ) : (
          <LoginView
            onLoginSuccess={() => setIsAuthenticated(true)}
          />
        )}
      </div>
    </BrowserRouter>
  );
};

export default DirectAuthApp;
