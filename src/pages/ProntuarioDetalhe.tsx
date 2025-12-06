import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ArrowLeft, User, Calendar, Activity, FileText, 
  Heart, Stethoscope, ClipboardList, Pill, AlertCircle,
  Save, Loader2, Edit3, Plus, BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SAEForm from '@/components/sae/SAEForm';
import SAECard from '@/components/sae/SAECard';
import RelatorioAltaForm from '@/components/alta/RelatorioAltaForm';

// Interfaces para tipagem dos dados recebidos
interface ProntuarioCompleto {
  id: string;
  nome_paciente: string;
  idade: string | number;
  sexo: string;
  quarto_leito: string;
  estado_clinico: string;
  prioridade: string;
  complexidade: string;
  diagnostico_principal: string;
  diagnosticos_secundarios: string[];
  historia_clinica: string;
  antecedentes: string;
  alergias: string[];
  observacoes: string;
  sinais_vitais: any[];
  evolucao_enfermagem: any[];
  intervencoes: any[];
  prescricoes: any[];
}

export default function ProntuarioDetalhe() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const queryClient = useQueryClient();
  
  const [anotacaoEstudante, setAnotacaoEstudante] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSAEDialog, setShowSAEDialog] = useState(false);
  const [editingSAE, setEditingSAE] = useState<any>(null);
  const [viewingSAE, setViewingSAE] = useState<any>(null);
  const [showAltaDialog, setShowAltaDialog] = useState(false);

  const { data: prontuario, isLoading } = useQuery({
    queryKey: ['prontuario', id],
    queryFn: async () => {
      const results = await base44.entities.Prontuario.filter({ id });
      return results[0] as ProntuarioCompleto;
    },
    enabled: !!id
  });

  const { data: anotacoes = [] } = useQuery({
    queryKey: ['anotacoes', id],
    queryFn: () => base44.entities.AnotacaoEstudante.filter({ prontuario_id: id }),
    enabled: !!id
  });

  const { data: saes = [] } = useQuery({
    queryKey: ['saes', id],
    queryFn: () => base44.entities.SAE.filter({ prontuario_id: id }),
    enabled: !!id
  });

  const { data: alta } = useQuery({
    queryKey: ['relatorio-alta', id],
    queryFn: async () => {
      const results = await base44.entities.RelatorioAlta.filter({ prontuario_id: id });
      return results[0];
    },
    enabled: !!id
  });

  const salvarAnotacao = useMutation({
    mutationFn: async () => {
      await base44.entities.AnotacaoEstudante.create({
        prontuario_id: id,
        titulo: `Anotação - ${prontuario?.nome_paciente}`,
        conteudo: anotacaoEstudante,
        tipo: 'Livre'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anotacoes', id] });
      setAnotacaoEstudante('');
    }
  });

  const handleSalvarAnotacao = async () => {
    if (!anotacaoEstudante.trim()) return;
    setIsSaving(true);
    await salvarAnotacao.mutateAsync();
    setIsSaving(false);
  };

  const saveSAE = useMutation({
    mutationFn: async (data: any) => {
      if (editingSAE) {
        return await base44.entities.SAE.update(editingSAE.id, data);
      }
      return await base44.entities.SAE.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saes', id] });
      setShowSAEDialog(false);
      setEditingSAE(null);
    }
  });

  const deleteSAE = useMutation({
    mutationFn: (saeId: string) => base44.entities.SAE.delete(saeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saes', id] });
    }
  });

  const handleSaveSAE = (data: any) => {
    saveSAE.mutate(data);
  };

  const handleEditSAE = (sae: any) => {
    setEditingSAE(sae);
    setShowSAEDialog(true);
  };

  const handleDeleteSAE = (saeId: string) => {
    if (confirm('Deseja realmente excluir esta SAE?')) {
      deleteSAE.mutate(saeId);
    }
  };

  const saveRelatorioAlta = useMutation({
    mutationFn: async (data: any) => {
      if (alta) {
        return await base44.entities.RelatorioAlta.update(alta.id, data);
      }
      return await base44.entities.RelatorioAlta.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relatorio-alta', id] });
      setShowAltaDialog(false);
    }
  });

  const handleSaveAlta = (data: any) => {
    saveRelatorioAlta.mutate(data);
  };

  const estadoColors: Record<string, string> = {
    'Estável': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    'Grave': 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    'Crítico': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    'Em observação': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
  };

  const prioridadeColors: Record<string, string> = {
    'Baixa': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    'Média': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Alta': 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    'Urgente': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!prontuario) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
        <AlertCircle className="w-16 h-16 text-slate-400 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Prontuário não encontrado
        </h2>
        <Link to={createPageUrl('Prontuarios')}>
          <Button variant="outline">Voltar aos Prontuários</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to={createPageUrl('Prontuarios')}>
            <Button variant="ghost" className="mb-4 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Prontuários
            </Button>
          </Link>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
                  {prontuario.nome_paciente?.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {prontuario.nome_paciente}
                  </h1>
                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {prontuario.idade} anos • {prontuario.sexo}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Quarto {prontuario.quarto_leito}
                    </span>
                  </div>
                </div>
              </div>
             <div className="flex flex-wrap gap-2">
          {/* Estado Clínico */}
          <Badge className={`${estadoColors[prontuario.estado_clinico] || 'bg-slate-100'} border-0 px-3 py-1`}>
            <Activity className="w-3 h-3 mr-2" />
            <span className="font-normal opacity-80 mr-1">Estado:</span>
            {prontuario.estado_clinico}
          </Badge>

          {/* Prioridade */}
          <Badge className={`${prioridadeColors[prontuario.prioridade] || 'bg-slate-100'} border-0 px-3 py-1`}>
            <AlertCircle className="w-3 h-3 mr-2" />
            <span className="font-normal opacity-80 mr-1">Prioridade:</span>
            {prontuario.prioridade}
          </Badge>

          {/* Complexidade */}
          {prontuario.complexidade && (
            <Badge variant="outline" className="dark:border-slate-600 dark:text-slate-300 px-3 py-1">
              <span className="font-normal text-slate-500 dark:text-slate-400 mr-1">Complexidade:</span>
              {prontuario.complexidade}
            </Badge>
          )}
        </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs Content */}
        <Tabs defaultValue="geral" className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-xl flex-wrap w-full justify-start h-auto gap-1">
            <TabsTrigger value="geral" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300">Informações Gerais</TabsTrigger>
            <TabsTrigger value="sinais" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300">Sinais Vitais</TabsTrigger>
            <TabsTrigger value="evolucao" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300">Evolução</TabsTrigger>
            <TabsTrigger value="prescricoes" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300">Prescrições</TabsTrigger>
            <TabsTrigger value="anotacoes" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300">Minhas Anotações</TabsTrigger>
            <TabsTrigger value="sae" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300">SAE</TabsTrigger>
            <TabsTrigger value="alta" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300">Relatório de Alta</TabsTrigger>
          </TabsList>

          {/* Informações Gerais */}
          <TabsContent value="geral">
            <div className="grid gap-6">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Diagnóstico e História Clínica
                  </CardTitle>
                </CardHeader>f<div className="flex flex-wrap gap-2"></div>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Diagnóstico Principal</h4>
                    <p className="text-slate-900 dark:text-white font-semibold text-lg">{prontuario.diagnostico_principal}</p>
                  </div>
                  {prontuario.diagnosticos_secundarios?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Diagnósticos Secundários</h4>
                      <div className="flex flex-wrap gap-2">
                        {prontuario.diagnosticos_secundarios.map((d, i) => (
                          <Badge key={i} variant="outline" className="dark:border-slate-600 dark:text-slate-300 text-sm py-1 px-3">{d}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {prontuario.historia_clinica && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">História Clínica</h4>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        {prontuario.historia_clinica}
                      </p>
                    </div>
                  )}
                  {prontuario.antecedentes && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Antecedentes</h4>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        {prontuario.antecedentes}
                      </p>
                    </div>
                  )}
                  {prontuario.alergias?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Alergias</h4>
                      <div className="flex flex-wrap gap-2">
                        {prontuario.alergias.map((a, i) => (
                          <Badge key={i} className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border-0 px-3 py-1">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {a}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {prontuario.observacoes && (
                <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                      <AlertCircle className="w-5 h-5" />
                      Observações Importantes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-amber-900 dark:text-amber-200">{prontuario.observacoes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Sinais Vitais */}
          <TabsContent value="sinais">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Heart className="w-5 h-5 text-red-500" />
                  Registro de Sinais Vitais
                </CardTitle>
              </CardHeader>
              <CardContent>
                {prontuario.sinais_vitais?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data/Hora</TableHead>
                          <TableHead>PA</TableHead>
                          <TableHead>FC</TableHead>
                          <TableHead>FR</TableHead>
                          <TableHead>Temp</TableHead>
                          <TableHead>SpO2</TableHead>
                          <TableHead>Dor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prontuario.sinais_vitais.map((sv, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{sv.data_hora}</TableCell>
                            <TableCell>{sv.pa}</TableCell>
                            <TableCell>{sv.fc} bpm</TableCell>
                            <TableCell>{sv.fr} irpm</TableCell>
                            <TableCell>{sv.temperatura}°C</TableCell>
                            <TableCell>{sv.spo2}%</TableCell>
                            <TableCell>{sv.dor}/10</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                    Nenhum registro de sinais vitais disponível
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evolução */}
          <TabsContent value="evolucao">
            <div className="space-y-4">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                    Evolução de Enfermagem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {prontuario.evolucao_enfermagem?.length > 0 ? (
                    <div className="space-y-4">
                      {prontuario.evolucao_enfermagem.map((ev, i) => (
                        <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl space-y-3 border border-slate-100 dark:border-slate-800">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Data/Hora:</span>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                {ev.data_hora}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Enfermeiro(a):</span>
                              <span className="text-sm text-slate-600 dark:text-slate-400">{ev.enfermeiro}</span>
                            </div>
                          </div>
                          
                          <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm block mb-1">Descrição:</span>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                              {ev.descricao}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                      Nenhuma evolução registrada
                    </p>
                  )}
                </CardContent>
              </Card>

              {prontuario.intervencoes?.length > 0 && (
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                      <ClipboardList className="w-5 h-5 text-green-600" />
                      Intervenções Realizadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {prontuario.intervencoes.map((int, i) => (
                        <div key={i} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30">
                          <div className="mb-2">
                            <span className="font-semibold text-green-800 dark:text-green-300 text-sm block mb-1">Intervenção:</span>
                            <span className="text-slate-800 dark:text-slate-200">{int.intervencao}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm mt-3 pt-3 border-t border-green-200/50 dark:border-green-800/50">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-green-800 dark:text-green-300">Horário:</span>
                              <span className="text-slate-600 dark:text-slate-400">{int.horario}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-green-800 dark:text-green-300">Responsável:</span>
                              <span className="text-slate-600 dark:text-slate-400">{int.responsavel}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Prescrições */}
          <TabsContent value="prescricoes">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Pill className="w-5 h-5 text-purple-600" />
                  Prescrições de Enfermagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                {prontuario.prescricoes?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medicamento</TableHead>
                          <TableHead>Dose</TableHead>
                          <TableHead>Via</TableHead>
                          <TableHead>Horários</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prontuario.prescricoes.map((p, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{p.medicamento}</TableCell>
                            <TableCell>{p.dose}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{p.via}</Badge>
                            </TableCell>
                            <TableCell>{p.horarios}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                    Nenhuma prescrição registrada
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anotações do Estudante */}
          <TabsContent value="anotacoes">
            <div className="space-y-6">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Edit3 className="w-5 h-5 text-blue-600" />
                    Nova Anotação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Escreva suas observações, análises e estudos sobre este caso..."
                    value={anotacaoEstudante}
                    onChange={(e) => setAnotacaoEstudante(e.target.value)}
                    className="min-h-[200px] bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-xl mb-4"
                  />
                  {/* BOTÃO MELHORADO */}
                  <Button 
                    onClick={handleSalvarAnotacao}
                    disabled={isSaving || !anotacaoEstudante.trim()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 px-6 h-11 rounded-xl transition-all hover:-translate-y-0.5"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Salvar Anotação
                  </Button>
                </CardContent>
              </Card>

              {anotacoes.length > 0 && (
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">Minhas Anotações Salvas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {anotacoes.map((an: any, i: number) => (
                        <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                              {an.created_date && format(new Date(an.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                            <Badge variant="outline">{an.tipo}</Badge>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{an.conteudo}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* SAE */}
          <TabsContent value="sae">
            <div className="space-y-6">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        Sistematização da Assistência de Enfermagem
                      </CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Registros por plantão
                      </p>
                    </div>
                    {/* BOTÃO MELHORADO */}
                    <Button 
                      onClick={() => {
                        setEditingSAE(null);
                        setShowSAEDialog(true);
                      }}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md shadow-blue-500/20 rounded-xl px-5 transition-all hover:-translate-y-0.5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nova SAE
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {saes.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {saes.map((sae: any) => (
                        <SAECard
                          key={sae.id}
                          sae={sae}
                          onView={setViewingSAE}
                          onEdit={handleEditSAE}
                          onDelete={handleDeleteSAE}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Nenhuma SAE registrada ainda</p>
                      <p className="text-sm mt-1">Clique em "Nova SAE" para começar</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Relatório de Alta */}
          <TabsContent value="alta">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                      <FileText className="w-5 h-5 text-green-600" />
                      Relatório de Alta Hospitalar
                    </CardTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Documento de conclusão da internação
                    </p>
                  </div>
                  {!alta && (
                    /* BOTÃO MELHORADO */
                    <Button 
                      onClick={() => setShowAltaDialog(true)}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 rounded-xl px-5 transition-all hover:-translate-y-0.5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Relatório
                    </Button>
                  )}
                  {alta && (
                    <Button 
                      onClick={() => setShowAltaDialog(true)}
                      variant="outline"
                      className="rounded-xl border-slate-300 dark:border-slate-700"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {alta ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-sm text-slate-500 dark:text-slate-400">Data da Alta:</span>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {alta.data_alta && format(new Date(alta.data_alta), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-slate-500 dark:text-slate-400">Tipo:</span>
                        <p className="font-medium text-slate-900 dark:text-white">{alta.tipo_alta}</p>
                      </div>
                    </div>

                    {alta.diagnostico_alta && (
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Diagnóstico na Alta</h4>
                        <p className="text-slate-700 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-100 dark:border-slate-800">{alta.diagnostico_alta}</p>
                      </div>
                    )}

                    {alta.condicoes_alta && (
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Condições na Alta</h4>
                        <p className="text-slate-700 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-100 dark:border-slate-800">{alta.condicoes_alta}</p>
                      </div>
                    )}

                    {alta.medicamentos_alta?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Medicações Prescritas</h4>
                        <div className="space-y-2">
                          {alta.medicamentos_alta.map((med: any, i: number) => (
                            <div key={i} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-sm border border-purple-100 dark:border-purple-900/30">
                              <span className="font-medium">{med.medicamento}</span> - {med.dose} - {med.via} - {med.frequencia}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {alta.orientacoes_alta && (
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Orientações Gerais</h4>
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-100 dark:border-slate-800">{alta.orientacoes_alta}</p>
                      </div>
                    )}

                    {alta.sinais_alerta && (
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                        <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          Sinais de Alerta
                        </h4>
                        <p className="text-amber-900 dark:text-amber-200 text-sm whitespace-pre-line">{alta.sinais_alerta}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum relatório de alta criado</p>
                    <p className="text-sm mt-1">Clique em "Criar Relatório" quando o paciente receber alta</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* SAE Dialog */}
      <Dialog open={showSAEDialog} onOpenChange={(open) => {
        setShowSAEDialog(open);
        if (!open) setEditingSAE(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSAE ? 'Editar SAE' : 'Nova SAE'}
            </DialogTitle>
          </DialogHeader>
          <SAEForm
            prontuarioId={id}
            initialData={editingSAE}
            onSave={handleSaveSAE}
            onCancel={() => {
              setShowSAEDialog(false);
              setEditingSAE(null);
            }}
            isSaving={saveSAE.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* SAE View Dialog */}
      <Dialog open={!!viewingSAE} onOpenChange={(open) => !open && setViewingSAE(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              SAE - {viewingSAE?.data_plantao && format(new Date(viewingSAE.data_plantao), "dd/MM/yyyy", { locale: ptBR })} - {viewingSAE?.turno}
            </DialogTitle>
          </DialogHeader>
          {viewingSAE && (
            <div className="space-y-6">
              {viewingSAE.historico_enfermagem && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">1. Histórico de Enfermagem</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                    {viewingSAE.historico_enfermagem}
                  </p>
                </div>
              )}

              {viewingSAE.diagnosticos_enfermagem?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">2. Diagnósticos de Enfermagem</h3>
                  <div className="space-y-3">
                    {viewingSAE.diagnosticos_enfermagem.map((diag: any, i: number) => (
                      <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">{diag.diagnostico}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          <strong>Características:</strong> {diag.caracteristicas}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          <strong>Fatores relacionados:</strong> {diag.fatores_relacionados}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewingSAE.planejamento?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">3. Planejamento</h3>
                  <div className="space-y-3">
                    {viewingSAE.planejamento.map((plano: any, i: number) => (
                      <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">{plano.resultado_esperado}</h4>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          <strong>Intervenções:</strong>
                          <ul className="list-disc list-inside ml-2 mt-1">
                            {plano.intervencoes?.map((int: string, j: number) => (
                              <li key={j}>{int}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewingSAE.implementacao && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">4. Implementação</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                    {viewingSAE.implementacao}
                  </p>
                </div>
              )}

              {viewingSAE.avaliacao && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">5. Avaliação</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                    {viewingSAE.avaliacao}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Relatório de Alta Dialog */}
      <Dialog open={showAltaDialog} onOpenChange={setShowAltaDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {alta ? 'Editar Relatório de Alta' : 'Criar Relatório de Alta'}
            </DialogTitle>
          </DialogHeader>
          <RelatorioAltaForm
            prontuarioId={id}
            initialData={alta}
            onSave={handleSaveAlta}
            onCancel={() => setShowAltaDialog(false)}
            isSaving={saveRelatorioAlta.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}