import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsIcon, MailIcon, PhotosIcon, PowerIcon } from '../constants';

interface StartMenuProps {
    onClose: () => void;
}

const StartMenu = ({ onClose }: StartMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [isPowerMenuOpen, setPowerMenuOpen] = useState(false);

    // Închide meniul Start la click în afara lui
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        // Timeout pentru a preveni închiderea instantanee de la click-ul care l-a deschis
        setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 0);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const apps = [
        { name: 'Mail', icon: <MailIcon className="w-8 h-8 text-white" />, color: 'bg-blue-500' },
        { name: 'Settings', icon: <SettingsIcon className="w-8 h-8 text-white" />, color: 'bg-gray-600' },
        { name: 'Photos', icon: <PhotosIcon className="w-8 h-8 text-white" />, color: 'bg-cyan-500' },
    ];
    
    return (
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute bottom-14 left-1/2 -translate-x-1/2 w-full max-w-lg bg-gray-200/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-lg shadow-2xl p-6 z-50"
        >
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                {apps.map(app => (
                    <button key={app.name} className="flex flex-col items-center justify-center p-2 space-y-2 rounded-md hover:bg-white/20">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${app.color}`}>
                            {app.icon}
                        </div>
                        <span className="text-xs text-gray-800 dark:text-gray-200">{app.name}</span>
                    </button>
                ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center font-bold text-white">U</div>
                     <span className="font-semibold text-gray-800 dark:text-gray-200">User</span>
                </div>
                <div className="relative">
                    <button onClick={() => setPowerMenuOpen(v => !v)} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 ring-offset-2 ring-gray-500 dark:ring-offset-gray-800">
                        <PowerIcon className="w-6 h-6 text-gray-700 dark:text-gray-300"/>
                    </button>
                    <AnimatePresence>
                    {isPowerMenuOpen && (
                        <motion.div 
                            initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.9}}
                            className="absolute bottom-full right-0 mb-2 w-40 bg-gray-100 dark:bg-gray-800 rounded-md shadow-lg py-1"
                        >
                            <button className="w-full text-left px-3 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700">Sleep</button>
                            <button className="w-full text-left px-3 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700">Shut down</button>
                            <button className="w-full text-left px-3 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700">Restart</button>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default StartMenu;
