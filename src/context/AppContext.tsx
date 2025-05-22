import React, { createContext, useState, useContext, useEffect } from 'react';

interface AppContextType {
  globalSearchActive: boolean;
  toggleGlobalSearch: () => void;
  closeGlobalSearch: () => void;
  openGlobalSearch: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalSearchActive, setGlobalSearchActive] = useState(false);

  const toggleGlobalSearch = () => {
    setGlobalSearchActive(prev => !prev);
  };

  const closeGlobalSearch = () => {
    setGlobalSearchActive(false);
  };

  const openGlobalSearch = () => {
    setGlobalSearchActive(true);
  };

  // Set up keyboard shortcuts for global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle search with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleGlobalSearch();
      }
      
      // Close search with Escape key
      if (e.key === 'Escape' && globalSearchActive) {
        closeGlobalSearch();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [globalSearchActive]);

  return (
    <AppContext.Provider 
      value={{ 
        globalSearchActive,
        toggleGlobalSearch,
        closeGlobalSearch,
        openGlobalSearch
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};
