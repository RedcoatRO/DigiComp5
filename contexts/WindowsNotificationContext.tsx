import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import { WindowsNotificationType } from '../types';

interface WindowsNotificationContextType {
  addNotification: (notification: Omit<WindowsNotificationType, 'id'>) => void;
  notifications: WindowsNotificationType[];
  removeNotification: (id: number) => void;
}

const WindowsNotificationContext = createContext<WindowsNotificationContextType | undefined>(undefined);

let notificationId = 0;

/**
 * Provider-ul pentru sistemul de notificări simulate de Windows.
 */
export const WindowsNotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<WindowsNotificationType[]>([]);

  const addNotification = useCallback((notification: Omit<WindowsNotificationType, 'id'>) => {
    const id = notificationId++;
    setNotifications(prev => [...prev, { id, ...notification }]);
  }, []);
  
  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <WindowsNotificationContext.Provider value={{ addNotification, notifications, removeNotification }}>
      {children}
    </WindowsNotificationContext.Provider>
  );
};

/**
 * Hook custom pentru a accesa contextul de notificări Windows.
 */
export const useWindowsNotification = () => {
  const context = useContext(WindowsNotificationContext);
  if (context === undefined) {
    throw new Error('useWindowsNotification must be used within a WindowsNotificationProvider');
  }
  return context;
};
