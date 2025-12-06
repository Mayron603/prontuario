import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, AlertCircle, Activity, Lightbulb } from 'lucide-react';

// 1. Definição das Interfaces
export interface ModeloSBARData {
  situacao?: string;
  background?: string;
  avaliacao?: string;
  recomendacao?: string;
  [key: string]: string | undefined; // Permite acesso por índice string
}

interface ModeloSBARProps {
  values: ModeloSBARData | null;
  onChange: (values: ModeloSBARData) => void;
  readOnly?: boolean;
}

export default function ModeloSBAR({ values, onChange, readOnly = false }: ModeloSBARProps) {
  const fields = [
    { 
      key: 'situacao', 
      label: 'S - Situação', 
      icon: AlertCircle,
      placeholder: 'Qual é a situação atual? O que está acontecendo?',
      color: 'text-red-600 dark:text-red-400',
      example: 'Paciente João Silva, 65 anos, internado no leito 302 da Clínica Médica por pneumonia adquirida na comunidade. Apresentou queda de saturação há 30 minutos.'
    },
    { 
      key: 'background', 
      label: 'B - Background (Histórico)', 
      icon: MessageSquare,
      placeholder: 'Qual é o contexto/histórico relevante?',
      color: 'text-blue-600 dark:text-blue-400',
      example: 'Paciente hipertenso e diabético. Internado há 3 dias, em uso de antibioticoterapia venosa. Estava estável até então, em ar ambiente. Apresenta tosse produtiva.'
    },
    { 
      key: 'avaliacao', 
      label: 'A - Avaliação', 
      icon: Activity,
      placeholder: 'Qual é sua avaliação do problema?',
      color: 'text-purple-600 dark:text-purple-400',
      example: 'SpO2 caiu de 96% para 88% em ar ambiente. PA: 140/90 mmHg, FC: 110 bpm, FR: 28 irpm, T: 38.2°C. Paciente apresenta dispneia e uso de musculatura acessória. Ausculta com crepitações em base esquerda.'
    },
    { 
      key: 'recomendacao', 
      label: 'R - Recomendação', 
      icon: Lightbulb,
      placeholder: 'O que você sugere/precisa?',
      color: 'text-green-600 dark:text-green-400',
      example: 'Solicito avaliação médica imediata. Iniciei oxigenoterapia via cateter nasal 3L/min. Solicito gasometria arterial e radiografia de tórax. Gostaria de saber se devo modificar alguma conduta.'
    }
  ];

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Modelo SBAR
        </CardTitle>
        <p className="text-orange-100 text-sm mt-1">
          Comunicação estruturada para passagem de plantão e situações de urgência
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {fields.map(({ key, label, icon: Icon, placeholder, color, example }) => (
          <div key={key} className="space-y-2">
            <Label className={`flex items-center gap-2 font-semibold ${color}`}>
              <Icon className="w-4 h-4" />
              {label}
            </Label>
            {readOnly ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {values?.[key] || example}
              </div>
            ) : (
              <Textarea
                placeholder={placeholder}
                value={values?.[key] || ''}
                onChange={(e) => onChange?.({ ...values, [key]: e.target.value })}
                className="min-h-[120px] bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-xl resize-none"
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}