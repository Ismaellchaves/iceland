
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to About page after 5 seconds (5000ms)
    const timer = setTimeout(() => {
      navigate('/about');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-urban-blue-900 to-urban-dark-950 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-urban-blue-500 to-urban-blue-300 rounded-full blur-xl opacity-70 animate-pulse-subtle"></div>
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "loop" }}
          className="relative"
        >
          <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-pulse">
            <circle cx="100" cy="100" r="95" stroke="#0075FF" strokeWidth="10" />
            <path d="M60 100L90 130L140 80" stroke="#0075FF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M100 45V155M45 100H155" stroke="#0075FF" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-4xl font-bold text-white mt-8 text-center"
      >
        Urban SOS
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="text-2xl font-semibold text-urban-blue-300 mt-2"
      >
        ISTEC
      </motion.p>
    </div>
  );
};

export default Index;
