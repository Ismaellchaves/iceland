
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CalendarCheck, CalendarDays, CalendarRange } from 'lucide-react';

const AdminStatistics = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('day');

  useEffect(() => {
    // Carregar relatórios do localStorage
    const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
    setReports(storedReports);
  }, []);

  // Função para filtrar os relatórios com base no período selecionado
  const filteredReports = useMemo(() => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 1);
    }
    
    return reports.filter(report => {
      const reportDate = new Date(report.createdAt);
      return reportDate >= startDate && reportDate <= now;
    });
  }, [reports, timeRange]);

  // Dados para o gráfico de categorias
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    
    filteredReports.forEach(report => {
      if (categories[report.category]) {
        categories[report.category]++;
      } else {
        categories[report.category] = 1;
      }
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [filteredReports]);

  // Dados para o gráfico de status
  const statusData = useMemo(() => {
    const status: Record<string, number> = {
      'pendente': 0,
      'em_analise': 0,
      'em_progresso': 0,
      'concluido': 0,
      'rejeitado': 0
    };
    
    filteredReports.forEach(report => {
      if (status[report.status]) {
        status[report.status]++;
      } else {
        status[report.status] = 1;
      }
    });
    
    return Object.entries(status).map(([name, value]) => ({ 
      name: name === 'pendente' ? 'Pendente' : 
            name === 'em_analise' ? 'Em Análise' : 
            name === 'em_progresso' ? 'Em Progresso' : 
            name === 'concluido' ? 'Concluído' : 
            name === 'rejeitado' ? 'Rejeitado' : name,
      value 
    }));
  }, [filteredReports]);

  // Cores para o gráfico de pizza
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Dados para o gráfico de tendência ao longo do tempo
  const timeData = useMemo(() => {
    const timeMap: Record<string, number> = {};
    let format = '';
    
    // Definir formato com base no intervalo de tempo
    switch (timeRange) {
      case 'day':
        format = 'HH'; // Horas
        break;
      case 'week':
        format = 'ddd'; // Dia da semana
        break;
      case 'month':
        format = 'DD'; // Dia do mês
        break;
      case 'year':
        format = 'MMM'; // Mês
        break;
      default:
        format = 'HH';
    }
    
    // Inicializar timeMap com base no intervalo
    if (timeRange === 'day') {
      for (let i = 0; i < 24; i++) {
        timeMap[`${i}h`] = 0;
      }
    } else if (timeRange === 'week') {
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      days.forEach(day => {
        timeMap[day] = 0;
      });
    } else if (timeRange === 'month') {
      for (let i = 1; i <= 31; i++) {
        timeMap[`${i}`] = 0;
      }
    } else if (timeRange === 'year') {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      months.forEach(month => {
        timeMap[month] = 0;
      });
    }
    
    // Contar relatórios por unidade de tempo
    filteredReports.forEach(report => {
      const date = new Date(report.createdAt);
      let key = '';
      
      if (timeRange === 'day') {
        key = `${date.getHours()}h`;
      } else if (timeRange === 'week') {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        key = days[date.getDay()];
      } else if (timeRange === 'month') {
        key = `${date.getDate()}`;
      } else if (timeRange === 'year') {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        key = months[date.getMonth()];
      }
      
      if (timeMap[key] !== undefined) {
        timeMap[key]++;
      }
    });
    
    return Object.entries(timeMap).map(([name, value]) => ({ name, value }));
  }, [filteredReports, timeRange]);

  return (
    <div className="min-h-screen bg-urban-blue-50/50 dark:bg-urban-dark-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-urban-dark-900 dark:text-white mb-6">
          Estatísticas
        </h1>

        <Tabs defaultValue="day" onValueChange={setTimeRange} className="w-full mb-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="day" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Dia</span>
            </TabsTrigger>
            <TabsTrigger value="week" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Semana</span>
            </TabsTrigger>
            <TabsTrigger value="month" className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" />
              <span>Mês</span>
            </TabsTrigger>
            <TabsTrigger value="year" className="flex items-center gap-2">
              <CalendarRange className="h-4 w-4" />
              <span>Ano</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
              <CardDescription>
                Visão geral das denúncias nos últimos {
                  timeRange === 'day' ? 'dias' : 
                  timeRange === 'week' ? '7 dias' : 
                  timeRange === 'month' ? '30 dias' : '12 meses'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-urban-dark-500 dark:text-urban-dark-300">Total de Denúncias</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{filteredReports.length}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm text-urban-dark-500 dark:text-urban-dark-300">Concluídas</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {filteredReports.filter(r => r.status === 'concluido').length}
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <p className="text-sm text-urban-dark-500 dark:text-urban-dark-300">Em Progresso</p>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {filteredReports.filter(r => r.status === 'em_progresso' || r.status === 'em_analise').length}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <p className="text-sm text-urban-dark-500 dark:text-urban-dark-300">Pendentes</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {filteredReports.filter(r => r.status === 'pendente').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status das Denúncias</CardTitle>
              <CardDescription>Distribuição por status</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Denúncias</CardTitle>
              <CardDescription>
                Evolução ao longo do {
                  timeRange === 'day' ? 'dia' : 
                  timeRange === 'week' ? 'da semana' : 
                  timeRange === 'month' ? 'mês' : 'ano'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} name="Denúncias" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Categorias de Denúncias</CardTitle>
            <CardDescription>Distribuição por tipo de problema</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStatistics;
