import React from 'react';

/**
 * O componentă care afișează un placeholder animat (schelet).
 * Este folosită pentru a simula încărcarea conținutului.
 */
const SkeletonLoader = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Skeleton pentru previzualizare */}
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
      
      {/* Skeleton pentru titlu */}
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>

      {/* Skeleton pentru detalii */}
      <div className="space-y-3 mt-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>

      {/* Skeleton pentru buton */}
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md mt-4"></div>
    </div>
  );
};

export default SkeletonLoader;
