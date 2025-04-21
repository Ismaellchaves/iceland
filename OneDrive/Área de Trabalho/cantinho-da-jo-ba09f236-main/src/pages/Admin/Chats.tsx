
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Clock, CheckCircle, History } from 'lucide-react';
import AnimatedLayout from '@/components/AnimatedLayout';
import UserAvatar from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { appointments, chats, users, Chat as ChatType } from '@/lib/data';

interface ChatListItem extends ChatType {
  client: {
    id: string;
    name: string;
    image?: string;
  };
  appointment?: {
    id: string;
    serviceName: string;
    date: Date;
    status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled';
  };
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
}

const AdminChats = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  
  useEffect(() => {
    // Preparar a lista de chats com informações adicionais
    const enhancedChats = chats.map(chat => {
      const clientId = chat.participantIds.find(id => id !== 'admin1') || '';
      const client = users.find(user => user.id === clientId);
      
      const appointment = chat.appointmentId
        ? appointments.find(app => app.id === chat.appointmentId)
        : undefined;
      
      const lastMessage = chat.messages.length > 0
        ? {
            content: chat.messages[chat.messages.length - 1].content,
            timestamp: chat.messages[chat.messages.length - 1].timestamp
          }
        : undefined;
      
      return {
        ...chat,
        client: {
          id: clientId,
          name: client?.name || 'Cliente',
          image: client?.image
        },
        appointment,
        lastMessage
      };
    });
    
    setChatList(enhancedChats);
  }, []);
  
  // Verificar se é administrador
  if (!currentUser || !currentUser.isAdmin) {
    navigate('/login');
    return null;
  }
  
  const filteredChats = chatList.filter(chat => {
    return chat.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (chat.appointment?.serviceName.toLowerCase().includes(searchQuery.toLowerCase()));
  });
  
  // Ordenar por data da última mensagem (mais recente primeiro)
  const sortedChats = [...filteredChats].sort((a, b) => {
    const aTime = a.lastMessage?.timestamp.getTime() || 0;
    const bTime = b.lastMessage?.timestamp.getTime() || 0;
    return bTime - aTime;
  });
  
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'rescheduled':
        return <History className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };
  
  return (
    <AnimatedLayout>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin')}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Conversas</h1>
          </div>
        </header>
        
        <main className="max-w-6xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar por cliente ou serviço..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="beauty-input pl-10"
              />
            </div>
            
            <div className="space-y-2">
              {sortedChats.length > 0 ? (
                sortedChats.map((chat, index) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => chat.appointmentId && navigate(`/admin/chat/${chat.appointmentId}`)}
                    className="bg-white rounded-xl shadow-sm p-4 flex items-center cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <UserAvatar
                      name={chat.client.name}
                      imageUrl={chat.client.image}
                      size="md"
                    />
                    
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-semibold truncate">{chat.client.name}</h3>
                        {chat.lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {formatDate(chat.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      
                      {chat.appointment && (
                        <div className="flex items-center gap-1 text-sm text-beauty-purple mb-1">
                          {getStatusIcon(chat.appointment.status)}
                          <span className="truncate">{chat.appointment.serviceName}</span>
                        </div>
                      )}
                      
                      {chat.lastMessage && (
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 bg-white rounded-2xl shadow-sm">
                  <p className="text-muted-foreground">Nenhuma conversa encontrada.</p>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </AnimatedLayout>
  );
};

export default AdminChats;
