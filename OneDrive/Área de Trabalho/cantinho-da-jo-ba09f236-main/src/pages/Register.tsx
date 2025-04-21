
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowLeft, MapPin, Camera, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Register = () => {
  const navigate = useNavigate();
  const { register, currentUser } = useAuth();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/services');
      }
    }
  }, [currentUser, navigate]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('As senhas não correspondem.');
      return;
    }
    
    setIsLoading(true);
    
    const success = await register(name, email, password, address, phone, imageFile || undefined);
    
    setIsLoading(false);
    
    if (success) {
      // Redirecionamento é feito no AuthContext
    }
  };

  return (
    <AuthLayout 
      title="Cadastrar" 
      subtitle="Crie sua conta para agendar serviços de beleza"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={theme === 'dark' ? 'text-white' : ''}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative mb-2"
            >
              <Avatar className={`h-20 w-20 border-2 ${theme === 'dark' ? 'border-beauty-light-purple/50' : 'border-beauty-light-purple/20'}`}>
                {previewUrl ? (
                  <AvatarImage src={previewUrl} alt="Preview" />
                ) : (
                  <AvatarFallback className={`${theme === 'dark' ? 'bg-beauty-light-purple' : 'bg-beauty-purple'} text-white`}>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                )}
              </Avatar>
              <Label 
                htmlFor="profile-image" 
                className={`absolute bottom-0 right-0 rounded-full ${theme === 'dark' ? 'bg-beauty-light-purple' : 'bg-beauty-purple'} text-white hover:bg-beauty-dark-purple w-7 h-7 flex items-center justify-center cursor-pointer transition-colors duration-300 shadow-md`}
              >
                <Camera className="h-4 w-4" />
              </Label>
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </motion.div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>Foto de perfil (opcional)</p>
          </div>
          
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label htmlFor="name" className={theme === 'dark' ? 'text-gray-200' : ''}>Nome completo</Label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} h-5 w-5`} />
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`beauty-input pl-10 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' : ''}`}
                required
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
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
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Label htmlFor="phone" className={theme === 'dark' ? 'text-gray-200' : ''}>Telefone</Label>
            <div className="relative">
              <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} h-5 w-5`} />
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`beauty-input pl-10 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' : ''}`}
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Label htmlFor="address" className={theme === 'dark' ? 'text-gray-200' : ''}>Endereço</Label>
            <div className="relative">
              <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} h-5 w-5`} />
              <Input
                id="address"
                type="text"
                placeholder="Seu endereço"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`beauty-input pl-10 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' : ''}`}
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Label htmlFor="password" className={theme === 'dark' ? 'text-gray-200' : ''}>Senha</Label>
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
                minLength={6}
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Label htmlFor="confirmPassword" className={theme === 'dark' ? 'text-gray-200' : ''}>Confirmar senha</Label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} h-5 w-5`} />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`beauty-input pl-10 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' : ''}`}
                required
              />
            </div>
          </motion.div>
          
          {error && (
            <motion.p 
              className="text-destructive text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              type="submit"
              className={`beauty-button w-full shadow-md ${theme === 'dark' ? 'bg-beauty-light-purple hover:bg-beauty-purple' : 'bg-beauty-purple hover:bg-beauty-dark-purple'}`}
              disabled={isLoading}
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </motion.div>
        </form>
        
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}>
            Já tem uma conta?{' '}
            <Link to="/login" className={`beauty-link ${theme === 'dark' ? 'text-beauty-light-purple hover:text-purple-300' : ''}`}>
              Conecte-se
            </Link>
          </p>
        </motion.div>
        
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/home')}
            className={theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-muted-foreground hover:text-beauty-purple'}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o início
          </Button>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
};

export default Register;
