import React from 'react';
import { motion } from 'framer-motion';
import { WALLPAPERS } from '../constants';
import { Wallpaper } from '../types';

interface WallpaperSettingsModalProps {
  onClose: () => void;
  onSelectWallpaper: (url: string) => void;
  currentWallpaper: string;
}

/**
 * Modal pentru schimbarea imaginii de fundal a desktop-ului.
 * Afișează o galerie de imagini predefinite și are stiluri de focus.
 */
const WallpaperSettingsModal = ({ onClose, onSelectWallpaper, currentWallpaper }: WallpaperSettingsModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl w-full max-w-3xl p-6"
        onClick={e => e.stopPropagation()} // Previne închiderea la click în interior
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Personalize Background</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {WALLPAPERS.map(wallpaper => (
            <button
              key={wallpaper.id} 
              className="cursor-pointer group rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-google-blue dark:focus-visible:ring-offset-gray-800"
              onClick={() => onSelectWallpaper(wallpaper.url)}
            >
              <img 
                src={wallpaper.url} 
                alt={wallpaper.name} 
                className={`w-full h-24 object-cover rounded-md transition-all duration-200 ${
                  currentWallpaper === wallpaper.url ? 'ring-4 ring-offset-2 ring-google-blue dark:ring-offset-gray-800' : 'group-hover:scale-105'
                }`}
              />
              <p className="text-center text-sm mt-2 text-gray-700 dark:text-gray-300">{wallpaper.name}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-google-blue dark:focus-visible:ring-offset-gray-800"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default WallpaperSettingsModal;