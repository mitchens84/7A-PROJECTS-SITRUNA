import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const LoginPage = ({ onLoginSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                localStorage.setItem('authToken', data.token);
                onLoginSuccess();
            }
            else {
                setError(data.message || 'Login failed. Please try again.');
            }
        }
        catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Login error:', err);
        }
    };
    return (_jsx("div", { className: "flex items-center justify-center h-screen bg-gray-200", children: _jsxs("form", { onSubmit: handleSubmit, className: "p-8 bg-white rounded shadow-md w-full max-w-sm", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-center", children: "Login" }), error && _jsx("p", { className: "text-red-500 text-sm mb-4", children: error }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), _jsx("input", { type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", required: true })] }), _jsx("button", { type: "submit", className: "w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: "Login" })] }) }));
};
export default LoginPage;
