import React from 'react';
import { motion } from 'framer-motion';
import { ChromeIcon, FileExplorerIcon, WindowsIcon } from '../constants';
import ThemeToggle from './ThemeToggle';
import Tooltip from './Tooltip';
import Clock from './Clock';

interface TaskbarProps {
  onChromeClick: () => void;
  isChromeOpen: boolean;
  onFileExplorerClick: () => void;
  isFileExplorerOpen: boolean;
  onStartMenuClick: () => void;
}

const Taskbar = ({ onChromeClick, isChromeOpen, onFileExplorerClick, isFileExplorerOpen, onStartMenuClick }: TaskbarProps) => (
  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-200/70 dark:bg-gray-900/70 backdrop-blur-xl flex justify-between items-center shadow-2xl transition-colors duration-300 px-4">
    <div className="flex-1"></div>
    <div className="flex-1 flex justify-center space-x-2">
      <Tooltip content="Start">
        <motion.button 
          onClick={onStartMenuClick}
          className="p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-blue-600 dark:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-windows-blue"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <WindowsIcon className="w-6 h-6" />
        </motion.button>
      </Tooltip>
      <Tooltip content="Google Chrome">
        <motion.button 
          onClick={onChromeClick} 
          className="relative p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-windows-blue"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChromeIcon className="w-8 h-8" />
          {isChromeOpen && (
            <motion.div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-windows-blue rounded-t-sm"
            ></motion.div>
          )}
        </motion.button>
      </Tooltip>
      <Tooltip content="File Explorer">
        <motion.button 
          onClick={onFileExplorerClick}
          className="relative p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-windows-blue"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FileExplorerIcon className="w-8 h-8" />
           {isFileExplorerOpen && (
            <motion.div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-windows-blue rounded-t-sm"
            ></motion.div>
          )}
        </motion.button>
      </Tooltip>
    </div>
    <div className="flex-1 flex justify-end items-center space-x-4">
      <ThemeToggle />
      <Clock />
    </div>
  </div>
);

export default Taskbar;