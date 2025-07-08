import React from 'react';
import { motion } from 'framer-motion';
import { FileItem } from '../types';

interface VersionHistoryModalProps {
  file: FileItem;
  onClose: () => void;
}

const VersionHistoryModal = ({ file, onClose }: VersionHistoryModalProps) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white dark:bg-[#3c3c3c] rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[70vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Version history for "{file.name}"</h2>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <ul className="space-y-4">
            {file.versions?.map((version, index) => (
              <li key={version.id} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {new Date(version.date).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                  {index === 0 && <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">Current version</span>}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Modified by {version.author}</p>
              </li>
            ))}
            {!file.versions || file.versions.length === 0 && (
                <p className="text-gray-500">No version history available.</p>
            )}
          </ul>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end rounded-b-xl flex-shrink-0">
          <button
            onClick={onClose}
            className="bg-google-blue text-white font-semibold px-4 py-2 rounded-md hover:bg-google-blue-dark transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VersionHistoryModal;
