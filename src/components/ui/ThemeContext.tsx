import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; // Correção: Importação de tipo separada

// 1. Definição da interface do Contexto
interface ThemeContextType {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  toggleTheme: () => void;
}

// 2. Definição da interface das Props do Provider
interface ThemeProviderProps {
  children: ReactNode;
}

// 3. Criação do contexto com tipo ou undefined
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, toggleTheme: () => setIsDark(!isDark) }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Hook customizado com verificação de segurança
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};