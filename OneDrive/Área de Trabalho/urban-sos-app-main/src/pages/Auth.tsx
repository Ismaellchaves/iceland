
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      if (!email || !password) {
        toast({
          title: "Erro",
          description: "Por favor, preencha todos os campos.",
          variant: "destructive"
        });
        return;
      }
      
      setLoading(true);
      
      try {
        console.log("Attempting login with:", email, password);
        await signIn(email, password);
        
        // Verificar se é admin para redirecionamento
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          if (userData.isAdmin) {
            navigate('/admin/dashboard');
          } else {
            navigate('/citizen/dashboard');
          }
        }
      } catch (error) {
        console.error("Erro no login:", error);
        toast({
          title: "Erro no login",
          description: error instanceof Error ? error.message : "Credenciais inválidas",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Para cadastro, redirecionar diretamente para o formulário de cadastro
      navigate('/register');
    }
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-urban-blue-900 to-urban-dark-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="urban-card bg-white dark:bg-urban-dark-800 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-urban-dark-900 dark:text-white">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </h1>
            <p className="text-urban-dark-500 dark:text-urban-dark-300 mt-2">
              {isLogin ? 'Acesse sua conta para continuar' : 'Cadastre-se para fazer denúncias'}
            </p>
          </div>

          {isLogin ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-urban-dark-400 h-5 w-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-urban-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center"
              >
                {loading ? (
                  <span className="animate-pulse">Processando...</span>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="mt-4 text-center">
              <p className="text-urban-dark-600 dark:text-urban-dark-300 mb-6">
                Crie sua conta para reportar problemas e acompanhar o progresso das suas denúncias.
              </p>
              <button 
                onClick={handleRegisterClick}
                className="w-full btn-primary flex items-center justify-center"
              >
                Começar Cadastro
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-urban-blue-500 hover:text-urban-blue-600 text-sm font-medium"
            >
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
