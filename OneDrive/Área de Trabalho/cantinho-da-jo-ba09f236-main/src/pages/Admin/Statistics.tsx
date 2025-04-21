
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, DollarSign } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import AnimatedLayout from '@/components/AnimatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { appointments } from '@/lib/data';
import { ChartContainer as UIChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';

// Helper function to group appointments by time period
const groupAppointmentsByPeriod = (period: 'daily' | 'monthly' | 'yearly') => {
  // Create a map to store services count by time period
  const servicesMap = new Map();
  let revenueMap = new Map();
  const statusCounts = { completed: 0, pending: 0, cancelled: 0, rescheduled: 0 };

  // If no appointments, return empty data
  if (appointments.length === 0) {
    return { servicesData: [], revenueData: [], statusData: [{ name: 'No Data', value: 1 }] };
  }

  // Count appointments by service and date
  appointments.forEach(appointment => {
    // Extract date parts
    const date = new Date(appointment.date);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    // Determine the key based on selected period
    let key;
    switch(period) {
      case 'daily':
        key = `${day}/${month + 1}`;
        break;
      case 'monthly':
        key = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][month];
        break;
      case 'yearly':
        key = year.toString();
        break;
    }
    
    // Update service counts
    if (!servicesMap.has(key)) {
      servicesMap.set(key, { name: key, cortes: 0, makeups: 0, unhas: 0, outros: 0 });
    }
    
    const serviceData = servicesMap.get(key);
    
    // Categorize the service
    if (appointment.serviceName.toLowerCase().includes('corte')) {
      serviceData.cortes += 1;
    } else if (appointment.serviceName.toLowerCase().includes('makeup')) {
      serviceData.makeups += 1;
    } else if (appointment.serviceName.toLowerCase().includes('unha') || 
              appointment.serviceName.toLowerCase().includes('manicure') || 
              appointment.serviceName.toLowerCase().includes('pedicure')) {
      serviceData.unhas += 1;
    } else {
      serviceData.outros += 1;
    }
    
    // Update revenue
    if (!revenueMap.has(key)) {
      revenueMap.set(key, { name: key, faturamento: 0, agendados: 0, concluidos: 0 });
    }
    
    const revenueData = revenueMap.get(key);
    
    // Only count revenue for completed appointments
    if (appointment.status === 'confirmed') {
      revenueData.faturamento += appointment.price;
      revenueData.concluidos += 1;
    }
    
    revenueData.agendados += 1;
    
    // Update status counts
    if (appointment.status in statusCounts) {
      statusCounts[appointment.status as keyof typeof statusCounts] += 1;
    }
  });

  // Convert maps to arrays
  const servicesData = Array.from(servicesMap.values());
  const revenueData = Array.from(revenueMap.values());
  
  // Prepare status data for pie chart
  const statusData = [
    { name: 'Concluídos', value: statusCounts.completed, color: '#10B981' },
    { name: 'Pendentes', value: statusCounts.pending, color: '#F59E0B' },
    { name: 'Cancelados', value: statusCounts.cancelled, color: '#EF4444' },
    { name: 'Remarcados', value: statusCounts.rescheduled, color: '#8B21E0' }
  ].filter(item => item.value > 0);
  
  return { servicesData, revenueData, statusData };
};

const AdminStatistics = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [revenueMultiplier, setRevenueMultiplier] = useState(1);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  // Process appointment data based on selected period
  const { servicesData, revenueData, statusData } = useMemo(() => 
    groupAppointmentsByPeriod(period), [period, appointments.length]);
  
  // Calculate adjusted revenue based on multiplier
  const adjustedRevenueData = useMemo(() => 
    revenueData.map(item => ({
      ...item,
      faturamento: item.faturamento * revenueMultiplier
    })), [revenueData, revenueMultiplier]);
  
  // Verify if is admin
  if (!currentUser || !currentUser.isAdmin) {
    navigate('/login');
    return null;
  }
  
  const handleRevenueMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setRevenueMultiplier(value);
    }
  };
  
  // If there's no data for the selected period, show a message
  const hasData = servicesData.length > 0;
  
  return (
    <AnimatedLayout>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`sticky top-0 z-10 px-6 py-4 ${theme === 'dark' ? 'bg-gray-800 shadow-gray-800/20' : 'bg-white shadow-sm'}`}>
          <div className="max-w-6xl mx-auto flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin')}
              className={`mr-4 ${theme === 'dark' ? 'text-white hover:bg-gray-700' : ''}`}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Estatísticas do Salão</h1>
          </div>
        </header>
        
        <main className="max-w-6xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 grid gap-6"
          >
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Desempenho do Salão</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="revenueMultiplier" className={`text-sm whitespace-nowrap ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                      Multiplicador:
                    </Label>
                    <Input
                      id="revenueMultiplier"
                      type="number"
                      value={revenueMultiplier}
                      onChange={handleRevenueMultiplierChange}
                      className={`w-24 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                      min="0.1"
                      step="0.1"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="monthly" onValueChange={(value) => setPeriod(value as any)}>
                  <TabsList className={`mb-4 w-full justify-start ${theme === 'dark' ? 'bg-gray-700' : ''}`}>
                    <TabsTrigger 
                      value="daily" 
                      className={theme === 'dark' ? 'data-[state=active]:bg-beauty-purple data-[state=active]:text-white text-gray-300' : ''}
                    >
                      Diário
                    </TabsTrigger>
                    <TabsTrigger 
                      value="monthly" 
                      className={theme === 'dark' ? 'data-[state=active]:bg-beauty-purple data-[state=active]:text-white text-gray-300' : ''}
                    >
                      Mensal
                    </TabsTrigger>
                    <TabsTrigger 
                      value="yearly" 
                      className={theme === 'dark' ? 'data-[state=active]:bg-beauty-purple data-[state=active]:text-white text-gray-300' : ''}
                    >
                      Anual
                    </TabsTrigger>
                  </TabsList>
                  
                  {hasData ? (
                    <>
                      <TabsContent value="daily" className="mt-0">
                        <ServiceChartContainer data={servicesData} period="diário" theme={theme} />
                      </TabsContent>
                      
                      <TabsContent value="monthly" className="mt-0">
                        <ServiceChartContainer data={servicesData} period="mensal" theme={theme} />
                      </TabsContent>
                      
                      <TabsContent value="yearly" className="mt-0">
                        <ServiceChartContainer data={servicesData} period="anual" theme={theme} />
                      </TabsContent>
                    </>
                  ) : (
                    <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                      Nenhum atendimento registrado para este período.
                    </div>
                  )}
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}>
                <CardHeader>
                  <CardTitle className={theme === 'dark' ? 'text-white' : ''}>
                    Faturamento {period === 'daily' ? 'Diário' : period === 'monthly' ? 'Mensal' : 'Anual'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hasData ? (
                    <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                      <LineChart data={adjustedRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#555' : '#ccc'} />
                        <XAxis dataKey="name" stroke={theme === 'dark' ? '#aaa' : '#666'} />
                        <YAxis stroke={theme === 'dark' ? '#aaa' : '#666'} />
                        <Tooltip 
                          formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Faturamento']}
                          contentStyle={theme === 'dark' ? { backgroundColor: '#333', borderColor: '#555', color: '#fff' } : undefined}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="faturamento" 
                          name="Faturamento (R$)"
                          stroke="#8B21E0" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="agendados" 
                          name="Agendados"
                          stroke="#F59E0B" 
                          strokeWidth={2}
                          activeDot={{ r: 6 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="concluidos" 
                          name="Concluídos"
                          stroke="#10B981" 
                          strokeWidth={2}
                          activeDot={{ r: 6 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                      Nenhum faturamento registrado para este período.
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}>
                <CardHeader>
                  <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Status dos Agendamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  {statusData.length > 0 && statusData[0].name !== 'No Data' ? (
                    <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={isMobile ? 60 : 80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} agendamentos`, 'Quantidade']} 
                          contentStyle={theme === 'dark' ? { backgroundColor: '#333', borderColor: '#555', color: '#fff' } : undefined}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                      Nenhum agendamento registrado.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </AnimatedLayout>
  );
};

interface ServiceChartContainerProps {
  data: any[];
  period: string;
  theme: 'light' | 'dark';
}

const ServiceChartContainer = ({ data, period, theme }: ServiceChartContainerProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-8">
      <div className={isMobile ? "h-60" : "h-80"}>
        <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Serviços {period}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#555' : '#ccc'} />
            <XAxis dataKey="name" stroke={theme === 'dark' ? '#aaa' : '#666'} />
            <YAxis stroke={theme === 'dark' ? '#aaa' : '#666'} />
            <Tooltip contentStyle={theme === 'dark' ? { backgroundColor: '#333', borderColor: '#555', color: '#fff' } : undefined} />
            <Legend />
            <Bar dataKey="cortes" name="Cortes" fill="#8B21E0" />
            <Bar dataKey="makeups" name="Makeups" fill="#E83E8C" />
            <Bar dataKey="unhas" name="Unhas" fill="#F8BBD0" />
            <Bar dataKey="outros" name="Outros" fill="#64748B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminStatistics;
