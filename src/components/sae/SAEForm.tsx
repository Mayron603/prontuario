import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Save, Loader2 } from 'lucide-react';

// 1. Definição das Interfaces
export interface DiagnosticoEnfermagem {
  diagnostico: string;
  caracteristicas: string;
  fatores_relacionados: string;
}

export interface Planejamento {
  resultado_esperado: string;
  intervencoes: string[];
}

export interface SAEData {
  id?: string;
  prontuario_id: string | null;
  data_plantao: string;
  turno: string;
  historico_enfermagem: string;
  diagnosticos_enfermagem: DiagnosticoEnfermagem[];
  planejamento: Planejamento[];
  implementacao: string;
  avaliacao: string;
  enfermeiro_responsavel: string;
  created_date?: string;
}

interface SAEFormProps {
  prontuarioId: string | null;
  onSave: (data: SAEData) => void;
  onCancel: () => void;
  initialData?: SAEData | null;
  isSaving: boolean;
}

export default function SAEForm({ 
  prontuarioId, 
  onSave, 
  onCancel, 
  initialData, 
  isSaving 
}: SAEFormProps) {
  
  // 2. Tipagem do Estado
  const [sae, setSae] = useState<SAEData>(initialData || {
    prontuario_id: prontuarioId,
    data_plantao: '',
    turno: '',
    historico_enfermagem: '',
    diagnosticos_enfermagem: [],
    planejamento: [],
    implementacao: '',
    avaliacao: '',
    enfermeiro_responsavel: ''
  });

  const [novoDiagnostico, setNovoDiagnostico] = useState<DiagnosticoEnfermagem>({
    diagnostico: '',
    caracteristicas: '',
    fatores_relacionados: ''
  });

  const [novoPlano, setNovoPlano] = useState<Planejamento>({
    resultado_esperado: '',
    intervencoes: ['']
  });

  const addDiagnostico = () => {
    if (novoDiagnostico.diagnostico.trim()) {
      setSae({
        ...sae,
        diagnosticos_enfermagem: [...sae.diagnosticos_enfermagem, novoDiagnostico]
      });
      setNovoDiagnostico({ diagnostico: '', caracteristicas: '', fatores_relacionados: '' });
    }
  };

  const removeDiagnostico = (index: number) => {
    setSae({
      ...sae,
      diagnosticos_enfermagem: sae.diagnosticos_enfermagem.filter((_, i) => i !== index)
    });
  };

  const addPlano = () => {
    if (novoPlano.resultado_esperado.trim()) {
      setSae({
        ...sae,
        planejamento: [...sae.planejamento, {
          ...novoPlano,
          intervencoes: novoPlano.intervencoes.filter(i => i.trim())
        }]
      });
      setNovoPlano({ resultado_esperado: '', intervencoes: [''] });
    }
  };

  const removePlano = (index: number) => {
    setSae({
      ...sae,
      planejamento: sae.planejamento.filter((_, i) => i !== index)
    });
  };

  const addIntervencaoToPlano = () => {
    setNovoPlano({
      ...novoPlano,
      intervencoes: [...novoPlano.intervencoes, '']
    });
  };

  const updateIntervencao = (index: number, value: string) => {
    const newIntervencoes = [...novoPlano.intervencoes];
    newIntervencoes[index] = value;
    setNovoPlano({ ...novoPlano, intervencoes: newIntervencoes });
  };

  const removeIntervencao = (index: number) => {
    setNovoPlano({
      ...novoPlano,
      intervencoes: novoPlano.intervencoes.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(sae);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados Básicos */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Dados do Plantão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Data do Plantão *</Label>
              <Input
                type="date"
                value={sae.data_plantao}
                onChange={(e) => setSae({ ...sae, data_plantao: e.target.value })}
                required
                className="bg-slate-50 dark:bg-slate-900 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Turno *</Label>
              <Select value={sae.turno} onValueChange={(v) => setSae({ ...sae, turno: v })}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manhã">Manhã</SelectItem>
                  <SelectItem value="Tarde">Tarde</SelectItem>
                  <SelectItem value="Noite">Noite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Enfermeiro Responsável</Label>
              <Input
                value={sae.enfermeiro_responsavel}
                onChange={(e) => setSae({ ...sae, enfermeiro_responsavel: e.target.value })}
                placeholder="Nome e COREN"
                className="bg-slate-50 dark:bg-slate-900 rounded-xl"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Enfermagem */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">1. Histórico de Enfermagem</CardTitle>
          <p className="text-sm text-slate-500">Coleta de dados - Anamnese e Exame Físico</p>
        </CardHeader>
        <CardContent>
          <Textarea
            value={sae.historico_enfermagem}
            onChange={(e) => setSae({ ...sae, historico_enfermagem: e.target.value })}
            placeholder="Descreva o estado geral do paciente, queixas, sinais e sintomas, exame físico..."
            className="min-h-[150px] bg-slate-50 dark:bg-slate-900 rounded-xl"
          />
        </CardContent>
      </Card>

      {/* Diagnósticos de Enfermagem */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">2. Diagnósticos de Enfermagem</CardTitle>
          <p className="text-sm text-slate-500">Baseado na taxonomia NANDA</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl space-y-3">
            <Input
              placeholder="Diagnóstico de Enfermagem (ex: Dor aguda)"
              value={novoDiagnostico.diagnostico}
              onChange={(e) => setNovoDiagnostico({ ...novoDiagnostico, diagnostico: e.target.value })}
              className="bg-white dark:bg-slate-800"
            />
            <Input
              placeholder="Características definidoras"
              value={novoDiagnostico.caracteristicas}
              onChange={(e) => setNovoDiagnostico({ ...novoDiagnostico, caracteristicas: e.target.value })}
              className="bg-white dark:bg-slate-800"
            />
            <Input
              placeholder="Fatores relacionados"
              value={novoDiagnostico.fatores_relacionados}
              onChange={(e) => setNovoDiagnostico({ ...novoDiagnostico, fatores_relacionados: e.target.value })}
              className="bg-white dark:bg-slate-800"
            />
            <Button type="button" onClick={addDiagnostico} className="bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Diagnóstico
            </Button>
          </div>

          <div className="space-y-3">
            {sae.diagnosticos_enfermagem.map((diag, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{diag.diagnostico}</h4>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeDiagnostico(i)}>
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  <strong>Características:</strong> {diag.caracteristicas}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>Fatores relacionados:</strong> {diag.fatores_relacionados}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Planejamento */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">3. Planejamento</CardTitle>
          <p className="text-sm text-slate-500">Resultados esperados e intervenções</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl space-y-3">
            <Input
              placeholder="Resultado esperado (ex: Paciente relatará redução da dor para 3/10)"
              value={novoPlano.resultado_esperado}
              onChange={(e) => setNovoPlano({ ...novoPlano, resultado_esperado: e.target.value })}
              className="bg-white dark:bg-slate-800"
            />
            <div className="space-y-2">
              <Label>Intervenções de Enfermagem</Label>
              {novoPlano.intervencoes.map((int, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder={`Intervenção ${i + 1}`}
                    value={int}
                    onChange={(e) => updateIntervencao(i, e.target.value)}
                    className="bg-white dark:bg-slate-800"
                  />
                  {novoPlano.intervencoes.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeIntervencao(i)}>
                      <X className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addIntervencaoToPlano}>
                <Plus className="w-3 h-3 mr-1" />
                Adicionar intervenção
              </Button>
            </div>
            <Button type="button" onClick={addPlano} className="bg-green-600">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar ao Plano
            </Button>
          </div>

          <div className="space-y-3">
            {sae.planejamento.map((plano, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{plano.resultado_esperado}</h4>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removePlano(i)}>
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>Intervenções:</strong>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    {plano.intervencoes.map((int, j) => (
                      <li key={j}>{int}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementação */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">4. Implementação</CardTitle>
          <p className="text-sm text-slate-500">Execução dos cuidados planejados</p>
        </CardHeader>
        <CardContent>
          <Textarea
            value={sae.implementacao}
            onChange={(e) => setSae({ ...sae, implementacao: e.target.value })}
            placeholder="Descreva as ações de enfermagem realizadas durante o plantão..."
            className="min-h-[150px] bg-slate-50 dark:bg-slate-900 rounded-xl"
          />
        </CardContent>
      </Card>

      {/* Avaliação */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">5. Avaliação</CardTitle>
          <p className="text-sm text-slate-500">Resultados alcançados</p>
        </CardHeader>
        <CardContent>
          <Textarea
            value={sae.avaliacao}
            onChange={(e) => setSae({ ...sae, avaliacao: e.target.value })}
            placeholder="Avalie os resultados obtidos, se os objetivos foram alcançados..."
            className="min-h-[120px] bg-slate-50 dark:bg-slate-900 rounded-xl"
          />
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSaving} className="bg-blue-600">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar SAE
            </>
          )}
        </Button>
      </div>
    </form>
  );
}