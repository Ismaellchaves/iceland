
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, ChevronRight } from 'lucide-react';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AnimatedLayout from '@/components/AnimatedLayout';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Service, services, createAppointment } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

const Schedule = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();
  
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Horários disponíveis para agendamento
  const availableTimes = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  
  useEffect(() => {
    if (serviceId) {
      const foundService = services.find(s => s.id === serviceId);
      if (foundService) {
        setService(foundService);
      } else {
        navigate('/services');
      }
    }
  }, [serviceId, navigate]);
  
  if (!currentUser) {
    navigate('/login');
    return null;
  }
  
  if (!service) {
    return null;
  }
  
  const handleSchedule = () => {
    if (!date || !selectedTime) {
      toast({
        title: "Erro ao agendar",
        description: "Selecione uma data e um horário.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Criar o objeto Date com a data e hora selecionadas
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const appointmentDate = setMinutes(setHours(date, hours), minutes);
      
      // Criar o agendamento
      const appointment = createAppointment(
        currentUser.id,
        service.name,
        service.price,
        appointmentDate
      );
      
      toast({
        title: "Agendamento realizado!",
        description: "Seu serviço foi agendado com sucesso.",
      });
      
      // Redirecionar para o chat
      navigate(`/chat/${appointment.id}`);
    } catch (error) {
      toast({
        title: "Erro ao agendar",
        description: "Ocorreu um erro ao criar seu agendamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AnimatedLayout>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm sticky top-0 z-10 px-6 py-4`}>
          <div className="max-w-4xl mx-auto flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/services')}
              className={`mr-4 ${theme === 'dark' ? 'text-white hover:bg-gray-700' : ''}`}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Agendar Serviço</h1>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 mb-8`}>
              <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>{service.name}</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} mb-4`}>{service.description}</p>
              <p className="text-lg font-bold text-beauty-purple">
                R$ {service.price.toFixed(2).replace('.', ',')}
              </p>
            </div>
            
            <h3 className={`text-lg font-semibold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : ''}`}>
              <Calendar className="h-5 w-5 mr-2 text-beauty-purple" />
              Selecione uma data
            </h3>
            
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-4 mb-8`}>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className={`mx-auto pointer-events-auto ${theme === 'dark' ? 'dark:bg-gray-800 dark:text-white' : ''}`}
                locale={ptBR}
                disabled={(date) => {
                  // Desabilitar datas no passado e o dia atual
                  return date < new Date();
                }}
              />
            </div>
            
            <h3 className={`text-lg font-semibold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : ''}`}>
              <Clock className="h-5 w-5 mr-2 text-beauty-purple" />
              Selecione um horário
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {availableTimes.map((time) => (
                <motion.button
                  key={time}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-xl text-center transition-colors ${
                    selectedTime === time
                      ? 'bg-beauty-purple text-white'
                      : theme === 'dark'
                        ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700'
                        : 'bg-white border border-beauty-light-purple/30 text-beauty-purple'
                  }`}
                >
                  {time}
                </motion.button>
              ))}
            </div>
            
            {date && selectedTime && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${theme === 'dark' ? 'bg-gray-800/80' : 'bg-beauty-soft-purple'} rounded-2xl p-6 mb-8`}
              >
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Resumo</h3>
                <div className="space-y-2 mb-4">
                  <p className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                  <p className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                    <Clock className="h-4 w-4 mr-2" />
                    {selectedTime}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>Preço total</p>
                    <p className="text-lg font-bold text-beauty-purple">
                      R$ {service.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-end"
            >
              <Button
                onClick={handleSchedule}
                className="beauty-button group"
                size="lg"
                disabled={!date || !selectedTime || isLoading}
              >
                <span>{isLoading ? 'Agendando...' : 'Confirmar agendamento'}</span>
                <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </AnimatedLayout>
  );
};

export default Schedule;
