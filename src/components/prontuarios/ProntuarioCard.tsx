import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Calendar, Activity, ArrowRight, AlertTriangle } from 'lucide-react';

// 1. Definição da interface do Prontuário
export interface Prontuario {
  id: string;
  nome_paciente: string;
  idade: string | number;
  sexo: string;
  diagnostico_principal: string;
  quarto_leito: string;
  estado_clinico: string;
  prioridade: string;
  complexidade?: string;
}

// 2. Interface das Props
interface ProntuarioCardProps {
  prontuario: Prontuario;
  index?: number;
}

// 3. Tipagem dos objetos de cores
const prioridadeColors: Record<string, string> = {
  'Baixa': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  'Média': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Alta': 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  'Urgente': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
};

const estadoColors: Record<string, string> = {
  'Estável': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  'Grave': 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  'Crítico': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  'Em observação': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
};

export default function ProntuarioCard({ prontuario, index = 0 }: ProntuarioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
            {prontuario.nome_paciente?.charAt(0) || 'P'}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
              {prontuario.nome_paciente}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <User className="w-3.5 h-3.5" />
              <span>{prontuario.idade} anos • {prontuario.sexo}</span>
            </div>
          </div>
        </div>
        
        {prontuario.prioridade === 'Urgente' && (
          <div className="flex items-center gap-1 text-red-500 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="space-y-3 mb-5">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Diagnóstico</span>
          <p className="text-slate-800 dark:text-slate-200 font-medium">{prontuario.diagnostico_principal}</p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>Quarto {prontuario.quarto_leito || 'N/A'}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <Badge className={`${estadoColors[prontuario.estado_clinico] || 'bg-slate-100'} border-0`}>
          <Activity className="w-3 h-3 mr-1" />
          {prontuario.estado_clinico}
        </Badge>
        <Badge className={`${prioridadeColors[prontuario.prioridade] || 'bg-slate-100'} border-0`}>
          {prontuario.prioridade}
        </Badge>
        {prontuario.complexidade && (
          <Badge variant="outline" className="dark:border-slate-600 dark:text-slate-300">
            {prontuario.complexidade}
          </Badge>
        )}
      </div>

      <Link to={`${createPageUrl('ProntuarioDetalhe')}?id=${prontuario.id}`}>
        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all">
          Abrir Prontuário
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </motion.div>
  );
}