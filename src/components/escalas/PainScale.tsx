import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Frown, Meh, Smile, Annoyed, Angry } from 'lucide-react';

const painLevels = [
  { min: 0, max: 0, label: 'Sem dor', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/50', icon: Smile },
  { min: 1, max: 3, label: 'Dor leve', color: 'text-lime-500', bg: 'bg-lime-100 dark:bg-lime-900/50', icon: Smile },
  { min: 4, max: 6, label: 'Dor moderada', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/50', icon: Meh },
  { min: 7, max: 9, label: 'Dor intensa', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/50', icon: Annoyed },
  { min: 10, max: 10, label: 'Dor insuportável', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/50', icon: Angry }
];

interface PainScaleProps {
  readOnly?: boolean;
}

export default function PainScale({ readOnly = false }: PainScaleProps) {
  const [pain, setPain] = useState([0]);

  useEffect(() => {
    if (readOnly) {
      setPain([7]); // Exemplo de dor intensa
    } else {
      setPain([0]);
    }
  }, [readOnly]);

  const getCurrentLevel = () => {
    return painLevels.find(l => pain[0] >= l.min && pain[0] <= l.max);
  };

  const level = getCurrentLevel();
  const Icon = level?.icon || Smile;

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <CardTitle className="flex items-center gap-2">
          <Frown className="w-5 h-5" />
          Escala Visual Analógica de Dor {readOnly && '(Exemplo)'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {readOnly && (
           <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl mb-6 border border-orange-100 dark:border-orange-800">
             <p className="text-sm text-orange-800 dark:text-orange-300">
              <strong>Cenário:</strong> Paciente pós-operatório imediato, refere dor forte ao movimentar-se.
            </p>
          </div>
        )}

        <div className="flex justify-center mb-8">
          <div className={`w-32 h-32 rounded-full ${level?.bg} flex items-center justify-center transition-all duration-300`}>
            <Icon className={`w-20 h-20 ${level?.color} transition-all duration-300`} />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>Sem dor</span>
            <span>Dor máxima</span>
          </div>
          <Slider
            value={pain}
            onValueChange={!readOnly ? setPain : undefined}
            max={10}
            step={1}
            disabled={readOnly}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400">
            {[...Array(11)].map((_, i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-2xl ${level?.bg} text-center transition-all duration-300`}>
          <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
            {pain[0]}
          </div>
          <div className={`text-xl font-semibold ${level?.color}`}>
            {level?.label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}