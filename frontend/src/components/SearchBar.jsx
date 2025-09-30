// frontend/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState("title"); // title, author, subject, isbn
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    year: "",
    language: ""
  });
  const [animateInput, setAnimateInput] = useState(false);
  const suggestionRef = useRef(null);
  const inputRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      // Add animation effect
      setAnimateInput(true);
      const timer = setTimeout(() => setAnimateInput(false), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() === "") {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/autocomplete?query=${encodeURIComponent(query)}&type=${searchType}`
        );
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        fetchSuggestions();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() === "") return; // Ignore empty searches
    setShowSuggestions(false);
    onSearch({
      query,
      type: searchType,
      filters: showAdvancedFilters ? filters : {}
    });
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    onSearch({
      query: suggestion.title,
      type: searchType,
      filters: showAdvancedFilters ? filters : {}
    });
  };
  
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSuggestions([]);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="relative" ref={suggestionRef}>
      {/* Search Type Selection */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          onClick={() => handleSearchTypeChange("title")}
          className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
            searchType === "title"
              ? "bg-indigo-600 text-white"
              : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
          }`}
        >
          Title
        </button>
        <button
          type="button"
          onClick={() => handleSearchTypeChange("author")}
          className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
            searchType === "author"
              ? "bg-indigo-600 text-white"
              : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
          }`}
        >
          Author
        </button>
        <button
          type="button"
          onClick={() => handleSearchTypeChange("subject")}
          className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
            searchType === "subject"
              ? "bg-indigo-600 text-white"
              : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
          }`}
        >
          Topic/Subject
        </button>
        <button
          type="button"
          onClick={() => handleSearchTypeChange("isbn")}
          className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
            searchType === "isbn"
              ? "bg-indigo-600 text-white"
              : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
          }`}
        >
          ISBN
        </button>
        
        {/* Advanced Filters Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="ml-auto px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 flex items-center"
        >
          <span>Advanced Filters</span>
          <svg
            className={`ml-1 h-4 w-4 transition-transform duration-300 ${
              showAdvancedFilters ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1">
                Publication Year
              </label>
              <input
                type="number"
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                placeholder="e.g., 2020"
                className="text-black w-full px-3 py-2 border border-indigo-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1">
                Language
              </label>
              <select
                name="language"
                value={filters.language}
                onChange={handleFilterChange}
                className="text-black w-full px-3 py-2 border border-indigo-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Any Language</option>
                <option value="eng">English</option>
                <option value="spa">Spanish</option>
                <option value="fre">French</option>
                <option value="ger">German</option>
                <option value="hin">Hindi</option>
                <option value="chi">Chinese</option>
                <option value="jpn">Japanese</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-grow w-full">
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-300 ${animateInput ? 'text-indigo-600 scale-110' : 'text-indigo-400'}`}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            className={`block w-full pl-10 pr-3 py-3 sm:py-4 border ${animateInput ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-indigo-200'} rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-indigo-300 focus:outline-none shadow-sm transition-all duration-300`}
            placeholder={`Search for books by ${searchType === "author" ? "author name" : searchType === "subject" ? "topic or subject" : searchType === "isbn" ? "ISBN" : "title"}...`}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              setAnimateInput(true);
              setTimeout(() => setAnimateInput(false), 800);
            }}
          />
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md flex items-center justify-center"
        >
          <span>Search</span>
          <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && query.trim() !== "" && (
        <div 
          className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-lg border border-indigo-200 max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-indigo-500">
              <div className="inline-block animate-spin h-5 w-5 border-t-2 border-indigo-500 rounded-full mr-2"></div>
              Loading suggestions...
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="divide-y divide-indigo-100">
              {suggestions.map((suggestion) => (
                <li 
                  key={suggestion.key}
                  className="px-4 py-3 hover:bg-indigo-50 cursor-pointer text-indigo-700 transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center">
                    {suggestion.type === "author" ? (
                      <svg className="h-4 w-4 text-indigo-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    ) : suggestion.type === "subject" ? (
                      <svg className="h-4 w-4 text-indigo-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-indigo-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium truncate">{suggestion.title}</span>
                      {suggestion.author && suggestion.type !== "author" && (
                        <span className="text-xs text-gray-500">by {suggestion.author}</span>
                      )}
                      {suggestion.year && (
                        <span className="text-xs text-gray-500">{suggestion.year}</span>
                      )}
                    </div>
                    {suggestion.cover_i && (
                      <img 
                        src={`https://covers.openlibrary.org/b/id/${suggestion.cover_i}-S.jpg`}
                        alt={suggestion.title}
                        className="h-10 w-8 object-cover ml-auto rounded"
                        onError={(e) => {e.target.style.display = 'none'}}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-indigo-500">No suggestions found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
