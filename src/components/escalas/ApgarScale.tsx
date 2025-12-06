import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Baby } from 'lucide-react';

const criteria = [
  { name: 'Aparência (Cor)', key: 'aparencia', options: [{ v: 0, l: 'Cianose central/Pálido' }, { v: 1, l: 'Acrocianose' }, { v: 2, l: 'Rosado' }] },
  { name: 'Pulso (Frequência Cardíaca)', key: 'pulso', options: [{ v: 0, l: 'Ausente' }, { v: 1, l: '< 100 bpm' }, { v: 2, l: '> 100 bpm' }] },
  { name: 'Gesticulação (Irritabilidade)', key: 'gesticulacao', options: [{ v: 0, l: 'Sem resposta' }, { v: 1, l: 'Maretas/Choro fraco' }, { v: 2, l: 'Espirro/Tosse/Choro forte' }] },
  { name: 'Atividade (Tônus Muscular)', key: 'atividade', options: [{ v: 0, l: 'Flácido' }, { v: 1, l: 'Alguma flexão' }, { v: 2, l: 'Movimentos ativos' }] },
  { name: 'Respiração', key: 'respiracao', options: [{ v: 0, l: 'Ausente' }, { v: 1, l: 'Lenta/Irregular' }, { v: 2, l: 'Forte/Regular (Choro)' }] }
];

interface ApgarProps {
  readOnly?: boolean;
}

export default function ApgarScale({ readOnly = false }: ApgarProps) {
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    if (readOnly) {
      setScores({ aparencia: 2, pulso: 2, gesticulacao: 2, atividade: 2, respiracao: 1 }); // Total 9
    } else {
      setScores({});
    }
  }, [readOnly]);

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const allFilled = Object.keys(scores).length === 5;

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-pink-400 to-rose-400 text-white">
        <CardTitle className="flex items-center gap-2">
          <Baby className="w-5 h-5" />
          Escala de Apgar {readOnly && '(Exemplo)'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {readOnly && (
          <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-xl mb-6 border border-pink-100 dark:border-pink-800">
            <p className="text-sm text-pink-800 dark:text-pink-300">
              <strong>Cenário:</strong> Recém-nascido, 1º minuto, cor rosada, FC 140bpm, reativo, ativo, choro forte mas respiração levemente irregular.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {criteria.map((c) => (
            <div key={c.key} className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{c.name}</label>
              <Select 
                value={scores[c.key]?.toString()} 
                onValueChange={(v) => !readOnly && setScores(prev => ({ ...prev, [c.key]: parseInt(v) }))}
                disabled={readOnly}
              >
                <SelectTrigger className="bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {c.options.map((opt) => (
                    <SelectItem key={opt.v} value={opt.v.toString()}>{opt.v} - {opt.l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl">
          <div className="text-sm text-slate-500 mb-1">Nota Total</div>
          <div className="text-5xl font-bold text-slate-900 dark:text-white">
            {allFilled ? total : '-'}<span className="text-2xl text-slate-400">/10</span>
          </div>
          {allFilled && (
            <div className={`mt-2 font-medium ${total >= 7 ? 'text-green-600' : total >= 4 ? 'text-yellow-600' : 'text-red-600'}`}>
              {total >= 7 ? 'Boa vitalidade' : total >= 4 ? 'Asfixia moderada' : 'Asfixia grave'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}