import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { contentModules } from './content-registry';
import ContentRenderer from './ContentRenderer';
import LoginPage from './LoginPage'; // Import the LoginPage component
const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        // Check for auth token in localStorage on initial load
        const token = localStorage.getItem('authToken');
        if (token) {
            // You might want to add token validation here in a real app
            setIsAuthenticated(true);
        }
    }, []);
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };
    // If not authenticated, show the login page
    if (!isAuthenticated) {
        return _jsx(LoginPage, { onLoginSuccess: handleLoginSuccess });
    }
    // If authenticated, show the main application content
    return (_jsx(BrowserRouter, { children: _jsxs("div", { className: "flex h-screen", children: [_jsxs("nav", { className: "w-64 bg-gray-100 p-4 overflow-y-auto", children: [_jsx("h1", { className: "text-xl font-bold mb-4", children: "7A Projects" }), _jsx("ul", { children: contentModules.map((mod) => (_jsx("li", { className: "mb-2", children: _jsx(Link, { to: `/${mod.path}`, className: "text-blue-600 hover:underline", children: mod.title }) }, mod.id))) })] }), _jsx("main", { className: "flex-1 overflow-auto", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: `/${contentModules[0]?.path || ''}`, replace: true }) }), _jsx(Route, { path: "/:modulePath", element: _jsx(ContentRenderer, {}) }), _jsx(Route, { path: "*", element: _jsx("div", { className: "p-4", children: "Page not found." }) })] }) })] }) }));
};
export default App;
