import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import { Toast, ToastType } from '../types';

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
  toasts: Toast[];
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

/**
 * Provider-ul pentru sistemul de notificări (Toast).
 * Gestionează starea globală a notificărilor.
 */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Funcție pentru a adăuga o notificare nouă.
  // Folosim useCallback pentru a o memora și a preveni re-randări inutile.
  const addToast = useCallback((message: string, type: ToastType) => {
    const id = toastId++;
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  }, []);
  
  // Funcție pentru a elimina o notificare.
  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, toasts, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

/**
 * Hook custom pentru a accesa cu ușurință contextul Toast.
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
