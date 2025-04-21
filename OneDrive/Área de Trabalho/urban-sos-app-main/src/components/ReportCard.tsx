
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  MapPin, 
  Calendar 
} from 'lucide-react';

interface ReportCardProps {
  report: {
    id: string;
    category: string;
    title: string;
    description: string;
    location: string;
    status: string;
    createdAt: string;
    userId: string;
    userName: string;
    imageUrl?: string | null;
  };
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
  onMessage?: (id: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ 
  report, 
  isAdmin = false, 
  onDelete, 
  onStatusChange,
  onMessage
}) => {
  const categoryIcons: Record<string, string> = {
    'buraco': '🕳️',
    'iluminacao': '💡',
    'lixo': '🗑️',
    'poluicao': '💨',
    'transito': '🚦',
    'outros': '📋',
  };

  const categoryNames: Record<string, string> = {
    'buraco': 'Buraco na Via',
    'iluminacao': 'Problema de Iluminação',
    'lixo': 'Descarte Irregular de Lixo',
    'poluicao': 'Poluição',
    'transito': 'Problema de Trânsito',
    'outros': 'Outros',
  };

  const statusColors: Record<string, string> = {
    'pendente': 'bg-amber-500',
    'analise': 'bg-blue-500',
    'finalizada': 'bg-green-500',
    'cancelada': 'bg-red-500',
  };

  const statusText: Record<string, string> = {
    'pendente': 'Pendente',
    'analise': 'Em Análise',
    'finalizada': 'Finalizada',
    'cancelada': 'Cancelada',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    'pendente': <Clock className="h-4 w-4" />,
    'analise': <AlertTriangle className="h-4 w-4" />,
    'finalizada': <CheckCircle className="h-4 w-4" />,
    'cancelada': <XCircle className="h-4 w-4" />,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="urban-card overflow-visible"
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="text-3xl mr-3">{categoryIcons[report.category] || '📋'}</div>
            <div>
              <h3 className="text-lg font-semibold text-urban-dark-900 dark:text-white">{report.title}</h3>
              <span className="text-sm text-urban-dark-500 dark:text-urban-dark-400">
                {categoryNames[report.category] || 'Categoria Desconhecida'}
              </span>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1 ${statusColors[report.status]}`}>
            {statusIcons[report.status]}
            {statusText[report.status]}
          </div>
        </div>
        
        <p className="mt-4 text-urban-dark-700 dark:text-urban-dark-300 text-sm">
          {report.description}
        </p>
        
        {/* Display image if available */}
        {report.imageUrl && (
          <div className="mt-4">
            <img 
              src={report.imageUrl} 
              alt="Imagem da denúncia" 
              className="w-full h-auto max-h-60 object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-urban-dark-500 dark:text-urban-dark-400">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{report.location}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(report.createdAt)}</span>
          </div>
        </div>

        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-urban-dark-200 dark:border-urban-dark-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-urban-dark-700 dark:text-urban-dark-300">
                Reportado por: <span className="font-medium">{report.userName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {onStatusChange && (
                  <select
                    onChange={(e) => onStatusChange(report.id, e.target.value)}
                    value={report.status}
                    className="text-sm px-2 py-1 rounded border border-urban-dark-200 dark:border-urban-dark-700 bg-white dark:bg-urban-dark-800 focus:outline-none focus:ring-1 focus:ring-urban-blue-500"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="analise">Em Análise</option>
                    <option value="finalizada">Finalizada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                )}
                
                {onMessage && (
                  <button
                    onClick={() => onMessage(report.id)}
                    className="p-2 hover:bg-urban-dark-100 dark:hover:bg-urban-dark-700 rounded-full"
                  >
                    <MessageSquare className="h-5 w-5 text-urban-blue-500" />
                  </button>
                )}
                
                {onDelete && (
                  <button
                    onClick={() => onDelete(report.id)}
                    className="p-2 hover:bg-urban-dark-100 dark:hover:bg-urban-dark-700 rounded-full"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {!isAdmin && onDelete && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => onDelete(report.id)}
              className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Excluir denúncia
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReportCard;
