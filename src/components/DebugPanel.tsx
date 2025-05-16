import React, { useState, useEffect } from 'react';
import { contentModulesConfig } from '../content-registry';

interface DebugPanelProps {
  currentPath?: string;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [version, setVersion] = useState('1.0');
  const [timestamp, setTimestamp] = useState('');
  const [buildMode, setBuildMode] = useState('');

  useEffect(() => {
    setTimestamp(new Date().toISOString());
    // Check if we're in production or development
    setBuildMode(import.meta.env.MODE || 'development');
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-yellow-200 hover:bg-yellow-300 text-black px-3 py-2 rounded-md 
          shadow-md flex items-center space-x-1 text-xs border border-yellow-500"
      >
        <span>Debug Info</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-yellow-50 border border-yellow-300 p-4 rounded-md shadow-lg 
      max-w-md w-full max-h-[80vh] overflow-auto">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-yellow-200">
        <h3 className="font-bold text-sm">Debug Info</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
      
      <div className="text-xs space-y-2">
        <div>
          <span className="font-semibold">ENV:</span> {buildMode}
        </div>
        <div>
          <span className="font-semibold">BASE_URL:</span> {import.meta.env.BASE_URL || '/'}
        </div>
        <div>
          <span className="font-semibold">Current Path:</span> {currentPath || 'Not set'}
        </div>
        
        <div className="mt-3">
          <span className="font-semibold block mb-1">Available Modules: {contentModulesConfig.length}</span>
          <div className="pl-2">
            {contentModulesConfig.map((module) => (
              <div key={module.id} className="mb-1 border-b border-dashed border-yellow-200 pb-1">
                {module.path} → {module.type} ({module.entryPoint})
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-yellow-200 text-gray-500">
          Debug Panel v{version} · {timestamp}
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
