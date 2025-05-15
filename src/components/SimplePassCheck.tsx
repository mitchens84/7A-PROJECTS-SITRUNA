import React, { useState, useEffect } from 'react';

console.log("⭐⭐⭐ SIMPLE PASS CHECK LOADED:", new Date().toISOString());

interface SimplePassCheckProps {
  onSuccess: () => void;
}

export function SimplePassCheck({ onSuccess }: SimplePassCheckProps) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    console.log("⭐⭐⭐ SimplePassCheck component mounted");
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("✅ SimplePassCheck submit with:", pass);
    
    if (pass === "password123") {
      console.log("✅ Password correct!");
      localStorage.setItem('isAuthenticated', 'true');
      onSuccess();
    } else {
      console.log("❌ Password incorrect!");
      setError('Incorrect password');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Enter Password</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mb-4"
            placeholder="Password"
            autoFocus
          />
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
