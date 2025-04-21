
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { MapPin, Calendar, MessageCircle } from 'lucide-react';
import UserProfileLink from './UserProfileLink';

const statusColors = {
  'pendente': 'bg-yellow-500',
  'em_analise': 'bg-blue-500',
  'em_progresso': 'bg-blue-700',
  'concluido': 'bg-green-500',
  'rejeitado': 'bg-red-500',
};

const statusLabels = {
  'pendente': 'Pendente',
  'em_analise': 'Em Análise',
  'em_progresso': 'Em Progresso',
  'concluido': 'Concluído',
  'rejeitado': 'Rejeitado',
};

const categoryIcons = {
  'buraco': '🕳️',
  'iluminacao': '💡',
  'lixo': '🗑️',
  'poluicao': '💨',
  'transito': '🚦',
  'outros': '📋',
};

interface AdminReportCardProps {
  report: {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    status: string;
    imageUrl?: string | null;
    createdAt: string;
    userId: string;
    userName: string;
  };
  onStatusChange?: (id: string, status: string) => void;
  onSendMessage?: (userId: string, userName: string) => void;
}

const AdminReportCard = ({
  report,
  onStatusChange,
  onSendMessage
}: AdminReportCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  const handleSendMessage = () => {
    if (onSendMessage) {
      onSendMessage(report.userId, report.userName);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              {categoryIcons[report.category as keyof typeof categoryIcons] || '📋'}
            </span>
            <CardTitle className="text-lg">{report.title}</CardTitle>
          </div>
          <Badge className={`${statusColors[report.status as keyof typeof statusColors]} text-white`}>
            {statusLabels[report.status as keyof typeof statusLabels] || report.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2">
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {report.description}
        </div>

        {report.imageUrl && (
          <div className="mt-3 mb-3">
            <img 
              src={report.imageUrl} 
              alt={report.title}
              className="rounded-md w-full h-48 object-cover"
            />
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{report.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Criado em: {formatDate(report.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Reportado por:</span>
            <UserProfileLink userId={report.userId} userName={report.userName} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between bg-gray-50 dark:bg-gray-800/50">
        {onStatusChange && (
          <select
            value={report.status}
            onChange={(e) => onStatusChange(report.id, e.target.value)}
            className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          >
            <option value="pendente">Pendente</option>
            <option value="em_analise">Em Análise</option>
            <option value="em_progresso">Em Progresso</option>
            <option value="concluido">Concluído</option>
            <option value="rejeitado">Rejeitado</option>
          </select>
        )}
        
        {onSendMessage && (
          <button
            onClick={handleSendMessage}
            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <MessageCircle className="h-3 w-3" /> Enviar Mensagem
          </button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AdminReportCard;
