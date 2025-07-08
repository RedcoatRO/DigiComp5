import React, { useMemo } from 'react';
import { FileItem } from '../types';

interface BreadcrumbsProps {
  currentFolderId: string | null;
  allFiles: FileItem[];
  onNavigate: (folderId: string | null) => void;
}

/**
 * Componenta Breadcrumbs afișează calea de navigare curentă
 * și permite revenirea la folderele părinte.
 */
const Breadcrumbs = ({ currentFolderId, allFiles, onNavigate }: BreadcrumbsProps) => {
  // Construiește calea de la rădăcină la folderul curent
  const path = useMemo(() => {
    const pathArray: FileItem[] = [];
    let currentId = currentFolderId;
    while (currentId) {
      const folder = allFiles.find(f => f.id === currentId);
      if (folder) {
        pathArray.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    return pathArray;
  }, [currentFolderId, allFiles]);

  return (
    <div className="flex items-center text-xl text-gray-800 dark:text-gray-100">
      <button
        onClick={() => onNavigate(null)}
        className="font-semibold hover:underline focus:underline focus:outline-none"
      >
        My Drive
      </button>
      {path.map(folder => (
        <React.Fragment key={folder.id}>
          <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
          <button
            onClick={() => onNavigate(folder.id)}
            className="font-semibold hover:underline focus:underline focus:outline-none"
          >
            {folder.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
