
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import AnimatedLayout from '@/components/AnimatedLayout';
import AppointmentCard, { Appointment } from '@/components/AppointmentCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { appointments, getAppointmentsByClientId } from '@/lib/data';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Appointments = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const [status, setStatus] = useState<'all' | 'pending' | 'confirmed' | 'rescheduled' | 'cancelled'>('all');
  
  useEffect(() => {
    if (currentUser) {
      const clientAppointments = getAppointmentsByClientId(currentUser.id);
      setUserAppointments(clientAppointments);
    }
  }, [currentUser, appointments]);
  
  if (!currentUser) {
    navigate('/login');
    return null;
  }
  
  const filteredAppointments = userAppointments.filter(appointment => {
    if (status === 'all') return true;
    return appointment.status === status;
  });
  
  const handleAppointmentClick = (appointment: Appointment) => {
    navigate(`/chat/${appointment.id}`);
  };
  
  return (
    <AnimatedLayout>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`${theme === 'dark' ? 'bg-gray-800 shadow-gray-800/20' : 'bg-white shadow-sm'} sticky top-0 z-10 px-4 sm:px-6 py-4`}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/services')}
                className={`mr-4 ${theme === 'dark' ? 'text-white hover:bg-gray-700' : ''}`}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Meus Agendamentos</h1>
            </div>
            <Button
              onClick={() => navigate('/services')}
              className="beauty-button flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              {!isMobile && "Novo"}
            </Button>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Tabs defaultValue="all" onValueChange={(value) => setStatus(value as any)}>
              <TabsList className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-beauty-soft-purple'} mb-6 w-full justify-start overflow-x-auto`}>
                <TabsTrigger value="all" className={`px-4 py-2 ${theme === 'dark' 
                  ? 'data-[state=active]:bg-beauty-purple data-[state=active]:text-white text-gray-300' 
                  : 'data-[state=active]:bg-beauty-purple data-[state=active]:text-white'}`}>
                  Todos
                </TabsTrigger>
                <TabsTrigger value="pending" className={`px-4 py-2 ${theme === 'dark' 
                  ? 'data-[state=active]:bg-beauty-purple data-[state=active]:text-white text-gray-300' 
                  : 'data-[state=active]:bg-beauty-purple data-[state=active]:text-white'}`}>
                  Pendentes
                </TabsTrigger>
                <TabsTrigger value="confirmed" className={`px-4 py-2 ${theme === 'dark' 
                  ? 'data-[state=active]:bg-beauty-purple data-[state=active]:text-white text-gray-300' 
                  : 'data-[state=active]:bg-beauty-purple data-[state=active]:text-white'}`}>
                  Confirmados
                </TabsTrigger>
                <TabsTrigger value="rescheduled" className={`px-4 py-2 ${theme === 'dark' 
                  ? 'data-[state=active]:bg-beauty-purple data-[state=active]:text-white text-gray-300' 
                  : 'data-[state=active]:bg-beauty-purple data-[state=active]:text-white'}`}>
                  Remarcados
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4 mt-0">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onClick={() => handleAppointmentClick(appointment)}
                      theme={theme}
                    />
                  ))
                ) : (
                  <div className={`text-center py-8 ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}>Nenhum agendamento encontrado.</p>
                    <Button
                      onClick={() => navigate('/services')}
                      variant="outline"
                      className={`mt-4 ${theme === 'dark' 
                        ? 'border-beauty-light-purple text-beauty-light-purple hover:bg-gray-700' 
                        : 'border-beauty-purple text-beauty-purple'}`}
                    >
                      Agendar um serviço
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              {['pending', 'confirmed', 'rescheduled'].map((tabStatus) => (
                <TabsContent key={tabStatus} value={tabStatus} className="space-y-4 mt-0">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onClick={() => handleAppointmentClick(appointment)}
                        theme={theme}
                      />
                    ))
                  ) : (
                    <div className={`text-center py-8 ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}>
                        Nenhum agendamento {
                          tabStatus === 'pending' ? 'pendente' :
                          tabStatus === 'confirmed' ? 'confirmado' : 'remarcado'
                        } encontrado.
                      </p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </main>
      </div>
    </AnimatedLayout>
  );
};

export default Appointments;
