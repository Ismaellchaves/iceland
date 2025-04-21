import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { setupDatabase } from "./database/database";
import { useAuth } from "./contexts/AuthContext";

// Import Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import CitizenDashboard from "./pages/CitizenDashboard";
import CitizenReports from "./pages/CitizenReports";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";
import AdminManagement from "./pages/AdminManagement";
import AdminStatistics from "./pages/AdminStatistics";
import Profile from "./pages/Profile";
import ReportForm from "./components/ReportForm";
import NotFound from "./pages/NotFound";

// Inicializar o banco de dados local
setupDatabase();

const queryClient = new QueryClient();

// Simple report page component that renders the ReportForm
const ReportPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verifica se o usuário está logado, caso contrário, redireciona para a página de cadastro
    if (!user) {
      navigate('/register');
    }
  }, [user, navigate]);
  
  // Só renderiza o formulário se o usuário estiver logado
  return user ? (
    <div className="min-h-screen bg-urban-blue-50/50 dark:bg-urban-dark-900 py-8">
      <ReportForm />
    </div>
  ) : null;
};

// Auth guard component for protected routes
const AuthGuard = ({ children, adminRequired = false }: { children: React.ReactNode, adminRequired?: boolean }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (adminRequired && !JSON.parse(user).isAdmin) {
      navigate('/citizen/dashboard');
    }
  }, [navigate, adminRequired]);
  
  return <>{children}</>;
};

const AppContent = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider>
          <AnimatePresence>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/register" element={<Register />} />
              
              {/* Citizen Routes */}
              <Route path="/citizen/dashboard" element={
                <AuthGuard>
                  <CitizenDashboard />
                </AuthGuard>
              } />
              <Route path="/citizen/reports" element={
                <AuthGuard>
                  <CitizenReports />
                </AuthGuard>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <AuthGuard adminRequired>
                  <AdminDashboard />
                </AuthGuard>
              } />
              <Route path="/admin/reports" element={
                <AuthGuard adminRequired>
                  <AdminReports />
                </AuthGuard>
              } />
              <Route path="/admin/management" element={
                <AuthGuard adminRequired>
                  <AdminManagement />
                </AuthGuard>
              } />
              <Route path="/admin/statistics" element={
                <AuthGuard adminRequired>
                  <AdminStatistics />
                </AuthGuard>
              } />
              
              {/* Shared Routes */}
              <Route path="/profile" element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              } />
              <Route path="/report" element={<ReportPage />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
