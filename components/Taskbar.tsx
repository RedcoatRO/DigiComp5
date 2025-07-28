import React from 'react';
import { motion } from 'framer-motion';
import { ChromeIcon, FileExplorerIcon, WindowsIcon, QuestionIcon, CheckCircleIcon } from '../constants';
import ThemeToggle from './ThemeToggle';
import Tooltip from './Tooltip';
import Clock from './Clock';

interface TaskbarProps {
  onChromeClick: () => void;
  isChromeOpen: boolean;
  onFileExplorerClick: () => void;
  isFileExplorerOpen: boolean;
  onStartMenuClick: () => void;
  score: number;
  maxScore: number;
  onCheckClick: () => void;
  onHintClick: () => void;
}

const Taskbar = ({ 
    onChromeClick, isChromeOpen, 
    onFileExplorerClick, isFileExplorerOpen, 
    onStartMenuClick,
    score, maxScore, onCheckClick, onHintClick
}: TaskbarProps) => (
  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-200/70 dark:bg-gray-900/70 backdrop-blur-xl flex justify-between items-center shadow-2xl transition-colors duration-300 px-4">
    
    {/* Partea stângă: Scor și Hint */}
    <div className="flex items-center space-x-4">
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            <span>SCOR: </span>
            <span className="font-bold">{score}/{maxScore}</span>
        </div>
        <Tooltip content="Ajutor">
            <button 
                onClick={onHintClick} 
                className="p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-windows-blue"
            >
                <QuestionIcon className="w-5 h-5" />
            </button>
        </Tooltip>
    </div>
    
    {/* Partea centrală: Iconițe aplicații */}
    <div className="absolute left-1/2 -translate-x-1/2 flex justify-center space-x-2">
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

    {/* Partea dreaptă: Buton verificare, Ceas, etc. */}
    <div className="flex justify-end items-center space-x-4">
      <button 
        onClick={onCheckClick} 
        className="flex items-center space-x-2 px-4 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 dark:focus-visible:ring-offset-gray-800 font-semibold"
      >
           <CheckCircleIcon className="w-5 h-5" />
           <span>Verifică-mă!</span>
       </button>
      <ThemeToggle />
      <Clock />
    </div>
  </div>
);

export default Taskbar;