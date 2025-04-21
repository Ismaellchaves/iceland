
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, MapPin, Check, X, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import MapComponent from '@/components/MapComponent';
import ImageUpload from '@/components/ImageUpload';

const categories = [
  { id: 'buraco', name: 'Buraco na Via', icon: '🕳️' },
  { id: 'iluminacao', name: 'Problema de Iluminação', icon: '💡' },
  { id: 'lixo', name: 'Descarte Irregular de Lixo', icon: '🗑️' },
  { id: 'poluicao', name: 'Poluição', icon: '💨' },
  { id: 'transito', name: 'Problema de Trânsito', icon: '🚦' },
  { id: 'outros', name: 'Outros', icon: '📋' },
];

// Default coordinates for Crateús, Ceará, Brazil
const DEFAULT_LOCATION = {
  lat: -5.1753,
  lng: -40.6669,
  name: 'Crateús, Ceará'
};

const ReportForm = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    location: '',
    latitude: DEFAULT_LOCATION.lat as number | null,
    longitude: DEFAULT_LOCATION.lng as number | null,
    imageUrl: null as string | null,
  });
  const [step, setStep] = useState(1);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [showMapSelector, setShowMapSelector] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserData(JSON.parse(user));
      setIsAuthenticated(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (imageUrl: string | null) => {
    setFormData(prev => ({ ...prev, imageUrl }));
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    setIsGettingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // For demo purposes, we'll use the Crateús coordinates with a small random offset
        // to simulate different locations within the city
        const randomOffset = () => (Math.random() - 0.5) * 0.02; // small random offset
        const lat = DEFAULT_LOCATION.lat + randomOffset();
        const lng = DEFAULT_LOCATION.lng + randomOffset();
        
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          location: `${DEFAULT_LOCATION.name} - Lat: ${lat.toFixed(6)}, Long: ${lng.toFixed(6)}`
        }));
        setIsGettingLocation(false);
        
        toast({
          title: "Localização encontrada",
          description: `Localização em ${DEFAULT_LOCATION.name} detectada com sucesso.`,
        });
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Permissão para acessar localização foi negada');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Informação de localização não disponível');
            break;
          case error.TIMEOUT:
            setLocationError('Tempo esgotado ao tentar obter localização');
            break;
          default:
            setLocationError('Erro desconhecido ao tentar obter localização');
            break;
        }
      }
    );
  };

  const handleMapClick = (location: { lat: number, lng: number }) => {
    setFormData(prev => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lng,
      location: `${DEFAULT_LOCATION.name} - Lat: ${location.lat.toFixed(6)}, Long: ${location.lng.toFixed(6)}`
    }));
    
    toast({
      title: "Localização selecionada",
      description: `Localização em ${DEFAULT_LOCATION.name} marcada no mapa.`,
    });
  };

  const validateStep = () => {
    if (step === 1 && !formData.category) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma categoria.",
        variant: "destructive"
      });
      return false;
    }

    if (step === 2) {
      if (!formData.title) {
        toast({
          title: "Erro",
          description: "Por favor, informe um título para a denúncia.",
          variant: "destructive"
        });
        return false;
      }
      if (!formData.description) {
        toast({
          title: "Erro",
          description: "Por favor, descreva o problema.",
          variant: "destructive"
        });
        return false;
      }
    }

    if (step === 3 && !formData.location) {
      toast({
        title: "Erro",
        description: "Por favor, informe a localização do problema.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    
    if (step === 4 && !isAuthenticated) {
      toast({
        title: "Autenticação necessária",
        description: "Você precisa fazer login para enviar uma denúncia.",
      });
      navigate('/auth');
      return;
    }

    if (step === 4 && isAuthenticated) {
      submitForm();
      return;
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const submitForm = () => {
    // Get existing reports from localStorage or initialize empty array
    const existingReports = JSON.parse(localStorage.getItem('reports') || '[]');
    
    // Create new report
    const newReport = {
      id: Date.now().toString(),
      ...formData,
      userId: userData.email,
      userName: userData.name || userData.email.split('@')[0],
      status: 'pendente',
      createdAt: new Date().toISOString()
    };
    
    // Save updated reports to localStorage
    localStorage.setItem('reports', JSON.stringify([...existingReports, newReport]));
    
    toast({
      title: "Denúncia enviada com sucesso!",
      description: "Obrigado por contribuir para a melhoria da cidade.",
    });
    
    navigate('/citizen/reports');
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-urban-dark-800 dark:text-white">
              Selecione uma categoria
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                  className={`p-4 rounded-lg cursor-pointer flex flex-col items-center justify-center text-center gap-2 ${
                    formData.category === category.id
                      ? 'bg-urban-blue-50 dark:bg-urban-blue-900/30 border-2 border-urban-blue-500'
                      : 'bg-white dark:bg-urban-dark-800 border border-urban-dark-200 dark:border-urban-dark-700'
                  }`}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <span className="text-sm font-medium text-urban-dark-800 dark:text-urban-dark-200">
                    {category.name}
                  </span>
                  {formData.category === category.id && (
                    <div className="absolute -top-2 -right-2 bg-urban-blue-500 rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-urban-dark-800 dark:text-white">
              Detalhes do problema
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
                  Título da denúncia
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-urban-blue-500"
                  placeholder="Ex: Buraco grande na Av. Principal"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
                  Descrição detalhada
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-urban-blue-500"
                  placeholder="Descreva o problema em detalhes. Quanto mais informações, melhor poderemos resolver."
                />
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-urban-dark-800 dark:text-white">
              Localização do problema
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
                  Endereço ou referência em Crateús
                </label>
                <div className="flex gap-2">
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-urban-blue-500"
                    placeholder="Ex: Rua Principal, próximo ao número 123, Crateús"
                  />
                  <button
                    onClick={getLocation}
                    disabled={isGettingLocation}
                    className="flex items-center justify-center px-4 py-2 bg-urban-blue-500 text-white rounded-lg hover:bg-urban-blue-600 focus:outline-none focus:ring-2 focus:ring-urban-blue-400"
                  >
                    {isGettingLocation ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <MapPin className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {locationError && (
                  <p className="text-red-500 text-sm mt-1">{locationError}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowMapSelector(!showMapSelector)}
                  className="text-sm text-urban-blue-500 hover:text-urban-blue-600"
                >
                  {showMapSelector ? "Esconder mapa" : "Selecionar no mapa"}
                </button>
              </div>

              {showMapSelector && (
                <div className="mt-2">
                  <MapComponent 
                    interactive={true} 
                    height="300px" 
                    onMapClick={handleMapClick}
                  />
                  <p className="text-xs text-urban-dark-500 dark:text-urban-dark-400 mt-1">
                    Clique no mapa para selecionar a localização do problema
                  </p>
                </div>
              )}

              <div className="bg-urban-blue-50 dark:bg-urban-dark-800 p-4 rounded-lg border border-urban-blue-100 dark:border-urban-dark-700">
                <div className="flex items-start gap-3">
                  <div className="bg-urban-blue-100 dark:bg-urban-dark-700 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-urban-blue-500 dark:text-urban-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-urban-dark-800 dark:text-white">
                      Precisamos da sua localização em Crateús
                    </h3>
                    <p className="text-sm text-urban-dark-600 dark:text-urban-dark-300 mt-1">
                      Sua localização exata ajuda as autoridades de Crateús a encontrarem e resolverem o problema mais rapidamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-urban-dark-800 dark:text-white">
              Adicionar Imagem (opcional)
            </h2>
            
            <div className="space-y-4">
              <ImageUpload 
                onImageSelect={handleImageSelect}
                initialImage={formData.imageUrl}
              />
              
              <div className="bg-urban-blue-50 dark:bg-urban-dark-800 p-4 rounded-lg border border-urban-blue-100 dark:border-urban-dark-700">
                <div className="flex items-start gap-3">
                  <div className="bg-urban-blue-100 dark:bg-urban-dark-700 p-2 rounded-full">
                    <Camera className="h-5 w-5 text-urban-blue-500 dark:text-urban-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-urban-dark-800 dark:text-white">
                      Uma imagem vale mais que mil palavras
                    </h3>
                    <p className="text-sm text-urban-dark-600 dark:text-urban-dark-300 mt-1">
                      Adicionar uma foto do problema facilita muito a identificação e resolução pela equipe da prefeitura.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="urban-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-urban-dark-800 dark:text-white">
            Fazer Denúncia
          </h1>
          
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === stepNumber
                      ? 'bg-urban-blue-500 text-white'
                      : step > stepNumber
                      ? 'bg-urban-blue-100 dark:bg-urban-blue-900/30 text-urban-blue-500'
                      : 'bg-urban-dark-100 dark:bg-urban-dark-800 text-urban-dark-500 dark:text-urban-dark-400'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-8 h-1 ${
                    step > stepNumber 
                      ? 'bg-urban-blue-500' 
                      : 'bg-urban-dark-200 dark:bg-urban-dark-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {renderStepContent()}
        
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="px-6 py-2 bg-white dark:bg-urban-dark-800 border border-urban-dark-200 dark:border-urban-dark-700 rounded-lg hover:bg-urban-dark-100 dark:hover:bg-urban-dark-700 focus:outline-none"
            >
              Voltar
            </button>
          ) : (
            <div></div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextStep}
            className="px-6 py-2 bg-urban-blue-500 text-white rounded-lg hover:bg-urban-blue-600 focus:outline-none focus:ring-2 focus:ring-urban-blue-400"
          >
            {step === 4 ? 'Enviar Denúncia' : 'Próximo'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
