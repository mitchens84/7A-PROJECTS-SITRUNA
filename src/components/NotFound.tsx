import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="not-found">
      <h2>Module not found</h2>
      <p>Sorry, the requested module could not be loaded.</p>
      <p>
        <Link to="/">Return to home page</Link>
      </p>
    </div>
  );
};

export default NotFound;