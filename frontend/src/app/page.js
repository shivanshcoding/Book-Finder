// frontend/app/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import Loader from "../components/Loader";
import SearchHistorySidebar from "../components/SearchHistorySidebar";

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
    useEffect(() => {
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {
            try {
                setSearchHistory(JSON.parse(savedHistory));
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

            switch (searchData.type) {
                case "author":
                    apiUrl += `author=${encodeURIComponent(searchData.query)}`;
                    break;
                case "subject":
                    apiUrl += `subject=${encodeURIComponent(searchData.query)}`;
                    break;
                case "isbn":
                    apiUrl += `isbn=${encodeURIComponent(searchData.query)}`;
                    break;
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

                // Save to search history with more details
                const newSearch = {
                    query: searchData.query,
                    type: searchData.type,
                    timestamp: new Date().toISOString(),
                    filters: searchData.filters || {},
                    resultCount: data.docs.length
                };

                const updatedHistory = [newSearch, ...searchHistory.filter(item =>
                    item.query !== searchData.query || item.type !== searchData.type
                )];

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

    // Handle selecting a search from history
    const handleSelectHistory = (historyItem) => {
        searchBooks({
            query: historyItem.query,
            type: historyItem.type,
            filters: {}
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-gradient-x">
            {/* Search History Sidebar */}
            <SearchHistorySidebar
                searchHistory={searchHistory}
                onSelectHistory={handleSelectHistory}
                setSearchHistory={setSearchHistory}
            />
            <Head>
                <title>Book Finder - Search for your favorite books</title>
                <meta name="description" content="Find books by title, author, or subject using the Open Library API" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            {/* Header with gradient and shadow */}
            <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 shadow-lg py-5 sm:py-3 mb-6  sticky top-0 z-10 backdrop-blur-sm bg-opacity-95">
                <div className="container mx-auto px-4 sm:px-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-center text-white tracking-tight drop-shadow-md animate-fadeIn">
                        <span className="inline-block transform hover:scale-105 transition-transform duration-300 text-shadow-black-md">📚</span> Book Finder
                    </h1>
                    <p className="text-center text-indigo-100 text-base sm:text-lg max-w-2xl mx-auto opacity-95">
                        Search for books and discover your next great read
                    </p>
                </div>
            </header>



            <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-7xl flex-grow">
                {/* Search section with card-like appearance */}
                <div className="bg-white rounded-xl shadow-lg p-5 sm:p-7 mb-8 sm:mb-12 transition-all duration-300 hover:shadow-xl border border-indigo-100 animate-fadeIn">
                    <SearchBar onSearch={searchBooks} />
                </div>

                {/* Loading state */}
                {loading && <Loader />}

                {/* Error message */}
                {error && (
                    <div className="text-center mt-4 sm:mt-8 mb-4 sm:mb-6 max-w-2xl mx-auto animate-fadeIn">
                        <div className="bg-red-50 border border-red-200 text-red-700 px-5 sm:px-7 py-4 sm:py-5 rounded-lg flex items-center justify-center shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    </div>
                )}

                {/* Results section */}
                {books.length > 0 && (
                    <div className="mb-8 sm:mb-10 animate-fadeIn">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-indigo-200 pb-4 sm:pb-5 mb-6 sm:mb-8 gap-3">
                            <h2 className="text-xl sm:text-2xl font-semibold text-indigo-800 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Found {books.length} results for "{searchParams.query}"
                            </h2>
                            <span className="text-sm text-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-1.5 rounded-full inline-block shadow-md border border-indigo-100">
                                Showing top {books.length} matches
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                            {books.map((book, index) => (
                                <div key={book.key} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                                    <BookCard book={book} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty state when no search has been performed */}
                {!loading && !error && books.length === 0 && !searchParams.query && (
                    <div className="text-center py-4 sm:py-4 bg-white rounded-xl shadow-lg border border-indigo-100 max-w-10xl mx-auto animate-fadeIn">
                        {/* Popular Categories */}
                        <div className="mb-10">
                            <h4 className="text-lg font-medium text-indigo-800 mb-2 flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                </svg>
                                Popular Categories
                            </h4>
                            <div className="flex flex-wrap justify-center gap-3">
                                {popularCategories.map((category, index) => (
                                    <button
                                        key={index}
                                        onClick={() => searchBooks({
                                            query: category.query,
                                            type: category.type,
                                            filters: {}
                                        })}
                                        className="cursor-pointer px-5 py-2.5 bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 text-indigo-700 rounded-full text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="text-7xl sm:text-8xl mb-4 sm:mb-6 animate-float">🔍</div>
                        <h3 className="text-xl sm:text-2xl font-medium text-indigo-800 mb-3">Start your book search</h3>
                        <p className="text-indigo-600 mx-auto text-base sm:text-lg px-4">
                            Enter a book title, author, or subject in the search bar above to discover your next favorite read
                        </p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 mt-4 sm:mt-20 py-5 sm:py-5 text-white shadow-inner">
                <div className="container mx-auto px-4 sm:px-3 text-center">
                    <p className="text-sm sm:text-base opacity-90">© {new Date().getFullYear()} Book Finder. Powered by Open Library API.</p>
                    <p className="text-xs text-indigo-200 mt-2">Find your next favorite book with ease.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
