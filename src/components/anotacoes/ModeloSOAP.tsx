import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Stethoscope, Brain, ClipboardCheck } from 'lucide-react';

// 1. Definição das Interfaces
export interface ModeloSOAPData {
  subjetivo?: string;
  objetivo?: string;
  avaliacao?: string;
  plano?: string;
  [key: string]: string | undefined;
}

interface ModeloSOAPProps {
  values: ModeloSOAPData | null;
  onChange: (values: ModeloSOAPData) => void;
  readOnly?: boolean;
}

export default function ModeloSOAP({ values, onChange, readOnly = false }: ModeloSOAPProps) {
  const fields = [
    { 
      key: 'subjetivo', 
      label: 'S - Subjetivo', 
      icon: FileText,
      placeholder: 'Queixas do paciente, história relatada, sintomas percebidos...',
      color: 'text-blue-600 dark:text-blue-400',
      example: 'Paciente refere dor abdominal tipo cólica em região epigástrica há 2 dias, com intensidade 7/10, que piora após alimentação. Relata náuseas e dois episódios de vômito hoje pela manhã. Nega febre.'
    },
    { 
      key: 'objetivo', 
      label: 'O - Objetivo', 
      icon: Stethoscope,
      placeholder: 'Dados objetivos: sinais vitais, exame físico, resultados de exames...',
      color: 'text-green-600 dark:text-green-400',
      example: 'PA: 130/80 mmHg, FC: 88 bpm, FR: 18 irpm, T: 36.8°C, SpO2: 98%. Abdome tenso, doloroso à palpação em epigástrio e hipocôndrio direito. Murphy positivo. Ausculta cardíaca e pulmonar sem alterações.'
    },
    { 
      key: 'avaliacao', 
      label: 'A - Avaliação', 
      icon: Brain,
      placeholder: 'Interpretação clínica, diagnósticos de enfermagem...',
      color: 'text-purple-600 dark:text-purple-400',
      example: 'Dor aguda relacionada a processo inflamatório evidenciada por expressão facial de dor e relato verbal. Risco de desidratação relacionado aos episódios eméticos. Ansiedade relacionada ao diagnóstico incerto.'
    },
    { 
      key: 'plano', 
      label: 'P - Plano', 
      icon: ClipboardCheck,
      placeholder: 'Intervenções planejadas, orientações, encaminhamentos...',
      color: 'text-orange-600 dark:text-orange-400',
      example: 'Manter jejum até liberação médica. Administrar medicação conforme prescrição. Monitorar sinais vitais 4/4h. Avaliar características da dor. Manter acesso venoso pérvio. Comunicar alterações à equipe médica.'
    }
  ];

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Modelo SOAP
        </CardTitle>
        <p className="text-blue-100 text-sm mt-1">
          Método de documentação que organiza as informações de forma lógica e completa
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