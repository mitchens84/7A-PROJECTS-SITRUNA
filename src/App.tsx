import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { contentModulesConfig } from './content-registry';
import ContentRenderer from './ContentRenderer';
import { SimplePassCheck } from './components/SimplePassCheck';

const App: React.FC = () => {
  console.log("🔄 App component rendering:", new Date().toISOString());
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log("🔄 App useEffect running");
    // Check for the isAuthenticated flag in localStorage on initial load
    const authFlag = localStorage.getItem('isAuthenticated');
    console.log("🔑 Auth flag from localStorage:", authFlag);
    if (authFlag === 'true') {
      console.log("✅ Setting authenticated to true");
      setIsAuthenticated(true);
    }
  }, []);

  // If not authenticated, show the password check
  if (!isAuthenticated) {
    console.log("🔒 Not authenticated, showing SimplePassCheck");
    return <SimplePassCheck onSuccess={() => {
      console.log("✅ SimplePassCheck succeeded");
      setIsAuthenticated(true);
    }} />;
  }

  console.log("🔓 Authenticated, showing main content");
  // If authenticated, show the main application content
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="flex h-screen">
        <nav className="w-64 bg-gray-100 p-4 overflow-y-auto">
          <h1 className="text-xl font-bold mb-4">7A Projects</h1>
          <ul>
            {contentModulesConfig.map((mod) => (
              <li key={mod.id} className="mb-2">
                <Link
                  to={`/${mod.path}`}
                  className="text-blue-600 hover:underline"
                >
                  {mod.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to={`/${contentModulesConfig[0]?.path || ''}`} replace />} />
            <Route path="/:modulePath" element={<ContentRenderer />} />
            <Route path="*" element={<div className="p-4">Page not found.</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
