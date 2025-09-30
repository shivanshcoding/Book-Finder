// frontend/components/BookCard.jsx
import React, { useState } from 'react';

const BookCard = ({ book }) => {
  const [imageError, setImageError] = useState(false);
  const { title, author_name, first_publish_year, subject, cover_i } = book;
  const coverUrl = cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg` : null;
  
  // Display up to 3 subjects
  const displaySubjects = subject ? subject.slice(0, 3) : [];
  const hasMoreSubjects = subject && subject.length > 3;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] transform h-full border border-indigo-100">
      <div className="pt-[120%] relative">
        {coverUrl && !imageError ? (
          <img
            src={coverUrl}
            alt={`Cover for ${title}`}
            className="absolute top-0 left-0 w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-200 to-purple-200">
            <span className="text-7xl animate-pulse">📚</span>
          </div>
        )}
        {first_publish_year && (
          <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            {first_publish_year}
          </div>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-700 transition-colors">{title}</h3>
        {author_name && author_name.length > 0 && (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <svg className="h-4 w-4 text-indigo-400 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span className="line-clamp-1">{author_name.join(', ')}</span>
          </div>
        )}
        {displaySubjects.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1.5">
              {displaySubjects.map((subject, index) => (
                <span key={index} className="inline-block bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-800 text-xs px-2.5 py-1 rounded-full border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-colors">
                  {subject}
                </span>
              ))}
              {hasMoreSubjects && (
                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full hover:bg-gray-200 transition-colors">
                  +{subject.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
