// frontend/app/page.jsx
"use client";

import React, { useState } from "react";
import Head from "next/head";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import Loader from "../components/Loader";

const HomePage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchParams, setSearchParams] = useState({
        query: "",
        type: "title",
        filters: {}
    });
    const [searchHistory, setSearchHistory] = useState([]);
    const [popularCategories, setPopularCategories] = useState([
        { name: "Fiction", query: "fiction", type: "subject" },
        { name: "Science", query: "science", type: "subject" },
        { name: "History", query: "history", type: "subject" },
        { name: "Fantasy", query: "fantasy", type: "subject" },
        { name: "Biography", query: "biography", type: "subject" },
        { name: "Self-Help", query: "self-help", type: "subject" }
    ]);

    // Load search history from localStorage on component mount
    React.useEffect(() => {
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {
            try {
                setSearchHistory(JSON.parse(savedHistory).slice(0, 5));
            } catch (e) {
                console.error("Error loading search history:", e);
            }
        }
    }, []);

    const searchBooks = async (searchData) => {
        setLoading(true);
        setError("");
        setBooks([]);
        setSearchParams(searchData);

        try {
            // Build the API URL based on search type
            let apiUrl = 'http://localhost:5000/api/books?';
            
            switch(searchData.type) {
                case "author":
                    apiUrl += `author=${encodeURIComponent(searchData.query)}`;
                    break;
                case "subject":
                    apiUrl += `subject=${encodeURIComponent(searchData.query)}`;
                    break;
                case "isbn":
                    apiUrl += `isbn=${encodeURIComponent(searchData.query)}`;
                    break;
                case "title":
                default:
                    apiUrl += `title=${encodeURIComponent(searchData.query)}`;
            }
            
            // Add filters if they exist
            if (searchData.filters) {
                if (searchData.filters.year) {
                    apiUrl += `&year=${searchData.filters.year}`;
                }
                if (searchData.filters.language) {
                    apiUrl += `&language=${searchData.filters.language}`;
                }
            }
            
            const res = await fetch(apiUrl);
            const data = await res.json();

            if (data.docs && data.docs.length > 0) {
                setBooks(data.docs.slice(0, 20)); // Show first 20 results
                
                // Save to search history
                const newSearch = {
                    query: searchData.query,
                    type: searchData.type,
                    timestamp: new Date().toISOString()
                };
                
                const updatedHistory = [newSearch, ...searchHistory.filter(item => 
                    item.query !== searchData.query || item.type !== searchData.type
                )].slice(0, 5);
                
                setSearchHistory(updatedHistory);
                localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
            } else {
                setError("No results found. Try a different search term.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <Head>
                <title>Book Finder - Search for your favorite books</title>
                <meta name="description" content="Find books by title, author, or subject using the Open Library API" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
                {/* Header with gradient and shadow */}
                <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md py-4 sm:py-6 mb-4 sm:mb-8 sticky top-0 z-10">
                    <div className="container mx-auto px-4 sm:px-6">
                        <h1 className="text-3xl md:text-5xl font-bold text-center text-white tracking-tight">
                            📚 Book Finder
                        </h1>
                        <p className="text-center text-indigo-100 mt-2 sm:mt-3 text-base sm:text-lg max-w-2xl mx-auto">
                            Search for books and discover your next great read
                        </p>
                    </div>
                </header>
                
                <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-7xl flex-grow">
                    {/* Search section with card-like appearance */}
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-10 transition-all duration-300 hover:shadow-xl border border-indigo-100">
                        <SearchBar onSearch={searchBooks} />
                    </div>
                    
                    {/* Loading state */}
                    {loading && <Loader />}
                    
                    {/* Error message */}
                    {error && (
                        <div className="text-center mt-4 sm:mt-8 mb-4 sm:mb-6 max-w-2xl mx-auto">
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-lg flex items-center justify-center shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        </div>
                    )}
                    
                    {/* Results section */}
                    {books.length > 0 && (
                        <div className="mb-6 sm:mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-indigo-200 pb-3 sm:pb-4 mb-4 sm:mb-6 gap-2">
                                <h2 className="text-lg sm:text-xl font-semibold text-indigo-800">
                                    Found {books.length} results for "{searchParams.query}"
                                </h2>
                                <span className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full inline-block shadow-sm border border-indigo-100">Showing top {books.length} matches</span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                                {books.map((book) => (
                                    book.cover_i? <BookCard key={book.key} book={book} /> : null
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Empty state when no search has been performed */}
                    {!loading && !error && books.length === 0 && !searchParams.query && (
                        <div className="text-center py-8 sm:py-16 bg-white rounded-xl shadow-md border border-indigo-100 max-w-4xl mx-auto">
                            <div className="text-6xl sm:text-7xl mb-3 sm:mb-4">🔍</div>
                            <h3 className="text-lg sm:text-xl font-medium text-indigo-800 mb-2">Start your book search</h3>
                            <p className="text-indigo-600 max-w-md mx-auto text-sm sm:text-base mb-8">
                                Enter a book title, author, or subject in the search bar above to discover your next favorite read
                            </p>
                            
                            {/* Popular Categories */}
                            <div className="mb-8">
                                <h4 className="text-md font-medium text-indigo-800 mb-3">Popular Categories</h4>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {popularCategories.map((category, index) => (
                                        <button
                                            key={index}
                                            onClick={() => searchBooks({
                                                query: category.query,
                                                type: category.type,
                                                filters: {}
                                            })}
                                            className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full text-sm transition-all duration-300"
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Search History */}
                            {searchHistory.length > 0 && (
                                <div>
                                    <h4 className="text-md font-medium text-indigo-800 mb-3">Recent Searches</h4>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {searchHistory.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => searchBooks({
                                                    query: item.query,
                                                    type: item.type,
                                                    filters: {}
                                                })}
                                                className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm transition-all duration-300 flex items-center"
                                            >
                                                <span>{item.query}</span>
                                                <span className="ml-2 bg-purple-200 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                                                    {item.type}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
                
                {/* Footer */}
                <footer className="bg-gradient-to-r from-indigo-600 to-purple-600 mt-8 sm:mt-16 py-6 sm:py-8 text-white">
                    <div className="container mx-auto px-4 sm:px-6 text-center text-sm">
                        <p>© {new Date().getFullYear()} Book Finder. Powered by Open Library API.</p>
                    </div>
                </footer>
            </div>
    );
};

export default HomePage;
