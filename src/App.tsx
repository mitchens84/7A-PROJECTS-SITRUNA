import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext'
import { AppProvider } from './context/AppContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import LoginPage from './features/auth/LoginPage'
import AIWorkflowProposal from './pages/AIWorkflowProposal'
import SitrunaKnowledgeMap from './pages/SitrunaKnowledgeMap'
import GlobalSearch from './components/GlobalSearch'
import { useAppContext } from './context/AppContext'
import './assets/styles.css' // Assuming global styles are here

// Dynamically set the base URL using Vite's `base` config.
// Fallback to '/' if somehow undefined, though `base` in vite.config.ts should provide it.
const baseName = import.meta.env.BASE_URL || '/';

// Wrap GlobalSearch functionality
const AppWithSearch: React.FC = () => {
  const { globalSearchActive, closeGlobalSearch } = useAppContext();
  
  return (
    <>
      <Router basename={baseName}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="proposal" element={<AIWorkflowProposal />} />
            <Route path="knowledge-map" element={<SitrunaKnowledgeMap />} />
            {/* Add other React-based routes here */}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} /> {/* Catch-all redirects to home */}
        </Routes>
        
        {/* Global search overlay */}
        <GlobalSearch 
          isActive={globalSearchActive} 
          onClose={closeGlobalSearch} 
        />
      </Router>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <AppWithSearch />
      </AppProvider>
    </AuthProvider>
  )
}

export default App
