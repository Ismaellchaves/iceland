import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Calendar, Phone, Mail, Home, Lock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import LocationSelector from '@/components/LocationSelector';
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    birthDate: undefined as Date | undefined,
    birthDateInput: '',
    phone: '',
    cpf: '',
    email: '',
    password: '',
    address: '',
    city: 'Crateús',
    state: 'CE',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, phone: formatPhone(value) }));
  };

  const handleChangeCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, cpf: formatCPF(value) }));
  };

  const handleChangeBirthDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, birthDateInput: value }));
    
    try {
      let parsedDate: Date | null = null;
      
      if (value.includes('/')) {
        const parts = value.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);
          
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            parsedDate = new Date(year, month, day);
          }
        }
      } else if (value.includes('-')) {
        parsedDate = new Date(value);
      }
      
      if (parsedDate && !isNaN(parsedDate.getTime())) {
        setFormData(prev => ({ ...prev, birthDate: parsedDate as Date }));
      }
    } catch (error) {
      console.log("Failed to parse date:", error);
    }
  };

  const handleStateChange = (state: string) => {
    setFormData(prev => ({ ...prev, state }));
  };

  const handleCityChange = (city: string) => {
    setFormData(prev => ({ ...prev, city }));
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ 
        ...prev, 
        birthDate: date,
        birthDateInput: format(date, 'dd/MM/yyyy')
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.birthDate && formData.birthDateInput) {
      try {
        const parts = formData.birthDateInput.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);
          
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const date = new Date(year, month, day);
            if (!isNaN(date.getTime())) {
              setFormData(prev => ({ ...prev, birthDate: date }));
            }
          }
        }
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    }

    if (
      !formData.name ||
      !formData.birthDateInput ||
      !formData.phone ||
      !formData.cpf ||
      !formData.email ||
      !formData.password ||
      !formData.address ||
      !formData.city ||
      !formData.state
    ) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    try {
      const finalData = {
        ...formData,
        birthDate: formData.birthDate || new Date()
      };
      
      await signUp(formData.email, formData.password, finalData);
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Bem-vindo ao Urban SOS.",
      });
      navigate('/citizen/dashboard');
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast({
        title: "Erro no cadastro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao criar sua conta",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-white to-urban-blue-50 dark:from-urban-dark-900 dark:to-urban-dark-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-3xl mx-auto px-4"
      >
        <div className="urban-card p-8">
          <h1 className="text-2xl font-bold text-urban-dark-900 dark:text-white text-center mb-6">
            Complete seu Cadastro
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-urban-dark-400 h-5 w-5" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-urban-blue-500"
                    placeholder="João da Silva"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="birthDateInput" className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
                  Data de Nascimento
                </label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-urban-dark-400 h-5 w-5" />
                    <Input
                      id="birthDateInput"
                      name="birthDateInput"
                      type="text" 
                      value={formData.birthDateInput}
                      onChange={handleChangeBirthDate}
                      className="w-full pl-10 pr-3"
                      placeholder="DD/MM/AAAA"
                    />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="px-3 h-10"
                        type="button"
                      >
                        <Calendar className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
                        mode="single"
                        selected={formData.birthDate}
                        onSelect={handleCalendarSelect}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-urban-dark-400 h-5 w-5" />
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChangePhone}
                    className="w-full pl-10 pr-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-urban-blue-500"
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="cpf" className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
                  CPF
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-urban-dark-400 h-5 w-5" />
                  <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    value={formData.cpf}
                    onChange={handleChangeCPF}
                    className="w-full pl-10 pr-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-urban-blue-500"
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-urban-dark-400 h-5 w-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-urban-blue-500"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-urban-dark-400 h-5 w-5" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-urban-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
                  Endereço
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-urban-dark-400 h-5 w-5" />
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-urban-blue-500"
                    placeholder="Rua, número, bairro"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <LocationSelector
                  initialState={formData.state}
                  initialCity={formData.city}
                  onStateChange={handleStateChange}
                  onCityChange={handleCityChange}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full btn-primary mt-8"
            >
              Concluir Cadastro
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
