import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, X } from 'lucide-react';
import '../assets/global-search.css';

// Define the SearchResult type locally to avoid import issues
interface SearchResult {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'map-node' | 'workflow-section' | 'static-page';
  path: string;
  relevance: number;
}

interface GlobalSearchProps {
  isActive: boolean;
  onClose: () => void;
  defaultQuery?: string;
}

// Mock implementation of globalContentSearch to avoid import issues
const globalContentSearch = async (query: string): Promise<SearchResult[]> => {
  // This is a temporary mock implementation
  console.log('Searching for:', query);
  
  // Return mock results after a delay to simulate network request
  return new Promise((resolve) => {
    setTimeout(() => {
      if (query.toLowerCase().includes('knowledge')) {
        resolve([
          {
            id: 'sitruna-core',
            title: 'Sitruna Core',
            description: 'Central knowledge management system for Sitruna',
            content: 'Content about Sitruna Core system',
            type: 'map-node',
            path: '/knowledge-map',
            relevance: 0.95
          }
        ]);
      } else if (query.toLowerCase().includes('workflow')) {
        resolve([
          {
            id: 'ai-workflow',
            title: 'AI Workflow Proposal',
            description: 'Workflow proposal for AI integration',
            content: 'Content about AI workflow',
            type: 'workflow-section',
            path: '/proposal',
            relevance: 0.9
          }
        ]);
      } else {
        resolve([]);
      }
    }, 500);
  });
};

function GlobalSearch({ isActive, onClose, defaultQuery = '' }: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState(defaultQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Focus input when search becomes active
  useEffect(() => {
    if (isActive && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isActive]);

  // Clear results when closed
  useEffect(() => {
    if (!isActive) {
      setResults([]);
      setSelectedResultIndex(-1);
    }
  }, [isActive]);

  // Handle search when query changes
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsLoading(true);
        try {
          const searchResults = await globalContentSearch(searchQuery);
          setResults(searchResults);
          setSelectedResultIndex(searchResults.length > 0 ? 0 : -1);
        } catch (error) {
          console.error('Error during search:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setSelectedResultIndex(-1);
      }
    }, 300); // Debounce search

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedResultIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
      scrollSelectedResultIntoView();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedResultIndex(prev => 
        prev > 0 ? prev - 1 : prev
      );
      scrollSelectedResultIntoView();
    } else if (e.key === 'Enter' && selectedResultIndex >= 0) {
      e.preventDefault();
      handleResultClick(results[selectedResultIndex]);
    }
  };

  const scrollSelectedResultIntoView = () => {
    if (resultsContainerRef.current && selectedResultIndex >= 0) {
      const selectedElement = resultsContainerRef.current.children[selectedResultIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleResultClick = (result: SearchResult) => {
    try {
      navigate(result.path);
      onClose();
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if navigate fails
      window.location.href = result.path;
      onClose();
    }
  };

  const highlightMatch = (text: string, term: string) => {
    const lowerText = text.toLowerCase();
    const lowerTerm = term.toLowerCase();
    const index = lowerText.indexOf(lowerTerm);
    
    if (index === -1) return text;
    
    const before = text.substring(0, index);
    const match = text.substring(index, index + term.length);
    const after = text.substring(index + term.length);
    
    return (
      <>
        {before}
        <span className="highlighted-match">{match}</span>
        {after}
      </>
    );
  };

  if (!isActive) return null;

  return (
    <div className="global-search-overlay" onClick={onClose}>
      <div className="global-search-container" onClick={(e) => e.stopPropagation()}>
        <div className="global-search-header">
          <div className="search-input-container">
            <SearchIcon className="search-icon" size={18} />
            <input
              ref={searchInputRef}
              type="text"
              className="global-search-input"
              placeholder="Search all content..."
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            {searchQuery && (
              <button 
                className="clear-search-button" 
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button className="close-search-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="global-search-body">
          {isLoading ? (
            <div className="search-loading">
              <span className="loading-spinner"></span>
              <span>Searching...</span>
            </div>
          ) : (
            <>
              {searchQuery.trim().length >= 2 && (
                <div className="search-stats">
                  {results.length === 0 
                    ? 'No results found' 
                    : `${results.length} result${results.length !== 1 ? 's' : ''} found`}
                </div>
              )}
              
              {results.length > 0 && (
                <div className="search-results" ref={resultsContainerRef}>
                  {results.map((result, index) => (
                    <div 
                      key={result.id}
                      className={`search-result ${index === selectedResultIndex ? 'selected' : ''}`}
                      onClick={() => handleResultClick(result)}
                      onMouseEnter={() => setSelectedResultIndex(index)}
                    >
                      <div className="result-title">
                        {highlightMatch(result.title, searchQuery)}
                      </div>
                      <div className="result-type">
                        {result.type === 'map-node' && 'Knowledge Map Node'}
                        {result.type === 'workflow-section' && 'Workflow Proposal'}
                        {result.type === 'static-page' && 'Page'}
                      </div>
                      <div className="result-description">
                        {highlightMatch(result.description, searchQuery)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {searchQuery.trim().length >= 2 && results.length === 0 && !isLoading && (
                <div className="no-results">
                  <p>No results found for "{searchQuery}"</p>
                  <p className="search-suggestions">
                    Try:
                    <ul>
                      <li>Using different keywords</li>
                      <li>Using more general terms</li>
                      <li>Checking for typos</li>
                    </ul>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="global-search-footer">
          <div className="search-shortcuts">
            <div className="shortcut">
              <span className="key">↑</span>
              <span className="key">↓</span>
              <span className="description">Navigate</span>
            </div>
            <div className="shortcut">
              <span className="key">Enter</span>
              <span className="description">Select</span>
            </div>
            <div className="shortcut">
              <span className="key">Esc</span>
              <span className="description">Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Make sure we export the component as the default export
export default GlobalSearch;
