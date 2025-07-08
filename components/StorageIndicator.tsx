import React, { useMemo } from 'react';
import { FileItem } from '../types';

interface StorageIndicatorProps {
  files: FileItem[];
}

// Funcție ajutătoare pentru a formata octeții într-un format lizibil (KB, MB, GB)
const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Afișează spațiul de stocare utilizat și o bară de progres.
 */
const StorageIndicator = ({ files }: StorageIndicatorProps) => {
  const totalStorage = 15 * 1024 * 1024 * 1024; // 15 GB in bytes

  // Calculează spațiul total utilizat de fișiere (nu cele din coș)
  const usedStorage = useMemo(() => {
    return files.reduce((acc, file) => acc + (file.isInTrash ? 0 : file.size), 0);
  }, [files]);

  const usagePercentage = (usedStorage / totalStorage) * 100;

  return (
    <div className="p-2 space-y-2 text-sm">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
        <div 
          className="bg-google-blue h-1.5 rounded-full" 
          style={{ width: `${usagePercentage}%` }}
        />
      </div>
      <p className="text-gray-600 dark:text-gray-400">
        {formatBytes(usedStorage)} of {formatBytes(totalStorage, 0)} used
      </p>
    </div>
  );
};

export default StorageIndicator;