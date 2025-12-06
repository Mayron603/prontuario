import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, ClipboardList, FileText, Calculator, 
  BookOpen, Menu, X, Moon, Sun, Heart,
  Stethoscope
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Início', href: 'Home', icon: Home },
  { name: 'Prontuários', href: 'Prontuarios', icon: ClipboardList },
  { name: 'Anotações', href: 'Anotacoes', icon: FileText },
  { name: 'Escalas', href: 'Escalas', icon: Calculator },
  { name: 'Biblioteca', href: 'Biblioteca', icon: BookOpen }
];

export default function Layout({ children, currentPageName }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPageName]);

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20"> {/* Aumentei um pouco a altura para h-20 */}
            
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3 group">
              {/* Ícone da Logo sem fundo colorido para ficar mais limpo, ou mantemos sutil */}
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                Enfermagem<span className="text-blue-600">.ai</span>
              </span>
            </Link>

            {/* Desktop Nav - AQUI ESTÁ A MUDANÇA VISUAL */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-50/50 dark:bg-slate-800/50 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              {navItems.map((item) => {
                const isActive = currentPageName === item.href;
                return (
                  <Link key={item.name} to={createPageUrl(item.href)}>
                    <Button
                      variant="ghost" // Usamos ghost base para remover bordas padrão
                      className={`
                        relative h-10 px-5 rounded-full text-sm font-medium transition-all duration-300
                        ${isActive 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700' 
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700'
                        }
                      `}
                    >
                      <item.icon className={`w-4 h-4 mr-2 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600'}`} />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Actions (Direita) */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDark(!isDark)}
                className="rounded-full w-10 h-10 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden rounded-full w-10 h-10 text-slate-500"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            >
              <nav className="container mx-auto px-4 py-4 space-y-1">
                {navItems.map((item) => {
                   const isActive = currentPageName === item.href;
                   return (
                    <Link key={item.name} to={createPageUrl(item.href)}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start rounded-xl mb-1 ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="bg-slate-50/50 dark:bg-slate-900 min-h-[calc(100vh-80px)]">
        {children}
      </main>

      {/* Footer (Simplificado para combinar com o novo estilo) */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-8 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-80">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-slate-700 dark:text-slate-300">Enfermagem.ai</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Feito com <Heart className="w-3 h-3 inline text-red-500 fill-current" /> para estudantes.
          </p>
        </div>
      </footer>
    </div>
  );
}