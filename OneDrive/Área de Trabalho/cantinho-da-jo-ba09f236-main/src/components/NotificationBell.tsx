
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { appointments } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: 'appointment' | 'message' | 'system';
}

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Check for upcoming appointments and generate notifications
  useEffect(() => {
    if (!currentUser) return;

    // Generate notifications from upcoming appointments
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    const upcomingAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const appointmentDateString = appointmentDate.toISOString().split('T')[0];
      return appointmentDateString === todayString;
    });
    
    // Create notifications for today's appointments
    const newNotifications = upcomingAppointments.map(appointment => ({
      id: `notification-${appointment.id}`,
      title: 'Agendamento hoje',
      message: `${appointment.clientName} - ${appointment.serviceName} às ${new Date(appointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      date: new Date(),
      read: false,
      type: 'appointment' as const
    }));
    
    if (newNotifications.length > 0) {
      setNotifications(prev => {
        // Filter out duplicates
        const existingIds = prev.map(n => n.id);
        const uniqueNewNotifications = newNotifications.filter(n => !existingIds.includes(n.id));
        
        if (uniqueNewNotifications.length > 0) {
          toast({
            title: 'Novos agendamentos hoje',
            description: `Você tem ${uniqueNewNotifications.length} agendamento(s) para hoje.`
          });
        }
        
        return [...uniqueNewNotifications, ...prev];
      });
    }
  }, [currentUser]);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleNotifications}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-1 -right-1 bg-beauty-purple text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${isMobile ? 'right-[-100px]' : 'right-0'} z-50 mt-2 ${isMobile ? 'w-72' : 'w-80'} overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
          >
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Notificações</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-beauty-purple hover:text-beauty-dark-purple"
                  >
                    Marcar todas como lidas
                  </Button>
                )}
              </div>
            </div>

            <div className={`${isMobile ? 'max-h-72' : 'max-h-96'} overflow-y-auto`}>
              {notifications.length > 0 ? (
                <div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-beauty-soft-purple/30' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.date).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Nenhuma notificação
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
