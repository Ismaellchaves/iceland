
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const loadNotifications = () => {
    if (!user) return;
    
    try {
      // Carregar notificações do localStorage
      const storedNotifications = localStorage.getItem('notifications');
      if (storedNotifications) {
        const allNotifications = JSON.parse(storedNotifications);
        const userNotifications = allNotifications.filter(
          (notif: Notification) => notif.userId === user.id
        );
        setNotifications(userNotifications);
        setUnreadCount(userNotifications.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const saveNotifications = (updatedNotifications: Notification[]) => {
    try {
      // Obter todas as notificações existentes
      const storedNotifications = localStorage.getItem('notifications');
      let allNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
      
      // Filtrar para remover as notificações do usuário atual
      if (user) {
        allNotifications = allNotifications.filter(
          (notif: Notification) => notif.userId !== user.id
        );
      }
      
      // Adicionar as notificações atualizadas do usuário
      const combinedNotifications = [...allNotifications, ...updatedNotifications];
      localStorage.setItem('notifications', JSON.stringify(combinedNotifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    if (!user) return;
    
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedNotifications = [...notifications, newNotification];
    setNotifications(updatedNotifications);
    setUnreadCount(prevCount => prevCount + 1);
    saveNotifications(updatedNotifications);
    
    // Mostrar toast para notificação nova
    toast({
      title: newNotification.title,
      description: newNotification.message,
    });
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    );
    
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    saveNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    saveNotifications(updatedNotifications);
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        addNotification, 
        markAsRead, 
        markAllAsRead 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
