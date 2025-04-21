
import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock } from 'lucide-react';
import UserAvatar from './UserAvatar';

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientImage?: string;
  serviceName: string;
  price: number;
  date: Date;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled';
}

interface AppointmentCardProps {
  appointment: Appointment;
  onClick?: () => void;
  theme?: 'light' | 'dark';
}

const AppointmentCard = ({ appointment, onClick, theme = 'light' }: AppointmentCardProps) => {
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
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${theme === 'dark' ? 'bg-gray-800 shadow-lg shadow-black/20' : 'bg-white shadow-md'} rounded-2xl p-6 cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <UserAvatar
            name={appointment.clientName}
            imageUrl={appointment.clientImage}
            size="md"
          />
          <div>
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>{appointment.clientName}</h3>
            <p className="text-sm text-beauty-purple">{appointment.serviceName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-beauty-purple">
            R$ {appointment.price.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              {format(appointment.date, "dd 'de' MMMM", { locale: ptBR })}
            </span>
          </div>
          <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {format(appointment.date, "HH:mm")}
            </span>
          </div>
        </div>
        
        <div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(appointment.status)}`}>
            {getStatusText(appointment.status)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default AppointmentCard;
