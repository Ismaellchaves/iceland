
import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ServiceCardProps {
  name: string;
  description?: string;
  price: number;
  image?: string;
  onClick: () => void;
  highlighted?: boolean;
}

const ServiceCard = ({ 
  name, 
  description, 
  price, 
  image = '/placeholder.svg',
  onClick,
  highlighted = false
}: ServiceCardProps) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl shadow-md 
        ${highlighted 
          ? 'bg-beauty-purple text-white' 
          : theme === 'dark' 
            ? 'bg-gray-800 text-white' 
            : 'bg-white text-beauty-purple'} 
        cursor-pointer`}
    >
      <div className="absolute top-3 right-3 z-10">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <PlusCircle className={`w-6 h-6 ${highlighted ? 'text-white' : theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`} />
        </motion.div>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col h-full">
          <div className="mb-4">
            {image && (
              <div className="mb-4 w-16 h-16 flex items-center justify-center">
                <img 
                  src={image} 
                  alt={name} 
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <h3 className={`text-lg font-bold ${highlighted ? 'text-white' : theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>
              {name}
            </h3>
            {description && (
              <p className={`text-sm ${
                highlighted 
                  ? 'text-white/80' 
                  : theme === 'dark' 
                    ? 'text-gray-300' 
                    : 'text-muted-foreground'
              }`}>
                {description}
              </p>
            )}
          </div>
          
          <div className="mt-auto">
            <p className={`font-bold text-lg ${
              highlighted 
                ? 'text-white' 
                : theme === 'dark' 
                  ? 'text-white' 
                  : 'text-beauty-purple'
            }`}>
              R$ {price.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
