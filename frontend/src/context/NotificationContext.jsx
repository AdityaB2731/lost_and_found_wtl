import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getNotifications, markNotificationAsRead } from '../api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

const buildNotification = (message) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  message,
  createdAt: new Date().toISOString(),
  read: false,
});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user, isSignedIn, getToken } = useAuth();
  
  const fetchNotifications = useCallback(async () => {
    if (isSignedIn) {
      try {
        const response = await getNotifications(getToken);
        setNotifications(response.data.map(n => ({
          id: n._id,
          message: n.message,
          createdAt: n.createdAt,
          read: n.isRead
        })));
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    }
  }, [getToken, isSignedIn, user?.email]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const addNotification = useCallback((message) => {
    // Local addition still possible for immediate feedback
    setNotifications((current) => [{ id: Date.now(), message, createdAt: new Date().toISOString(), read: false }, ...current].slice(0, 20));
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((current) => current.map((entry) => ({ ...entry, read: true })));
    // Sync with backend individual notifications if needed, 
    // or just mark the ones that aren't read yet
    for (const n of notifications) {
      if (!n.read) {
        try { await markNotificationAsRead(n.id); } catch (e) {}
      }
    }
  }, [notifications]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((entry) => !entry.read).length;

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAllRead,
      clearNotifications,
    }),
    [notifications, unreadCount, addNotification, markAllRead, clearNotifications],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }

  return context;
};
