import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Heart, Thermometer, Wind, Activity, Droplets } from 'lucide-react';

type VitalKey = 'fc' | 'fr' | 'pas' | 'pad' | 'temperatura' | 'spo2';

interface Range {
  min: number;
  max: number;
  unit: string;
  label: string;
}

const normalRanges: Record<VitalKey, Range> = {
  fc: { min: 60, max: 100, unit: 'bpm', label: 'Frequência Cardíaca' },
  fr: { min: 12, max: 20, unit: 'irpm', label: 'Frequência Respiratória' },
  pas: { min: 90, max: 140, unit: 'mmHg', label: 'PA Sistólica' },
  pad: { min: 60, max: 90, unit: 'mmHg', label: 'PA Diastólica' },
  temperatura: { min: 36, max: 37.5, unit: '°C', label: 'Temperatura' },
  spo2: { min: 95, max: 100, unit: '%', label: 'SpO2' }
};

interface VitalSignsProps {
  readOnly?: boolean;
}

export default function VitalSignsCalculator({ readOnly = false }: VitalSignsProps) {
  const [vitals, setVitals] = useState<Record<VitalKey, string>>({
    fc: '',
    fr: '',
    pas: '',
    pad: '',
    temperatura: '',
    spo2: ''
  });

  useEffect(() => {
    if (readOnly) {
      setVitals({
        fc: '88',
        fr: '16',
        pas: '120',
        pad: '80',
        temperatura: '36.5',
        spo2: '98'
      });
    } else {
      setVitals({ fc: '', fr: '', pas: '', pad: '', temperatura: '', spo2: '' });
    }
  }, [readOnly]);

  const getStatus = (key: VitalKey, value: string) => {
    if (!value) return null;
    const num = parseFloat(value);
    const range = normalRanges[key];
    if (num < range.min) return { status: 'baixo', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' };
    if (num > range.max) return { status: 'alto', color: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' };
    return { status: 'normal', color: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' };
  };

  const vitalFields: { key: VitalKey; icon: any; placeholder: string }[] = [
    { key: 'fc', icon: Heart, placeholder: '60-100' },
    { key: 'fr', icon: Wind, placeholder: '12-20' },
    { key: 'pas', icon: Activity, placeholder: '90-140' },
    { key: 'pad', icon: Activity, placeholder: '60-90' },
    { key: 'temperatura', icon: Thermometer, placeholder: '36.0-37.5' },
    { key: 'spo2', icon: Droplets, placeholder: '95-100' }
  ];

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Sinais Vitais (SSVV) {readOnly && '(Exemplo)'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {readOnly && (
           <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl mb-6 border border-rose-100 dark:border-rose-800">
             <p className="text-sm text-rose-800 dark:text-rose-300">
              <strong>Cenário:</strong> Sinais vitais dentro dos parâmetros normais para um adulto em repouso.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vitalFields.map(({ key, icon: Icon, placeholder }) => {
            const range = normalRanges[key];
            const status = getStatus(key, vitals[key]);
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-500" />
                    {range.label}
                  </Label>
                  {status && (
                    <Badge className={status.color}>
                      {status.status}
                    </Badge>
                  )}
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.1"
                    placeholder={placeholder}
                    value={vitals[key]}
                    onChange={(e) => !readOnly && setVitals({ ...vitals, [key]: e.target.value })}
                    readOnly={readOnly}
                    className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl pr-16 ${readOnly ? 'opacity-70' : ''}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    {range.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-3">Valores de Referência (Adultos)</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {(Object.entries(normalRanges) as [VitalKey, Range][]).map(([key, range]) => (
              <div key={key} className="text-slate-600 dark:text-slate-400">
                <span className="font-medium">{range.label}:</span>{' '}
                {range.min}-{range.max} {range.unit}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}