import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, AlertOctagon } from 'lucide-react';

const niveis = [
  { cor: 'Vermelho', tempo: '0 min', nome: 'Emergência', desc: 'Risco imediato de morte', style: 'bg-red-500 border-red-600 text-white', ring: 'focus-visible:ring-red-500' },
  { cor: 'Laranja', tempo: '10 min', nome: 'Muito Urgente', desc: 'Risco potencial de morte', style: 'bg-orange-500 border-orange-600 text-white', ring: 'focus-visible:ring-orange-500' },
  { cor: 'Amarelo', tempo: '60 min', nome: 'Urgente', desc: 'Necessita de atendimento rápido', style: 'bg-yellow-400 border-yellow-500 text-slate-900', ring: 'focus-visible:ring-yellow-400' },
  { cor: 'Verde', tempo: '120 min', nome: 'Pouco Urgente', desc: 'Condições não agudas', style: 'bg-green-500 border-green-600 text-white', ring: 'focus-visible:ring-green-500' },
  { cor: 'Azul', tempo: '240 min', nome: 'Não Urgente', desc: 'Atendimento eletivo', style: 'bg-blue-500 border-blue-600 text-white', ring: 'focus-visible:ring-blue-500' }
];

interface ManchesterProps {
  readOnly?: boolean;
}

export default function ManchesterScale({ readOnly = false }: ManchesterProps) {
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    if (readOnly) {
      setSelected('Laranja');
    } else {
      setSelected('');
    }
  }, [readOnly]);

  const currentLevel = niveis.find(n => n.cor === selected);

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
        <CardTitle className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5" />
          Protocolo de Manchester {readOnly && '(Exemplo)'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {readOnly && (
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl mb-6 border border-orange-100 dark:border-orange-800">
            <p className="text-sm text-orange-800 dark:text-orange-300">
              <strong>Cenário:</strong> Paciente com dor torácica intensa, sudorese e dispneia leve.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <Label className="text-base">Selecione a Classificação de Risco:</Label>
          <RadioGroup value={selected} onValueChange={(v) => !readOnly && setSelected(v)} disabled={readOnly} className="grid gap-3">
            {niveis.map((nivel) => (
              <div key={nivel.cor}>
                <RadioGroupItem value={nivel.cor} id={nivel.cor} className="peer sr-only" />
                <Label
                  htmlFor={nivel.cor}
                  className={`
                    flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.01]
                    ${selected === nivel.cor ? `ring-2 ring-offset-2 ${nivel.ring} scale-[1.02]` : 'opacity-80 hover:opacity-100'}
                    ${nivel.style}
                  `}
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">{nivel.nome}</span>
                    <span className="text-xs opacity-90 font-medium">{nivel.desc}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="font-bold">{nivel.tempo}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {currentLevel && (
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-center border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500">Tempo Alvo para Atendimento Médico</div>
            <div className={`text-3xl font-bold mt-1`} style={{ color: currentLevel.cor === 'Amarelo' ? '#ca8a04' : currentLevel.style.split(' ')[0].replace('bg-', 'text-') }}>
              Até {currentLevel.tempo}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}