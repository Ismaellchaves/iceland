
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { toast } from '@/components/ui/use-toast';
import { User, Mail, Phone, Calendar, Home, Save, Upload, LogOut, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LocationSelector from '@/components/LocationSelector';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, updateUserProfile } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: undefined as Date | undefined,
    phone: '',
    cpf: '',
    address: '',
    city: '',
    state: '',
    profileImage: ''
  });

  useEffect(() => {
    // Get user data
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setIsAdmin(user.isAdmin);
    
    setFormData({
      name: user.name || '',
      email: user.email || '',
      birthDate: user.birthDate ? new Date(user.birthDate) : undefined,
      phone: user.phone || '',
      cpf: user.cpf || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      profileImage: user.profileImage || ''
    });
  }, [navigate, user]);

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

  const handleStateChange = (state: string) => {
    setFormData(prev => ({ ...prev, state }));
  };

  const handleCityChange = (city: string) => {
    setFormData(prev => ({ ...prev, city }));
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.name) {
      toast({
        title: "Erro",
        description: "Por favor, preencha seu nome.",
        variant: "destructive"
      });
      return;
    }

    // Update user data using the new function
    updateUserProfile({
      name: formData.name,
      phone: formData.phone,
      cpf: formData.cpf,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      birthDate: formData.birthDate ? formData.birthDate.toISOString() : undefined,
      profileImage: formData.profileImage
    });
    
    setIsEditing(false);
  };

  const handleLogout = () => {
    signOut();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For demo purposes, we'll use a FileReader to get a data URL
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-urban-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-urban-blue-50/50 dark:bg-urban-dark-900">
      <Navbar isAdmin={isAdmin} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-urban-dark-900 dark:text-white">
            Perfil
          </h1>
          <p className="text-urban-dark-600 dark:text-urban-dark-300 mt-1">
            Gerencie suas informações pessoais
          </p>
        </div>
        
        <div className="bg-white dark:bg-urban-dark-800 rounded-xl shadow-sm border border-urban-dark-200 dark:border-urban-dark-700 overflow-hidden">
          <div className="md:flex">
            <div className="p-6 md:w-1/3 flex flex-col items-center border-b md:border-b-0 md:border-r border-urban-dark-200 dark:border-urban-dark-700">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-urban-blue-100 dark:bg-urban-dark-700 flex items-center justify-center overflow-hidden">
                  {formData.profileImage ? (
                    <img 
                      src={formData.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-20 w-20 text-urban-blue-500 dark:text-urban-blue-300" />
                  )}
                </div>
                
                {isEditing && (
                  <label 
                    htmlFor="profile-image" 
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-white" />
                    <input 
                      id="profile-image" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-urban-dark-900 dark:text-white mt-4">
                {formData.name || formData.email.split('@')[0]}
              </h2>
              
              <p className="text-urban-dark-500 dark:text-urban-dark-400 mt-1">
                {isAdmin ? 'Administrador' : 'Cidadão'}
              </p>
              
              <div className="mt-8 w-full space-y-2">
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="w-full py-2 px-4 rounded-lg bg-urban-blue-500 text-white hover:bg-urban-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-5 w-5" />
                      Salvar Alterações
                    </>
                  ) : (
                    <>
                      <Edit className="h-5 w-5" />
                      Editar Perfil
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-4 rounded-lg bg-white dark:bg-urban-dark-700 text-urban-dark-800 dark:text-white border border-urban-dark-200 dark:border-urban-dark-600 hover:bg-urban-dark-100 dark:hover:bg-urban-dark-600 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </button>
              </div>
            </div>
            
            <div className="p-6 md:w-2/3">
              <h3 className="text-lg font-semibold text-urban-dark-900 dark:text-white mb-6">
                Informações Pessoais
              </h3>
              
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
                      className={`w-full pl-10 pr-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg ${
                        isEditing 
                          ? 'focus:outline-none focus:ring-2 focus:ring-urban-blue-500' 
                          : 'opacity-75 cursor-not-allowed'
                      }`}
                      placeholder="João da Silva"
                      readOnly={!isEditing}
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
                      className="w-full pl-10 pr-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg opacity-75 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="birthDate" className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
                    Data de Nascimento
                  </label>
                  <div className="relative">
                    {isEditing ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-10 pr-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg text-left font-normal flex justify-start",
                              !formData.birthDate && "text-urban-dark-400"
                            )}
                          >
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-urban-dark-400 h-5 w-5" />
                            {formData.birthDate ? (
                              format(formData.birthDate, "dd/MM/yyyy", { locale: pt })
                            ) : (
                              "Selecione uma data"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={formData.birthDate}
                            onSelect={(date) => setFormData(prev => ({ ...prev, birthDate: date }))}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-urban-dark-400 h-5 w-5" />
                        <input
                          type="text"
                          value={formData.birthDate ? format(formData.birthDate, "dd/MM/yyyy", { locale: pt }) : ''}
                          className="w-full pl-10 pr-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg opacity-75 cursor-not-allowed"
                          readOnly
                        />
                      </div>
                    )}
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
                      className={`w-full pl-10 pr-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg ${
                        isEditing 
                          ? 'focus:outline-none focus:ring-2 focus:ring-urban-blue-500' 
                          : 'opacity-75 cursor-not-allowed'
                      }`}
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                      readOnly={!isEditing}
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
                      className={`w-full pl-10 pr-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg ${
                        isEditing 
                          ? 'focus:outline-none focus:ring-2 focus:ring-urban-blue-500' 
                          : 'opacity-75 cursor-not-allowed'
                      }`}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      readOnly={!isEditing}
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
                      className={`w-full pl-10 pr-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg ${
                        isEditing 
                          ? 'focus:outline-none focus:ring-2 focus:ring-urban-blue-500' 
                          : 'opacity-75 cursor-not-allowed'
                      }`}
                      placeholder="Rua, número, bairro"
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <LocationSelector
                    initialState={formData.state}
                    initialCity={formData.city}
                    onStateChange={handleStateChange}
                    onCityChange={handleCityChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg border border-urban-dark-200 dark:border-urban-dark-600 text-urban-dark-800 dark:text-white mr-2"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-urban-blue-500 text-white hover:bg-urban-blue-600 transition-colors"
                  >
                    Salvar Alterações
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
