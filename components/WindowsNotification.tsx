import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { WindowsNotificationType } from '../types';

interface WindowsNotificationProps {
  notification: WindowsNotificationType;
  onClose: () => void;
}

/**
 * Componenta pentru o singură notificare simulată de Windows.
 * Se închide automat după 8 secunde.
 */
const WindowsNotification = ({ notification, onClose }: WindowsNotificationProps) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 8000); // Se închide automat după 8 secunde

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100, transition: { duration: 0.3 } }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="relative w-full p-4 text-white rounded-lg shadow-2xl bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm border border-white/10"
    >
        <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                {notification.icon}
            </div>
            <div className="flex-grow">
                <p className="text-sm font-semibold text-gray-100">{notification.title}</p>
                <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
            </div>
            <button 
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-white/20 hover:text-white"
                aria-label="Close"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
            </button>
        </div>
    </motion.div>
  );
};

export default WindowsNotification;
