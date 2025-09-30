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
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex flex-wrap gap-2 p-1 bg-indigo-50 rounded-full shadow-sm border border-indigo-100 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleSearchTypeChange("title")}
            className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center ${
              searchType === "title"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "bg-white text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800"
            }`}
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            Title
          </button>
          <button
            type="button"
            onClick={() => handleSearchTypeChange("author")}
            className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center ${
              searchType === "author"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "bg-white text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800"
            }`}
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Author
          </button>
          <button
            type="button"
            onClick={() => handleSearchTypeChange("subject")}
            className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center ${
              searchType === "subject"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "bg-white text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800"
            }`}
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            Topic
          </button>
        </div>
        
        {/* Advanced Filters Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="ml-auto px-4 py-2 text-sm font-medium rounded-full bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 flex items-center shadow-sm hover:shadow"
        >
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
          </svg>
          <span className="cursor-pointer">Filters</span>
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
        <div className="mb-4 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 shadow-md animate-fadeIn transition-all duration-300">
          <h3 className="text-indigo-800 font-semibold mb-3 flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
            Refine Your Search
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="group">
              <label className="block text-sm font-medium text-indigo-700 mb-2 group-hover:text-indigo-900 transition-colors">
                <svg className="h-4 w-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                First Publication Year
              </label>
              <input
                type="number"
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                placeholder="e.g., 2020"
                className="text-gray-800 w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm hover:border-indigo-300 transition-all duration-300"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-medium text-indigo-700 mb-2 group-hover:text-indigo-900 transition-colors">
                <svg className="h-4 w-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                </svg>
                Language
              </label>
              <select
                name="language"
                value={filters.language}
                onChange={handleFilterChange}
                className="text-gray-800 w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm hover:border-indigo-300 transition-all duration-300 appearance-none"
                style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%234f46e5\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9l6 6 6-6\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center" }}
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
          <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${animateInput ? 'text-indigo-600 scale-110' : 'text-indigo-400'}`}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            className={`block w-full pl-12 pr-4 py-3 sm:py-4 border ${animateInput ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-indigo-200'} rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-indigo-300 focus:outline-none shadow-md hover:shadow-lg transition-all duration-300 text-base`}
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
          className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
        >
          <span className="mr-1">Search</span>
          <svg className="ml-1 h-5 w-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && query.trim() !== "" && (
        <div 
          className="absolute z-10 mt-2 w-full bg-white shadow-xl rounded-lg border border-indigo-200 max-h-72 overflow-y-auto animate-fadeIn"
        >
          {isLoading ? (
            <div className="p-4 text-center text-indigo-500">
              <div className="inline-block animate-spin h-5 w-5 border-t-2 border-b-2 border-indigo-500 rounded-full mr-2"></div>
              Loading suggestions...
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="divide-y divide-indigo-100">
              {suggestions.map((suggestion) => (
                <li 
                  key={suggestion.key}
                  className="px-4 py-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer text-indigo-700 transition-colors flex items-center"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center w-full">
                    {suggestion.type === "author" ? (
                      <div className="bg-indigo-100 p-2 rounded-full mr-3 flex-shrink-0">
                        <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                    ) : suggestion.type === "subject" ? (
                      <div className="bg-purple-100 p-2 rounded-full mr-3 flex-shrink-0">
                        <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                      </div>
                    ) : (
                      <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                      </div>
                    )}
                    <div className="flex flex-col flex-grow">
                      <span className="font-medium truncate">{suggestion.title}</span>
                      {suggestion.author && suggestion.type !== "author" && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          {suggestion.author}
                        </span>
                      )}
                      {suggestion.year && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          {suggestion.year}
                        </span>
                      )}
                    </div>
                    {suggestion.cover_i && (
                      <img 
                        src={`https://covers.openlibrary.org/b/id/${suggestion.cover_i}-S.jpg`}
                        alt={suggestion.title}
                        className="h-14 w-10 object-cover ml-auto rounded shadow-sm hover:shadow-md transition-shadow duration-300"
                        onError={(e) => {e.target.style.display = 'none'}}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center">
              <svg className="h-10 w-10 text-indigo-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-indigo-500 font-medium">No suggestions found</p>
              <p className="text-gray-500 text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
