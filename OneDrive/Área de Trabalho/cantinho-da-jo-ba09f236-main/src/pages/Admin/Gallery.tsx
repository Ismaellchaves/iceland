
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, Image } from 'lucide-react';
import AnimatedLayout from '@/components/AnimatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
}

const AdminGallery = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // Estado inicial com algumas imagens de exemplo
  const [images, setImages] = useState<GalleryImage[]>([
    {
      id: '1',
      url: '/placeholder.svg',
      title: 'Exemplo 1'
    },
    {
      id: '2',
      url: '/placeholder.svg',
      title: 'Exemplo 2'
    }
  ]);
  
  const [dragActive, setDragActive] = useState(false);
  
  // Verificar se é administrador
  if (!currentUser || !currentUser.isAdmin) {
    navigate('/login');
    return null;
  }
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = (files: FileList) => {
    // Simulando o upload de arquivos
    Array.from(files).forEach(file => {
      // Na vida real, você enviaria os arquivos para o servidor
      // Aqui, estamos apenas criando URLs temporárias
      const imageUrl = URL.createObjectURL(file);
      const newImage: GalleryImage = {
        id: `img_${Date.now()}`,
        url: imageUrl,
        title: file.name
      };
      
      setImages(prev => [...prev, newImage]);
    });
    
    toast({
      title: "Imagens adicionadas",
      description: "As imagens foram adicionadas à galeria."
    });
  };
  
  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    
    toast({
      title: "Imagem removida",
      description: "A imagem foi removida da galeria."
    });
  };
  
  return (
    <AnimatedLayout>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin')}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Galeria de Imagens</h1>
          </div>
        </header>
        
        <main className="max-w-6xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div 
              className={`border-2 border-dashed rounded-2xl p-10 text-center ${
                dragActive ? 'border-beauty-purple bg-beauty-soft-purple' : 'border-beauty-light-purple/30'
              } transition-colors duration-300`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: dragActive ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
              >
                <Upload className="h-12 w-12 text-beauty-purple mb-4" />
                <h3 className="text-xl font-semibold mb-2">Arraste imagens aqui</h3>
                <p className="text-muted-foreground mb-6">ou clique para selecionar arquivos</p>
                
                <label htmlFor="file-upload" className="beauty-button cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar arquivos
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
              </motion.div>
            </div>
          </motion.div>
          
          <h2 className="text-xl font-semibold mb-4">Imagens na galeria ({images.length})</h2>
          
          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden group relative">
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemoveImage(image.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="p-0">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3">
                        <p className="font-medium truncate">{image.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <Image className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma imagem na galeria.</p>
              <p className="text-muted-foreground">Adicione imagens para mostrar aqui.</p>
            </div>
          )}
        </main>
      </div>
    </AnimatedLayout>
  );
};

export default AdminGallery;
