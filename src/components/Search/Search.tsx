import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import staticTocData from '../../toc-static-data.json';
import * as AppRoutes from '../../appRoutes';

interface SearchResult {
  id: string;
  title: string;
  path: string;
  type: 'react' | 'static';
  excerpt?: string;
}

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Combine TOC items for searching
    const allItems: AppRoutes.TOCItem[] = [
      ...AppRoutes.reactAppRoutes,
      ...(staticTocData as AppRoutes.TOCItem[]),
    ];
    
    // Flatten the nested TOC structure for searching
    const flattenItems = (items: AppRoutes.TOCItem[]): AppRoutes.TOCItem[] => {
      return items.reduce((acc: AppRoutes.TOCItem[], item) => {
        acc.push(item);
        if (item.children && item.children.length > 0) {
          acc.push(...flattenItems(item.children));
        }
        return acc;
      }, []);
    };
    
    const flattenedItems = flattenItems(allItems);
    
    // Search through the flattened TOC
    const searchResults = flattenedItems
      .filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
      )
      .map(item => ({
        id: item.id,
        title: item.title,
        path: item.path,
        type: item.type,
        excerpt: `Navigate to ${item.title}`,
      }));
    
    setResults(searchResults);
    setIsOpen(true);
  };
  
  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    
    // Navigate based on result type
    if (result.type === 'react') {
      navigate(result.path);
    } else {
      // For static content, use window.location
      window.location.href = result.path;
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search content..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">🔍</button>
      </form>
      
      {isOpen && results.length > 0 && (
        <div className="search-results">
          {results.map(result => (
            <div 
              key={result.id} 
              className="search-result-item"
              onClick={() => handleResultClick(result)}
            >
              <div className="search-result-title">{result.title}</div>
              <div className="search-result-excerpt">{result.excerpt}</div>
              <div className="search-result-type">{result.type === 'react' ? 'React Page' : 'Static Content'}</div>
            </div>
          ))}
        </div>
      )}
      
      {isOpen && results.length === 0 && query && (
        <div className="search-results">
          <div className="search-no-results">No results found for "{query}"</div>
        </div>
      )}
    </div>
  );
};

export default Search;
