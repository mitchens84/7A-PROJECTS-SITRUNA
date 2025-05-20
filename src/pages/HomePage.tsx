import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to {import.meta.env.VITE_APP_TITLE || 'the Application'}</h1>
      <p>
        This is the main landing page of the React application.
        Navigate using the Table of Contents on the left.
      </p>
      <p>
        Static content from the <code>EXPRESS/</code> directory and dynamic React pages
        are both accessible through the unified ToC.
      </p>
      <h2>Project Overview</h2>
      <p>
        This project, "7A-PROJECTS-SITRUNA," serves as a comprehensive platform integrating static HTML content with a dynamic React application. It features client-side authentication, a unified collapsible Table of Contents (ToC) for seamless navigation between static and React-based pages, and persistent storage for user preferences and session information.
      </p>
      <h3>Key Features:</h3>
      <ul>
        <li><strong>Tier 1 Client-Side Authentication:</strong> Secure login using a hashed password stored in environment variables. Session status is managed via `sessionStorage`.</li>
        <li><strong>Unified Collapsible ToC:</strong> A single, easy-to-navigate ToC. The static content section is auto-generated, while React app routes are manually defined. ToC expansion states are persisted in `localStorage`.</li>
        <li><strong>Persistent Storage:</strong> Utilizes `localStorage` for user inputs (e.g., form field values, ToC state) and `sessionStorage` for authentication status, ensuring a personalized user experience across sessions.</li>
        <li><strong>Static & Dynamic Content:</strong> Hosts static HTML files (e.g., from `EXPRESS/` subdirectories) alongside interactive React components (from `src/`).</li>
        <li><strong>GitHub Pages Deployment:</strong> Configured for easy deployment to GitHub Pages.</li>
      </ul>
      <p>
        Please refer to the <code>PROJECT_BRIEF.md</code> and <code>README.md</code> for more detailed information on the project's architecture, setup, and development guidelines.
      </p>
    </div>
  );
};

export default HomePage;
