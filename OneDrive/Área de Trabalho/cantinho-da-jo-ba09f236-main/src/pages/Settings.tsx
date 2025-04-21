
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Settings as SettingsIcon, Moon, Sun, Bell, Shield, Trash, HelpCircle } from 'lucide-react';
import AnimatedLayout from '@/components/AnimatedLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

const Settings = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  // Check for authentication
  React.useEffect(() => {
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
          <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>Configurações</h1>
          <div></div> {/* Empty div for spacing */}
        </header>

        <main className="max-w-3xl mx-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-md`}>
              <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>
                Aparência
              </h2>

              <div className="space-y-4">
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
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-md`}>
              <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>
                Notificações
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-4 ${theme === 'dark' ? 'bg-beauty-purple/20' : 'bg-beauty-soft-purple'}`}>
                      <Bell className={`h-6 w-6 ${theme === 'dark' ? 'text-beauty-light-purple' : 'text-beauty-purple'}`} />
                    </div>
                    <div>
                      <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>Notificações push</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Receba alertas de novos agendamentos
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-4 ${theme === 'dark' ? 'bg-beauty-purple/20' : 'bg-beauty-soft-purple'}`}>
                      <Bell className={`h-6 w-6 ${theme === 'dark' ? 'text-beauty-light-purple' : 'text-beauty-purple'}`} />
                    </div>
                    <div>
                      <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>Notificações por email</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Receba emails sobre atualizações
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-md`}>
              <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>
                Privacidade e Segurança
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-4 ${theme === 'dark' ? 'bg-beauty-purple/20' : 'bg-beauty-soft-purple'}`}>
                      <Shield className={`h-6 w-6 ${theme === 'dark' ? 'text-beauty-light-purple' : 'text-beauty-purple'}`} />
                    </div>
                    <div>
                      <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>Alterar senha</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Atualize sua senha de acesso
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    Alterar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-4 ${theme === 'dark' ? 'bg-beauty-purple/20' : 'bg-beauty-soft-purple'}`}>
                      <Shield className={`h-6 w-6 ${theme === 'dark' ? 'text-beauty-light-purple' : 'text-beauty-purple'}`} />
                    </div>
                    <div>
                      <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>Privacidade de dados</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Gerencie como seus dados são utilizados
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    Gerenciar
                  </Button>
                </div>
              </div>
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-md`}>
              <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>
                Suporte
              </h2>
              
              <div className="space-y-4">
                <button 
                  className={`w-full flex items-center justify-between p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-xl transition`}
                  onClick={() => {}}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-4 ${theme === 'dark' ? 'bg-beauty-purple/20' : 'bg-beauty-soft-purple'}`}>
                      <HelpCircle className={`h-6 w-6 ${theme === 'dark' ? 'text-beauty-light-purple' : 'text-beauty-purple'}`} />
                    </div>
                    <div className="text-left">
                      <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>Ajuda e FAQ</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Dúvidas frequentes e suporte</p>
                    </div>
                  </div>
                  <ChevronLeft className={`h-5 w-5 rotate-180 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              </div>
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-md`}>
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-4 bg-red-100`}>
                    <Trash className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Excluir conta</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Remove todos os seus dados
                    </p>
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => {}}>
                  Excluir
                </Button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </AnimatedLayout>
  );
};

export default Settings;
