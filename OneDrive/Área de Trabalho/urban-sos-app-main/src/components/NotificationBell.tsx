
import React, { useState } from 'react';
import { Bell, BellDot } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNotifications, Notification } from '@/contexts/NotificationContext';

const NotificationItem = ({ notification, onRead }: { notification: Notification, onRead: () => void }) => {
  return (
    <div 
      className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
        notification.read ? 'opacity-70' : 'bg-blue-50/50 dark:bg-blue-900/10'
      }`}
      onClick={onRead}
    >
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-medium">{notification.title}</h4>
        {!notification.read && (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Nova</Badge>
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
        {format(new Date(notification.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
      </p>
    </div>
  );
};

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <>
              <BellDot className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                {unreadCount}
              </Badge>
            </>
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-3 flex justify-between items-center">
          <h3 className="font-semibold">Notificações</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div>
              {notifications
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((notification) => (
                  <React.Fragment key={notification.id}>
                    <NotificationItem 
                      notification={notification} 
                      onRead={() => handleMarkAsRead(notification.id)} 
                    />
                    <Separator />
                  </React.Fragment>
                ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>Nenhuma notificação no momento</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
