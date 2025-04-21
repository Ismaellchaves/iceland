import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ReportCard from '@/components/ReportCard';
import MapComponent from '@/components/MapComponent';
import { toast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Filter, Search, MapPin, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const AdminReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [message, setMessage] = useState('');

  const categories = [
    { id: 'buraco', name: 'Buraco na Via' },
    { id: 'iluminacao', name: 'Problema de Iluminação' },
    { id: 'lixo', name: 'Descarte Irregular de Lixo' },
    { id: 'poluicao', name: 'Poluição' },
    { id: 'transito', name: 'Problema de Trânsito' },
    { id: 'outros', name: 'Outros' },
  ];

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
    }
    setLoading(false);
  }, [navigate]);

  const handleDeleteReport = (id: string) => {
    setReportToDelete(id);
  };

  const confirmDelete = () => {
    if (!reportToDelete) return;
    
    const allReports = JSON.parse(localStorage.getItem('reports') || '[]');
    const updatedReports = allReports.filter((report: any) => report.id !== reportToDelete);
    localStorage.setItem('reports', JSON.stringify(updatedReports));
    setReports(reports.filter(report => report.id !== reportToDelete));
    toast({
      title: "Denúncia excluída",
      description: "A denúncia foi excluída com sucesso.",
    });
    setReportToDelete(null);
  };

  const handleStatusChange = (id: string, status: string) => {
    const allReports = JSON.parse(localStorage.getItem('reports') || '[]');
    const updatedReports = allReports.map((report: any) => {
      if (report.id === id) {
        return { ...report, status };
      }
      return report;
    });
    localStorage.setItem('reports', JSON.stringify(updatedReports));
    setReports(updatedReports);
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

  const handleMessage = (id: string) => {
    const report = reports.find(r => r.id === id);
    if (report) {
      setSelectedReport(report);
    }
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedReport) return;
    
    toast({
      title: "Mensagem enviada",
      description: `Sua mensagem foi enviada para ${selectedReport.userName}.`,
    });
    
    setMessage('');
    setSelectedReport(null);
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

  const mapCenterCoordinates = {
    lat: -5.1753,
    lng: -40.6669
  };

  return (
    <div className="min-h-screen bg-urban-blue-50/50 dark:bg-urban-dark-900">
      <Navbar isAdmin />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-urban-dark-900 dark:text-white">
            Acompanhamento de Denúncias
          </h1>
          <p className="text-urban-dark-600 dark:text-urban-dark-300 mt-1">
            Visualize e gerencie todas as denúncias de Crateús, Ceará
          </p>
        </div>
        
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setShowMap(!showMap)} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showMap 
                ? 'bg-urban-blue-500 text-white' 
                : 'bg-white dark:bg-urban-dark-800 text-urban-dark-800 dark:text-white border border-urban-dark-200 dark:border-urban-dark-700'
            }`}
          >
            <MapPin className="h-5 w-5" />
            {showMap ? 'Modo Lista' : 'Ver no Mapa'}
          </button>
          
          <button 
            onClick={() => navigate('/admin/management')} 
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-urban-dark-800 text-urban-dark-800 dark:text-white border border-urban-dark-200 dark:border-urban-dark-700 rounded-lg"
          >
            <MessageSquare className="h-5 w-5" />
            Gestão de Denúncias
          </button>
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
        
        {showMap ? (
          <div className="bg-white dark:bg-urban-dark-800 rounded-xl shadow-sm border border-urban-dark-200 dark:border-urban-dark-700 overflow-hidden">
            <div className="p-4 border-b border-urban-dark-200 dark:border-urban-dark-700">
              <h2 className="text-lg font-semibold text-urban-dark-900 dark:text-white">
                Mapa de Denúncias - Crateús, Ceará
              </h2>
              <p className="text-sm text-urban-dark-600 dark:text-urban-dark-300">
                Visualize a distribuição geográfica das denúncias em Crateús
              </p>
            </div>
            <MapComponent reports={filteredReports} height="500px" />
          </div>
        ) : (
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
                    isAdmin
                    onDelete={handleDeleteReport}
                    onStatusChange={handleStatusChange}
                    onMessage={handleMessage}
                  />
                ))
            ) : (
              <div className="text-center py-10">
                <p className="text-urban-dark-500 dark:text-urban-dark-400">
                  Nenhuma denúncia encontrada com os filtros aplicados.
                </p>
              </div>
            )}
          </div>
        )}
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
      
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar mensagem</DialogTitle>
            <DialogDescription>
              Envie uma mensagem para {selectedReport?.userName} sobre a denúncia "{selectedReport?.title}".
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva sua mensagem aqui..."
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReport(null)}>Cancelar</Button>
            <Button onClick={sendMessage}>Enviar mensagem</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReports;

