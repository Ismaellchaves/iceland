
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const AuthLayout = ({ children, title, subtitle, backgroundImage = '/lovable-uploads/6fe4c9ba-d2df-4e06-956a-05990aa080e3.png' }: AuthLayoutProps) => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen w-full overflow-hidden grid md:grid-cols-2">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden md:block bg-beauty-purple"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className={`flex items-center justify-center p-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-beauty-soft-purple to-white'}`}>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-beauty-light-purple' : 'text-beauty-purple'}`}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={`${theme === 'dark' ? 'bg-gray-800 shadow-lg border border-gray-700' : 'bg-white shadow-lg'} rounded-2xl p-8`}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
