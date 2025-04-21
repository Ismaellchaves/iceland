
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { AlertTriangle, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [counters, setCounters] = useState({
    total: 0,
    pending: 0,
    inAnalysis: 0,
    completed: 0,
    canceled: 0
  });

  useEffect(() => {
    // Get user data
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/auth');
      return;
    }
    setUserData(JSON.parse(user));

    // Get reports data
    const storedReports = localStorage.getItem('reports');
    if (storedReports) {
      const parsedReports = JSON.parse(storedReports);
      setReports(parsedReports);
      
      // Count reports
      const userReports = parsedReports.filter((report: any) => report.userId === JSON.parse(user).email);
      setCounters({
        total: userReports.length,
        pending: userReports.filter((r: any) => r.status === 'pendente').length,
        inAnalysis: userReports.filter((r: any) => r.status === 'analise').length,
        completed: userReports.filter((r: any) => r.status === 'finalizada').length,
        canceled: userReports.filter((r: any) => r.status === 'cancelada').length
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
    }
  ];

  return (
    <div className="min-h-screen bg-urban-blue-50/50 dark:bg-urban-dark-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-urban-dark-900 dark:text-white">
              Olá, {userData?.name || 'Cidadão'}
            </h1>
            <p className="text-urban-dark-600 dark:text-urban-dark-300 mt-1">
              Bem-vindo ao seu painel de denúncias
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/report')}
            className="mt-4 md:mt-0 btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Nova Denúncia
          </motion.button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 rounded-xl border ${card.color} shadow-sm`}
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-urban-dark-800 rounded-xl shadow-sm p-5 border border-urban-dark-200 dark:border-urban-dark-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-urban-dark-900 dark:text-white">
                  Suas Denúncias Recentes
                </h2>
                <button 
                  onClick={() => navigate('/citizen/reports')}
                  className="text-sm text-urban-blue-500 hover:text-urban-blue-600 font-medium"
                >
                  Ver todas
                </button>
              </div>
              
              {reports.filter((report) => report.userId === userData?.email)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 3)
                .map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      index !== 0 ? 'mt-3' : ''
                    } ${
                      report.status === 'pendente' ? 'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10' :
                      report.status === 'analise' ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10' :
                      report.status === 'finalizada' ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10' :
                      'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-urban-dark-900 dark:text-white">
                          {report.title}
                        </h3>
                        <p className="text-sm text-urban-dark-600 dark:text-urban-dark-400 mt-1">
                          {report.location}
                        </p>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1 ${
                        report.status === 'pendente' ? 'bg-amber-500' :
                        report.status === 'analise' ? 'bg-blue-500' :
                        report.status === 'finalizada' ? 'bg-green-500' :
                        'bg-red-500'
                      }`}>
                        {report.status === 'pendente' ? <Clock className="h-3 w-3" /> :
                         report.status === 'analise' ? <AlertTriangle className="h-3 w-3" /> :
                         report.status === 'finalizada' ? <CheckCircle className="h-3 w-3" /> :
                         <XCircle className="h-3 w-3" />}
                        {report.status === 'pendente' ? 'Pendente' :
                         report.status === 'analise' ? 'Em Análise' :
                         report.status === 'finalizada' ? 'Finalizada' :
                         'Cancelada'}
                      </div>
                    </div>
                  </motion.div>
              ))}
              
              {reports.filter((report) => report.userId === userData?.email).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-urban-dark-500 dark:text-urban-dark-400">
                    Você ainda não fez nenhuma denúncia.
                  </p>
                  <button 
                    onClick={() => navigate('/report')}
                    className="mt-4 btn-primary"
                  >
                    Fazer primeira denúncia
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-white dark:bg-urban-dark-800 rounded-xl shadow-sm p-5 border border-urban-dark-200 dark:border-urban-dark-700">
              <h2 className="text-xl font-semibold text-urban-dark-900 dark:text-white mb-6">
                Instruções Úteis
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-urban-blue-50 dark:bg-urban-dark-700 border border-urban-blue-100 dark:border-urban-dark-600">
                  <h3 className="font-medium text-urban-dark-900 dark:text-white">
                    Como fazer uma denúncia eficaz
                  </h3>
                  <ul className="mt-2 text-sm text-urban-dark-600 dark:text-urban-dark-300 space-y-2">
                    <li>• Seja específico sobre o problema</li>
                    <li>• Adicione a localização exata</li>
                    <li>• Inclua detalhes relevantes</li>
                    <li>• Use uma linguagem clara e objetiva</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                  <h3 className="font-medium text-urban-dark-900 dark:text-white">
                    Acompanhe suas denúncias
                  </h3>
                  <p className="mt-2 text-sm text-urban-dark-600 dark:text-urban-dark-300">
                    Você pode acompanhar o status de todas as suas denúncias na página "Minhas Denúncias".
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                  <h3 className="font-medium text-urban-dark-900 dark:text-white">
                    Denúncias resolvidas
                  </h3>
                  <p className="mt-2 text-sm text-urban-dark-600 dark:text-urban-dark-300">
                    Quando uma denúncia é resolvida, seu status muda para "Finalizada". Você pode verificar o histórico completo a qualquer momento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CitizenDashboard;
