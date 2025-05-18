import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface HeaderProps {
  onToggleSettings: () => void;
  darkMode: boolean;
  title?: string;
  onSearch?: (searchTerm: string) => void;
  onFilter?: (filterType: string, value: string) => void;
}

const Header = ({ onToggleSettings, darkMode, title = "KaamKaaj - Task Manager", onSearch, onFilter }: HeaderProps) => {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };
  
  const handleFilterClick = (filterType: string, value: string) => {
    if (onFilter) {
      onFilter(filterType, value);
      setActiveFilter(value);
    }
    setIsFilterMenuOpen(false);
  };
  
  return (
    <header className={`shadow-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <motion.div 
          className="flex items-center"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={`w-8 h-8 ${darkMode ? 'text-purple-400' : 'text-purple-600'} mr-3`}
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </motion.svg>
          <motion.h1 
            className="text-2xl font-bold"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {title}
          </motion.h1>
        </motion.div>
        
        <div className="flex-1 mx-8">
          <div className={`relative ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                darkMode 
                ? 'bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500' 
                : 'bg-gray-100 border-gray-300 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500'
              } focus:outline-none focus:ring-2 transition duration-150 ease-in-out`}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <motion.button 
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                darkMode ? 'bg-purple-900 text-purple-200 hover:bg-purple-800' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-4 h-4 mr-2"
              >
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"></path>
              </svg>
              Filter
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-4 h-4 ml-2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </motion.button>
            
            <AnimatePresence>
              {isFilterMenuOpen && (
                <motion.div 
                  className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg ${
                    darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  } z-20`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="py-1">
                    <p className={`px-4 py-2 text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      SORT BY
                    </p>
                    <button 
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      } ${activeFilter === 'date' ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
                      onClick={() => handleFilterClick('sort', 'date')}
                    >
                      Date Created
                    </button>
                    <button 
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      } ${activeFilter === 'priority-high' ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
                      onClick={() => handleFilterClick('sort', 'priority-high')}
                    >
                      Priority (High to Low)
                    </button>
                    <button 
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      } ${activeFilter === 'priority-low' ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
                      onClick={() => handleFilterClick('sort', 'priority-low')}
                    >
                      Priority (Low to High)
                    </button>
                    <button 
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      } ${activeFilter === 'title' ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
                      onClick={() => handleFilterClick('sort', 'title')}
                    >
                      Title (A-Z)
                    </button>
                    
                    <hr className={`my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                    
                    <p className={`px-4 py-2 text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      FILTER BY
                    </p>
                    <button 
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      } ${activeFilter === 'high-priority' ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
                      onClick={() => handleFilterClick('filter', 'high-priority')}
                    >
                      High Priority Only
                    </button>
                    <button 
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      } ${activeFilter === 'all' ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
                      onClick={() => handleFilterClick('filter', 'all')}
                    >
                      Show All Tasks
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <motion.button
            onClick={onToggleSettings}
            className={`p-2 rounded-full ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } focus:outline-none`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            title="Settings"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-6 h-6"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header; 