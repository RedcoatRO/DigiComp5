import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toast } from '../types';
import { MailIcon } from '../constants'; // Importăm noua iconiță

interface ToastProps {
  toast: Toast;
  onClose: () => void;
}

const icons = {
  success: <span className="text-xl">✓</span>,
  info: <span className="text-xl">ℹ</span>,
  warning: <span className="text-xl">⚠</span>,
  error: <span className="text-xl">✖</span>,
  // Adăugăm iconița pentru email
  mail: <MailIcon className="w-5 h-5" />,
};

const colors = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    // Adăugăm culoarea pentru email
    mail: 'bg-gray-800 dark:bg-gray-600',
}

/**
 * Componenta pentru o singură notificare Toast.
 * Se închide automat după 5 secunde.
 */
const ToastComponent = ({ toast, onClose }: ToastProps) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Se închide automat după 5 secunde

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`relative flex items-center w-full p-4 text-white rounded-lg shadow-lg ${colors[toast.type]}`}
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3">
        {icons[toast.type]}
      </div>
      <div className="text-sm font-normal">{toast.message}</div>
      <button 
        onClick={onClose}
        className="absolute top-1 right-1 p-1 rounded-full hover:bg-black/20"
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
      </button>
    </motion.div>
  );
};

export default ToastComponent;