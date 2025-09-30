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
    const [searchQuery, setSearchQuery] = useState("");

    const searchBooks = async (query) => {
        setLoading(true);
        setError("");
        setBooks([]);
        setSearchQuery(query);

        try {
            const res = await fetch(
                `http://localhost:5000/api/books?title=${encodeURIComponent(query)}`
            );
            const data = await res.json();

            if (data.docs && data.docs.length > 0) {
                setBooks(data.docs.slice(0, 20)); // Show first 20 results
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
                                    Found {books.length} results for "{searchQuery}"
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
                    {!loading && !error && books.length === 0 && !searchQuery && (
                        <div className="text-center py-8 sm:py-16 bg-white rounded-xl shadow-md border border-indigo-100 max-w-2xl mx-auto">
                            <div className="text-6xl sm:text-7xl mb-3 sm:mb-4">🔍</div>
                            <h3 className="text-lg sm:text-xl font-medium text-indigo-800 mb-2">Start your book search</h3>
                            <p className="text-indigo-600 max-w-md mx-auto text-sm sm:text-base">
                                Enter a book title in the search bar above to discover your next favorite read
                            </p>
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
