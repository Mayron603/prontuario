import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, AlertTriangle } from 'lucide-react';

interface NewsScaleProps {
  readOnly?: boolean;
}

export default function NewsScale({ readOnly = false }: NewsScaleProps) {
  const [values, setValues] = useState({
    fr: '',
    spo2: '',
    suplementoO2: '',
    temperatura: '',
    pas: '',
    fc: '',
    consciencia: ''
  });

  // Efeito para carregar exemplo
  useEffect(() => {
    if (readOnly) {
      setValues({
        fr: '24',           // Pontuação 2
        spo2: '92',         // Pontuação 2
        suplementoO2: 'sim',// Pontuação 2
        temperatura: '38.5',// Pontuação 1
        pas: '100',         // Pontuação 1
        fc: '115',          // Pontuação 2
        consciencia: 'alerta' // Pontuação 0
      });
    } else {
      setValues({
        fr: '', spo2: '', suplementoO2: '', temperatura: '', pas: '', fc: '', consciencia: ''
      });
    }
  }, [readOnly]);

  const calculateScore = () => {
    let score = 0;
    const { fr, spo2, suplementoO2, temperatura, pas, fc, consciencia } = values;
    
    // Frequência Respiratória
    const frNum = parseInt(fr);
    if (frNum <= 8) score += 3;
    else if (frNum >= 9 && frNum <= 11) score += 1;
    else if (frNum >= 12 && frNum <= 20) score += 0;
    else if (frNum >= 21 && frNum <= 24) score += 2;
    else if (frNum >= 25) score += 3;

    // SpO2
    const spo2Num = parseInt(spo2);
    if (spo2Num <= 91) score += 3;
    else if (spo2Num >= 92 && spo2Num <= 93) score += 2;
    else if (spo2Num >= 94 && spo2Num <= 95) score += 1;
    else if (spo2Num >= 96) score += 0;

    // Suplemento O2
    if (suplementoO2 === 'sim') score += 2;

    // Temperatura
    const tempNum = parseFloat(temperatura);
    if (tempNum <= 35) score += 3;
    else if (tempNum >= 35.1 && tempNum <= 36) score += 1;
    else if (tempNum >= 36.1 && tempNum <= 38) score += 0;
    else if (tempNum >= 38.1 && tempNum <= 39) score += 1;
    else if (tempNum >= 39.1) score += 2;

    // PA Sistólica
    const pasNum = parseInt(pas);
    if (pasNum <= 90) score += 3;
    else if (pasNum >= 91 && pasNum <= 100) score += 2;
    else if (pasNum >= 101 && pasNum <= 110) score += 1;
    else if (pasNum >= 111 && pasNum <= 219) score += 0;
    else if (pasNum >= 220) score += 3;

    // Frequência Cardíaca
    const fcNum = parseInt(fc);
    if (fcNum <= 40) score += 3;
    else if (fcNum >= 41 && fcNum <= 50) score += 1;
    else if (fcNum >= 51 && fcNum <= 90) score += 0;
    else if (fcNum >= 91 && fcNum <= 110) score += 1;
    else if (fcNum >= 111 && fcNum <= 130) score += 2;
    else if (fcNum >= 131) score += 3;

    // Consciência
    if (consciencia === 'alerta') score += 0;
    else if (consciencia && consciencia !== '') score += 3;

    return score;
  };

  const allFilled = Object.values(values).every(v => v !== '');
  const score = allFilled ? calculateScore() : null;

  const getRisk = () => {
    if (score === null) return null;
    if (score <= 4) return { level: 'Baixo', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/50' };
    if (score <= 6) return { level: 'Médio', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/50' };
    return { level: 'Alto', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/50' };
  };

  const risk = getRisk();

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          NEWS - National Early Warning Score {readOnly && '(Exemplo)'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {readOnly && (
          <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-xl mb-4 border border-teal-100 dark:border-teal-800">
            <p className="text-sm text-teal-800 dark:text-teal-300">
              <strong>Cenário:</strong> Paciente com quadro de sepse pulmonar, taquipneico, taquicárdico e em uso de O2 suplementar.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Frequência Respiratória (irpm)</Label>
            <Input
              type="number"
              placeholder="Ex: 16"
              value={values.fr}
              onChange={(e) => !readOnly && setValues({ ...values, fr: e.target.value })}
              readOnly={readOnly}
              className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl ${readOnly ? 'opacity-70' : ''}`}
            />
          </div>
          <div className="space-y-2">
            <Label>SpO2 (%)</Label>
            <Input
              type="number"
              placeholder="Ex: 98"
              value={values.spo2}
              onChange={(e) => !readOnly && setValues({ ...values, spo2: e.target.value })}
              readOnly={readOnly}
              className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl ${readOnly ? 'opacity-70' : ''}`}
            />
          </div>
          <div className="space-y-2">
            <Label>Suplemento de O2</Label>
            <Select 
              value={values.suplementoO2} 
              onValueChange={(v) => !readOnly && setValues({ ...values, suplementoO2: v })}
              disabled={readOnly}
            >
              <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nao">Ar ambiente</SelectItem>
                <SelectItem value="sim">Com oxigênio</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Temperatura (°C)</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="Ex: 36.5"
              value={values.temperatura}
              onChange={(e) => !readOnly && setValues({ ...values, temperatura: e.target.value })}
              readOnly={readOnly}
              className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl ${readOnly ? 'opacity-70' : ''}`}
            />
          </div>
          <div className="space-y-2">
            <Label>PA Sistólica (mmHg)</Label>
            <Input
              type="number"
              placeholder="Ex: 120"
              value={values.pas}
              onChange={(e) => !readOnly && setValues({ ...values, pas: e.target.value })}
              readOnly={readOnly}
              className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl ${readOnly ? 'opacity-70' : ''}`}
            />
          </div>
          <div className="space-y-2">
            <Label>Frequência Cardíaca (bpm)</Label>
            <Input
              type="number"
              placeholder="Ex: 72"
              value={values.fc}
              onChange={(e) => !readOnly && setValues({ ...values, fc: e.target.value })}
              readOnly={readOnly}
              className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl ${readOnly ? 'opacity-70' : ''}`}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Nível de Consciência (AVPU)</Label>
            <Select 
              value={values.consciencia} 
              onValueChange={(v) => !readOnly && setValues({ ...values, consciencia: v })}
              disabled={readOnly}
            >
              <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alerta">Alerta (A)</SelectItem>
                <SelectItem value="voz">Responde à Voz (V)</SelectItem>
                <SelectItem value="dor">Responde à Dor (P)</SelectItem>
                <SelectItem value="inconsciente">Inconsciente (U)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className={`p-6 rounded-2xl ${risk ? risk.bg : 'bg-slate-100 dark:bg-slate-900'} text-center mt-6`}>
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">Pontuação NEWS</div>
          <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
            {score !== null ? score : '-'}
          </div>
          {risk && (
            <div className={`flex items-center justify-center gap-2 text-lg font-semibold ${risk.color}`}>
              <AlertTriangle className="w-5 h-5" />
              Risco {risk.level}
            </div>
          )}
        </div>

        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-2">Interpretação:</h4>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <li>0-4: Risco baixo (monitorização padrão)</li>
            <li>5-6: Risco médio (aumento da frequência de monitorização)</li>
            <li>≥ 7: Risco alto (avaliação urgente)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}