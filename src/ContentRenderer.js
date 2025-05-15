import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { getModuleByPath } from './content-registry';
import { useParams } from 'react-router-dom';
const ContentRenderer = () => {
    const { modulePath } = useParams();
    const mod = modulePath
        ? getModuleByPath(modulePath)
        : undefined;
    if (!mod) {
        return _jsx("div", { className: "p-4", children: "Module not found." });
    }
    if (mod.type === 'iframe') {
        return (_jsx("iframe", { src: mod.entryPoint, title: mod.title, className: "w-full h-full border-none" }));
    }
    // react-component
    const Component = mod.component;
    return (_jsx(React.Suspense, { fallback: _jsxs("div", { children: ["Loading ", mod.title, "..."] }), children: _jsx(Component, {}) }));
};
export default ContentRenderer;
