// frontend/components/BookCard.jsx
import React from "react";

const BookCard = ({ book }) => {
  // Construct cover image URL if cover_i exists
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "https://via.placeholder.com/150x200?text=No+Cover";

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col transform hover:-translate-y-1">
      <div className="relative overflow-hidden bg-gray-100 pt-[70%]">
        <img
          src={coverUrl}
          alt={book.title}
          className="absolute top-0 left-0 w-full h-full object-cover object-center"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/150x200?text=No+Cover";
          }}
        />
        {book.first_publish_year && (
          <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {book.first_publish_year}
          </span>
        )}
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h2 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">{book.title}</h2>
        <p className="text-gray-600 mb-2 text-sm flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
          </svg>
          {book.author_name ? (
            <span className="line-clamp-1">{book.author_name.join(", ")}</span>
          ) : (
            <span className="italic text-gray-400">Unknown author</span>
          )}
        </p>
        
        {book.subject && book.subject.length > 0 && (
          <div className="mt-auto pt-3">
            <div className="flex flex-wrap gap-1">
              {book.subject.slice(0, 3).map((subject, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full truncate max-w-[120px]">
                  {subject}
                </span>
              ))}
              {book.subject.length > 3 && (
                <span className="text-xs text-gray-400">+{book.subject.length - 3} more</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
