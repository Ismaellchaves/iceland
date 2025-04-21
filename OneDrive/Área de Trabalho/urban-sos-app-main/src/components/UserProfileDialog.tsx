
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User, Calendar, Phone, Mail, Home, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import MessageDialog from './MessageDialog';

type UserData = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  birthDate?: string;
  cpf?: string;
};

interface UserProfileDialogProps {
  user: UserData | null;
  open: boolean;
  onClose: () => void;
}

const UserProfileDialog = ({ user, open, onClose }: UserProfileDialogProps) => {
  if (!user) return null;
  const { addNotification } = useNotifications();
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);

  const formatBirthDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const handleSendMessage = () => {
    setMessageDialogOpen(true);
  };

  const sendNotification = () => {
    addNotification({
      userId: user.id,
      title: "Mensagem do Administrador",
      message: "Um administrador quer se comunicar com você sobre uma denúncia.",
      read: false
    });
    
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Perfil do Usuário</DialogTitle>
            <DialogDescription>
              Informações detalhadas do usuário
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="h-24 w-24 rounded-full bg-urban-blue-100 dark:bg-urban-blue-900 flex items-center justify-center">
                <User className="h-14 w-14 text-urban-blue-500" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-urban-blue-500" />
                <div>
                  <p className="text-sm text-urban-dark-500 dark:text-urban-dark-400">Nome</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-urban-blue-500" />
                <div>
                  <p className="text-sm text-urban-dark-500 dark:text-urban-dark-400">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-urban-blue-500" />
                  <div>
                    <p className="text-sm text-urban-dark-500 dark:text-urban-dark-400">Telefone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
              )}
              
              {user.birthDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-urban-blue-500" />
                  <div>
                    <p className="text-sm text-urban-dark-500 dark:text-urban-dark-400">Data de Nascimento</p>
                    <p className="font-medium">{formatBirthDate(user.birthDate)}</p>
                  </div>
                </div>
              )}
              
              {user.cpf && (
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-urban-blue-500" />
                  <div>
                    <p className="text-sm text-urban-dark-500 dark:text-urban-dark-400">CPF</p>
                    <p className="font-medium">{user.cpf}</p>
                  </div>
                </div>
              )}
              
              {user.address && (
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-urban-blue-500" />
                  <div>
                    <p className="text-sm text-urban-dark-500 dark:text-urban-dark-400">Endereço</p>
                    <p className="font-medium">{user.address}</p>
                  </div>
                </div>
              )}
              
              {(user.city || user.state) && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-urban-blue-500" />
                  <div>
                    <p className="text-sm text-urban-dark-500 dark:text-urban-dark-400">Cidade/Estado</p>
                    <p className="font-medium">{user.city && user.state ? `${user.city}, ${user.state}` : user.city || user.state}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-center mt-4">
              <Button onClick={handleSendMessage} className="bg-urban-blue-500 hover:bg-urban-blue-600">
                Enviar Mensagem
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {user && (
        <MessageDialog
          open={messageDialogOpen}
          onClose={() => setMessageDialogOpen(false)}
          recipientId={user.id}
          recipientName={user.name}
        />
      )}
    </>
  );
};

export default UserProfileDialog;
