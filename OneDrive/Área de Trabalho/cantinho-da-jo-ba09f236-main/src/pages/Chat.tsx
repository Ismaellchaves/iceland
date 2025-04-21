import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Trash2, AlertTriangle, Image, Paperclip } from 'lucide-react';
import AnimatedLayout from '@/components/AnimatedLayout';
import ChatMessage, { Message } from '@/components/ChatMessage';
import UserAvatar from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { appointments, addMessage, getChatByAppointmentId, users, updateAppointmentStatus } from '@/lib/data';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

const Chat = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { toast } = useToast();
  
  const [appointment, setAppointment] = useState<any | null>(null);
  const [adminUser, setAdminUser] = useState(users.find(user => user.isAdmin));
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (appointmentId) {
      const foundAppointment = appointments.find(a => a.id === appointmentId);
      if (foundAppointment) {
        setAppointment(foundAppointment);
        
        // Buscar o chat relacionado ao agendamento
        const chat = getChatByAppointmentId(appointmentId);
        if (chat) {
          setMessages(chat.messages);
        }
      } else {
        navigate('/appointments');
      }
    }
  }, [appointmentId, navigate]);
  
  useEffect(() => {
    // Rolar para a última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (!currentUser) {
    navigate('/login');
    return null;
  }
  
  if (!appointment || !adminUser) {
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
  
  const handleCancelAppointment = () => {
    if (!appointmentId) return;
    
    const updatedAppointment = updateAppointmentStatus(appointmentId, 'cancelled');
    
    if (updatedAppointment) {
      setAppointment(updatedAppointment);
      
      // Enviar mensagem automática no chat
      const chat = getChatByAppointmentId(appointmentId);
      if (chat) {
        const message = addMessage(chat.id, "Agendamento cancelado pelo cliente.", currentUser.id);
        if (message) {
          setMessages([...messages, message]);
        }
      }
      
      toast({
        title: "Agendamento cancelado",
        description: "Seu agendamento foi cancelado com sucesso.",
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
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'rescheduled': return 'bg-amber-100 text-amber-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
      case 'rescheduled': return 'Remarcado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
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
                onClick={() => navigate('/appointments')}
                className={`mr-2 ${theme === 'dark' ? 'text-white hover:bg-gray-700' : ''}`}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center">
                <UserAvatar 
                  name={adminUser.name}
                  imageUrl={adminUser.image}
                  size="sm"
                />
                <div className="ml-3">
                  <h1 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>{adminUser.name}</h1>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>Atendimento</p>
                </div>
              </div>
            </div>
            
            {appointment.status !== 'cancelled' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`border-red-500 text-red-500 hover:bg-red-50 ${theme === 'dark' ? 'hover:bg-red-900/20' : ''}`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}>
                  <AlertDialogHeader>
                    <AlertDialogTitle className={theme === 'dark' ? 'text-white' : ''}>
                      Cancelar agendamento
                    </AlertDialogTitle>
                    <AlertDialogDescription className={theme === 'dark' ? 'text-gray-300' : ''}>
                      Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className={theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : ''}>
                      Voltar
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleCancelAppointment}
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      Sim, cancelar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl shadow-sm p-4 mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-beauty-purple">{appointment.serviceName}</h3>
                <p className={`font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
                  R$ {appointment.price.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                Agendado para {formatAppointmentDate(appointment.date)}
              </p>
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(appointment.status)}`}>
                  {getStatusText(appointment.status)}
                </span>
              </div>
              
              {appointment.status === 'cancelled' && (
                <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Este agendamento foi cancelado</span>
                </div>
              )}
            </motion.div>
            
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

export default Chat;