// VERY UNIQUE MARKER FOR DEBUGGING - 15 May 2025 - ID_ALPHABRAVOCHARLIE
console.log('[LoginPage.tsx] TOP LEVEL LOG - VERSION_MAY15_ABC - LOADED AT:', new Date().toLocaleTimeString());

import React, { useState } from 'react';

// ADDED A VERY OBVIOUS LOG HERE TO CHECK IF THIS FILE IS LOADED
console.log('[LoginPage.tsx] TOP LEVEL LOG - NEW VERSION LOADED AT:', new Date().toLocaleTimeString());

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const CLIENT_SIDE_PASSWORD = "password123"; // IMPORTANT: Change this if needed

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  console.log('[LoginPage.tsx] Component rendering - NEW VERSION');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(''); 
    console.log("[LoginPage.tsx] handleSubmit called. Password input:", password);
    console.log("[LoginPage.tsx] Comparing with CLIENT_SIDE_PASSWORD:", CLIENT_SIDE_PASSWORD);

    if (password === CLIENT_SIDE_PASSWORD) {
      console.log("[LoginPage.tsx] Client-side password matched.");
      localStorage.setItem('isAuthenticated', 'true'); 
      onLoginSuccess();
    } else {
      console.log("[LoginPage.tsx] Client-side password did NOT match.");
      setError('Login failed. Please check the password and try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
