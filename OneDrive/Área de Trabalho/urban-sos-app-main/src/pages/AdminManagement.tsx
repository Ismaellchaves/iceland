
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { toast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Filter, Search, AlertTriangle, CheckCircle, Clock, XCircle, Trash2, Edit } from 'lucide-react';

const AdminManagement = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);

  const categories = [
    { id: 'buraco', name: 'Buraco na Via', icon: '🕳️' },
    { id: 'iluminacao', name: 'Problema de Iluminação', icon: '💡' },
    { id: 'lixo', name: 'Descarte Irregular de Lixo', icon: '🗑️' },
    { id: 'poluicao', name: 'Poluição', icon: '💨' },
    { id: 'transito', name: 'Problema de Trânsito', icon: '🚦' },
    { id: 'outros', name: 'Outros', icon: '📋' },
  ];

  useEffect(() => {
    // Get user data
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

    // Get reports data
    const storedReports = localStorage.getItem('reports');
    if (storedReports) {
      const parsedReports = JSON.parse(storedReports);
      setReports(parsedReports);
    }
    setLoading(false);
  }, [navigate]);

  const handleDeleteReport = (id: string) => {
    setReportToDelete(id);
  };

  const confirmDelete = () => {
    if (!reportToDelete) return;
    
    // Get all reports
    const allReports = JSON.parse(localStorage.getItem('reports') || '[]');
    
    // Filter out the report to delete
    const updatedReports = allReports.filter((report: any) => report.id !== reportToDelete);
    
    // Update localStorage
    localStorage.setItem('reports', JSON.stringify(updatedReports));
    
    // Update state
    setReports(reports.filter(report => report.id !== reportToDelete));
    
    // Show toast
    toast({
      title: "Denúncia excluída",
      description: "A denúncia foi excluída com sucesso.",
    });
    
    // Reset reportToDelete
    setReportToDelete(null);
  };

  const handleStatusChange = (id: string, status: string) => {
    // Get all reports
    const allReports = JSON.parse(localStorage.getItem('reports') || '[]');
    
    // Find and update the report
    const updatedReports = allReports.map((report: any) => {
      if (report.id === id) {
        return { ...report, status };
      }
      return report;
    });
    
    // Update localStorage
    localStorage.setItem('reports', JSON.stringify(updatedReports));
    
    // Update state
    setReports(updatedReports);
    
    // Show toast
    toast({
      title: "Status atualizado",
      description: `A denúncia agora está ${
        status === 'pendente' ? 'pendente' :
        status === 'analise' ? 'em análise' :
        status === 'finalizada' ? 'finalizada' :
        'cancelada'
      }.`,
    });
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

  const filteredReports = reports.filter(report => {
    const matchesSearch = (
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const statusColors: Record<string, string> = {
    'pendente': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    'analise': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'finalizada': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'cancelada': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    'pendente': <Clock className="inline-block h-4 w-4 mr-1" />,
    'analise': <AlertTriangle className="inline-block h-4 w-4 mr-1" />,
    'finalizada': <CheckCircle className="inline-block h-4 w-4 mr-1" />,
    'cancelada': <XCircle className="inline-block h-4 w-4 mr-1" />,
  };

  return (
    <div className="min-h-screen bg-urban-blue-50/50 dark:bg-urban-dark-900">
      <Navbar isAdmin />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-urban-dark-900 dark:text-white">
            Gestão de Denúncias
          </h1>
          <p className="text-urban-dark-600 dark:text-urban-dark-300 mt-1">
            Gerencie o status e controle todas as denúncias da cidade
          </p>
        </div>
        
        <div className="bg-white dark:bg-urban-dark-800 rounded-xl shadow-sm p-5 border border-urban-dark-200 dark:border-urban-dark-700 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-urban-dark-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Pesquisar denúncias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-urban-blue-500"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2">
                <Filter className="text-urban-dark-400 h-5 w-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-urban-blue-500"
                >
                  <option value="all">Todos os status</option>
                  <option value="pendente">Pendente</option>
                  <option value="analise">Em Análise</option>
                  <option value="finalizada">Finalizada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-urban-blue-500"
              >
                <option value="all">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-urban-dark-800 rounded-xl shadow-sm border border-urban-dark-200 dark:border-urban-dark-700 overflow-hidden">
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-urban-blue-500 border-t-transparent rounded-full"></div>
              <p className="mt-4 text-urban-dark-600 dark:text-urban-dark-300">Carregando denúncias...</p>
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-urban-blue-50/70 dark:bg-urban-dark-700/50 border-b border-urban-dark-200 dark:border-urban-dark-700">
                    <th className="text-left py-3 px-4 text-urban-dark-600 dark:text-urban-dark-300 font-medium">ID</th>
                    <th className="text-left py-3 px-4 text-urban-dark-600 dark:text-urban-dark-300 font-medium">Categoria</th>
                    <th className="text-left py-3 px-4 text-urban-dark-600 dark:text-urban-dark-300 font-medium">Título</th>
                    <th className="text-left py-3 px-4 text-urban-dark-600 dark:text-urban-dark-300 font-medium">Reportado por</th>
                    <th className="text-left py-3 px-4 text-urban-dark-600 dark:text-urban-dark-300 font-medium">Data</th>
                    <th className="text-left py-3 px-4 text-urban-dark-600 dark:text-urban-dark-300 font-medium">Status</th>
                    <th className="text-center py-3 px-4 text-urban-dark-600 dark:text-urban-dark-300 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((report) => (
                      <tr 
                        key={report.id} 
                        className="border-b border-urban-dark-100 dark:border-urban-dark-800 hover:bg-urban-blue-50/50 dark:hover:bg-urban-dark-700/30"
                      >
                        <td className="py-4 px-4 text-urban-dark-500 dark:text-urban-dark-400 text-sm">
                          {report.id.slice(0, 8)}...
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">
                              {categories.find(c => c.id === report.category)?.icon || '📋'}
                            </span>
                            <span className="text-sm text-urban-dark-700 dark:text-urban-dark-200">
                              {categories.find(c => c.id === report.category)?.name || 'Outros'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-urban-dark-800 dark:text-white font-medium">
                          {report.title}
                        </td>
                        <td className="py-4 px-4 text-urban-dark-600 dark:text-urban-dark-300">
                          {report.userName}
                        </td>
                        <td className="py-4 px-4 text-urban-dark-600 dark:text-urban-dark-300 text-sm">
                          {formatDate(report.createdAt)}
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={report.status}
                            onChange={(e) => handleStatusChange(report.id, e.target.value)}
                            className={`px-3 py-1 rounded text-sm font-medium ${statusColors[report.status]}`}
                          >
                            <option value="pendente">Pendente</option>
                            <option value="analise">Em Análise</option>
                            <option value="finalizada">Finalizada</option>
                            <option value="cancelada">Cancelada</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleDeleteReport(report.id)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-urban-dark-500 dark:text-urban-dark-400">
                Nenhuma denúncia encontrada com os filtros aplicados.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <AlertDialog open={!!reportToDelete} onOpenChange={() => !reportToDelete && setReportToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir denúncia</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta denúncia? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReportToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminManagement;
