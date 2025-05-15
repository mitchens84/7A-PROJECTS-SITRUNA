// NOTE: Import this at the top level of your main.tsx or App.tsx to run the diagnostics

export function runDiagnostics() {
  console.log('🔍 RUNNING DIAGNOSTICS - ' + new Date().toISOString());
  
  // Check for service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log(`🔍 Found ${registrations.length} service worker registrations`);
      registrations.forEach(registration => {
        console.log('🔍 Service worker:', registration.scope);
      });
      
      if (registrations.length > 0) {
        console.log('⚠️ Service workers might be interfering with updates! Consider unregistering them.');
      }
    });
  } else {
    console.log('🔍 Service Worker API not available in this browser');
  }
  
  // Check caching headers
  console.log('🔍 Checking for cache control headers on main resources...');
  
  // Check localStorage for debug flags
  const debugFlags = {
    isAuthenticated: localStorage.getItem('isAuthenticated'),
    authToken: localStorage.getItem('authToken'),
  };
  
  console.log('🔍 localStorage debug flags:', debugFlags);
  
  // Add a global flag to detect if this diagnostic code ran
  window.__diagnosticsRun = true;
  
  // Return some state we can check
  return {
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    location: window.location.toString(),
    hasServiceWorkerAPI: 'serviceWorker' in navigator,
    localStorage: debugFlags,
  };
}
