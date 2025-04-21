
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

type User = {
  id: string;
  email: string;
  name?: string;
  isAdmin: boolean;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  birthDate?: string;
  cpf?: string;
  profileImage?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticação no carregamento
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          // Converter para objeto e definir o usuário
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log('Usuário recuperado do localStorage:', parsedUser);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log("Signing up with:", email);
      console.log("User data:", userData);
      
      // Criar novo usuário no localStorage para demo
      const newUser = {
        id: Date.now().toString(),
        email,
        name: userData.name || email.split('@')[0],
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        birthDate: userData.birthDate ? userData.birthDate.toISOString() : '',
        cpf: userData.cpf || '',
        isAdmin: false,
      };
      
      console.log("Novo usuário sendo criado:", newUser);
      
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      // Adicionar usuário ao "banco de dados" local
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push({
        ...newUser,
        password, // Em um app real, nunca armazenamos senhas em texto plano
      });
      localStorage.setItem('users', JSON.stringify(users));
      
      toast({
        title: "Conta criada com sucesso",
        description: "Bem-vindo ao Urban SOS!",
      });
      
      return;
    } catch (error) {
      console.error("Error signing up:", error);
      toast({
        title: "Erro ao criar usuário",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao criar sua conta",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in with:", email);
      
      // Verificar no "banco de dados" local para demo
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const adminUser = {
        id: '1',
        email: 'prefeitura@gmail.com',
        password: 'prefeitura123',
        name: 'Administrador',
        isAdmin: true
      };
      
      // Admin login check
      if (email === adminUser.email && password === adminUser.password) {
        const userData = {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          isAdmin: true
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo, Administrador!",
        });
        
        return;
      }
      
      // Regular user login
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const userData = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          phone: foundUser.phone || '',
          address: foundUser.address || '',
          city: foundUser.city || '',
          state: foundUser.state || '',
          birthDate: foundUser.birthDate || '',
          cpf: foundUser.cpf || '',
          profileImage: foundUser.profileImage || '',
          isAdmin: foundUser.isAdmin || false
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        });
        
        return;
      }
      
      // Se chegou aqui, não encontrou o usuário
      throw new Error("Credenciais inválidas");
      
    } catch (error) {
      console.error("Error signing in:", error);
      toast({
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Credenciais inválidas",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    
    // Atualizar no localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Atualizar no estado
    setUser(updatedUser);
    
    // Atualizar no "banco de dados" local
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...data };
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
  };

  const signOut = async () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
