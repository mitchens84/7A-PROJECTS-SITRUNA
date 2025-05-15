// This is a completely standalone auth solution with no dependencies on other components

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { contentModules } from './content-registry';
import ContentRenderer from './ContentRenderer';
import { CollapsibleTOC } from './components/CollapsibleTOC';

// Very obvious logging
console.log("🔥🔥🔥 DIRECT AUTH APP LOADED:", new Date().toLocaleTimeString());

const DirectAuthApp: React.FC = () => {
  console.log("🔥 DirectAuthApp component rendering");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // This is the login component defined inline to avoid any import issues
  const LoginView = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("🔥 Login attempt with:", password);
      
      if (password === 'password123') {
        console.log("🔥 Login successful");
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
      } else {
        console.log("🔥 Login failed");
        setError('Incorrect password');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 max-w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">7A Projects Login</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-4"
              placeholder="Password"
              autoFocus
            />
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  };

  // If not authenticated, show the inline login component
  if (!isAuthenticated) {
    console.log("🔥 Not authenticated, showing login");
    return <LoginView />;
  }

  // If authenticated, show the main application
  console.log("🔥 Authenticated, showing main content");
  return (
    <BrowserRouter>
      <div className="h-screen bg-gray-50">
        {/* Logout Button - moved to the left side to avoid TOC clash */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors flex items-center"
            aria-label="Logout"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
        
        {/* New Collapsible TOC */}
        <CollapsibleTOC />
        
        {/* Main Content Area */}
        <main className="w-full h-full p-4 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to={`/${contentModules[0]?.path || ''}`} replace />} />
              <Route path="/:modulePath" element={<ContentRenderer />} />
              <Route path="*" element={<div className="p-4">Page not found.</div>} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default DirectAuthApp;
