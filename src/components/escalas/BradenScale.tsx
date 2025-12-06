import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, AlertTriangle } from 'lucide-react';

const criteria = [
  {
    name: 'Percepção Sensorial',
    options: [
      { value: 1, label: 'Totalmente limitada' },
      { value: 2, label: 'Muito limitada' },
      { value: 3, label: 'Levemente limitada' },
      { value: 4, label: 'Nenhuma limitação' }
    ]
  },
  {
    name: 'Umidade',
    options: [
      { value: 1, label: 'Constantemente úmida' },
      { value: 2, label: 'Frequentemente úmida' },
      { value: 3, label: 'Ocasionalmente úmida' },
      { value: 4, label: 'Raramente úmida' }
    ]
  },
  {
    name: 'Atividade',
    options: [
      { value: 1, label: 'Acamado' },
      { value: 2, label: 'Restrito à cadeira' },
      { value: 3, label: 'Caminha ocasionalmente' },
      { value: 4, label: 'Caminha frequentemente' }
    ]
  },
  {
    name: 'Mobilidade',
    options: [
      { value: 1, label: 'Totalmente imóvel' },
      { value: 2, label: 'Muito limitada' },
      { value: 3, label: 'Levemente limitada' },
      { value: 4, label: 'Nenhuma limitação' }
    ]
  },
  {
    name: 'Nutrição',
    options: [
      { value: 1, label: 'Muito pobre' },
      { value: 2, label: 'Provavelmente inadequada' },
      { value: 3, label: 'Adequada' },
      { value: 4, label: 'Excelente' }
    ]
  },
  {
    name: 'Fricção e Cisalhamento',
    options: [
      { value: 1, label: 'Problema' },
      { value: 2, label: 'Problema potencial' },
      { value: 3, label: 'Nenhum problema' }
    ]
  }
];

interface BradenProps {
  readOnly?: boolean;
}

export default function BradenScale({ readOnly = false }: BradenProps) {
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    if (readOnly) {
      setScores({
        'Percepção Sensorial': 3,
        'Umidade': 2,
        'Atividade': 1,
        'Mobilidade': 2,
        'Nutrição': 2,
        'Fricção e Cisalhamento': 1
      });
    } else {
      setScores({});
    }
  }, [readOnly]);

  const total = Object.values(scores).reduce((acc: number, val: number) => acc + val, 0);
  const allFilled = Object.keys(scores).length === criteria.length;

  const getRisk = () => {
    if (!allFilled) return null;
    if (total <= 9) return { level: 'Muito Alto', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/50' };
    if (total <= 12) return { level: 'Alto', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/50' };
    if (total <= 14) return { level: 'Moderado', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/50' };
    if (total <= 18) return { level: 'Baixo', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/50' };
    return { level: 'Sem Risco', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/50' };
  };

  const risk = getRisk();

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Escala de Braden {readOnly && '(Exemplo)'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {readOnly && (
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl mb-4 border border-purple-100 dark:border-purple-800">
             <p className="text-sm text-purple-800 dark:text-purple-300">
              <strong>Cenário:</strong> Paciente idoso, acamado, umidade ocasional, aceita metade da dieta e desliza na cama.
            </p>
          </div>
        )}

        {criteria.map((criterion) => (
          <div key={criterion.name} className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {criterion.name}
            </label>
            <Select
              value={scores[criterion.name]?.toString() || ''}
              onValueChange={(v) => !readOnly && setScores({ ...scores, [criterion.name]: parseInt(v) })}
              disabled={readOnly}
            >
              <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {criterion.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value.toString()}>
                    {opt.value} - {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        <div className={`p-6 rounded-2xl ${risk ? risk.bg : 'bg-slate-100 dark:bg-slate-900'} text-center mt-6`}>
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">Pontuação Total</div>
          <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
            {allFilled ? total : '-'}<span className="text-2xl text-slate-400">/23</span>
          </div>
          {risk && (
            <div className={`flex items-center justify-center gap-2 text-lg font-semibold ${risk.color}`}>
              <AlertTriangle className="w-5 h-5" />
              Risco {risk.level}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}