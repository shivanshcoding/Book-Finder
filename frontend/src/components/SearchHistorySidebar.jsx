import React, { useState, useEffect } from 'react';

const SearchHistorySidebar = ({ searchHistory, onSelectHistory, setSearchHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Format the timestamp to a readable format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Clear all search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Remove a specific search history item
  const removeHistoryItem = (index) => {
    const updatedHistory = [...searchHistory];
    updatedHistory.splice(index, 1);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  return (
    <div className={`fixed top-0 right-0 h-[calc(100vh)] z-20 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-2.5rem)]'}`}>
      {/* Toggle button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 -left-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-1.5 rounded-l-md shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
        aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <svg 
          className="w-4 h-4 transition-transform duration-300" 
          style={{ transform: !isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      {/* Sidebar content */}
      <div className="bg-white border-l border-indigo-200 shadow-lg h-full w-82 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center">
          <h3 className="font-semibold flex items-center">
            <svg className="w-5 h-15 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Search History
          </h3>
          <button 
            onClick={clearHistory}
            className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded transition-colors duration-300 flex items-center"
            disabled={searchHistory.length === 0}
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Clear All
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {searchHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500 italic">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p>No search history yet</p>
              <p className="text-xs mt-1">Your searches will appear here</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {searchHistory.map((item, index) => (
                <li 
                  key={index} 
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 relative group"
                >
                  <button 
                    onClick={() => onSelectHistory(item)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center mb-1">
                      <span className="font-medium text-indigo-800">{item.query}</span>
                      <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full">
                        {item.type}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {formatTimestamp(item.timestamp)}
                    </div>
                  </button>
                  
                  {/* Delete button */}
                  <button 
                    onClick={() => removeHistoryItem(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="Remove from history"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchHistorySidebar;