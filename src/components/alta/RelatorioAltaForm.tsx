import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Save, Loader2 } from 'lucide-react';

// 1. Definição dos Tipos (Interfaces)
export interface MedicamentoAlta {
  medicamento: string;
  dose: string;
  via: string;
  frequencia: string;
}

export interface RelatorioAltaData {
  id?: string;
  prontuario_id: string | null;
  data_alta: string;
  tipo_alta: string;
  condicoes_alta: string;
  evolucao_quadro: string;
  procedimentos_realizados: string[];
  diagnostico_alta: string;
  medicamentos_alta: MedicamentoAlta[];
  orientacoes_alta: string;
  orientacoes_dieta: string;
  cuidados_domiciliares: string;
  retorno_consulta: string;
  sinais_alerta: string;
  enfermeiro_responsavel: string;
  created_date?: string;
}

interface RelatorioAltaFormProps {
  prontuarioId: string | null;
  onSave: (data: RelatorioAltaData) => void;
  onCancel: () => void;
  initialData?: RelatorioAltaData | null;
  isSaving: boolean;
}

// 2. Aplicação dos tipos no componente
export default function RelatorioAltaForm({ 
  prontuarioId, 
  onSave, 
  onCancel, 
  initialData, 
  isSaving 
}: RelatorioAltaFormProps) {
  
  const [relatorio, setRelatorio] = useState<RelatorioAltaData>(initialData || {
    prontuario_id: prontuarioId,
    data_alta: '',
    tipo_alta: '',
    condicoes_alta: '',
    evolucao_quadro: '',
    procedimentos_realizados: [],
    diagnostico_alta: '',
    medicamentos_alta: [],
    orientacoes_alta: '',
    orientacoes_dieta: '',
    cuidados_domiciliares: '',
    retorno_consulta: '',
    sinais_alerta: '',
    enfermeiro_responsavel: ''
  });

  const [novoProcedimento, setNovoProcedimento] = useState('');
  const [novoMedicamento, setNovoMedicamento] = useState<MedicamentoAlta>({
    medicamento: '',
    dose: '',
    via: '',
    frequencia: ''
  });

  const addProcedimento = () => {
    if (novoProcedimento.trim()) {
      setRelatorio({
        ...relatorio,
        procedimentos_realizados: [...relatorio.procedimentos_realizados, novoProcedimento]
      });
      setNovoProcedimento('');
    }
  };

  const removeProcedimento = (index: number) => {
    setRelatorio({
      ...relatorio,
      procedimentos_realizados: relatorio.procedimentos_realizados.filter((_, i) => i !== index)
    });
  };

  const addMedicamento = () => {
    if (novoMedicamento.medicamento.trim()) {
      setRelatorio({
        ...relatorio,
        medicamentos_alta: [...relatorio.medicamentos_alta, novoMedicamento]
      });
      setNovoMedicamento({ medicamento: '', dose: '', via: '', frequencia: '' });
    }
  };

  const removeMedicamento = (index: number) => {
    setRelatorio({
      ...relatorio,
      medicamentos_alta: relatorio.medicamentos_alta.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(relatorio);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados Básicos */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Dados da Alta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Data da Alta *</Label>
              <Input
                type="date"
                value={relatorio.data_alta}
                onChange={(e) => setRelatorio({ ...relatorio, data_alta: e.target.value })}
                required
                className="bg-slate-50 dark:bg-slate-900 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Alta *</Label>
              <Select value={relatorio.tipo_alta} onValueChange={(v) => setRelatorio({ ...relatorio, tipo_alta: v })}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Melhora">Melhora</SelectItem>
                  <SelectItem value="Transferência">Transferência</SelectItem>
                  <SelectItem value="Óbito">Óbito</SelectItem>
                  <SelectItem value="Evasão">Evasão</SelectItem>
                  <SelectItem value="A pedido">A pedido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Enfermeiro Responsável</Label>
              <Input
                value={relatorio.enfermeiro_responsavel}
                onChange={(e) => setRelatorio({ ...relatorio, enfermeiro_responsavel: e.target.value })}
                placeholder="Nome e COREN"
                className="bg-slate-50 dark:bg-slate-900 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Diagnóstico na Alta</Label>
            <Input
              value={relatorio.diagnostico_alta}
              onChange={(e) => setRelatorio({ ...relatorio, diagnostico_alta: e.target.value })}
              placeholder="Diagnóstico final"
              className="bg-slate-50 dark:bg-slate-900 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Condições do Paciente na Alta</Label>
            <Textarea
              value={relatorio.condicoes_alta}
              onChange={(e) => setRelatorio({ ...relatorio, condicoes_alta: e.target.value })}
              placeholder="Estado geral, sinais vitais, nível de consciência..."
              className="min-h-[100px] bg-slate-50 dark:bg-slate-900 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Evolução e Procedimentos */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Resumo da Internação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Evolução do Quadro</Label>
            <Textarea
              value={relatorio.evolucao_quadro}
              onChange={(e) => setRelatorio({ ...relatorio, evolucao_quadro: e.target.value })}
              placeholder="Resumo da evolução durante a internação..."
              className="min-h-[120px] bg-slate-50 dark:bg-slate-900 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Procedimentos Realizados</Label>
            <div className="flex gap-2">
              <Input
                value={novoProcedimento}
                onChange={(e) => setNovoProcedimento(e.target.value)}
                placeholder="Adicionar procedimento"
                className="bg-slate-50 dark:bg-slate-900 rounded-xl"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProcedimento())}
              />
              <Button type="button" onClick={addProcedimento} className="bg-blue-600 rounded-xl">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {relatorio.procedimentos_realizados.map((proc, i) => (
                <div key={i} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-sm border border-blue-200 dark:border-blue-800">
                  <span>{proc}</span>
                  <button type="button" onClick={() => removeProcedimento(i)} className="hover:text-blue-900 dark:hover:text-blue-100">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medicamentos de Alta */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Medicações para Uso Domiciliar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl space-y-3 border border-purple-100 dark:border-purple-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Medicamento"
                value={novoMedicamento.medicamento}
                onChange={(e) => setNovoMedicamento({ ...novoMedicamento, medicamento: e.target.value })}
                className="bg-white dark:bg-slate-800 rounded-xl"
              />
              <Input
                placeholder="Dose (ex: 500mg)"
                value={novoMedicamento.dose}
                onChange={(e) => setNovoMedicamento({ ...novoMedicamento, dose: e.target.value })}
                className="bg-white dark:bg-slate-800 rounded-xl"
              />
              <Input
                placeholder="Via (ex: VO)"
                value={novoMedicamento.via}
                onChange={(e) => setNovoMedicamento({ ...novoMedicamento, via: e.target.value })}
                className="bg-white dark:bg-slate-800 rounded-xl"
              />
              <Input
                placeholder="Frequência (ex: 8/8h)"
                value={novoMedicamento.frequencia}
                onChange={(e) => setNovoMedicamento({ ...novoMedicamento, frequencia: e.target.value })}
                className="bg-white dark:bg-slate-800 rounded-xl"
              />
            </div>
            
            {/* BOTÃO MELHORADO */}
            <Button 
              type="button" 
              onClick={addMedicamento} 
              variant="outline"
              className="w-full border-dashed border-2 border-slate-300 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-300 h-10 rounded-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Medicamento
            </Button>
          </div>

          <div className="space-y-2">
            {relatorio.medicamentos_alta.map((med, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm rounded-xl">
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-purple-600 dark:text-purple-400">{med.medicamento}</span> - {med.dose} - {med.via} - {med.frequencia}
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeMedicamento(i)} className="text-slate-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Orientações */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Orientações ao Paciente/Família</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Orientações Gerais</Label>
            <Textarea
              value={relatorio.orientacoes_alta}
              onChange={(e) => setRelatorio({ ...relatorio, orientacoes_alta: e.target.value })}
              placeholder="Orientações gerais sobre o tratamento, repouso, atividades..."
              className="min-h-[100px] bg-slate-50 dark:bg-slate-900 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Orientações Dietéticas</Label>
            <Textarea
              value={relatorio.orientacoes_dieta}
              onChange={(e) => setRelatorio({ ...relatorio, orientacoes_dieta: e.target.value })}
              placeholder="Orientações sobre alimentação, restrições..."
              className="min-h-[80px] bg-slate-50 dark:bg-slate-900 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Cuidados Domiciliares</Label>
            <Textarea
              value={relatorio.cuidados_domiciliares}
              onChange={(e) => setRelatorio({ ...relatorio, cuidados_domiciliares: e.target.value })}
              placeholder="Cuidados a serem realizados em casa (curativos, higiene, etc)"
              className="min-h-[80px] bg-slate-50 dark:bg-slate-900 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Retorno/Consulta</Label>
            <Input
              value={relatorio.retorno_consulta}
              onChange={(e) => setRelatorio({ ...relatorio, retorno_consulta: e.target.value })}
              placeholder="Ex: Retornar em 7 dias no ambulatório de clínica médica"
              className="bg-slate-50 dark:bg-slate-900 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Sinais de Alerta</Label>
            <Textarea
              value={relatorio.sinais_alerta}
              onChange={(e) => setRelatorio({ ...relatorio, sinais_alerta: e.target.value })}
              placeholder="Sinais e sintomas que indicam necessidade de retornar ao hospital..."
              className="min-h-[80px] bg-slate-50 dark:bg-slate-900 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} className="h-11 rounded-xl">
          Cancelar
        </Button>
        {/* BOTÃO MELHORADO */}
        <Button 
          type="submit" 
          disabled={isSaving} 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 h-11 px-6 rounded-xl transition-all hover:-translate-y-0.5"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Relatório
            </>
          )}
        </Button>
      </div>
    </form>
  );
}