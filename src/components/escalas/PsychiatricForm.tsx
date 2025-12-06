import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Brain } from 'lucide-react';

interface PsychiatricFormProps {
  readOnly?: boolean;
}

export default function PsychiatricForm({ readOnly = false }: PsychiatricFormProps) {
  const [data, setData] = useState({
    aparencia: '',
    consciencia: '',
    orientacao: '',
    memoria: '',
    atencao: '',
    pensamento: '',
    afeto: '',
    critica: ''
  });

  useEffect(() => {
    if (readOnly) {
      setData({
        aparencia: 'Vigil, cuidados preservados, postura colaborativa.',
        consciencia: 'Lúcido, sem alterações do nível de consciência.',
        orientacao: 'Orientado autopsiquicamente e alopsiquicamente (tempo/espaço).',
        memoria: 'Preservada para fatos recentes e remotos.',
        atencao: 'Normotenaz e normovigil.',
        pensamento: 'Curso normal, forma lógica, conteúdo sem delírios.',
        afeto: 'Eutímico, modulante.',
        critica: 'Preservada sobre seu estado atual.'
      });
    } else {
      setData({
        aparencia: '', consciencia: '', orientacao: '', memoria: '',
        atencao: '', pensamento: '', afeto: '', critica: ''
      });
    }
  }, [readOnly]);

  const handleChange = (field: string, value: string) => {
    if (!readOnly) setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-teal-700 to-emerald-700 text-white">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Exame do Estado Mental (Súmula Psiquiátrica) {readOnly && '(Exemplo)'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Aparência e Atitude</Label>
            <Textarea 
              value={data.aparencia} 
              onChange={(e) => handleChange('aparencia', e.target.value)}
              placeholder="Higiene, vestimenta, postura, contato visual..."
              className="bg-slate-50 dark:bg-slate-900"
              readOnly={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>Consciência</Label>
            <Textarea 
              value={data.consciencia} 
              onChange={(e) => handleChange('consciencia', e.target.value)}
              placeholder="Nível de alerta, lucidez..."
              className="bg-slate-50 dark:bg-slate-900"
              readOnly={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>Orientação</Label>
            <Textarea 
              value={data.orientacao} 
              onChange={(e) => handleChange('orientacao', e.target.value)}
              placeholder="Tempo, Espaço, Autopsíquica..."
              className="bg-slate-50 dark:bg-slate-900"
              readOnly={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>Atenção e Memória</Label>
            <Textarea 
              value={data.memoria} 
              onChange={(e) => handleChange('memoria', e.target.value)}
              placeholder="Tenacidade, vigilância, memória recente/remota..."
              className="bg-slate-50 dark:bg-slate-900"
              readOnly={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>Pensamento e Sensopercepção</Label>
            <Textarea 
              value={data.pensamento} 
              onChange={(e) => handleChange('pensamento', e.target.value)}
              placeholder="Curso, forma, conteúdo (delírios), alucinações..."
              className="bg-slate-50 dark:bg-slate-900"
              readOnly={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>Afeto e Humor</Label>
            <Textarea 
              value={data.afeto} 
              onChange={(e) => handleChange('afeto', e.target.value)}
              placeholder="Eutímico, deprimido, ansioso, modulante..."
              className="bg-slate-50 dark:bg-slate-900"
              readOnly={readOnly}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}