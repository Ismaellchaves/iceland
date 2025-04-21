import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, PieChart, MessageSquare, Users, Image, Settings, LogOut, Menu, X, UserRound, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { appointments } from '@/lib/data';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import UserAvatar from '@/components/UserAvatar';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);

  const pendingAppointmentsCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedAppointmentsCount = appointments.filter(a => a.status === 'confirmed').length;
  const totalAppointmentsCount = appointments.length;

  // Calculate total revenue
  const totalRevenue = appointments
    .filter(a => a.status !== 'cancelled')
    .reduce((sum, appointment) => sum + appointment.price, 0);

  // Get confirmed appointments dates for the calendar
  const appointmentDates = appointments
    .filter(a => a.status === 'confirmed')
    .map(a => a.date);

  // Get appointments for the selected date
  const selectedDateAppointments = selectedDate
    ? appointments.filter(a =>
      a.date.toDateString() === selectedDate.toDateString() &&
      a.status === 'confirmed'
    )
    : [];

  const MenuItems = [
    { icon: <CalendarIcon className="h-6 w-6" />, title: "Agendamentos", path: "/admin/appointments", count: totalAppointmentsCount },
    { icon: <MessageSquare className="h-6 w-6" />, title: "Chats", path: "/admin/chats" },
    { icon: <Image className="h-6 w-6" />, title: "Galeria", path: "/admin/gallery" },
    { icon: <PieChart className="h-6 w-6" />, title: "Estatísticas", path: "/admin/statistics" },
  ];

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Calendar date render function
  const renderCalendarDay = (day: Date, modifiers: any) => {
    const hasAppointment = appointmentDates.some(date =>
      date.getDate() === day.getDate() &&
      date.getMonth() === day.getMonth() &&
      date.getFullYear() === day.getFullYear()
    );

    // Count appointments for this day
    const appointmentsCount = appointments.filter(a =>
      a.date.getDate() === day.getDate() &&
      a.date.getMonth() === day.getMonth() &&
      a.date.getFullYear() === day.getFullYear() &&
      a.status === 'confirmed'
    ).length;

    return (
      <div className="relative">
        <div>{day.getDate()}</div>
        {hasAppointment && (
          <div className={`absolute bottom-0 left-0 right-0 h-1.5 rounded-full ${theme === 'dark' ? 'bg-beauty-light-purple' : 'bg-beauty-purple'}`}></div>
        )}
        {appointmentsCount > 0 && (
          <div className="absolute top-0 right-0 w-4 h-4 bg-beauty-purple rounded-full flex items-center justify-center text-[10px] text-white">
            {appointmentsCount}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="grid grid-cols-1 md:grid-cols-5 h-screen overflow-hidden">
        {/* Mobile Header with Menu Button */}
        {isMobile && (
          <header className={`fixed top-0 left-0 right-0 z-30 ${theme === 'dark' ? 'bg-gray-800' : 'bg-beauty-purple'} px-4 py-3 flex justify-between items-center`}>
            <div className="flex items-center gap-2">
              <img src="/lovable-uploads/d8a02b59-bdd8-45a4-8ccb-5539515a2c87.png" alt="Logo" className="w-6 h-6" />
              <h1 className="text-white text-lg font-bold">Cantinho Da Jô Admin</h1>
            </div>
            <Button variant="ghost" onClick={toggleMobileMenu} className="text-white p-1">
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </header>
        )}

        {/* Mobile Sidebar - Shown when menu is toggled */}
        <AnimatePresence>
          {isMobile && showMobileMenu && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className={`fixed inset-0 z-20 ${theme === 'dark' ? 'bg-black/60' : 'bg-black/40'}`}
              onClick={toggleMobileMenu}
            >
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className={`w-[250px] h-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-beauty-purple'} p-4 overflow-y-auto`}
                onClick={e => e.stopPropagation()}
              >
                <div className="mt-16 flex flex-col h-full">
                  <nav className="flex-1">
                    <ul className="space-y-2">
                      {MenuItems.map((item, index) => (
                        <li key={index}>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              navigate(item.path);
                              setShowMobileMenu(false);
                            }}
                            className={`w-full justify-start text-white hover:bg-white/10 ${location.pathname === item.path ? 'bg-white/20' : ''
                              }`}
                          >
                            {item.icon}
                            <span className="ml-2">{item.title}</span>
                            {item.count && (
                              <span className="ml-auto bg-white/20 text-xs rounded-full px-2 py-1">
                                {item.count}
                              </span>
                            )}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-white/10">
                      <div className="flex items-center">
                        <Settings className="h-5 w-5 text-white" />
                        <span className="ml-2 text-white">Tema</span>
                      </div>
                      <ThemeToggle className={theme === 'dark' ? 'bg-gray-700' : 'bg-white/20'} />
                    </div>

                    <Button
                      variant="ghost"
                      onClick={logout}
                      className="w-full justify-start text-white hover:bg-white/10"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="ml-2">Sair</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        {!isMobile && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`col-span-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-beauty-purple'} p-4 flex flex-col h-full shadow-xl`}
          >
            <div className="flex items-center gap-2 mb-8 mt-2">
              <img src="/lovable-uploads/d8a02b59-bdd8-45a4-8ccb-5539515a2c87.png" alt="Logo" className="w-8 h-8" />
              <h1 className="text-white text-xl font-bold">BeautyAdmin</h1>
            </div>

            <nav className="flex-1">
              <ul className="space-y-2">
                {MenuItems.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => navigate(item.path)}
                      className={`w-full justify-start text-white hover:bg-white/10 ${location.pathname === item.path ? 'bg-white/20' : ''
                        }`}
                    >
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                      {item.count && (
                        <span className="ml-auto bg-white/20 text-xs rounded-full px-2 py-1">
                          {item.count}
                        </span>
                      )}
                    </Button>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto space-y-2">
              <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-white/10">
                <div className="flex items-center">
                  <Settings className="h-5 w-5 text-white" />
                  <span className="ml-2 text-white">Tema</span>
                </div>
                <ThemeToggle className={theme === 'dark' ? 'bg-gray-700' : 'bg-white/20'} />
              </div>

              <Button
                variant="ghost"
                onClick={logout}
                className="w-full justify-start text-white hover:bg-white/10"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-2">Sair</span>
              </Button>
            </div>
          </motion.div>
        )}

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`col-span-4 p-4 md:p-6 overflow-auto ${isMobile ? 'mt-16' : ''}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>Painel de Controle</h1>
            <p className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <StatsCard
              icon={<CalendarIcon className={`h-6 w-6 md:h-8 md:w-8 ${theme === 'dark' ? 'text-beauty-light-purple' : 'text-beauty-purple'}`} />}
              title="Agendamentos"
              value={totalAppointmentsCount.toString()}
              description="Total"
              theme={theme}
              onClick={() => navigate('/admin/appointments')}
            />
            <StatsCard
              icon={<MessageSquare className={`h-6 w-6 md:h-8 md:w-8 ${theme === 'dark' ? 'text-beauty-light-purple' : 'text-beauty-purple'}`} />}
              title="Pendentes"
              value={pendingAppointmentsCount.toString()}
              description="Necessitam atenção"
              theme={theme}
              onClick={() => navigate('/admin/appointments')}
            />
            <StatsCard
              icon={<Users className={`h-6 w-6 md:h-8 md:w-8 ${theme === 'dark' ? 'text-beauty-light-purple' : 'text-beauty-purple'}`} />}
              title="Confirmados"
              value={confirmedAppointmentsCount.toString()}
              description="Agendamentos"
              theme={theme}
              onClick={() => navigate('/admin/appointments')}
            />
            <StatsCard
              icon={<PieChart className={`h-6 w-6 md:h-8 md:w-8 ${theme === 'dark' ? 'text-beauty-light-purple' : 'text-beauty-purple'}`} />}
              title="Receita"
              value={`R$ ${totalRevenue.toFixed(2).replace('.', ',')}`}
              description="Total"
              theme={theme}
              onClick={() => navigate('/admin/statistics')}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Calendar Card */}
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Calendário de Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`rounded-lg p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      if (date) {
                        // Check if there are appointments on this date
                        const hasAppointments = appointments.some(
                          a => a.date.toDateString() === date.toDateString() && a.status === 'confirmed'
                        );
                        if (hasAppointments) {
                          setShowAppointmentDetails(true);
                        }
                      }
                    }}
                    locale={pt}
                    modifiersClassNames={{
                      selected: 'bg-beauty-purple text-white',
                    }}
                    className={theme === 'dark' ? 'text-white' : ''}
                  />
                </div>

                {/* Appointment Details Sheet */}
                <Sheet open={showAppointmentDetails} onOpenChange={setShowAppointmentDetails}>
                  <SheetContent className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}>
                    <SheetHeader>
                      <SheetTitle className={theme === 'dark' ? 'text-white' : ''}>
                        Agendamentos do dia {selectedDate ? format(selectedDate, "d 'de' MMMM", { locale: pt }) : ''}
                      </SheetTitle>
                      <SheetDescription className={theme === 'dark' ? 'text-gray-300' : ''}>
                        {selectedDateAppointments.length} agendamento(s) confirmado(s) para este dia
                      </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-4">
                      {selectedDateAppointments.map((appointment) => {
                        const client = appointment.clientName;
                        return (
                          <div
                            key={appointment.id}
                            className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50 shadow-sm'} cursor-pointer transition`}
                            onClick={() => navigate(`/admin/chat/${appointment.id}`)}
                          >
                            <div className="flex items-center gap-3">
                              <UserAvatar
                                name={client}
                                size="sm"
                              />
                              <div className="flex-1">
                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{client}</p>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{appointment.serviceName}</p>
                                <p className="text-sm text-beauty-purple">
                                  {format(appointment.date, "HH:mm")}
                                </p>
                              </div>
                              <ChevronRight className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                            </div>
                          </div>
                        );
                      })}

                      {selectedDateAppointments.length === 0 && (
                        <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            Não há agendamentos confirmados para este dia.
                          </p>
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Agendamentos Recentes</CardTitle>
              </CardHeader>
              <CardContent className={theme === 'dark' ? 'text-gray-300' : ''}>
                {appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.slice(0, 3).map(appointment => (
                      <div
                        key={appointment.id}
                        className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} cursor-pointer transition`}
                        onClick={() => navigate(`/admin/chat/${appointment.id}`)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            {appointment.clientName}
                          </span>
                          <span className={`text-sm ${theme === 'dark' ? 'text-beauty-light-purple' : 'text-beauty-purple'}`}>
                            R$ {appointment.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {appointment.serviceName}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${appointment.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                              appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                'bg-amber-100 text-amber-800'
                            }`}>
                            {appointment.status === 'pending' ? 'Pendente' :
                              appointment.status === 'confirmed' ? 'Confirmado' : 'Remarcado'}
                          </span>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className={`w-full mt-2 ${theme === 'dark' ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : ''}`}
                      onClick={() => navigate('/admin/appointments')}
                    >
                      Ver todos
                    </Button>
                  </div>
                ) : (
                  <p>Nenhum agendamento disponível.</p>
                )}
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent className={theme === 'dark' ? 'text-gray-300' : ''}>
                <div className="space-y-4">
                  {appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.slice(0, 3).map((appointment, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`mt-1 w-2 h-2 rounded-full ${index === 0 ? 'bg-green-400' :
                              index === 1 ? 'bg-blue-400' :
                                'bg-amber-400'
                            }`}></div>
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">{appointment.clientName}</span>
                              {index === 0 ? ' agendou ' :
                                index === 1 ? ' remarcou ' :
                                  ' confirmou '}
                              {appointment.serviceName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(appointment.date.getTime() - index * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Nenhuma atividade recente.</p>
                  )}
                  <Button
                    variant="outline"
                    className={`w-full mt-2 ${theme === 'dark' ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : ''}`}
                    onClick={() => navigate('/admin/statistics')}
                  >
                    Ver estatísticas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  theme: 'light' | 'dark';
  onClick?: () => void;
}

const StatsCard = ({ icon, title, value, description, theme, onClick }: StatsCardProps) => (
  <Card
    className={`transition-all cursor-pointer ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'hover:shadow-md'}`}
    onClick={onClick}
  >
    <CardContent className="p-4 md:p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-xs md:text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{title}</p>
          <p className={`text-lg md:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>{value}</p>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
        </div>
        <div className={`p-2 md:p-3 rounded-full ${theme === 'dark' ? 'bg-beauty-purple/20' : 'bg-beauty-soft-purple'}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AdminDashboard;