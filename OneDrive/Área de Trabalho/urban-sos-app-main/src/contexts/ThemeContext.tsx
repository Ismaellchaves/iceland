
import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeType = 'light' | 'dark';

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Iniciar com o tema claro por padrão ou recuperar do localStorage
  const [theme, setTheme] = useState<ThemeType>(() => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeType) || 'light';
  });

  // Aplicar o tema ao documento quando ele mudar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    
    // Remover ambas as classes antes de adicionar a nova
    root.classList.remove('light', 'dark');
    
    // Adicionar a classe apropriada
    root.classList.add(theme);
    
    // Salvar o tema no localStorage
    localStorage.setItem('theme', theme);
    
    console.log('Tema atual:', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
