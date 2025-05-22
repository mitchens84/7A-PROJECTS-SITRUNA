import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import '../assets/breadcrumbs.css';

interface BreadcrumbItem {
  path: string;
  label: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  homeLabel?: string;
  className?: string;
}

// Map of route paths to friendly names
const routeNameMap: Record<string, string> = {
  '': 'Home',
  'workflow-proposal': 'AI Workflow Proposal',
  'knowledge-map': 'Knowledge Map',
  'static-page': 'Pages',
  'about': 'About'
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  items, 
  homeLabel = 'Home', 
  className = '' 
}) => {
  const location = useLocation();
  
  // If items are not provided, generate them from the current path
  const breadcrumbItems = items || generateBreadcrumbsFromPath(location.pathname, homeLabel);
  
  return (
    <nav aria-label="Breadcrumbs" className={`breadcrumbs-container ${className}`}>
      <ol className="breadcrumbs-list">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={item.path} className="breadcrumbs-item">
              {isLast ? (
                <span className="breadcrumbs-current">{item.label}</span>
              ) : (
                <>
                  <Link to={item.path} className="breadcrumbs-link">
                    {item.label}
                  </Link>
                  <ChevronRight size={16} className="breadcrumbs-separator" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Helper function to generate breadcrumbs from a URL path
function generateBreadcrumbsFromPath(path: string, homeLabel: string): BreadcrumbItem[] {
  // Remove trailing slash if present
  const normalizedPath = path.endsWith('/') && path !== '/' 
    ? path.slice(0, -1) 
    : path;
  
  const segments = normalizedPath.split('/').filter(segment => segment);
  const breadcrumbs: BreadcrumbItem[] = [
    { path: '/', label: homeLabel }
  ];
  
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Get friendly name from the map, or use the segment with capitalization
    let label = routeNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    // Special case for IDs or slugs (usually the last segment)
    if (index === segments.length - 1 && segments.length > 1) {
      // Check if this is likely an ID or slug by looking at the previous segment
      const previousSegment = segments[index - 1];
      if (previousSegment === 'workflow-proposal') {
        label = 'Proposal Details';
      } else if (previousSegment === 'static-page') {
        label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      }
    }
    
    breadcrumbs.push({
      path: currentPath,
      label
    });
  });
  
  return breadcrumbs;
}

export default Breadcrumbs;
