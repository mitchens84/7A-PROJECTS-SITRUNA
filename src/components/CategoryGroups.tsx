import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Define types for the content module
interface ContentModule {
  id: string;
  title: string;
  path: string;
  type: 'iframe' | 'react-component';
  entryPoint: string;
  description?: string;
  category?: string; // Optional category property
}

// Group modules by their category
const groupModulesByCategory = (modules: ContentModule[]) => {
  const categorized: Record<string, ContentModule[]> = {};
  
  modules.forEach(module => {
    const category = module.category || 'Uncategorized';
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(module);
  });
  
  return categorized;
};

interface CategoryGroupProps {
  modules: ContentModule[];
}

export const CategoryGroups: React.FC<CategoryGroupProps> = ({ modules }) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const currentPath = `/${location.pathname.split('/')[1]}`;
  
  const categorizedModules = groupModulesByCategory(modules);
  const categories = Object.keys(categorizedModules).sort();
  
  // Toggle a category's expanded state
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  return (
    <div className="space-y-3">
      {categories.map(category => (
        <div key={category} className="border border-gray-200 rounded-md overflow-hidden">
          <div 
            className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
            onClick={() => toggleCategory(category)}
            onKeyDown={(e) => e.key === 'Enter' && toggleCategory(category)}
            tabIndex={0}
            role="button"
            aria-expanded={expandedCategories[category] || false}
          >
            <h3 className="font-medium text-gray-800">{category}</h3>
            {expandedCategories[category] ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </div>
          
          {expandedCategories[category] && (
            <ul className="border-t border-gray-200">
              {categorizedModules[category].map(module => (
                <li key={module.id} className="border-b border-gray-200 last:border-b-0">
                  <Link
                    to={`/${module.path}`}
                    className={`
                      block px-3 py-2 
                      ${currentPath === `/${module.path}` 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'hover:bg-gray-50 text-gray-700'}
                    `}
                    aria-current={currentPath === `/${module.path}` ? 'page' : undefined}
                  >
                    <div className="font-medium">{module.title}</div>
                    {module.description && (
                      <p className="text-xs text-gray-500 mt-1">{module.description}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};
