import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { contentModulesConfig as contentModules } from '../content-registry.ts';
import { CategoryGroups } from './CategoryGroups';

export const CollapsibleTOC: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [useCategories, setUseCategories] = useState(false);
  const location = useLocation();
  const currentPath = `/${location.pathname.split('/')[1]}`;

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      className={`
        fixed top-5 right-0 z-40 transition-all duration-300 ease-in-out
        ${isCollapsed 
          ? 'w-12 bg-gray-800 bg-opacity-80 hover:bg-opacity-90' 
          : 'w-64 bg-white shadow-lg'
        }
        ${isMobile ? 'top-auto bottom-0 w-full' : ''}
        rounded-l-lg overflow-hidden
      `}
      aria-expanded={!isCollapsed}
      role="navigation"
      aria-label="Table of Contents"
    >
      {/* Header/Toggle Bar */}
      <div 
        className={`
          flex items-center cursor-pointer p-3 
          ${isCollapsed 
            ? 'justify-center text-white hover:bg-gray-700' 
            : 'justify-between bg-gray-100 border-b hover:bg-gray-200'
          }
          ${isMobile ? 'justify-center' : ''}
        `}
        onClick={() => setIsCollapsed(!isCollapsed)}
        onKeyDown={(e) => e.key === 'Enter' && setIsCollapsed(!isCollapsed)}
        tabIndex={0}
        role="button"
        aria-label={isCollapsed ? "Expand table of contents" : "Collapse table of contents"}
      >
        {!isCollapsed && <span className="font-semibold select-none">Contents</span>}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-6 w-6 transition-transform ${isCollapsed ? 'text-white' : 'text-gray-600'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          {isCollapsed ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          )}
        </svg>
      </div>

      {/* Content List */}
      {!isCollapsed && (
        <div className="max-h-[80vh] overflow-y-auto p-3">
          {/* View toggle */}
          <div className="flex justify-end mb-3">
            <button
              className={`text-xs px-2 py-1 rounded ${useCategories ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setUseCategories(!useCategories)}
              aria-pressed={useCategories}
              title={useCategories ? "Switch to flat list view" : "Switch to categorized view"}
            >
              {useCategories ? "Flat List" : "Categories"}
            </button>
          </div>

          {useCategories ? (
            <CategoryGroups modules={contentModules} />
          ) : (
            <ul>
              {contentModules.map((mod) => (
                <li key={mod.id} className="mb-2">
                  <Link
                    to={`/${mod.path}`}
                    className={`
                      block px-3 py-2 rounded transition-colors
                      ${currentPath === `/${mod.path}` 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'}
                    `}
                    aria-current={currentPath === `/${mod.path}` ? 'page' : undefined}
                  >
                    {mod.title}
                    {mod.description && (
                      <p className="text-xs text-gray-500 mt-1">{mod.description}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
