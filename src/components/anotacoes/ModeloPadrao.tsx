import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ClipboardList, Clock } from 'lucide-react';

// 1. Definição das Interfaces
export interface ModeloPadraoData {
  dataHora?: string;
  enfermeiro?: string;
  anotacao?: string;
}

interface ModeloPadraoProps {
  values: ModeloPadraoData | null;
  onChange: (values: ModeloPadraoData) => void;
  readOnly?: boolean;
}

export default function ModeloPadrao({ values, onChange, readOnly = false }: ModeloPadraoProps) {
  const exampleText = `Plantão: 07:00 às 19:00

Paciente encontra-se no leito, acordado, orientado, contactuante, afebril, normocorado, normocárdico, eupneico em ar ambiente.

SSVV: PA: 120/80 mmHg | FC: 76 bpm | FR: 16 irpm | T: 36.5°C | SpO2: 98%

Aceitando dieta por via oral. Diurese presente, clara, em bom volume. Evacuação ausente neste plantão.

Acesso venoso periférico em MSE, pérvio, sem sinais flogísticos. Curativo oclusivo limpo e seco.

Medicações administradas conforme prescrição médica.

Mantido cuidados de enfermagem conforme plano assistencial.

Aguardando avaliação médica para possível alta hospitalar.

_________________________
Enf. Maria Santos
COREN-SP 123456`;

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          Anotação de Enfermagem Padrão
        </CardTitle>
        <p className="text-emerald-100 text-sm mt-1">
          Modelo tradicional de anotação com descrição cronológica dos cuidados
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {!readOnly && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                Data e Hora
              </Label>
              <Input
                type="datetime-local"
                value={values?.dataHora || ''}
                onChange={(e) => onChange?.({ ...values, dataHora: e.target.value })}
                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Enfermeiro(a) Responsável</Label>
              <Input
                placeholder="Nome e COREN"
                value={values?.enfermeiro || ''}
                onChange={(e) => onChange?.({ ...values, enfermeiro: e.target.value })}
                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label>Anotação</Label>
          {readOnly ? (
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {values?.anotacao || exampleText}
            </div>
          ) : (
            <Textarea
              placeholder="Descreva o estado do paciente, cuidados realizados, intercorrências..."
              value={values?.anotacao || ''}
              onChange={(e) => onChange?.({ ...values, anotacao: e.target.value })}
              className="min-h-[400px] bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-xl resize-none font-mono text-sm"
            />
          )}
        </div>

        {!readOnly && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Dicas para uma boa anotação:</h4>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Seja objetivo e claro</li>
              <li>Registre horário das ocorrências</li>
              <li>Descreva sinais vitais e estado geral</li>
              <li>Documente medicações administradas</li>
              <li>Registre intercorrências e condutas</li>
              <li>Não use abreviações não padronizadas</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}