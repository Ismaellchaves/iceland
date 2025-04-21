
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { sendMessage } from '@/services/messageService';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from '@/components/ui/use-toast';

interface MessageDialogProps {
  open: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  reportId?: string;
}

const MessageDialog = ({
  open,
  onClose,
  recipientId,
  recipientName,
  reportId,
}: MessageDialogProps) => {
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const handleSendMessage = () => {
    if (!message.trim() || !user) {
      toast({
        title: "Erro",
        description: "Por favor, escreva uma mensagem antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    // Criar e salvar a mensagem
    const newMessage = sendMessage({
      reportId: reportId || "",
      senderId: user.id,
      recipientId,
      content: message,
      read: false,
    });

    // Criar notificação para o destinatário
    addNotification({
      userId: recipientId,
      title: `Nova mensagem de ${user.name || user.email}`,
      message: message.length > 50 ? `${message.substring(0, 50)}...` : message,
      read: false
    });

    toast({
      title: "Mensagem enviada",
      description: `Sua mensagem foi enviada para ${recipientName}.`,
    });

    setMessage('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Enviar mensagem para {recipientName}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escreva sua mensagem aqui..."
            className="min-h-[150px]"
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSendMessage}>
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
