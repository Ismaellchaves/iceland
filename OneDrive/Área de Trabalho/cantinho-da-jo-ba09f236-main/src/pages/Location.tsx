
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Clock, MapPin, ExternalLink } from 'lucide-react';
import AnimatedLayout from '@/components/AnimatedLayout';
import { Button } from '@/components/ui/button';
import { salonLocation } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';

const Location = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load Google Maps embed
    if (mapRef.current) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.3676308710985!2d-40.665174!3d-5.1555983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x796f54a0f39b07f%3A0xaceede8d322a9259!2sCantinho%20da%20j%C3%B4!5e0!3m2!1spt-BR!2sbr!4v1682341234567!5m2!1spt-BR!2sbr`;
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.border = "0";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.loading = "lazy";
      iframe.className = "rounded-lg";
      
      // Clear and append
      mapRef.current.innerHTML = "";
      mapRef.current.appendChild(iframe);
    }
  }, []);
  
  return (
    <AnimatedLayout>
      <div className="min-h-screen bg-beauty-soft-purple/30">
        <header className="bg-white shadow-sm sticky top-0 z-10 px-6 py-4 border-b border-beauty-light-purple/20">
          <div className="max-w-4xl mx-auto flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-4 text-beauty-purple hover:bg-beauty-soft-purple/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl font-bold text-beauty-purple"
            >
              Localização
            </motion.h1>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 space-y-6"
          >
            <Card className="overflow-hidden border-beauty-light-purple/20 shadow-lg">
              <div className="aspect-video w-full bg-gray-200 relative">
                <div ref={mapRef} className="w-full h-full">
                  {/* Map will be loaded here */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-muted-foreground">Carregando mapa...</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-beauty-light-purple/20 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <motion.h2 
                    className="text-2xl font-semibold mb-4 text-beauty-purple"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    Cantinho Da Jô
                  </motion.h2>
                  
                  <div className="space-y-5">
                    <motion.div 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <MapPin className="h-5 w-5 text-beauty-purple mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Endereço</p>
                        <p className="text-muted-foreground">{salonLocation.address}</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <Phone className="h-5 w-5 text-beauty-purple mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Telefone</p>
                        <p className="text-muted-foreground">{salonLocation.phone}</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <Clock className="h-5 w-5 text-beauty-purple mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Horário de Funcionamento</p>
                        <div className="space-y-1 mt-1">
                          <div className="flex justify-between border-b border-beauty-light-purple/10 pb-1">
                            <p className="text-sm text-muted-foreground">Segunda-feira</p>
                            <p className="text-sm font-medium text-beauty-purple">{salonLocation.openingHours.monday}</p>
                          </div>
                          <div className="flex justify-between border-b border-beauty-light-purple/10 pb-1">
                            <p className="text-sm text-muted-foreground">Terça-feira</p>
                            <p className="text-sm font-medium text-beauty-purple">{salonLocation.openingHours.tuesday}</p>
                          </div>
                          <div className="flex justify-between border-b border-beauty-light-purple/10 pb-1">
                            <p className="text-sm text-muted-foreground">Quarta-feira</p>
                            <p className="text-sm font-medium text-beauty-purple">{salonLocation.openingHours.wednesday}</p>
                          </div>
                          <div className="flex justify-between border-b border-beauty-light-purple/10 pb-1">
                            <p className="text-sm text-muted-foreground">Quinta-feira</p>
                            <p className="text-sm font-medium text-beauty-purple">{salonLocation.openingHours.thursday}</p>
                          </div>
                          <div className="flex justify-between border-b border-beauty-light-purple/10 pb-1">
                            <p className="text-sm text-muted-foreground">Sexta-feira</p>
                            <p className="text-sm font-medium text-beauty-purple">{salonLocation.openingHours.friday}</p>
                          </div>
                          <div className="flex justify-between border-b border-beauty-light-purple/10 pb-1">
                            <p className="text-sm text-muted-foreground">Sábado</p>
                            <p className="text-sm font-medium text-beauty-purple">{salonLocation.openingHours.saturday}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm text-muted-foreground">Domingo</p>
                            <p className="text-sm font-medium text-beauty-purple">{salonLocation.openingHours.sunday}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              className="flex justify-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${salonLocation.coordinates.lat},${salonLocation.coordinates.lng}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="no-underline"
              >
                <Button className="beauty-button gap-2 bg-beauty-purple hover:bg-beauty-dark-purple shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
                  <ExternalLink className="h-4 w-4" />
                  Abrir no Google Maps
                </Button>
              </a>
              
              <a 
                href={`tel:${salonLocation.phone.replace(/[^0-9]/g, '')}`}
                className="no-underline" 
              >
                <Button variant="outline" className="border-beauty-purple text-beauty-purple hover:bg-beauty-soft-purple gap-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
                  <Phone className="h-4 w-4" />
                  Ligar agora
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </AnimatedLayout>
  );
};

export default Location;
