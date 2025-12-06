import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Adicionado useMutation e useQueryClient
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ClipboardList, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProntuarioCard, { type Prontuario } from '@/components/prontuarios/ProntuarioCard';
import ProntuarioFilters from '@/components/prontuarios/ProntuarioFilters';
import { toast } from 'sonner'; // Para notificações

export default function Prontuarios() {
  const queryClient = useQueryClient(); // Cliente para atualizar a lista
  const [filters, setFilters] = useState({
    search: '',
    prioridade: 'all',
    estado: 'all',
    complexidade: 'all'
  });

  const { data: prontuarios = [], isLoading } = useQuery<Prontuario[]>({
    queryKey: ['prontuarios'],
    queryFn: () => base44.entities.Prontuario.list('-created_date')
  });

  // Mutação para deletar
  const deleteMutation = useMutation({
    mutationFn: (id: string) => base44.entities.Prontuario.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] });
      toast.success('Prontuário excluído com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir prontuário.');
    }
  });

  // Função chamada pelo Card
  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este prontuário? Essa ação não pode ser desfeita.')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredProntuarios = prontuarios.filter((p: Prontuario) => {
    const searchMatch = !filters.search || 
      p.nome_paciente?.toLowerCase().includes(filters.search.toLowerCase()) ||
      p.diagnostico_principal?.toLowerCase().includes(filters.search.toLowerCase());
    const prioridadeMatch = filters.prioridade === 'all' || p.prioridade === filters.prioridade;
    const estadoMatch = filters.estado === 'all' || p.estado_clinico === filters.estado;
    const complexidadeMatch = filters.complexidade === 'all' || p.complexidade === filters.complexidade;
    return searchMatch && prioridadeMatch && estadoMatch && complexidadeMatch;
  });

  const clearFilters = () => {
    setFilters({
      search: '',
      prioridade: 'all',
      estado: 'all',
      complexidade: 'all'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-blue-600 text-white">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Prontuários Simulados
                </h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400 ml-14">
                Explore casos clínicos completos para praticar suas habilidades
              </p>
            </div>
            
            <Link to={createPageUrl('CreateProntuario')}>
              <Button className="bg-[#10a37f] hover:bg-[#0d8a6a] text-white shadow-md rounded-full font-medium px-6 h-11 transition-all hover:shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                Criar Prontuário
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ProntuarioFilters 
            filters={filters} 
            setFilters={setFilters} 
            onClear={clearFilters} 
          />
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredProntuarios.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Nenhum prontuário encontrado
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Tente ajustar os filtros ou aguarde novos casos
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProntuarios.map((prontuario: Prontuario, index: number) => (
              <ProntuarioCard 
                key={prontuario.id} 
                prontuario={prontuario} 
                index={index}
                onDelete={handleDelete} // Passando a função
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}