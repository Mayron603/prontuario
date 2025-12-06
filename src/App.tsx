import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/ThemeContext';
import { Toaster } from 'sonner';
import Layout from '@/layout';

// Importação das Páginas
import Home from '@/pages/Home';
import Prontuarios from '@/pages/Prontuarios';
import ProntuarioDetalhe from '@/pages/ProntuarioDetalhe';
import CreateProntuario from '@/pages/CreateProntuario';
import Anotacoes from '@/pages/Anotacoes';
import Escalas from '@/pages/Escalas';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Toaster richColors position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout currentPageName="Home"><Home /></Layout>} />
            <Route path="/prontuarios" element={<Layout currentPageName="Prontuarios"><Prontuarios /></Layout>} />
            <Route path="/create-prontuario" element={<Layout currentPageName="Prontuarios"><CreateProntuario /></Layout>} />
            <Route path="/prontuario-detalhe" element={<Layout currentPageName="Prontuarios"><ProntuarioDetalhe /></Layout>} />
            <Route path="/anotacoes" element={<Layout currentPageName="Anotacoes"><Anotacoes /></Layout>} />
            <Route path="/escalas" element={<Layout currentPageName="Escalas"><Escalas /></Layout>} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;