import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, Save, Plus, X, User, Activity, 
  Heart, Pill, FileText, Loader2, Stethoscope,
  ClipboardList, BrainCircuit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

// 1. Interfaces Atualizadas
interface SinalVital {
  data_hora: string;
  pa: string;
  fc: string;
  fr: string;
  temperatura: string;
  spo2: string;
  dor: string;
}

interface Evolucao {
  data_hora: string;
  descricao: string;
  avaliacao: string; // [NOVO]
  enfermeiro: string;
}

// [NOVO] Interface para Diagnóstico de Enfermagem
interface DiagnosticoEnf {
  tipo: 'Diagnóstico' | 'Risco' | 'Promoção';
  descricao: string;
  enfermeiro: string;
}

interface Intervencao {
  intervencao: string;
  horario: string;
  responsavel: string;
}

interface Prescricao {
  medicamento: string;
  dose: string;
  via: string;
  horarios: string;
}

interface ProntuarioData {
  id?: string;
  nome_paciente: string;
  idade: string;
  sexo: string;
  diagnostico_principal: string;
  diagnosticos_secundarios: string[];
  estado_clinico: string;
  prioridade: string;
  complexidade: string;
  quarto_leito: string;
  data_internacao: string;
  historia_clinica: string;
  antecedentes: string;
  alergias: string[];
  sinais_vitais: SinalVital[];
  evolucao_enfermagem: Evolucao[];
  diagnosticos_enfermagem: DiagnosticoEnf[]; // [NOVO]
  intervencoes: Intervencao[];
  prescricoes: Prescricao[];
  observacoes: string;
}

export default function CreateProntuario() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const idToEdit = searchParams.get('edit');
  
  // 2. Estado Principal
  const [prontuario, setProntuario] = useState<ProntuarioData>({
    nome_paciente: '',
    idade: '',
    sexo: '',
    diagnostico_principal: '',
    diagnosticos_secundarios: [],
    estado_clinico: '',
    prioridade: '',
    complexidade: '',
    quarto_leito: '',
    data_internacao: '',
    historia_clinica: '',
    antecedentes: '',
    alergias: [],
    sinais_vitais: [],
    evolucao_enfermagem: [],
    diagnosticos_enfermagem: [], // [NOVO]
    intervencoes: [],
    prescricoes: [],
    observacoes: ''
  });

  // 3. Estados Auxiliares
  const [novoDiagnostico, setNovoDiagnostico] = useState('');
  const [novaAlergia, setNovaAlergia] = useState('');
  
  const [novoSinalVital, setNovoSinalVital] = useState<SinalVital>({
    data_hora: '', pa: '', fc: '', fr: '', temperatura: '', spo2: '', dor: ''
  });
  
  // [MODIFICADO] Evolução com Avaliação
  const [novaEvolucao, setNovaEvolucao] = useState<Evolucao>({
    data_hora: '', descricao: '', avaliacao: '', enfermeiro: ''
  });

  // [NOVO] Estado para Diagnóstico de Enfermagem
  const [novoDiagnosticoEnf, setNovoDiagnosticoEnf] = useState<DiagnosticoEnf>({
    tipo: 'Diagnóstico',
    descricao: '',
    enfermeiro: ''
  });
  
  const [novaIntervencao, setNovaIntervencao] = useState<Intervencao>({
    intervencao: '', horario: '', responsavel: ''
  });
  
  const [novaPrescricao, setNovaPrescricao] = useState<Prescricao>({
    medicamento: '', dose: '', via: '', horarios: ''
  });

  // 4. Buscar dados
  const { data: dadosExistentes, isLoading: loadingData } = useQuery({
    queryKey: ['prontuario', idToEdit],
    queryFn: async () => {
      if (!idToEdit) return null;
      const res = await base44.entities.Prontuario.filter({ id: idToEdit });
      return res[0];
    },
    enabled: !!idToEdit
  });

  // 5. Preencher formulário
  useEffect(() => {
    if (dadosExistentes) {
      setProntuario({
        ...dadosExistentes,
        idade: dadosExistentes.idade?.toString() || '',
        sinais_vitais: dadosExistentes.sinais_vitais?.map((s: any) => ({
          ...s,
          fc: s.fc?.toString() || '',
          fr: s.fr?.toString() || '',
          temperatura: s.temperatura?.toString() || '',
          spo2: s.spo2?.toString() || '',
          dor: s.dor?.toString() || ''
        })) || [],
        // Garantir arrays vazios se não existirem no backend antigo
        diagnosticos_enfermagem: dadosExistentes.diagnosticos_enfermagem || []
      });
    }
  }, [dadosExistentes]);

  // 6. Mutação para Salvar
  const saveMutation = useMutation({
    mutationFn: async (data: ProntuarioData) => {
      const cleanedData = {
        ...data,
        idade: parseInt(data.idade) || 0,
        sinais_vitais: data.sinais_vitais.map(sv => ({
          ...sv,
          fc: parseFloat(sv.fc) || 0,
          fr: parseFloat(sv.fr) || 0,
          temperatura: parseFloat(sv.temperatura) || 0,
          spo2: parseFloat(sv.spo2) || 0,
          dor: parseFloat(sv.dor) || 0
        }))
      };

      if (idToEdit) {
        return await base44.entities.Prontuario.update(idToEdit, cleanedData);
      } else {
        return await base44.entities.Prontuario.create(cleanedData);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] });
      if (idToEdit) queryClient.invalidateQueries({ queryKey: ['prontuario', idToEdit] });
      
      toast.success(idToEdit ? 'Prontuário atualizado com sucesso!' : 'Prontuário criado com sucesso!');
      navigate(`${createPageUrl('ProntuarioDetalhe')}?id=${data.id}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erro ao salvar prontuário');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prontuario.nome_paciente || !prontuario.diagnostico_principal) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    saveMutation.mutate(prontuario);
  };

  // --- Funções Auxiliares ---

  const addDiagnosticoSecundario = () => {
    if (novoDiagnostico.trim()) {
      setProntuario({
        ...prontuario,
        diagnosticos_secundarios: [...prontuario.diagnosticos_secundarios, novoDiagnostico]
      });
      setNovoDiagnostico('');
    }
  };

  const removeDiagnosticoSecundario = (index: number) => {
    setProntuario({
      ...prontuario,
      diagnosticos_secundarios: prontuario.diagnosticos_secundarios.filter((_, i) => i !== index)
    });
  };

  const addAlergia = () => {
    if (novaAlergia.trim()) {
      setProntuario({
        ...prontuario,
        alergias: [...prontuario.alergias, novaAlergia]
      });
      setNovaAlergia('');
    }
  };

  const removeAlergia = (index: number) => {
    setProntuario({
      ...prontuario,
      alergias: prontuario.alergias.filter((_, i) => i !== index)
    });
  };

  const addSinalVital = () => {
    if (novoSinalVital.data_hora && novoSinalVital.pa) {
      setProntuario({
        ...prontuario,
        sinais_vitais: [...prontuario.sinais_vitais, novoSinalVital]
      });
      setNovoSinalVital({
        data_hora: '', pa: '', fc: '', fr: '', temperatura: '', spo2: '', dor: ''
      });
    } else {
      toast.warning('Preencha Data/Hora e PA');
    }
  };

  const removeSinalVital = (index: number) => {
    setProntuario({
      ...prontuario,
      sinais_vitais: prontuario.sinais_vitais.filter((_, i) => i !== index)
    });
  };

  // [MODIFICADO] Adicionar Evolução
  const addEvolucao = () => {
    if (novaEvolucao.data_hora && novaEvolucao.descricao) {
      setProntuario({
        ...prontuario,
        evolucao_enfermagem: [...prontuario.evolucao_enfermagem, novaEvolucao]
      });
      setNovaEvolucao({ data_hora: '', descricao: '', avaliacao: '', enfermeiro: '' });
    } else {
      toast.warning('Preencha Data/Hora e Descrição');
    }
  };

  const removeEvolucao = (index: number) => {
    setProntuario({
      ...prontuario,
      evolucao_enfermagem: prontuario.evolucao_enfermagem.filter((_, i) => i !== index)
    });
  };

  // [NOVO] Adicionar Diagnóstico de Enfermagem
  const addDiagnosticoEnf = () => {
    if (novoDiagnosticoEnf.descricao && novoDiagnosticoEnf.enfermeiro) {
      setProntuario({
        ...prontuario,
        diagnosticos_enfermagem: [...prontuario.diagnosticos_enfermagem, novoDiagnosticoEnf]
      });
      setNovoDiagnosticoEnf({ tipo: 'Diagnóstico', descricao: '', enfermeiro: '' });
    } else {
      toast.warning('Preencha a descrição e o enfermeiro');
    }
  };

  const removeDiagnosticoEnf = (index: number) => {
    setProntuario({
      ...prontuario,
      diagnosticos_enfermagem: prontuario.diagnosticos_enfermagem.filter((_, i) => i !== index)
    });
  };

  const addIntervencao = () => {
    if (novaIntervencao.intervencao) {
      setProntuario({
        ...prontuario,
        intervencoes: [...prontuario.intervencoes, novaIntervencao]
      });
      setNovaIntervencao({ intervencao: '', horario: '', responsavel: '' });
    } else {
      toast.warning('Preencha a descrição da intervenção');
    }
  };

  const removeIntervencao = (index: number) => {
    setProntuario({
      ...prontuario,
      intervencoes: prontuario.intervencoes.filter((_, i) => i !== index)
    });
  };

  const addPrescricao = () => {
    if (novaPrescricao.medicamento && novaPrescricao.dose) {
      setProntuario({
        ...prontuario,
        prescricoes: [...prontuario.prescricoes, novaPrescricao]
      });
      setNovaPrescricao({ medicamento: '', dose: '', via: '', horarios: '' });
    } else {
      toast.warning('Preencha Medicamento e Dose');
    }
  };

  const removePrescricao = (index: number) => {
    setProntuario({
      ...prontuario,
      prescricoes: prontuario.prescricoes.filter((_, i) => i !== index)
    });
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8 px-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to={idToEdit ? `${createPageUrl('ProntuarioDetalhe')}?id=${idToEdit}` : createPageUrl('Prontuarios')}>
            <Button variant="ghost" className="mb-4 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {idToEdit ? 'Voltar ao Prontuário' : 'Voltar aos Prontuários'}
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {idToEdit ? 'Editar Prontuário' : 'Criar Novo Prontuário'}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {idToEdit ? 'Atualize as informações do paciente' : 'Preencha os dados do caso clínico simulado'}
              </p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="identificacao" className="space-y-6">
            <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-xl flex-wrap w-full justify-start h-auto gap-1">
              <TabsTrigger value="identificacao" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300">
                <User className="w-4 h-4 mr-2" />
                Identificação
              </TabsTrigger>
              <TabsTrigger value="clinica" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300">
                <Activity className="w-4 h-4 mr-2" />
                Dados Clínicos
              </TabsTrigger>
              <TabsTrigger value="sinais" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300">
                <Heart className="w-4 h-4 mr-2" />
                Sinais Vitais
              </TabsTrigger>
              <TabsTrigger value="evolucao" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300">
                <Stethoscope className="w-4 h-4 mr-2" />
                Evolução e SAE
              </TabsTrigger>
              <TabsTrigger value="prescricoes" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300">
                <Pill className="w-4 h-4 mr-2" />
                Prescrições
              </TabsTrigger>
            </TabsList>

            {/* ... Conteúdo das Tabs Identificação, Clínica e Sinais (IGUAIS AO ANTERIOR) ... */}
            <TabsContent value="identificacao">
                 <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    Dados de Identificação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Nome do Paciente *</Label>
                      <Input
                        value={prontuario.nome_paciente}
                        onChange={(e) => setProntuario({ ...prontuario, nome_paciente: e.target.value })}
                        placeholder="Ex: João Silva Santos"
                        required
                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Idade *</Label>
                      <Input
                        type="number"
                        value={prontuario.idade}
                        onChange={(e) => setProntuario({ ...prontuario, idade: e.target.value })}
                        placeholder="Ex: 45"
                        required
                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Sexo *</Label>
                      <Select value={prontuario.sexo} onValueChange={(v) => setProntuario({ ...prontuario, sexo: v })}>
                        <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Feminino">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Estado Clínico *</Label>
                      <Select value={prontuario.estado_clinico} onValueChange={(v) => setProntuario({ ...prontuario, estado_clinico: v })}>
                        <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Estável">Estável</SelectItem>
                          <SelectItem value="Grave">Grave</SelectItem>
                          <SelectItem value="Crítico">Crítico</SelectItem>
                          <SelectItem value="Em observação">Em observação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Prioridade *</Label>
                      <Select value={prontuario.prioridade} onValueChange={(v) => setProntuario({ ...prontuario, prioridade: v })}>
                        <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Baixa">Baixa</SelectItem>
                          <SelectItem value="Média">Média</SelectItem>
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Complexidade</Label>
                      <Select value={prontuario.complexidade} onValueChange={(v) => setProntuario({ ...prontuario, complexidade: v })}>
                        <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Simples">Simples</SelectItem>
                          <SelectItem value="Moderada">Moderada</SelectItem>
                          <SelectItem value="Complexa">Complexa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quarto/Leito</Label>
                      <Input
                        value={prontuario.quarto_leito}
                        onChange={(e) => setProntuario({ ...prontuario, quarto_leito: e.target.value })}
                        placeholder="Ex: 302-A ou UTI-05"
                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Data de Internação</Label>
                      <Input
                        type="date"
                        value={prontuario.data_internacao ? new Date(prontuario.data_internacao).toISOString().split('T')[0] : ''}
                        onChange={(e) => setProntuario({ ...prontuario, data_internacao: e.target.value })}
                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="clinica">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    Informações Clínicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Diagnóstico Principal *</Label>
                    <Input
                      value={prontuario.diagnostico_principal}
                      onChange={(e) => setProntuario({ ...prontuario, diagnostico_principal: e.target.value })}
                      placeholder="Ex: Pneumonia Comunitária"
                      required
                      className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Diagnósticos Secundários</Label>
                    <div className="flex gap-2">
                      <Input
                        value={novoDiagnostico}
                        onChange={(e) => setNovoDiagnostico(e.target.value)}
                        placeholder="Adicionar diagnóstico secundário"
                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDiagnosticoSecundario())}
                      />
                      <Button type="button" onClick={addDiagnosticoSecundario} className="bg-blue-600 rounded-xl">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {prontuario.diagnosticos_secundarios.map((d, i) => (
                        <div key={i} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                          <span className="text-sm">{d}</span>
                          <button type="button" onClick={() => removeDiagnosticoSecundario(i)} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>História Clínica</Label>
                    <Textarea
                      value={prontuario.historia_clinica}
                      onChange={(e) => setProntuario({ ...prontuario, historia_clinica: e.target.value })}
                      placeholder="Descreva o histórico do paciente, queixas principais, evolução do quadro..."
                      className="min-h-[120px] bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Antecedentes</Label>
                    <Textarea
                      value={prontuario.antecedentes}
                      onChange={(e) => setProntuario({ ...prontuario, antecedentes: e.target.value })}
                      placeholder="Antecedentes pessoais e familiares, comorbidades..."
                      className="min-h-[100px] bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Alergias</Label>
                    <div className="flex gap-2">
                      <Input
                        value={novaAlergia}
                        onChange={(e) => setNovaAlergia(e.target.value)}
                        placeholder="Adicionar alergia"
                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAlergia())}
                      />
                      <Button type="button" onClick={addAlergia} className="bg-blue-600 rounded-xl">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {prontuario.alergias.map((a, i) => (
                        <div key={i} className="flex items-center gap-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-3 py-1 rounded-lg border border-red-200 dark:border-red-800">
                          <span className="text-sm">{a}</span>
                          <button type="button" onClick={() => removeAlergia(i)} className="hover:bg-red-200 dark:hover:bg-red-800 rounded-full p-0.5 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Observações Importantes</Label>
                    <Textarea
                      value={prontuario.observacoes}
                      onChange={(e) => setProntuario({ ...prontuario, observacoes: e.target.value })}
                      placeholder="Observações importantes sobre o caso, cuidados especiais..."
                      className="min-h-[80px] bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sinais">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" />
                    Registros de Sinais Vitais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <h4 className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Novo Registro
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Input
                        placeholder="Data/Hora"
                        value={novoSinalVital.data_hora}
                        onChange={(e) => setNovoSinalVital({ ...novoSinalVital, data_hora: e.target.value })}
                        className="bg-white dark:bg-slate-800 rounded-xl"
                      />
                      <Input
                        placeholder="PA (ex: 120/80)"
                        value={novoSinalVital.pa}
                        onChange={(e) => setNovoSinalVital({ ...novoSinalVital, pa: e.target.value })}
                        className="bg-white dark:bg-slate-800 rounded-xl"
                      />
                      <Input
                        type="number"
                        placeholder="FC (bpm)"
                        value={novoSinalVital.fc}
                        onChange={(e) => setNovoSinalVital({ ...novoSinalVital, fc: e.target.value })}
                        className="bg-white dark:bg-slate-800 rounded-xl"
                      />
                      <Input
                        type="number"
                        placeholder="FR (irpm)"
                        value={novoSinalVital.fr}
                        onChange={(e) => setNovoSinalVital({ ...novoSinalVital, fr: e.target.value })}
                        className="bg-white dark:bg-slate-800 rounded-xl"
                      />
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Temp (°C)"
                        value={novoSinalVital.temperatura}
                        onChange={(e) => setNovoSinalVital({ ...novoSinalVital, temperatura: e.target.value })}
                        className="bg-white dark:bg-slate-800 rounded-xl"
                      />
                      <Input
                        type="number"
                        placeholder="SpO2 (%)"
                        value={novoSinalVital.spo2}
                        onChange={(e) => setNovoSinalVital({ ...novoSinalVital, spo2: e.target.value })}
                        className="bg-white dark:bg-slate-800 rounded-xl"
                      />
                      <Input
                        type="number"
                        placeholder="Dor (0-10)"
                        value={novoSinalVital.dor}
                        onChange={(e) => setNovoSinalVital({ ...novoSinalVital, dor: e.target.value })}
                        className="bg-white dark:bg-slate-800 rounded-xl"
                      />
                    </div>
                    
                    <Button 
                      type="button" 
                      onClick={addSinalVital} 
                      variant="outline"
                      className="w-full border-dashed border-2 border-slate-300 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 text-slate-600 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-300 h-12 rounded-xl transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Registro de Sinais Vitais
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {prontuario.sinais_vitais.map((sv, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                        <div className="text-sm text-slate-700 dark:text-slate-300 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 w-full mr-4">
                          <span className="font-semibold text-blue-600 dark:text-blue-400 col-span-2 md:col-span-4 mb-1">{sv.data_hora}</span>
                          <span>PA: <b>{sv.pa}</b></span>
                          <span>FC: <b>{sv.fc}</b></span>
                          <span>FR: <b>{sv.fr}</b></span>
                          <span>Temp: <b>{sv.temperatura}°C</b></span>
                          <span>SpO2: <b>{sv.spo2}%</b></span>
                          <span>Dor: <b>{sv.dor}</b></span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSinalVital(i)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full">
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* --- Evolução, Diagnóstico e Implementação --- */}
            <TabsContent value="evolucao">
              <div className="space-y-8">
                {/* 1. Evolução */}
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-blue-500" />
                      Evolução de Enfermagem
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                      {/* Inputs da Evolução */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Data/Hora"
                          value={novaEvolucao.data_hora}
                          onChange={(e) => setNovaEvolucao({ ...novaEvolucao, data_hora: e.target.value })}
                          className="bg-white dark:bg-slate-800 rounded-xl"
                        />
                        <Input
                          placeholder="Enfermeiro"
                          value={novaEvolucao.enfermeiro}
                          onChange={(e) => setNovaEvolucao({ ...novaEvolucao, enfermeiro: e.target.value })}
                          className="bg-white dark:bg-slate-800 rounded-xl"
                        />
                      </div>
                      <Textarea
                        placeholder="Descrição da evolução..."
                        value={novaEvolucao.descricao}
                        onChange={(e) => setNovaEvolucao({ ...novaEvolucao, descricao: e.target.value })}
                        className="bg-white dark:bg-slate-800 min-h-[100px] rounded-xl"
                      />
                      {/* Novo Campo Avaliação */}
                      <Textarea
                        placeholder="Avaliação..."
                        value={novaEvolucao.avaliacao}
                        onChange={(e) => setNovaEvolucao({ ...novaEvolucao, avaliacao: e.target.value })}
                        className="bg-white dark:bg-slate-800 min-h-[80px] rounded-xl border-slate-200 dark:border-slate-700"
                      />
                      
                      <Button 
                        type="button" 
                        onClick={addEvolucao} 
                        variant="outline"
                        className="w-full border-dashed border-2 border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-300 h-12 rounded-xl transition-all duration-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Evolução
                      </Button>
                    </div>

                    {/* Lista Evolução */}
                    <div className="space-y-3">
                      {prontuario.evolucao_enfermagem.map((ev, i) => (
                        <div key={i} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm rounded-xl">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{ev.data_hora}</span>
                              <span className="text-sm text-slate-500 ml-2">- {ev.enfermeiro}</span>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeEvolucao(i)} className="text-slate-400 hover:text-red-500">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                              <strong>Descrição:</strong> {ev.descricao}
                            </p>
                            {ev.avaliacao && (
                              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                <strong>Avaliação:</strong> {ev.avaliacao}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 2. Diagnóstico de Enfermagem (NOVA SEÇÃO) */}
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                      <BrainCircuit className="w-5 h-5 text-indigo-500" />
                      Diagnósticos de Enfermagem
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                      
                      {/* Seleção do Tipo */}
                      <div className="space-y-2">
                        <Label>Tipo de Diagnóstico</Label>
                        <RadioGroup 
                          value={novoDiagnosticoEnf.tipo} 
                          onValueChange={(v: any) => setNovoDiagnosticoEnf({...novoDiagnosticoEnf, tipo: v})}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Diagnóstico" id="tipo-diag" />
                            <Label htmlFor="tipo-diag">Diagnóstico</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Risco" id="tipo-risco" />
                            <Label htmlFor="tipo-risco">Risco</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Promoção" id="tipo-promocao" />
                            <Label htmlFor="tipo-promocao">Promoção</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label>Descrição do Diagnóstico</Label>
                        <Textarea
                          placeholder="Descreva o diagnóstico..."
                          value={novoDiagnosticoEnf.descricao}
                          onChange={(e) => setNovoDiagnosticoEnf({ ...novoDiagnosticoEnf, descricao: e.target.value })}
                          className="bg-white dark:bg-slate-800 rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Enfermeiro Responsável</Label>
                        <Input
                          placeholder="Nome do Enfermeiro"
                          value={novoDiagnosticoEnf.enfermeiro}
                          onChange={(e) => setNovoDiagnosticoEnf({ ...novoDiagnosticoEnf, enfermeiro: e.target.value })}
                          className="bg-white dark:bg-slate-800 rounded-xl"
                        />
                      </div>

                      <Button 
                        type="button" 
                        onClick={addDiagnosticoEnf} 
                        variant="outline"
                        className="w-full border-dashed border-2 border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-600 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-300 h-12 rounded-xl transition-all duration-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Diagnóstico
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {prontuario.diagnosticos_enfermagem?.map((diag, i) => (
                        <div key={i} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm rounded-xl">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                                diag.tipo === 'Diagnóstico' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                diag.tipo === 'Risco' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                'bg-green-100 text-green-700 border-green-200'
                              }`}>
                                {diag.tipo}
                              </span>
                              <span className="text-sm text-slate-500">- {diag.enfermeiro}</span>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeDiagnosticoEnf(i)} className="text-slate-400 hover:text-red-500">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300">{diag.descricao}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 3. Implementação (RENOMEADO) */}
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-green-500" />
                      Implementação Realizadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Implementação/Intervenção"
                          value={novaIntervencao.intervencao}
                          onChange={(e) => setNovaIntervencao({ ...novaIntervencao, intervencao: e.target.value })}
                          className="bg-white dark:bg-slate-800 rounded-xl"
                        />
                        <Input
                          placeholder="Horário"
                          value={novaIntervencao.horario}
                          onChange={(e) => setNovaIntervencao({ ...novaIntervencao, horario: e.target.value })}
                          className="bg-white dark:bg-slate-800 rounded-xl"
                        />
                        <Input
                          placeholder="Responsável"
                          value={novaIntervencao.responsavel}
                          onChange={(e) => setNovaIntervencao({ ...novaIntervencao, responsavel: e.target.value })}
                          className="bg-white dark:bg-slate-800 rounded-xl"
                        />
                      </div>
                      
                      <Button 
                        type="button" 
                        onClick={addIntervencao} 
                        variant="outline"
                        className="w-full border-dashed border-2 border-slate-300 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 text-slate-600 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-300 h-12 rounded-xl transition-all duration-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Implementação
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {prontuario.intervencoes.map((int, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm rounded-xl">
                          <div className="text-sm text-slate-700 dark:text-slate-300">
                            <span className="font-semibold">{int.intervencao}</span>
                            {int.horario && <span className="text-slate-500 mx-2">• {int.horario}</span>}
                            {int.responsavel && <span className="text-slate-500">• {int.responsavel}</span>}
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeIntervencao(i)} className="text-slate-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* ... Tab Prescrições (IGUAL AO ANTERIOR) ... */}
            <TabsContent value="prescricoes">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                    <Pill className="w-5 h-5 text-purple-500" />
                    Prescrições de Enfermagem
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Medicamento"
                        value={novaPrescricao.medicamento}
                        onChange={(e) => setNovaPrescricao({ ...novaPrescricao, medicamento: e.target.value })}
                        className="bg-white dark:bg-slate-800 rounded-xl"
                      />
                      <Input
                        placeholder="Dose (ex: 500mg)"
                        value={novaPrescricao.dose}
                        onChange={(e) => setNovaPrescricao({ ...novaPrescricao, dose: e.target.value })}
                        className="bg-white dark:bg-slate-800 rounded-xl"
                      />
                      <Input
                        placeholder="Via (ex: EV, VO, SC)"
                        value={novaPrescricao.via}
                        onChange={(e) => setNovaPrescricao({ ...novaPrescricao, via: e.target.value })}
                        className="bg-white dark:bg-slate-800 rounded-xl"
                      />
                      <Input
                        placeholder="Horários (ex: 8h, 14h, 20h)"
                        value={novaPrescricao.horarios}
                        onChange={(e) => setNovaPrescricao({ ...novaPrescricao, horarios: e.target.value })}
                        className="bg-white dark:bg-slate-800 rounded-xl"
                      />
                    </div>
                    
                    <Button 
                      type="button" 
                      onClick={addPrescricao} 
                      variant="outline"
                      className="w-full border-dashed border-2 border-slate-300 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-300 h-12 rounded-xl transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Prescrição
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {prontuario.prescricoes.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm rounded-xl">
                        <div className="text-sm text-slate-700 dark:text-slate-300">
                          <span className="font-bold text-purple-600 dark:text-purple-400">{p.medicamento}</span>
                          <span className="mx-2">•</span>
                          <span>{p.dose}</span>
                          <span className="mx-2">•</span>
                          <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs">{p.via}</span>
                          <span className="mx-2">•</span>
                          <span>{p.horarios}</span>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removePrescricao(i)} className="text-slate-400 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-10 mb-20">
            <Link to={idToEdit ? `${createPageUrl('ProntuarioDetalhe')}?id=${idToEdit}` : createPageUrl('Prontuarios')}>
              <Button type="button" variant="outline" className="h-12 px-6 rounded-xl border-slate-300 dark:border-slate-700">
                Cancelar
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={saveMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 h-12 px-8 rounded-xl text-base font-medium transition-all duration-300 hover:-translate-y-0.5"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {idToEdit ? 'Salvar Alterações' : 'Criar Prontuário'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}