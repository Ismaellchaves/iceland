import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { AlertTriangle, CheckCircle, Clock, XCircle, Users, MapPin, Activity } from 'lucide-react';
import UserListDialog from '@/components/UserListDialog';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [showUserListDialog, setShowUserListDialog] = useState(false);
  const [counters, setCounters] = useState({
    total: 0,
    pending: 0,
    inAnalysis: 0,
    completed: 0,
    canceled: 0,
    users: 0
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const parsedUser = JSON.parse(user);
    if (!parsedUser.isAdmin) {
      navigate('/citizen/dashboard');
      return;
    }
    
    setUserData(parsedUser);

    const storedReports = localStorage.getItem('reports');
    if (storedReports) {
      const parsedReports = JSON.parse(storedReports);
      setReports(parsedReports);
      
      const uniqueUsers = new Set(parsedReports.map((report: any) => report.userId)).size;
      
      setCounters({
        total: parsedReports.length,
        pending: parsedReports.filter((r: any) => r.status === 'pendente').length,
        inAnalysis: parsedReports.filter((r: any) => r.status === 'analise').length,
        completed: parsedReports.filter((r: any) => r.status === 'finalizada').length,
        canceled: parsedReports.filter((r: any) => r.status === 'cancelada').length,
        users: uniqueUsers
      });
    }
  }, [navigate]);

  const statCards = [
    {
      title: 'Total de Denúncias',
      count: counters.total,
      icon: <AlertTriangle className="h-6 w-6 text-urban-blue-500" />,
      color: 'border-urban-blue-200 bg-urban-blue-50 dark:border-urban-blue-800 dark:bg-urban-blue-900/20'
    },
    {
      title: 'Pendentes',
      count: counters.pending,
      icon: <Clock className="h-6 w-6 text-amber-500" />,
      color: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
    },
    {
      title: 'Em Análise',
      count: counters.inAnalysis,
      icon: <AlertTriangle className="h-6 w-6 text-blue-500" />,
      color: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
    },
    {
      title: 'Finalizadas',
      count: counters.completed,
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      color: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
    },
    {
      title: 'Canceladas',
      count: counters.canceled,
      icon: <XCircle className="h-6 w-6 text-red-500" />,
      color: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
    },
    {
      title: 'Cidadãos Ativos',
      count: counters.users,
      icon: <Users className="h-6 w-6 text-purple-500" />,
      color: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20',
      onClick: () => setShowUserListDialog(true),
      className: 'p-2 sm:p-4 md:p-6' // Responsive padding
    }
  ];

  const getTopCategories = () => {
    if (!reports.length) return [];
    
    const categories: Record<string, number> = {};
    
    reports.forEach((report) => {
      if (!categories[report.category]) {
        categories[report.category] = 0;
      }
      categories[report.category]++;
    });
    
    return Object.entries(categories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  };

  const getTopLocations = () => {
    if (!reports.length) return [];
    
    const locations: Record<string, number> = {};
    
    reports.forEach((report) => {
      const location = report.location.split(',')[0].trim();
      if (!locations[location]) {
        locations[location] = 0;
      }
      locations[location]++;
    });
    
    return Object.entries(locations)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  };

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

  return (
    <div className="min-h-screen bg-urban-blue-50/50 dark:bg-urban-dark-900">
      <Navbar isAdmin />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-urban-dark-900 dark:text-white">
            Painel Administrativo
          </h1>
          <p className="text-urban-dark-600 dark:text-urban-dark-300 mt-1">
            Gerenciamento centralizado das denúncias da cidade
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 rounded-xl border ${card.color} shadow-sm ${card.onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
              onClick={card.onClick}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-urban-dark-600 dark:text-urban-dark-300">
                    {card.title}
                  </h3>
                  <p className="text-3xl font-bold mt-2 text-urban-dark-900 dark:text-white">
                    {card.count}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-white dark:bg-urban-dark-800 shadow-sm">
                  {card.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-urban-dark-800 rounded-xl shadow-sm p-5 border border-urban-dark-200 dark:border-urban-dark-700">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-urban-blue-500" />
                <h2 className="text-xl font-semibold text-urban-dark-900 dark:text-white">
                  Categorias mais reportadas
                </h2>
              </div>
            </div>
            
            <div className="space-y-4">
              {getTopCategories().map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="text-2xl mr-3">
                    {categoryIcons[item.category] || '📋'}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
                        {categoryNames[item.category] || 'Categoria Desconhecida'}
                      </span>
                      <span className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
                        {item.count} 
                      </span>
                    </div>
                    <div className="w-full bg-urban-dark-100 dark:bg-urban-dark-700 rounded-full h-2">
                      <div 
                        className="bg-urban-blue-500 h-2 rounded-full"
                        style={{ width: `${(item.count / counters.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              
              {getTopCategories().length === 0 && (
                <p className="text-center py-4 text-urban-dark-500 dark:text-urban-dark-400">
                  Nenhuma denúncia cadastrada.
                </p>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-urban-dark-800 rounded-xl shadow-sm p-5 border border-urban-dark-200 dark:border-urban-dark-700">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-urban-blue-500" />
                <h2 className="text-xl font-semibold text-urban-dark-900 dark:text-white">
                  Locais mais reportados
                </h2>
              </div>
            </div>
            
            <div className="space-y-4">
              {getTopLocations().map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="p-2 bg-urban-blue-50 dark:bg-urban-dark-700 rounded-full mr-3">
                    <MapPin className="h-5 w-5 text-urban-blue-500 dark:text-urban-blue-300" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
                        {item.location}
                      </span>
                      <span className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
                        {item.count} 
                      </span>
                    </div>
                    <div className="w-full bg-urban-dark-100 dark:bg-urban-dark-700 rounded-full h-2">
                      <div 
                        className="bg-urban-blue-500 h-2 rounded-full"
                        style={{ width: `${(item.count / counters.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              
              {getTopLocations().length === 0 && (
                <p className="text-center py-4 text-urban-dark-500 dark:text-urban-dark-400">
                  Nenhuma denúncia cadastrada.
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-urban-dark-800 rounded-xl shadow-sm p-5 border border-urban-dark-200 dark:border-urban-dark-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-urban-dark-900 dark:text-white">
              Denúncias Recentes
            </h2>
            <button 
              onClick={() => navigate('/admin/reports')}
              className="text-sm text-urban-blue-500 hover:text-urban-blue-600 font-medium"
            >
              Ver todas
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-urban-dark-200 dark:border-urban-dark-700">
                  <th className="text-left py-3 px-4 text-urban-dark-600 dark:text-urban-dark-300 font-medium">Categoria</th>
                  <th className="text-left py-3 px-4 text-urban-dark-600 dark:text-urban-dark-300 font-medium">Título</th>
                  <th className="text-left py-3 px-4 text-urban-dark-600 dark:text-urban-dark-300 font-medium">Localização</th>
                  <th className="text-left py-3 px-4 text-urban-dark-600 dark:text-urban-dark-300 font-medium">Reportado por</th>
                  <th className="text-left py-3 px-4 text-urban-dark-600 dark:text-urban-dark-300 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {reports
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((report) => (
                    <tr 
                      key={report.id} 
                      className="border-b border-urban-dark-100 dark:border-urban-dark-800 hover:bg-urban-blue-50/50 dark:hover:bg-urban-dark-700/30"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{categoryIcons[report.category] || '📋'}</span>
                          <span className="text-sm text-urban-dark-700 dark:text-urban-dark-200">
                            {categoryNames[report.category] || 'Categoria Desconhecida'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-urban-dark-800 dark:text-white">{report.title}</td>
                      <td className="py-3 px-4 text-urban-dark-600 dark:text-urban-dark-300">{report.location}</td>
                      <td className="py-3 px-4 text-urban-dark-600 dark:text-urban-dark-300">{report.userName}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.status === 'pendente' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                          report.status === 'analise' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          report.status === 'finalizada' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {report.status === 'pendente' && <Clock className="inline-block h-3 w-3 mr-1" />}
                          {report.status === 'analise' && <AlertTriangle className="inline-block h-3 w-3 mr-1" />}
                          {report.status === 'finalizada' && <CheckCircle className="inline-block h-3 w-3 mr-1" />}
                          {report.status === 'cancelada' && <XCircle className="inline-block h-3 w-3 mr-1" />}
                          {report.status === 'pendente' ? 'Pendente' :
                           report.status === 'analise' ? 'Em Análise' :
                           report.status === 'finalizada' ? 'Finalizada' :
                           'Cancelada'}
                        </span>
                      </td>
                    </tr>
                  ))}
                
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-urban-dark-500 dark:text-urban-dark-400">
                      Nenhuma denúncia cadastrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <UserListDialog 
        open={showUserListDialog} 
        onClose={() => setShowUserListDialog(false)} 
      />
    </div>
  );
};

export default AdminDashboard;
