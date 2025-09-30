// frontend/app/page.jsx
"use client";

import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import Loader from "../components/Loader";

const HomePage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const searchBooks = async (query) => {
        setLoading(true);
        setError("");
        setBooks([]);

        try {
            const res = await fetch(
                `http://localhost:5000/api/books?title=${encodeURIComponent(query)}`
            );
            const data = await res.json();

            if (data.docs && data.docs.length > 0) {
                setBooks(data.docs.slice(0, 20)); // Show first 20 results
            } else {
                setError("No results found.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <h1 className="text-4xl font-bold text-center mt-10">
                📚 Book Finder
            </h1>
            <SearchBar onSearch={searchBooks} />
            {loading && <Loader />}
            {error && <p className="text-center text-red-500 mt-6">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                {books.map((book) => (
                    <BookCard key={book.key} book={book} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;
