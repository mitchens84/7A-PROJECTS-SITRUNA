import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import LoginPage from './features/auth/LoginPage'
import AIWorkflowProposalPage from './features/career/proposal' // Corrected import
import './assets/styles.css' // Assuming global styles are here

// Dynamically set the base URL
// For development, Vite's `base` config is the source of truth.
// For production, `VITE_APP_BASE_URL` set during build (e.g., in .env.production or CI) takes precedence.
const configuredBase = import.meta.env.BASE_URL; // This comes from vite.config.js base
const productionBase = import.meta.env.VITE_APP_BASE_URL;
const baseName = productionBase && productionBase !== '/' ? productionBase : configuredBase;


const App: React.FC = () => {
  return (
    <AuthProvider>
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
            <Route path="proposal" element={<AIWorkflowProposalPage />} />
            {/* Add other React-based routes here */}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} /> {/* Catch-all redirects to home */}
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
