import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

// 1. Definição das Interfaces
export interface FilterState {
  search: string;
  prioridade: string;
  estado: string;
  complexidade: string;
}

interface ProntuarioFiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onClear: () => void;
}

export default function ProntuarioFilters({ filters, setFilters, onClear }: ProntuarioFiltersProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-semibold text-slate-900 dark:text-white">Filtros de Busca</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Buscar por nome ou diagnóstico..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
          />
        </div>

        <Select 
          value={filters.prioridade} 
          onValueChange={(v) => setFilters({ ...filters, prioridade: v })}
        >
          <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="Baixa">Baixa</SelectItem>
            <SelectItem value="Média">Média</SelectItem>
            <SelectItem value="Alta">Alta</SelectItem>
            <SelectItem value="Urgente">Urgente</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.estado} 
          onValueChange={(v) => setFilters({ ...filters, estado: v })}
        >
          <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl">
            <SelectValue placeholder="Estado Clínico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Estável">Estável</SelectItem>
            <SelectItem value="Grave">Grave</SelectItem>
            <SelectItem value="Crítico">Crítico</SelectItem>
            <SelectItem value="Em observação">Em observação</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.complexidade} 
          onValueChange={(v) => setFilters({ ...filters, complexidade: v })}
        >
          <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl">
            <SelectValue placeholder="Complexidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="Simples">Simples</SelectItem>
            <SelectItem value="Moderada">Moderada</SelectItem>
            <SelectItem value="Complexa">Complexa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(filters.search || filters.prioridade !== 'all' || filters.estado !== 'all' || filters.complexidade !== 'all') && (
        <div className="mt-4 flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4 mr-1" />
            Limpar Filtros
          </Button>
        </div>
      )}
    </div>
  );
}