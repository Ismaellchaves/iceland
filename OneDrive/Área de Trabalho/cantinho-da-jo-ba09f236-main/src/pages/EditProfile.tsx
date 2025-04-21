
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Camera, X } from 'lucide-react';
import AnimatedLayout from '@/components/AnimatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import UserAvatar from '@/components/UserAvatar';

const EditProfile = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { currentUser, updateUserProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    bio: currentUser?.bio || '',
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(currentUser?.image || null);
  const [newImage, setNewImage] = useState<File | null>(null);

  // Check for authentication
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setNewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, you would upload the image and update the profile
      // with the image URL, but for this demo, we'll just simulate success
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update profile with new data
      updateUserProfile({
        ...currentUser,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        image: imagePreview,
      });
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso!",
        variant: "default",
      });
      
      navigate('/profile');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seu perfil. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatedLayout>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 flex items-center justify-between shadow-sm`}>
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft className={`h-6 w-6 ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`} />
          </button>
          <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-beauty-purple'}`}>Editar Perfil</h1>
          <div></div> {/* Empty div for spacing */}
        </header>

        <main className="max-w-3xl mx-auto p-4 sm:p-6">
          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-md mb-6`}
            >
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div 
                    className="relative cursor-pointer" 
                    onClick={handleImageClick}
                  >
                    <UserAvatar
                      name={formData.name}
                      imageUrl={imagePreview}
                      size="xl"
                      className="ring-4 ring-beauty-purple/20"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white h-8 w-8" />
                    </div>
                  </div>
                  
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Clique na foto para alterar a imagem
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nome completo
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    E-mail
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Telefone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                  />
                </div>
                
                <div>
                  <label htmlFor="bio" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Biografia
                  </label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleChange}
                    rows={4}
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>
              </div>
            </motion.div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/profile')}
                className={theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : ''}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-beauty-purple hover:bg-beauty-dark-purple"
              >
                Salvar alterações
              </Button>
            </div>
          </form>
        </main>
      </div>
    </AnimatedLayout>
  );
};

export default EditProfile;
