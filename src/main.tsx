console.log("🚀🚀 COMPLETELY NEW MAIN.TSX - " + new Date().toISOString());

import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App'; // No longer using App.tsx at all
import DirectAuthApp from './DirectAuthApp'; // Use our standalone component
import './index.css';
import { runDiagnostics } from './diagnostics';

// Run diagnostics to help troubleshoot caching issues
const diagnosticResults = runDiagnostics();
console.log("🚀 Diagnostic results:", diagnosticResults);

// Add version info to help detect when the bundle actually updates
console.log("🚀 App version: 2025-05-15-v3 - COMPLETE BYPASS");

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DirectAuthApp />
  </React.StrictMode>
);
