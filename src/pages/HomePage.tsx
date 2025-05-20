import React, { useState, useEffect } from 'react';

// Feature card component with hover animation
const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

// Stat card for the dashboard
const StatCard = ({ label, value, icon }: { label: string, value: string | number, icon: string }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [loading, setLoading] = useState(true);
  
  // Simulated data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setCurrentTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
    
    return () => clearTimeout(timer);
  }, []);
  
  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="page-header-container">
        <h1>Welcome to {import.meta.env.VITE_APP_TITLE || 'the Application'}</h1>
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {currentTheme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <div className="intro-card">
        <p>
          This is the main landing page of the React application.
          Navigate using the Table of Contents on the left.
        </p>
        <p>
          Static content from the <code>EXPRESS/</code> directory and dynamic React pages
          are both accessible through the unified ToC.
        </p>
      </div>
      
      {/* Stats Dashboard */}
      <div className="stats-dashboard">
        <h2>Project Dashboard</h2>
        <div className="stats-container">
          <StatCard icon="📄" value={12} label="Documents" />
          <StatCard icon="🔗" value={24} label="Links" />
          <StatCard icon="👥" value={5} label="Collaborators" />
          <StatCard icon="✅" value="87%" label="Completion" />
        </div>
      </div>

      {/* Feature Cards */}
      <h2>Key Features</h2>
      <div className="features-grid">
        <FeatureCard 
          icon="🔒" 
          title="Secure Authentication" 
          description="Client-side authentication with hashed passwords stored in environment variables" 
        />
        <FeatureCard 
          icon="🧭" 
          title="Unified Navigation" 
          description="Seamless navigation between static and dynamic content through a single collapsible TOC" 
        />
        <FeatureCard 
          icon="💾" 
          title="Persistent Storage" 
          description="User preferences and session data stored locally for a personalized experience" 
        />
        <FeatureCard 
          icon="🚀" 
          title="GitHub Pages Ready" 
          description="Pre-configured for smooth deployment to GitHub Pages with proper routing" 
        />
      </div>

      <div className="project-overview-section">
        <h2>Project Overview</h2>
        <p>
          This project, "7A-PROJECTS-SITRUNA," serves as a comprehensive platform integrating static HTML content with a dynamic React application. It features client-side authentication, a unified collapsible Table of Contents (ToC) for seamless navigation between static and React-based pages, and persistent storage for user preferences and session information.
        </p>
        <div className="info-box">
          <p>
            Please refer to the <code>PROJECT_BRIEF.md</code> and <code>README.md</code> for more detailed information on the project's architecture, setup, and development guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
