
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Bell, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from './NotificationBell';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/components/ui/use-toast';

const NavbarActions = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    console.log('NavbarActions theme:', theme);
  }, [theme]);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleStatisticsClick = () => {
    navigate('/admin/statistics');
  };

  const handleLogout = async () => {
    await signOut();
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    toast({
      title: newTheme === 'light' ? 'Modo Claro Ativado' : 'Modo Escuro Ativado',
      description: 'O tema foi alterado com sucesso!',
    });
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Notification Bell para todos os usuários */}
      <NotificationBell />
      
      {/* Botão de alternar tema mais visível */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        title={theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
        className="bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
      >
        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleProfileClick}
        title="Perfil"
      >
        <User className="h-5 w-5" />
      </Button>

      {user.isAdmin && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleStatisticsClick}
          title="Estatísticas"
        >
          <Settings className="h-5 w-5" />
        </Button>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        title="Sair"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default NavbarActions;
