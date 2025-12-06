import { useState } from 'react'; // Removido 'React'
import { motion } from 'framer-motion';
import { FileText, BookOpen, PenTool } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ModeloSOAP from '@/components/anotacoes/ModeloSOAP';
import ModeloSBAR from '@/components/anotacoes/ModeloSBAR';
import ModeloPadrao from '@/components/anotacoes/ModeloPadrao';

export default function Anotacoes() {
  const [mode, setMode] = useState<'exemplos' | 'pratica'>('exemplos');
  const [soapValues, setSoapValues] = useState({});
  const [sbarValues, setSbarValues] = useState({});
  const [padraoValues, setPadraoValues] = useState({});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-12 px-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-cyan-600 text-white">
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Anotações de Enfermagem
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 ml-14">
            Aprenda e pratique diferentes modelos de anotação de enfermagem
          </p>
        </motion.div>

        {/* Mode Toggle Melhorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-slate-200/50 dark:bg-slate-800 p-1.5 rounded-2xl inline-flex gap-1 border border-slate-200 dark:border-slate-700 shadow-inner">
            <Button
              variant="ghost"
              onClick={() => setMode('exemplos')}
              className={`
                relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                ${mode === 'exemplos' 
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md shadow-slate-200/50 dark:shadow-none' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Ver Exemplos</span>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setMode('pratica')}
              className={`
                relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                ${mode === 'pratica' 
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md shadow-slate-200/50 dark:shadow-none' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                <span>Praticar</span>
              </div>
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="soap" className="space-y-6">
            <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-xl w-full justify-start flex-wrap">
              <TabsTrigger value="soap" className="rounded-lg">SOAP</TabsTrigger>
              <TabsTrigger value="sbar" className="rounded-lg">SBAR</TabsTrigger>
              <TabsTrigger value="padrao" className="rounded-lg">Padrão</TabsTrigger>
            </TabsList>

            <TabsContent value="soap">
              <ModeloSOAP 
                values={mode === 'pratica' ? soapValues : null} 
                onChange={setSoapValues}
                readOnly={mode === 'exemplos'}
              />
            </TabsContent>

            <TabsContent value="sbar">
              <ModeloSBAR 
                values={mode === 'pratica' ? sbarValues : null} 
                onChange={setSbarValues}
                readOnly={mode === 'exemplos'}
              />
            </TabsContent>

            <TabsContent value="padrao">
              <ModeloPadrao 
                values={mode === 'pratica' ? padraoValues : null} 
                onChange={setPadraoValues}
                readOnly={mode === 'exemplos'}
              />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-600">S</span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">SOAP</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Subjetivo, Objetivo, Avaliação e Plano. Ideal para documentação sistemática do cuidado.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-orange-600">S</span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">SBAR</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Situação, Background, Avaliação e Recomendação. Perfeito para comunicação urgente.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Padrão</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Modelo tradicional cronológico, descrevendo cuidados e intercorrências do plantão.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}