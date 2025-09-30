// frontend/components/Loader.jsx
import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center py-10">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 absolute top-0 left-0"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading books...</p>
    </div>
  );
};

export default Loader;
