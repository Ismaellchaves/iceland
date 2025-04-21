
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';
import AnimatedLayout from '@/components/AnimatedLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  React.useEffect(() => {
    // Garantir que o app inicie no modo claro
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  
    // Se já estiver logado, redirecionar para a página adequada
    if (currentUser) {
      if (currentUser.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/services');
      }
    }
  }, [currentUser, navigate]);
  

  return (
    <AnimatedLayout>
      <div className="min-h-screen w-full flex flex-col">
        <header className="w-full py-4 px-6 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-beauty-purple">Cantinho Da Jô</h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/location')}
              className="flex items-center text-beauty-purple"
            >
              <MapPin className="h-4 w-4 mr-1" />
              <span>Localização</span>
            </Button>
          </motion.div>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
          {/* Background decorations */}
          <motion.div 
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-beauty-light-purple opacity-20"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-beauty-purple opacity-10"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center max-w-2xl mb-10"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="flex justify-center mb-6"
            >
              <Sparkles className="h-16 w-16 text-beauty-purple" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-purple-gradient">
              Cantinho Da Jô
            </h1>
            
            <h2 className="text-xl text-beauty-purple mb-6">
              ISTEC
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                onClick={() => navigate('/login')}
                className="beauty-button group"
                size="lg"
              >
                <span>Entrar</span>
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                onClick={() => navigate('/register')}
                variant="outline"
                className="border-beauty-purple text-beauty-purple hover:bg-beauty-soft-purple"
                size="lg"
              >
                Cadastrar
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-md"
          >
            <img 
              src="/lovable-uploads/6fe4c9ba-d2df-4e06-956a-05990aa080e3.png" 
              alt="Beauty Services" 
              className="w-full h-auto rounded-2xl shadow-xl"
            />
          </motion.div>
        </main>
      </div>
    </AnimatedLayout>
  );
};

export default Index;
