
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedLayout from '@/components/AnimatedLayout';
import { Sparkles } from 'lucide-react';

const floatingBubbles = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  size: Math.random() * 80 + 20,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 2,
  duration: Math.random() * 5 + 5
}));

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/home');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <AnimatedLayout>
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-purple-gradient relative overflow-hidden">
        {/* Animated bubbles */}
        {floatingBubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full bg-white opacity-10"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, bubble.id % 2 === 0 ? 20 : -20, 0],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              repeatType: "reverse",
              delay: bubble.delay
            }}
          />
        ))}
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8,
            type: "spring" 
          }}
          className="flex flex-col items-center text-center z-10"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-white mb-6 relative"
          >
            <Sparkles className="h-24 w-24" />
            <motion.div
              className="absolute inset-0 bg-beauty-pink rounded-full opacity-20 blur-xl"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-white mb-6 relative"
            animate={{ 
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <span className="relative z-10">Cantinho Da Jô</span>
            <motion.span 
              className="absolute inset-0 bg-beauty-pink opacity-20 blur-xl rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5
              }}
            />
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-white/90 max-w-md mb-6 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Aguarde um momento enquanto preparamos uma experiência de beleza incrível para você!
          </motion.p>
          
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.span
              className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-beauty-light-pink relative z-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ISNEX
            </motion.span>
            <motion.div 
              className="absolute inset-0 bg-white opacity-10 rounded-full blur-sm"
              animate={{ 
                scale: [1, 1.5, 1], 
                opacity: [0.1, 0.2, 0.1] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>
          
          <motion.div 
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <motion.div 
              className="w-32 h-1 bg-white/30 rounded-full overflow-hidden"
              whileHover={{ scale: 1.1 }}
            >
              <motion.div 
                className="h-full bg-white rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ 
                  duration: 5,
                  ease: "linear"
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedLayout>
  );
};

export default Welcome;
