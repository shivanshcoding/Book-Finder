// frontend/components/BookCard.jsx
import React from "react";

const BookCard = ({ book }) => {
  // Construct cover image URL if cover_i exists
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "https://via.placeholder.com/150x200?text=No+Cover";

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={coverUrl}
        alt={book.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h2 className="font-bold text-lg mb-1">{book.title}</h2>
        <p className="text-gray-700 mb-1">
          Author: {book.author_name ? book.author_name.join(", ") : "Unknown"}
        </p>
        <p className="text-gray-500">
          First Published: {book.first_publish_year || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
