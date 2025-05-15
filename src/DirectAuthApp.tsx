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

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-gray-100">
        {isAuthenticated ? (
          <>
            {/* FIXED: Only render header with logout button once */}
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
              <h1 className="text-xl font-semibold">Sitruna</h1>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                aria-label="Logout"
              >
                Logout
              </button>
            </header>
            
            <div className="container mx-auto p-4 relative">
              {/* Main content area */}
              <Routes>
                {contentModules.map((module) => (
                  <Route
                    key={module.id}
                    path={module.path}
                    element={<ContentRenderer module={module} />}
                  />
                ))}
                <Route
                  path="/"
                  element={<Navigate to={contentModules[0]?.path || "/"} replace />}
                />
              </Routes>
              
              {/* FIXED: Only include the CollapsibleTOC once, positioned in upper right */}
              <div className="fixed top-20 right-4 z-50">
                <CollapsibleTOC />
              </div>
            </div>
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
