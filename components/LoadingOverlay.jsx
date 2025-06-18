import React from 'react';

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-orange-500 border-gray-200"></div>
        <p className="text-gray-600 font-medium">Loading product...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay; 