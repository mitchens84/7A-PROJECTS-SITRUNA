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

// Log environment information
console.log("🚀 Environment:", {
  BASE_URL: import.meta.env.BASE_URL,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
  URL: window.location.href,
  PATHNAME: window.location.pathname,
  SEARCH: window.location.search
});

// Add debugging info for GitHub Pages issues
console.log("🚀 Browser environment:", {
  userAgent: navigator.userAgent,
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
  documentReady: document.readyState
});

// Check if any 404 debugging info exists from previous redirects
try {
  const debug404 = localStorage.getItem('404_debug');
  if (debug404) {
    console.log("🚀 Previous 404 redirect info:", JSON.parse(debug404));
  }
} catch (e) {
  console.error("Error reading debug info:", e);
}

// Add version info to help detect when the bundle actually updates
console.log("🚀 App version: 2025-05-15-v7 - GITHUB PAGES FIX WITH SPA ROUTING AND PATH CORRECTION");

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DirectAuthApp />
  </React.StrictMode>
);
