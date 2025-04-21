
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ReportCard from '@/components/ReportCard';
import { toast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Filter, Search } from 'lucide-react';

const CitizenReports = () => {
  const navigate = useNavigate();
  const [userReports, setUserReports] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);

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
      const userSpecificReports = parsedReports.filter((report: any) => 
        report.userId === JSON.parse(user).email
      );
      setUserReports(userSpecificReports);
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
    setUserReports(userReports.filter(report => report.id !== reportToDelete));
    
    // Show toast
    toast({
      title: "Denúncia excluída",
      description: "A denúncia foi excluída com sucesso.",
    });
    
    // Reset reportToDelete
    setReportToDelete(null);
  };

  const cancelDelete = () => {
    setReportToDelete(null);
  };

  const filteredReports = userReports.filter(report => {
    const matchesSearch = (
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-urban-blue-50/50 dark:bg-urban-dark-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-urban-dark-900 dark:text-white">
            Minhas Denúncias
          </h1>
          <p className="text-urban-dark-600 dark:text-urban-dark-300 mt-1">
            Acompanhe o status de todas as suas denúncias
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
          </div>
        </div>
        
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-urban-blue-500 border-t-transparent rounded-full"></div>
              <p className="mt-4 text-urban-dark-600 dark:text-urban-dark-300">Carregando denúncias...</p>
            </div>
          ) : filteredReports.length > 0 ? (
            filteredReports
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onDelete={handleDeleteReport}
                />
              ))
          ) : (
            <div className="text-center py-10">
              <p className="text-urban-dark-500 dark:text-urban-dark-400">
                {searchTerm || statusFilter !== 'all'
                  ? 'Nenhuma denúncia encontrada com os filtros aplicados.'
                  : 'Você ainda não fez nenhuma denúncia.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button 
                  onClick={() => navigate('/report')}
                  className="mt-4 btn-primary"
                >
                  Fazer primeira denúncia
                </button>
              )}
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
            <AlertDialogCancel onClick={cancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CitizenReports;
