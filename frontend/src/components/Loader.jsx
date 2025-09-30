// frontend/components/Loader.jsx
import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16">
      <div className="relative">
        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
        <div className="absolute top-0 left-0 h-16 w-16 sm:h-20 sm:w-20 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin opacity-70" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="mt-5 text-indigo-600 font-medium text-lg sm:text-xl">Loading books...</p>
      <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
    </div>
  );
};

export default Loader;
