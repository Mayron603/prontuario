import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Zap, Moon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const levels = [
  { val: 4, label: 'Combativo', desc: 'Violento, perigo para a equipe' },
  { val: 3, label: 'Muito Agitado', desc: 'Puxa tubos/cateteres, agressivo' },
  { val: 2, label: 'Agitado', desc: 'Movimentos desordenados frequentes' },
  { val: 1, label: 'Inquieto', desc: 'Ansioso, apreensivo, movimentos não agressivos' },
  { val: 0, label: 'Alerta e Calmo', desc: 'Comportamento normal' },
  { val: -1, label: 'Sonolento', desc: 'Acorda com voz, mantém olhos abertos > 10s' },
  { val: -2, label: 'Sedação Leve', desc: 'Acorda com voz, contato visual < 10s' },
  { val: -3, label: 'Sedação Moderada', desc: 'Move-se ou abre olhos à voz, sem contato visual' },
  { val: -4, label: 'Sedação Profunda', desc: 'Sem resposta à voz, move-se ao estímulo físico' },
  { val: -5, label: 'Não Despertável', desc: 'Sem resposta a estímulo físico ou verbal' },
];

interface RassProps {
  readOnly?: boolean;
}

export default function RassScale({ readOnly = false }: RassProps) {
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (readOnly) {
      setScore(-2);
    } else {
      setScore(null);
    }
  }, [readOnly]);

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Escala de RASS (Agitação e Sedação) {readOnly && '(Exemplo)'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {readOnly && (
          <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-xl mb-6 border border-violet-100 dark:border-violet-800">
            <p className="text-sm text-violet-800 dark:text-violet-300">
              <strong>Cenário:</strong> Paciente em UTI sob sedação contínua, abre os olhos brevemente ao chamado mas logo volta a dormir (contato visual &lt; 10s).
            </p>
          </div>
        )}

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          <RadioGroup value={score?.toString()} onValueChange={(v) => !readOnly && setScore(parseInt(v))} disabled={readOnly}>
             {levels.map((l) => (
               <div key={l.val} className={`
                 flex items-center space-x-3 p-3 rounded-xl border transition-all
                 ${score === l.val 
                   ? 'bg-violet-50 dark:bg-violet-900/30 border-violet-200 dark:border-violet-700 ring-1 ring-violet-500' 
                   : 'bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}
               `}>
                 <RadioGroupItem value={l.val.toString()} id={`rass-${l.val}`} />
                 <Label htmlFor={`rass-${l.val}`} className={`flex-1 cursor-pointer grid grid-cols-[40px_1fr] gap-4 items-center`}>
                    <span className={`font-bold text-lg text-center ${l.val > 0 ? 'text-orange-600' : l.val < 0 ? 'text-blue-600' : 'text-green-600'}`}>
                      {l.val > 0 ? `+${l.val}` : l.val}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        {l.label}
                        {l.val > 0 && <Zap className="w-3 h-3 text-orange-500" />}
                        {l.val < 0 && <Moon className="w-3 h-3 text-blue-500" />}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{l.desc}</div>
                    </div>
                 </Label>
               </div>
             ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}