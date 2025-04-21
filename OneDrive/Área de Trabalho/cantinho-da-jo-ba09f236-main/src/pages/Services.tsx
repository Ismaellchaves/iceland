import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, LogOut, User as UserIcon, Scissors, Palette, Brush } from 'lucide-react';
import AnimatedLayout from '@/components/AnimatedLayout';
import ServiceCard from '@/components/ServiceCard';
import UserAvatar from '@/components/UserAvatar';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/contexts/AuthContext';
import { Service, services } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/contexts/ThemeContext';

interface CategoryInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const Services = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  // Verificação de autenticação
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  // Categorias definidas
  const categories: CategoryInfo[] = [
    { id: 'all', name: 'Todos', icon: <img src="../lovable-uploads/d8a02b59-bdd8-45a4-8ccb-5539515a2c87.png" alt="All" className="w-5 h-5" />, color: 'bg-gradient-purple-pink' },
    { id: 'Alisamento', name: 'Alisamento', icon: <Brush size={18} />, color: 'bg-gradient-pink' },
    { id: 'Cabelo', name: 'Cabelo', icon: <Scissors size={18} />, color: 'bg-gradient-blue-purple' },
    { id: 'Tinta', name: 'Tinta', icon: <Palette size={18} />, color: 'bg-gradient-blue-purple' },
    { id: 'Corte', name: 'Corte', icon: <Scissors size={18} />, color: 'bg-gradient-peach' },
    { id: 'Sobrancelhas', name: 'Sobrancelhas', icon: <Scissors size={18} className="rotate-45" />, color: 'bg-beauty-purple' }
  ];

  // Filtra serviços com useMemo para otimização
  const filteredServices = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchLower) ||
                          (service.description && service.description.toLowerCase().includes(searchLower));
      
      if (selectedCategory === 'all') return matchesSearch;
      return matchesSearch && service.category === selectedCategory;
    });
  }, [services, searchQuery, selectedCategory]);

  // Agrupa serviços por categoria com useMemo
  const groupedServices = useMemo(() => {
    const groups: Record<string, Service[]> = {};
    const searchLower = searchQuery.toLowerCase();

    services.forEach(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchLower) ||
                          (service.description && service.description.toLowerCase().includes(searchLower));
      
      if (matchesSearch) {
        if (!groups[service.category]) {
          groups[service.category] = [];
        }
        groups[service.category].push(service);
      }
    });

    return groups;
  }, [services, searchQuery]);

  // Verifica se há serviços para exibir
  const hasServices = useMemo(() => {
    return selectedCategory === 'all' 
      ? Object.keys(groupedServices).length > 0
      : filteredServices.length > 0;
  }, [selectedCategory, groupedServices, filteredServices]);

  const handleServiceClick = (service: Service) => {
    navigate(`/schedule/${service.id}`);
  };
  
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  const getCategoryById = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <AnimatedLayout>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`${theme === 'dark' ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-sm'} sticky top-0 z-10 px-4 sm:px-6 py-4`}>
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}
            >
              Cantinho Da Jô
            </motion.h1>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/profile')}
                  className={theme === 'dark' ? 'text-white' : 'text-beauty-purple'}
                >
                  <UserIcon className="h-5 w-5" />
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/appointments')}
                  className={theme === 'dark' ? 'text-white' : 'text-beauty-purple'}
                >
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
              >
                <NotificationBell />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className={theme === 'dark' ? 'text-white' : 'text-beauty-purple'}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </header>
        
        <main className="max-w-6xl mx-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
          >
            <UserAvatar
              name={currentUser.name}
              imageUrl={currentUser.image}
              size="lg"
            />
            <div>
              <h2 className={`text-xl sm:text-2xl font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>
                Olá, {currentUser.name.split(' ')[0]}
              </h2>
              <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                Escolha um serviço para agendar
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mb-6 sm:mb-8"
          >
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'} h-5 w-5`} />
            <Input
              type="text"
              placeholder="Buscar serviços..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`beauty-input pl-10 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 sm:mb-8"
            ref={scrollRef}
          >
            <ScrollArea className="w-full" orientation="horizontal">
              <div className="flex space-x-3 pb-4 pr-8 min-w-max">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`flex-shrink-0 cursor-pointer rounded-xl overflow-hidden ${
                      selectedCategory === category.id 
                        ? 'ring-2 ring-beauty-purple' 
                        : `ring-1 ${theme === 'dark' ? 'ring-white/30' : 'ring-beauty-light-purple/30'}`
                    }`}
                  >
                    <div className={`${category.color} text-white p-3 text-center`}>
                      <div className="flex flex-col items-center justify-center h-16 w-20 sm:h-20 sm:w-24">
                        <div className="bg-white/20 p-2 rounded-full mb-1 sm:mb-2">
                          {category.icon}
                        </div>
                        <p className="text-xs sm:text-sm font-medium">{category.name}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {!hasServices ? (
              <div className={`text-center py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm`}>
                <Search className={`h-12 w-12 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'} mx-auto mb-4`} />
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} text-lg`}>
                  Nenhum serviço encontrado{selectedCategory !== 'all' ? ` na categoria ${getCategoryById(selectedCategory)?.name}` : ''}.
                </p>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}>
                  Tente uma busca diferente ou selecione outra categoria.
                </p>
              </div>
            ) : selectedCategory === 'all' ? (
              <div className="space-y-6 sm:space-y-8">
                {Object.entries(groupedServices).map(([categoryId, categoryServices]) => {
                  const category = getCategoryById(categoryId);
                  return (
                    <div key={categoryId}>
                      <h3 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'} flex items-center`}>
                        {category?.icon}
                        <span className="ml-2">{category?.name || categoryId}</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {categoryServices.map((service) => (
                          <ServiceCard
                            key={service.id}
                            name={service.name}
                            description={service.description}
                            price={service.price}
                            image={service.image}
                            onClick={() => handleServiceClick(service)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <h3 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'} flex items-center`}>
                  {getCategoryById(selectedCategory)?.icon}
                  <span className="ml-2">{getCategoryById(selectedCategory)?.name || selectedCategory}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      name={service.name}
                      description={service.description}
                      price={service.price}
                      image={service.image}
                      onClick={() => handleServiceClick(service)}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </AnimatedLayout>
  );
};

export default Services;