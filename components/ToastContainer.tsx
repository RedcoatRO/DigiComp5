import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';
import ToastComponent from './Toast';

/**
 * Containerul care afișează toate notificările Toast active.
 * Se poziționează în colțul din dreapta jos al ecranului.
 */
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-14 right-4 z-[100] w-80 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
