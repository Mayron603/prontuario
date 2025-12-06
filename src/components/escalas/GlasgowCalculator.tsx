import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Brain, Eye, MessageCircle, Hand } from 'lucide-react';

const ocularOptions = [
  { value: 4, label: 'Espontânea' },
  { value: 3, label: 'Ao estímulo verbal' },
  { value: 2, label: 'Ao estímulo doloroso' },
  { value: 1, label: 'Ausente' }
];

const verbalOptions = [
  { value: 5, label: 'Orientada' },
  { value: 4, label: 'Confusa' },
  { value: 3, label: 'Palavras inapropriadas' },
  { value: 2, label: 'Sons incompreensíveis' },
  { value: 1, label: 'Ausente' }
];

const motoraOptions = [
  { value: 6, label: 'Obedece comandos' },
  { value: 5, label: 'Localiza dor' },
  { value: 4, label: 'Movimento de retirada' },
  { value: 3, label: 'Flexão anormal (decorticação)' },
  { value: 2, label: 'Extensão anormal (descerebração)' },
  { value: 1, label: 'Ausente' }
];

// ADICIONADO: Interface para aceitar readOnly
interface GlasgowProps {
  readOnly?: boolean;
}

export default function GlasgowCalculator({ readOnly = false }: GlasgowProps) {
  const [ocular, setOcular] = useState<number | null>(null);
  const [verbal, setVerbal] = useState<number | null>(null);
  const [motora, setMotora] = useState<number | null>(null);

  // ADICIONADO: Efeito para preencher exemplo
  useEffect(() => {
    if (readOnly) {
      setOcular(3);
      setVerbal(4);
      setMotora(6);
    } else {
      setOcular(null);
      setVerbal(null);
      setMotora(null);
    }
  }, [readOnly]);

  const total = (ocular || 0) + (verbal || 0) + (motora || 0);
  
  const getClassificacao = () => {
    if (ocular === null || verbal === null || motora === null) return null;
    if (total >= 13) return { text: 'Leve', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/50' };
    if (total >= 9) return { text: 'Moderado', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/50' };
    return { text: 'Grave', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/50' };
  };

  const classificacao = getClassificacao();

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Escala de Coma de Glasgow {readOnly && '(Exemplo)'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {readOnly && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-4 border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Cenário:</strong> Paciente vítima de queda, abre os olhos ao chamado, conversa confuso, obedece comandos.
            </p>
          </div>
        )}

        {/* Abertura Ocular */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
            <Eye className="w-5 h-5 text-blue-500" />
            Abertura Ocular (O)
          </div>
          <RadioGroup 
            value={ocular?.toString()} 
            onValueChange={(v) => !readOnly && setOcular(parseInt(v))}
            disabled={readOnly}
          >
            <div className="grid gap-2">
              {ocularOptions.map((opt) => (
                <div key={opt.value} className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${readOnly ? 'opacity-90' : 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30'} ${ocular === opt.value ? 'bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500' : 'bg-slate-50 dark:bg-slate-900/50'}`}>
                  <RadioGroupItem value={opt.value.toString()} id={`o-${opt.value}`} />
                  <Label htmlFor={`o-${opt.value}`} className={`flex-1 ${!readOnly && 'cursor-pointer'}`}>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{opt.value}</span>
                    <span className="text-slate-600 dark:text-slate-400 ml-2">- {opt.label}</span>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Resposta Verbal */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            Resposta Verbal (V)
          </div>
          <RadioGroup 
            value={verbal?.toString()} 
            onValueChange={(v) => !readOnly && setVerbal(parseInt(v))}
            disabled={readOnly}
          >
            <div className="grid gap-2">
              {verbalOptions.map((opt) => (
                <div key={opt.value} className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${readOnly ? 'opacity-90' : 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30'} ${verbal === opt.value ? 'bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500' : 'bg-slate-50 dark:bg-slate-900/50'}`}>
                  <RadioGroupItem value={opt.value.toString()} id={`v-${opt.value}`} />
                  <Label htmlFor={`v-${opt.value}`} className={`flex-1 ${!readOnly && 'cursor-pointer'}`}>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{opt.value}</span>
                    <span className="text-slate-600 dark:text-slate-400 ml-2">- {opt.label}</span>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Resposta Motora */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
            <Hand className="w-5 h-5 text-blue-500" />
            Resposta Motora (M)
          </div>
          <RadioGroup 
            value={motora?.toString()} 
            onValueChange={(v) => !readOnly && setMotora(parseInt(v))}
            disabled={readOnly}
          >
            <div className="grid gap-2">
              {motoraOptions.map((opt) => (
                <div key={opt.value} className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${readOnly ? 'opacity-90' : 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30'} ${motora === opt.value ? 'bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500' : 'bg-slate-50 dark:bg-slate-900/50'}`}>
                  <RadioGroupItem value={opt.value.toString()} id={`m-${opt.value}`} />
                  <Label htmlFor={`m-${opt.value}`} className={`flex-1 ${!readOnly && 'cursor-pointer'}`}>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{opt.value}</span>
                    <span className="text-slate-600 dark:text-slate-400 ml-2">- {opt.label}</span>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Resultado */}
        <div className={`p-6 rounded-2xl ${classificacao ? classificacao.bg : 'bg-slate-100 dark:bg-slate-900'} text-center`}>
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">Pontuação Total</div>
          <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
            {total || '-'}<span className="text-2xl text-slate-400">/15</span>
          </div>
          {classificacao && (
            <div className={`text-lg font-semibold ${classificacao.color}`}>
              Traumatismo Cranioencefálico {classificacao.text}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}