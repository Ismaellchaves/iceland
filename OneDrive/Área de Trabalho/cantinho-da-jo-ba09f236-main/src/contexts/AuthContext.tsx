
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, addUser, authenticateUser, users } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string, 
    email: string, 
    password: string, 
    address?: string, 
    phone?: string,
    imageFile?: File
  ) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há um usuário salvo no localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Verificar se esse usuário ainda existe no sistema
        const user = users.find(u => u.id === parsedUser.id);
        if (user) {
          setCurrentUser(user);
        } else {
          localStorage.removeItem('currentUser');
        }
      } catch (err) {
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = authenticateUser(email, password);
      
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo de volta, ${user.name}!`,
        });
        
        // Redirecionar com base no tipo de usuário
        if (user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/services');
        }
        
        return true;
      } else {
        toast({
          title: "Falha no login",
          description: "E-mail ou senha incorretos.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string,
    address?: string,
    phone?: string,
    imageFile?: File
  ): Promise<boolean> => {
    try {
      // Verificar se o email já está em uso
      const existingUser = users.find(user => user.email === email);
      
      if (existingUser) {
        toast({
          title: "Falha no registro",
          description: "Este e-mail já está em uso.",
          variant: "destructive",
        });
        return false;
      }
      
      // Process profile image if provided
      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        // In a real app, we would upload this to storage
        // For now, create a data URL for demo purposes
        imageUrl = URL.createObjectURL(imageFile);
      }
      
      const newUser = addUser({ 
        name, 
        email, 
        password,
        address,
        phone,
        image: imageUrl 
      });
      
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      toast({
        title: "Registro bem-sucedido",
        description: `Bem-vindo, ${newUser.name}!`,
      });
      
      // Redirecionar para serviços
      navigate('/services');
      return true;
    } catch (error) {
      toast({
        title: "Erro no registro",
        description: "Ocorreu um erro durante o registro. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      ...updates
    };
    
    // Update the user in the "database"
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
    }
    
    // Update local state and localStorage
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso."
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logout bem-sucedido",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/home');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser?.isAdmin || false,
        isLoading,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
