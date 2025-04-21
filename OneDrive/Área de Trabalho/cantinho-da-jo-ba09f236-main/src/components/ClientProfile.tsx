
import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, MessageSquare } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { User as UserType } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

interface ClientProfileProps {
  user: UserType;
  onClose?: () => void;
}

const ClientProfile = ({ user, onClose }: ClientProfileProps) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-4"
    >
      <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-16 w-16">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : (
              <AvatarFallback className={`${theme === 'dark' ? 'bg-beauty-light-purple' : 'bg-beauty-purple'} text-white`}>
                {getInitials(user.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <CardTitle className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>
              {user.name}
            </CardTitle>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
              Cliente desde {user.createdAt.toLocaleDateString('pt-BR')}
            </p>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={`${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              ✕
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className={`flex items-start gap-3 ${theme === 'dark' ? 'text-gray-200' : ''}`}>
              <Mail className="h-5 w-5 mt-0.5 text-beauty-purple flex-shrink-0" />
              <div>
                <p className="font-medium">Email</p>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{user.email}</p>
              </div>
            </div>
            
            {user.phone && (
              <div className={`flex items-start gap-3 ${theme === 'dark' ? 'text-gray-200' : ''}`}>
                <Phone className="h-5 w-5 mt-0.5 text-beauty-purple flex-shrink-0" />
                <div>
                  <p className="font-medium">Telefone</p>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{user.phone}</p>
                </div>
              </div>
            )}
            
            {user.address && (
              <div className={`flex items-start gap-3 ${theme === 'dark' ? 'text-gray-200' : ''}`}>
                <MapPin className="h-5 w-5 mt-0.5 text-beauty-purple flex-shrink-0" />
                <div>
                  <p className="font-medium">Endereço</p>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{user.address}</p>
                </div>
              </div>
            )}
            
            {user.bio && (
              <div className={`flex items-start gap-3 ${theme === 'dark' ? 'text-gray-200' : ''}`}>
                <User className="h-5 w-5 mt-0.5 text-beauty-purple flex-shrink-0" />
                <div>
                  <p className="font-medium">Bio</p>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{user.bio}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              className={`flex-1 gap-2 ${theme === 'dark' ? 'border-gray-600 text-white hover:bg-gray-700' : 'border-beauty-purple text-beauty-purple hover:bg-beauty-soft-purple'}`}
              onClick={() => navigate(`/admin/chats/${user.id}`)}
            >
              <MessageSquare className="h-4 w-4" />
              Enviar Mensagem
            </Button>
            <Button 
              variant="default" 
              className={`flex-1 gap-2 ${theme === 'dark' ? 'bg-beauty-light-purple hover:bg-beauty-purple' : 'bg-beauty-purple hover:bg-beauty-dark-purple'}`}
              onClick={() => navigate(`/admin/appointments?client=${user.id}`)}
            >
              <Calendar className="h-4 w-4" />
              Ver Agendamentos
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientProfile;
