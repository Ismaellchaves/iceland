
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, ChevronLeft, Moon, Sun, Settings as SettingsIcon, Edit, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedLayout from '@/components/AnimatedLayout';
import UserAvatar from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  return (
    <AnimatedLayout>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 flex items-center justify-between shadow-sm`}>
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft className={`h-6 w-6 ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`} />
          </button>
          <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>Meu Perfil</h1>
          <div></div> {/* Empty div for spacing */}
        </header>

        <main className="max-w-3xl mx-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-md mb-6 relative`}
          >
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/edit-profile')}
              className="absolute top-4 right-4"
            >
              <Edit className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`} />
            </Button>
            
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4">
              <UserAvatar
                name={currentUser.name}
                imageUrl={currentUser.image}
                size="xl"
              />
              <div className="flex-1 text-center sm:text-left">
                <h2 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>{currentUser.name}</h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{currentUser.email}</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{currentUser.phone}</p>
                {currentUser.bio && (
                  <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{currentUser.bio}</p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-md`}>
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-4 ${theme === 'dark' ? 'bg-beauty-purple/20' : 'bg-beauty-soft-purple'}`}>
                    {theme === 'dark' ? (
                      <Moon className="h-6 w-6 text-beauty-light-purple" />
                    ) : (
                      <Sun className="h-6 w-6 text-beauty-purple" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>Tema do App</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {theme === 'dark' ? 'Modo escuro ativado' : 'Modo claro ativado'}
                    </p>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-md`}>
              <button 
                className={`w-full flex items-center p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-xl transition`}
                onClick={() => navigate('/appointments')}
              >
                <div className={`p-2 rounded-full mr-4 ${theme === 'dark' ? 'bg-beauty-purple/20' : 'bg-beauty-soft-purple'}`}>
                  <Calendar className={`h-6 w-6 ${theme === 'dark' ? 'text-beauty-light-purple' : 'text-beauty-purple'}`} />
                </div>
                <div className="text-left">
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>Meus Agendamentos</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Visualize seus agendamentos</p>
                </div>
              </button>
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-md`}>
              <button 
                className={`w-full flex items-center p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-xl transition`}
                onClick={() => navigate('/settings')}
              >
                <div className={`p-2 rounded-full mr-4 ${theme === 'dark' ? 'bg-beauty-purple/20' : 'bg-beauty-soft-purple'}`}>
                  <SettingsIcon className={`h-6 w-6 ${theme === 'dark' ? 'text-beauty-light-purple' : 'text-beauty-purple'}`} />
                </div>
                <div className="text-left">
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>Configurações</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Ajuste suas preferências</p>
                </div>
              </button>
            </div>

            <div className="mt-8">
              <Button 
                onClick={logout}
                variant="destructive" 
                className="w-full flex justify-center items-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                Sair da Conta
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    </AnimatedLayout>
  );
};

export default Profile;
