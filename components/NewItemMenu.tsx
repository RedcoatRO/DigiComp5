import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadIcon, NewFolderIcon } from '../constants';

interface NewItemMenuProps {
    onFileUploadClick: () => void;
    onNewFolderClick: () => void;
}

/**
 * Componenta pentru meniul "New" din Google Drive.
 * Afișează un dropdown cu opțiuni pentru a crea conținut nou.
 */
const NewItemMenu = ({ onFileUploadClick, onNewFolderClick }: NewItemMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Închide meniul dacă se dă click în afara lui
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOptionClick = (action: () => void) => {
        action();
        setIsOpen(false);
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-32 px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full shadow-md hover:shadow-lg transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-google-blue dark:focus-visible:ring-offset-gray-800"
            >
                <span className="text-2xl mr-2">+</span>
                <span className="font-semibold">New</span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 w-56 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-30"
                    >
                        <button onClick={() => handleOptionClick(onNewFolderClick)} className="flex items-center w-full px-4 py-2 text-left text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <NewFolderIcon className="w-5 h-5 mr-3" />
                            <span>New Folder</span>
                        </button>
                         <button onClick={() => handleOptionClick(onFileUploadClick)} className="flex items-center w-full px-4 py-2 text-left text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <UploadIcon className="w-5 h-5 mr-3" />
                            <span>File Upload</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NewItemMenu;
