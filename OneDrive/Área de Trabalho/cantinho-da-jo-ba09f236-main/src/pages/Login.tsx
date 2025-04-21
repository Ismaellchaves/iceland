
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password);
    
    setIsLoading(false);
    
    if (success) {
      // Redirecionar para a página apropriada será feito no AuthContext
    }
  };

  return (
    <AuthLayout 
      title="Conectar" 
      subtitle="Entre para agendar seu serviço de beleza"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={theme === 'dark' ? 'text-white' : ''}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className={theme === 'dark' ? 'text-gray-200' : ''}>E-mail</Label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} h-5 w-5`} />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`beauty-input pl-10 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' : ''}`}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password" className={theme === 'dark' ? 'text-gray-200' : ''}>Senha</Label>
              <Link to="/forgot-password" className={`beauty-link text-sm ${theme === 'dark' ? 'text-beauty-light-purple hover:text-purple-300' : ''}`}>
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} h-5 w-5`} />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`beauty-input pl-10 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' : ''}`}
                required
              />
            </div>
          </div>
          
          <Button
            type="submit"
            className={`beauty-button w-full ${theme === 'dark' ? 'bg-beauty-light-purple hover:bg-beauty-purple' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Conectando...' : 'Conectar'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}>
            Não tem uma conta?{' '}
            <Link to="/register" className={`beauty-link ${theme === 'dark' ? 'text-beauty-light-purple hover:text-purple-300' : ''}`}>
              Cadastre-se
            </Link>
          </p>
        </div>
        
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className={theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-muted-foreground hover:text-beauty-purple'}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o início
          </Button>
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;
