import { useState } from 'react'; // React removido
import { motion } from 'framer-motion';
import { Calculator, Brain, Heart, Shield, Activity, BookOpen, PenTool, AlertOctagon, Baby, UserCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

// Imports dos Componentes
import GlasgowCalculator from '@/components/escalas/GlasgowCalculator';
import PainScale from '@/components/escalas/PainScale';
import BradenScale from '@/components/escalas/BradenScale';
import NewsScale from '@/components/escalas/NewsScale';
import VitalSignsCalculator from '@/components/escalas/VitalSignsCalculator';
import ManchesterScale from '@/components/escalas/ManchesterScale';
import ApgarScale from '@/components/escalas/ApgarScale';
import RassScale from '@/components/escalas/RassScale';
import PsychiatricForm from '@/components/escalas/PsychiatricForm';

export default function Escalas() {
  const [mode, setMode] = useState<'exemplos' | 'pratica'>('exemplos');

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
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <Calculator className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Escalas e Ferramentas
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 ml-14">
            Calculadoras interativas para avaliação clínica
          </p>
        </motion.div>

         {/* Mode Toggle */}
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
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md shadow-slate-200/50 dark:shadow-none' 
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
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md shadow-slate-200/50 dark:shadow-none' 
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
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="glasgow" className="space-y-6">
            <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-xl flex-wrap w-full justify-start gap-1 h-auto">
              <TabsTrigger value="glasgow" className="rounded-lg flex items-center gap-2"><Brain className="w-4 h-4" /> Glasgow</TabsTrigger>
              <TabsTrigger value="manchester" className="rounded-lg flex items-center gap-2"><AlertOctagon className="w-4 h-4" /> Manchester</TabsTrigger>
              <TabsTrigger value="apgar" className="rounded-lg flex items-center gap-2"><Baby className="w-4 h-4" /> Apgar</TabsTrigger>
              <TabsTrigger value="rass" className="rounded-lg flex items-center gap-2"><Activity className="w-4 h-4" /> RASS</TabsTrigger>
              <TabsTrigger value="psic" className="rounded-lg flex items-center gap-2"><UserCheck className="w-4 h-4" /> Psiquiatria</TabsTrigger>
              <TabsTrigger value="dor" className="rounded-lg flex items-center gap-2"><Heart className="w-4 h-4" /> Dor</TabsTrigger>
              <TabsTrigger value="braden" className="rounded-lg flex items-center gap-2"><Shield className="w-4 h-4" /> Braden</TabsTrigger>
              <TabsTrigger value="news" className="rounded-lg flex items-center gap-2"><Activity className="w-4 h-4" /> NEWS</TabsTrigger>
              <TabsTrigger value="ssvv" className="rounded-lg flex items-center gap-2"><Heart className="w-4 h-4" /> SSVV</TabsTrigger>
            </TabsList>

            <TabsContent value="glasgow"><GlasgowCalculator readOnly={mode === 'exemplos'} /></TabsContent>
            <TabsContent value="manchester"><ManchesterScale readOnly={mode === 'exemplos'} /></TabsContent>
            <TabsContent value="apgar"><ApgarScale readOnly={mode === 'exemplos'} /></TabsContent>
            <TabsContent value="rass"><RassScale readOnly={mode === 'exemplos'} /></TabsContent>
            <TabsContent value="psic"><PsychiatricForm readOnly={mode === 'exemplos'} /></TabsContent>
            <TabsContent value="dor"><PainScale readOnly={mode === 'exemplos'} /></TabsContent>
            <TabsContent value="braden"><BradenScale readOnly={mode === 'exemplos'} /></TabsContent>
            <TabsContent value="news"><NewsScale readOnly={mode === 'exemplos'} /></TabsContent>
            <TabsContent value="ssvv"><VitalSignsCalculator readOnly={mode === 'exemplos'} /></TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}