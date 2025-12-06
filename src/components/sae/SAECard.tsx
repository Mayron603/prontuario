import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Eye, Edit3, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
// Correção: Importação explícita de tipo
import type { SAEData } from './SAEForm';

// 1. Tipagem do objeto de cores para aceitar chaves string
const turnoColors: Record<string, string> = {
  'Manhã': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Tarde': 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  'Noite': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
};

// 2. Interface das Props do Componente
interface SAECardProps {
  sae: SAEData;
  onView: (sae: SAEData) => void;
  onEdit: (sae: SAEData) => void;
  onDelete: (id: string) => void;
}

export default function SAECard({ sae, onView, onEdit, onDelete }: SAECardProps) {
  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-slate-900 dark:text-white mb-2">
              SAE - {sae.data_plantao && format(new Date(sae.data_plantao), "dd/MM/yyyy", { locale: ptBR })}
            </CardTitle>
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <Badge className={`${turnoColors[sae.turno] || 'bg-slate-100'} border-0`}>
                {sae.turno}
              </Badge>
              {sae.enfermeiro_responsavel && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {sae.enfermeiro_responsavel}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          {sae.diagnosticos_enfermagem?.length > 0 && (
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Diagnósticos: {sae.diagnosticos_enfermagem.length}
              </span>
            </div>
          )}
          {sae.planejamento?.length > 0 && (
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Planejamentos: {sae.planejamento.length}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onView(sae)} className="flex-1">
            <Eye className="w-4 h-4 mr-1" />
            Ver
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(sae)}>
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => sae.id && onDelete(sae.id)} 
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}