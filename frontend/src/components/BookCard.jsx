// frontend/components/BookCard.jsx
import React, { useState } from 'react';

const BookCard = ({ book }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { title, author_name, first_publish_year, subject, cover_i } = book;
  const coverUrl = cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg` : null;
  
  // Display up to 3 subjects
  const displaySubjects = subject ? subject.slice(0, 3) : [];
  const hasMoreSubjects = subject && subject.length > 3;

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.03] transform h-full border border-indigo-100 hover:border-indigo-300 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle glow effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 opacity-0 transition-opacity duration-300 rounded-xl ${isHovered ? 'opacity-100' : ''}`}></div>
      
      <div className="pt-[120%] relative">
        {coverUrl && !imageError ? (
          <img
            src={coverUrl}
            alt={`Cover for ${title}`}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 ease-in-out"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-200 to-purple-300">
            <div className="relative">
              <span className="text-7xl">📚</span>
              <div className={`absolute inset-0 bg-white/20 rounded-full blur-xl transition-opacity duration-1000 ${isHovered ? 'animate-pulse opacity-70' : 'opacity-0'}`}></div>
            </div>
          </div>
        )}
        
        {/* Ribbon for publication year */}
        {first_publish_year && (
          <div className="absolute top-3 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-l-full shadow-lg transform -translate-y-1/2 backdrop-blur-sm">
            <span className="drop-shadow-sm">{first_publish_year}</span>
          </div>
        )}
      </div>
      
      <div className="p-5 sm:p-6 relative">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2.5 line-clamp-2 group-hover:text-indigo-700 transition-colors">{title}</h3>
        
        {author_name && author_name.length > 0 && (
          <div className="flex items-center text-sm text-gray-600 mb-3.5">
            <svg className="h-4 w-4 text-indigo-500 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span className="line-clamp-1 font-medium">{author_name.join(', ')}</span>
          </div>
        )}
        
        {displaySubjects.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {displaySubjects.map((subject, index) => (
                <span 
                  key={index} 
                  className="inline-block bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-800 text-xs px-3 py-1.5 rounded-full border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 hover:shadow-md"
                >
                  {subject}
                </span>
              ))}
              {hasMoreSubjects && (
                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-3 py-1.5 rounded-full hover:bg-gray-200 transition-all duration-300 hover:shadow-md">
                  +{subject.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Decorative element */}
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-indigo-100/40 to-transparent rounded-tl-full -mb-6 -mr-6 opacity-0 transition-opacity duration-300" style={{ opacity: isHovered ? 0.7 : 0 }}></div>
      </div>
    </div>
  );
};

export default BookCard;
