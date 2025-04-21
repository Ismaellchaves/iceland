
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Páginas principais
import Welcome from "./pages/Welcome";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import Schedule from "./pages/Schedule";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
import Appointments from "./pages/Appointments";
import Location from "./pages/Location";

// Páginas admin
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminAppointments from "./pages/Admin/Appointments";
import AdminChat from "./pages/Admin/Chat";
import AdminChats from "./pages/Admin/Chats";
import AdminGallery from "./pages/Admin/Gallery";
import AdminStatistics from "./pages/Admin/Statistics";

import NotFound from "./pages/NotFound";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Rota de boas-vindas */}
                  <Route path="/" element={<Welcome />} />
                  <Route path="/home" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/location" element={<Location />} />
                  
                  {/* Rotas de cliente */}
                  <Route path="/services" element={<Services />} />
                  <Route path="/schedule/:serviceId" element={<Schedule />} />
                  <Route path="/chat/:appointmentId" element={<Chat />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/edit-profile" element={<EditProfile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/appointments" element={<Appointments />} />
                  
                  {/* Rotas de admin */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/appointments" element={<AdminAppointments />} />
                  <Route path="/admin/chat/:appointmentId" element={<AdminChat />} />
                  <Route path="/admin/chats" element={<AdminChats />} />
                  <Route path="/admin/gallery" element={<AdminGallery />} />
                  <Route path="/admin/statistics" element={<AdminStatistics />} />
                  
                  {/* Rota para não encontrado */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
