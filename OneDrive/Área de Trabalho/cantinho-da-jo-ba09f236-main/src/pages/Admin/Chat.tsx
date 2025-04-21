
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Calendar, CheckCircle, XCircle, Clock, Image, Paperclip } from 'lucide-react';
import AnimatedLayout from '@/components/AnimatedLayout';
import ChatMessage, { Message } from '@/components/ChatMessage';
import UserAvatar from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { appointments, getChatByAppointmentId, addMessage, updateAppointmentStatus, users } from '@/lib/data';
import { useTheme } from '@/contexts/ThemeContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const AdminChat = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();
  
  const [appointment, setAppointment] = useState(
    appointmentId ? appointments.find(a => a.id === appointmentId) : null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [client, setClient] = useState(
    appointment ? users.find(u => u.id === appointment.clientId) : null
  );
  const [isUploading, setIsUploading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (appointmentId) {
      const foundAppointment = appointments.find(a => a.id === appointmentId);
      
      if (foundAppointment) {
        setAppointment(foundAppointment);
        setClient(users.find(u => u.id === foundAppointment.clientId));
        
        // Buscar o chat relacionado ao agendamento
        const chat = getChatByAppointmentId(appointmentId);
        if (chat) {
          setMessages(chat.messages);
        }
      } else {
        navigate('/admin/appointments');
      }
    }
  }, [appointmentId, navigate]);
  
  useEffect(() => {
    // Rolar para a última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Verificar se é administrador
  if (!currentUser || !currentUser.isAdmin) {
    navigate('/login');
    return null;
  }
  
  if (!appointment || !client) {
    return null;
  }
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !appointmentId) return;
    
    const chat = getChatByAppointmentId(appointmentId);
    if (chat) {
      const message = addMessage(chat.id, newMessage, currentUser.id);
      if (message) {
        setMessages([...messages, message]);
        setNewMessage('');
      }
    }
  };
  
  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !appointmentId) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulating file upload
    setTimeout(() => {
      const chat = getChatByAppointmentId(appointmentId);
      if (chat) {
        // Create message with file information
        const fileType = file.type.startsWith('image/') ? 'image' : 'video';
        const messageContent = fileType === 'image' 
          ? `Enviou uma imagem: ${file.name}`
          : `Enviou um vídeo: ${file.name}`;
        
        const message = addMessage(chat.id, messageContent, currentUser.id);
        if (message) {
          // Add file metadata to message
          message.fileMetadata = {
            name: file.name,
            type: fileType,
            url: URL.createObjectURL(file), // Create a temporary URL
            size: file.size
          };
          
          setMessages([...messages, message]);
          setIsUploading(false);
          
          toast({
            title: "Arquivo enviado",
            description: "O arquivo foi enviado com sucesso.",
          });
        }
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1500);
  };
  
  const handleUpdateStatus = (status: 'confirmed' | 'rescheduled') => {
    if (!appointmentId) return;
    
    const updatedAppointment = updateAppointmentStatus(appointmentId, status);
    
    if (updatedAppointment) {
      setAppointment(updatedAppointment);
      
      // Enviar mensagem automática
      const statusMessage = status === 'confirmed'
        ? `Agendamento confirmado para ${new Date(updatedAppointment.date).toLocaleString('pt-BR')}`
        : 'Precisamos remarcar seu agendamento. Por favor, escolha uma nova data.';
      
      const chat = getChatByAppointmentId(appointmentId);
      if (chat) {
        const message = addMessage(chat.id, statusMessage, currentUser.id);
        if (message) {
          // Adicionar o status à mensagem
          message.status = status;
          setMessages([...messages, message]);
        }
      }
      
      toast({
        title: status === 'confirmed' ? 'Agendamento confirmado!' : 'Agendamento remarcado',
        description: status === 'confirmed'
          ? 'O cliente foi notificado da confirmação.'
          : 'O cliente foi notificado da necessidade de remarcação.'
      });
    }
  };
  
  const formatAppointmentDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Intl.DateTimeFormat('pt-BR', options).format(date);
  };
  
  return (
    <AnimatedLayout>
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`sticky top-0 z-10 px-6 py-4 ${theme === 'dark' ? 'bg-gray-800 shadow-gray-800/20' : 'bg-white shadow-sm'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/appointments')}
                className={`mr-2 ${theme === 'dark' ? 'text-white hover:bg-gray-700' : ''}`}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center">
                <UserAvatar 
                  name={client.name}
                  imageUrl={client.image}
                  size="sm"
                />
                <div className="ml-3">
                  <h1 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>{client.name}</h1>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>{client.email}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="border-beauty-purple text-beauty-purple">
                    <Calendar className="h-4 w-4 mr-2" />
                    Detalhes
                  </Button>
                </SheetTrigger>
                <SheetContent className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}>
                  <SheetHeader>
                    <SheetTitle className={theme === 'dark' ? 'text-white' : ''}>Detalhes do Agendamento</SheetTitle>
                    <SheetDescription className={theme === 'dark' ? 'text-gray-300' : ''}>
                      Informações e opções para gerenciar este agendamento.
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-6">
                    <div className={theme === 'dark' ? 'bg-gray-700 rounded-lg p-4' : 'bg-beauty-soft-purple rounded-lg p-4'}>
                      <h3 className="font-semibold text-beauty-purple mb-2">{appointment.serviceName}</h3>
                      <div className={`flex items-center mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatAppointmentDate(appointment.date)}</span>
                      </div>
                      <p className="font-semibold text-beauty-purple">
                        R$ {appointment.price.toFixed(2).replace('.', ',')}
                      </p>
                      
                      <div className="mt-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          appointment.status === 'rescheduled' ? 'bg-amber-100 text-amber-800' : 
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {appointment.status === 'confirmed' ? 'Confirmado' : 
                           appointment.status === 'rescheduled' ? 'Remarcado' : 
                           appointment.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>Cliente</h3>
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={client.name}
                          imageUrl={client.image}
                          size="md"
                        />
                        <div>
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{client.name}</p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>{client.email}</p>
                          {client.phone && (
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>{client.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>Ações</h3>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={() => handleUpdateStatus('confirmed')}
                          className="bg-green-500 hover:bg-green-600 text-white"
                          disabled={appointment.status === 'confirmed' || appointment.status === 'cancelled'}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirmar
                        </Button>
                        
                        <Button
                          onClick={() => handleUpdateStatus('rescheduled')}
                          className="bg-amber-500 hover:bg-amber-600 text-white"
                          disabled={appointment.status === 'rescheduled' || appointment.status === 'cancelled'}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Remarcar
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence>
              {appointment.status === 'pending' && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`rounded-2xl shadow-sm p-4 mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-beauty-soft-purple'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${theme === 'dark' ? 'text-beauty-light-purple' : 'text-beauty-purple'}`}>Agendamento pendente</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>Confirme ou solicite remarcação</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus('confirmed')}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirmar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus('rescheduled')}
                        variant="outline"
                        className={`border-amber-500 text-amber-500 ${theme === 'dark' ? 'hover:bg-amber-900/20' : 'hover:bg-amber-50'}`}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Remarcar
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isCurrentUser={message.senderId === currentUser.id}
                  index={index}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </main>
        
        <footer className={`p-4 ${theme === 'dark' ? 'bg-gray-800 shadow-gray-800/20' : 'bg-white shadow-sm'}`}>
          <form onSubmit={handleSendMessage} className="max-w-2xl mx-auto flex gap-2">
            {/* Hidden file input */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleUploadFile}
              accept="image/*,video/*"
              className="hidden"
            />
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white' : 'border-beauty-purple text-beauty-purple'}`}
                  disabled={appointment.status === 'cancelled' || isUploading}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className={`p-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                side="top"
                align="start"
              >
                <div className="flex flex-col gap-2">
                  <Button 
                    className={`w-full justify-start ${theme === 'dark' ? 'hover:bg-gray-600' : ''}`}
                    variant="ghost"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = "image/*";
                        fileInputRef.current.click();
                      }
                    }}
                    disabled={appointment.status === 'cancelled' || isUploading}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Enviar imagem
                  </Button>
                  <Button 
                    className={`w-full justify-start ${theme === 'dark' ? 'hover:bg-gray-600' : ''}`}
                    variant="ghost"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = "video/*";
                        fileInputRef.current.click();
                      }
                    }}
                    disabled={appointment.status === 'cancelled' || isUploading}
                  >
                    <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 4C14.5 2.9 13.6 2 12.5 2H6.5C5.4 2 4.5 2.9 4.5 4V20C4.5 21.1 5.4 22 6.5 22H12.5C13.6 22 14.5 21.1 14.5 20V16"></path>
                      <path d="M12.5 12L21 16.7V7.3L12.5 12Z"></path>
                    </svg>
                    Enviar vídeo
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <Input
              type="text"
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className={`flex-1 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'beauty-input'}`}
              disabled={appointment.status === 'cancelled' || isUploading}
            />
            <Button
              type="submit"
              className="beauty-button"
              disabled={!newMessage.trim() || appointment.status === 'cancelled' || isUploading}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </footer>
      </div>
    </AnimatedLayout>
  );
};

export default AdminChat;