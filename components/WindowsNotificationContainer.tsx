import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWindowsNotification } from '../contexts/WindowsNotificationContext';
import WindowsNotification from './WindowsNotification';

/**
 * Containerul care afișează toate notificările simulate de Windows.
 * Se poziționează în colțul din dreapta jos al ecranului.
 */
const WindowsNotificationContainer = () => {
  const { notifications, removeNotification } = useWindowsNotification();

  return (
    <div className="fixed bottom-14 right-4 z-[100] w-96 space-y-3">
      <AnimatePresence>
        {notifications.map(notification => (
          <WindowsNotification
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default WindowsNotificationContainer;
