import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  BookOpen, FileText, Search, 
  Download, ExternalLink, Folder, Loader2 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Definição da Interface
interface Recurso {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  categoria: string;
  arquivo_url?: string;
}

const tipoIcons: Record<string, any> = {
  PDF: FileText,
  Artigo: FileText,
  Protocolo: Folder,
  Resumo: BookOpen
};

const tipoColors: Record<string, string> = {
  PDF: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  Artigo: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  Protocolo: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  Resumo: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
};

export default function Biblioteca() {
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('all');
  const [tipo, setTipo] = useState('all');

  const { data: recursos = [], isLoading } = useQuery<Recurso[]>({
    queryKey: ['recursos'],
    queryFn: () => base44.entities.RecursoBiblioteca.list('-created_date')
  });

  const filteredRecursos = recursos.filter((r: Recurso) => {
    const searchMatch = !search || 
      r.titulo?.toLowerCase().includes(search.toLowerCase()) ||
      r.descricao?.toLowerCase().includes(search.toLowerCase());
    const categoriaMatch = categoria === 'all' || r.categoria === categoria;
    const tipoMatch = tipo === 'all' || r.tipo === tipo;
    return searchMatch && categoriaMatch && tipoMatch;
  });

  // Recursos de exemplo (caso não haja no banco)
  const recursosExemplo: Recurso[] = [
    {
      id: 'ex1',
      titulo: 'Fundamentos de Enfermagem',
      descricao: 'Guia completo sobre os fundamentos da prática de enfermagem, incluindo técnicas básicas e cuidados essenciais.',
      tipo: 'Resumo',
      categoria: 'Fundamentos'
    },
    // ... outros exemplos mantidos ...
  ];

  const displayRecursos = recursos.length > 0 ? filteredRecursos : recursosExemplo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Biblioteca
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 ml-14">
            PDFs, artigos, protocolos e resumos para seus estudos
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Buscar recursos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="Fundamentos">Fundamentos</SelectItem>
                <SelectItem value="Farmacologia">Farmacologia</SelectItem>
                <SelectItem value="Procedimentos">Procedimentos</SelectItem>
                <SelectItem value="Emergência">Emergência</SelectItem>
                <SelectItem value="UTI">UTI</SelectItem>
                <SelectItem value="Pediatria">Pediatria</SelectItem>
                <SelectItem value="Geriatria">Geriatria</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="Artigo">Artigo</SelectItem>
                <SelectItem value="Protocolo">Protocolo</SelectItem>
                <SelectItem value="Resumo">Resumo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayRecursos.map((recurso: Recurso, index: number) => {
              const Icon = tipoIcons[recurso.tipo] || FileText;
              return (
                <motion.div
                  key={recurso.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl h-full hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className={`p-3 rounded-xl ${tipoColors[recurso.tipo] || 'bg-gray-100 text-gray-700'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex gap-2">
                          <Badge className={`${tipoColors[recurso.tipo] || 'bg-gray-100'} border-0`}>
                            {recurso.tipo}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg text-slate-900 dark:text-white mt-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {recurso.titulo}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                        {recurso.descricao}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="dark:border-slate-600 dark:text-slate-300">
                          {recurso.categoria}
                        </Badge>
                        {recurso.arquivo_url ? (
                          <a 
                            href={recurso.arquivo_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Button size="sm" variant="outline" className="rounded-lg">
                              <Download className="w-4 h-4 mr-1" />
                              Baixar
                            </Button>
                          </a>
                        ) : (
                          <Button size="sm" variant="outline" className="rounded-lg" disabled>
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}