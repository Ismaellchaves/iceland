
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ChevronDown, Search, UserPlus, X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Appointment } from '@/components/AppointmentCard';
import { appointments, users } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import ClientProfile from '@/components/ClientProfile';

const AdminAppointments = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showClientProfile, setShowClientProfile] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!currentUser?.isAdmin) {
      navigate('/login');
      return;
    }

    // Sort appointments by date (newest first)
    const sortedAppointments = [...appointments].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Apply filters
    let filtered = sortedAppointments;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(appointment => 
        appointment.clientName.toLowerCase().includes(term) || 
        appointment.serviceName.toLowerCase().includes(term)
      );
    }
    
    setFilteredAppointments(filtered);
  }, [currentUser, navigate, searchTerm, statusFilter, appointments]);

  const handleStatusChange = (appointmentId: string, newStatus: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled') => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.status = newStatus;
      toast({
        title: 'Status atualizado',
        description: `O agendamento de ${appointment.clientName} foi ${getStatusText(newStatus)}.`,
      });
      // Force refresh of filtered appointments
      setFilteredAppointments([...filteredAppointments]);
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'pendente';
      case 'confirmed': return 'confirmado';
      case 'rescheduled': return 'reagendado';
      case 'cancelled': return 'cancelado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': 
        return theme === 'dark' ? 'text-yellow-300 bg-yellow-900/30' : 'text-yellow-600 bg-yellow-100';
      case 'confirmed': 
        return theme === 'dark' ? 'text-green-300 bg-green-900/30' : 'text-green-600 bg-green-100';
      case 'rescheduled': 
        return theme === 'dark' ? 'text-blue-300 bg-blue-900/30' : 'text-blue-600 bg-blue-100';
      case 'cancelled': 
        return theme === 'dark' ? 'text-red-300 bg-red-900/30' : 'text-red-600 bg-red-100';
      default: 
        return theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'rescheduled': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewClientProfile = (clientId: string) => {
    const client = users.find(user => user.id === clientId);
    if (client) {
      setSelectedClient(client);
      setShowClientProfile(true);
    }
  };

  return (
    <div className={`h-full min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>Gerenciar Agendamentos</h1>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}>
              Visualize e gerencie todos os agendamentos
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <Input
                placeholder="Buscar por cliente ou serviço"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-9 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' : ''}`}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              )}
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={`w-full sm:w-40 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}`}>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="confirmed">Confirmados</SelectItem>
                <SelectItem value="rescheduled">Reagendados</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList className={`grid w-full grid-cols-2 mb-8 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <div className={`rounded-lg overflow-hidden border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200'}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Cliente</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Serviço</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Data</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                      <th className={`px-6 py-3 text-right text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Ações</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment) => (
                        <tr key={appointment.id} className={theme === 'dark' ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div 
                                className="cursor-pointer flex items-center"
                                onClick={() => handleViewClientProfile(appointment.clientId)}
                              >
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-beauty-light-purple' : 'bg-beauty-purple'} text-white`}>
                                  {appointment.clientImage ? (
                                    <img src={appointment.clientImage} alt={appointment.clientName} className="h-8 w-8 rounded-full" />
                                  ) : (
                                    <User className="h-4 w-4" />
                                  )}
                                </div>
                                <div className="ml-3">
                                  <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{appointment.clientName}</div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            {appointment.serviceName}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            <div className="flex flex-col">
                              <span>{formatDate(appointment.date)}</span>
                              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{formatTime(appointment.date)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {getStatusIcon(appointment.status)}
                              <span className="ml-1">{getStatusText(appointment.status)}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost" 
                                size="sm"
                                className={`${theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-beauty-purple hover:bg-beauty-soft-purple'}`}
                                onClick={() => navigate(`/admin/chat/${appointment.clientId}?appointment=${appointment.id}`)}
                              >
                                Chat
                              </Button>
                              
                              <Select 
                                value={appointment.status} 
                                onValueChange={(value) => handleStatusChange(appointment.id, value as any)}
                              >
                                <SelectTrigger className={`w-[130px] h-8 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}`}>
                                  <span className="flex items-center">
                                    <ChevronDown className="h-4 w-4 mr-1" />
                                    <span>Mudar Status</span>
                                  </span>
                                </SelectTrigger>
                                <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}>
                                  <SelectItem value="pending">Pendente</SelectItem>
                                  <SelectItem value="confirmed">Confirmar</SelectItem>
                                  <SelectItem value="rescheduled">Reagendar</SelectItem>
                                  <SelectItem value="cancelled">Cancelar</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className={`px-6 py-8 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          <div className="flex flex-col items-center">
                            <Calendar className="h-12 w-12 mb-2 opacity-20" />
                            <p className="text-lg font-medium mb-1">Nenhum agendamento encontrado</p>
                            <p className="text-sm">
                              {searchTerm || statusFilter !== 'all' 
                                ? 'Tente ajustar os filtros de busca' 
                                : 'Não há agendamentos no sistema ainda'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-200'}`}>
              <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Visualização de calendário em desenvolvimento...
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={showClientProfile} onOpenChange={setShowClientProfile}>
        <DialogContent className={`p-0 overflow-hidden max-w-md ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
          {selectedClient && (
            <ClientProfile 
              user={selectedClient} 
              onClose={() => setShowClientProfile(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAppointments;
