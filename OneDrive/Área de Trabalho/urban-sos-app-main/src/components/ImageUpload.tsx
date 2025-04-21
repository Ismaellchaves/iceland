
import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string | null) => void;
  initialImage?: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, initialImage = null }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('O tamanho máximo da imagem é 5MB.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setPreviewUrl(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
        Adicionar Imagem (opcional)
      </label>
      
      {previewUrl ? (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-auto max-h-60 object-cover rounded-lg"
          />
          <button 
            onClick={handleClearImage}
            className="absolute top-2 right-2 bg-urban-dark-900/70 text-white p-1 rounded-full hover:bg-urban-dark-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging 
              ? 'border-urban-blue-500 bg-urban-blue-50 dark:bg-urban-blue-900/20' 
              : 'border-urban-dark-300 dark:border-urban-dark-600 hover:border-urban-blue-400 hover:bg-urban-blue-50/50 dark:hover:bg-urban-blue-900/10'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          <div className="mb-2 bg-urban-blue-100 dark:bg-urban-blue-900/30 p-3 rounded-full">
            <Upload className="h-5 w-5 text-urban-blue-500" />
          </div>
          <p className="text-sm font-medium text-urban-dark-800 dark:text-white">
            Clique ou arraste uma imagem
          </p>
          <p className="text-xs text-urban-dark-500 dark:text-urban-dark-400 mt-1">
            Formato: JPG, PNG ou WEBP (máx. 5MB)
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
