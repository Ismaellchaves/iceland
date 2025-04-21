
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Settings, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  isAdmin?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const menuItems = isAdmin 
    ? [
        { label: 'Dashboard', path: '/admin/dashboard' },
        { label: 'Acompanhamento', path: '/admin/reports' },
        { label: 'Gestão', path: '/admin/management' },
        { label: 'Perfil', path: '/profile' },
      ]
    : [
        { label: 'Dashboard', path: '/citizen/dashboard' },
        { label: 'Fazer Denúncia', path: '/report' },
        { label: 'Minhas Denúncias', path: '/citizen/reports' },
        { label: 'Perfil', path: '/profile' },
      ];

  const basePath = isAdmin ? '/admin' : '/citizen';

  return (
    <nav className="bg-white dark:bg-urban-dark-900 border-b border-urban-dark-200 dark:border-urban-dark-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(basePath)}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 rounded-full bg-urban-blue-500 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-urban-dark-900 dark:text-white">
                Urban<span className="text-urban-blue-500">SOS</span>
              </span>
            </motion.button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {menuItems.map((item) => (
              <motion.a
                key={item.path}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(item.path)}
                className={`px-3 py-2 cursor-pointer text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-urban-blue-500 border-b-2 border-urban-blue-500'
                    : 'text-urban-dark-600 dark:text-urban-dark-300 hover:text-urban-blue-500'
                }`}
              >
                {item.label}
              </motion.a>
            ))}

            {userData && (
              <div className="flex items-center border-l border-urban-dark-200 dark:border-urban-dark-700 pl-6 ml-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => navigate('/profile')}
                >
                  <div className="w-8 h-8 rounded-full bg-urban-blue-100 dark:bg-urban-dark-700 flex items-center justify-center">
                    <User className="h-4 w-4 text-urban-blue-500 dark:text-urban-blue-300" />
                  </div>
                  <span className="text-sm font-medium text-urban-dark-800 dark:text-urban-dark-200">
                    {userData.name || userData.email.split('@')[0]}
                  </span>
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="ml-4 p-2 rounded-full hover:bg-urban-dark-100 dark:hover:bg-urban-dark-800"
                >
                  <LogOut className="h-5 w-5 text-urban-dark-500 dark:text-urban-dark-400" />
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-urban-dark-500 dark:text-urban-dark-400 hover:text-urban-dark-900 dark:hover:text-white hover:bg-urban-dark-100 dark:hover:bg-urban-dark-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-urban-dark-900 shadow-lg">
              {menuItems.map((item) => (
                <a
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                    location.pathname === item.path
                      ? 'bg-urban-blue-50 dark:bg-urban-dark-800 text-urban-blue-500'
                      : 'text-urban-dark-600 dark:text-urban-dark-300 hover:bg-urban-dark-100 dark:hover:bg-urban-dark-800 hover:text-urban-blue-500'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              
              {userData && (
                <>
                  <div className="border-t border-urban-dark-200 dark:border-urban-dark-700 pt-4 mt-4">
                    <div className="flex items-center px-3 py-2">
                      <div className="w-8 h-8 rounded-full bg-urban-blue-100 dark:bg-urban-dark-700 flex items-center justify-center">
                        <User className="h-4 w-4 text-urban-blue-500 dark:text-urban-blue-300" />
                      </div>
                      <span className="ml-3 text-sm font-medium text-urban-dark-800 dark:text-urban-dark-200">
                        {userData.name || userData.email.split('@')[0]}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 text-base font-medium text-urban-dark-600 dark:text-urban-dark-300 hover:bg-urban-dark-100 dark:hover:bg-urban-dark-800 rounded-md"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Sair
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
