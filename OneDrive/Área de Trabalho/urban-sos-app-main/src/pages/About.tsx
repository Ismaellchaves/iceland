
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, UserCheck, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const About = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <AlertTriangle className="h-8 w-8 text-urban-blue-500" />,
      title: "Reporte Problemas",
      description: "Denuncie problemas urbanos diretamente para as autoridades locais."
    },
    {
      icon: <MapPin className="h-8 w-8 text-urban-blue-500" />,
      title: "Localização Exata",
      description: "Use GPS para marcar com precisão onde o problema está localizado."
    },
    {
      icon: <UserCheck className="h-8 w-8 text-urban-blue-500" />,
      title: "Acompanhamento",
      description: "Acompanhe o status das suas denúncias e receba atualizações."
    },
    {
      icon: <Activity className="h-8 w-8 text-urban-blue-500" />,
      title: "Impacto Real",
      description: "Ajude a melhorar sua cidade e comunidade com suas denúncias."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const handleReportClick = () => {
    if (user) {
      // Se o usuário estiver logado, redireciona para a página de denúncia
      navigate('/report');
    } else {
      // Se não estiver logado, redireciona para a página de cadastro
      navigate('/register');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-white to-urban-blue-50 dark:from-urban-dark-900 dark:to-urban-dark-950 p-6"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto pt-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-urban-dark-900 dark:text-white text-center">
          Bem-vindo ao <span className="text-urban-blue-500">Urban SOS</span>
        </h1>
        
        <p className="mt-6 text-lg text-urban-dark-700 dark:text-urban-dark-200 text-center leading-relaxed">
          O Urban SOS é uma plataforma que permite aos cidadãos reportar problemas urbanos 
          diretamente para as autoridades responsáveis, ajudando a melhorar a qualidade de vida na cidade.
        </p>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="urban-card p-6 flex flex-col items-center text-center"
            >
              <div className="p-3 bg-urban-blue-50 dark:bg-urban-dark-700 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-urban-dark-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-urban-dark-600 dark:text-urban-dark-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="mb-6 text-urban-dark-700 dark:text-urban-dark-300">
            Para fazer uma denúncia, você precisará se cadastrar ou fazer login.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleReportClick}
              className="btn-primary"
            >
              Fazer Denúncia
            </button>
            
            <button 
              onClick={() => navigate('/auth')}
              className="btn-secondary"
            >
              Entrar / Cadastrar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default About;
