import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import QuickAccessCards from '@/components/home/QuickAccessCards';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Award,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <HeroSection />
      <QuickAccessCards />
      
      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Por que estudar conosco?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Desenvolvido por profissionais de enfermagem para futuros profissionais
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: GraduationCap,
                title: 'Aprendizado Prático',
                description: 'Casos clínicos reais simulados para praticar sem riscos'
              },
              {
                icon: Users,
                title: 'Colaborativo',
                description: 'Compartilhe conhecimento e aprenda com a comunidade'
              },
              {
                icon: BookOpen,
                title: 'Conteúdo Atualizado',
                description: 'Material alinhado com as diretrizes mais recentes'
              },
              {
                icon: Award,
                title: 'Qualidade',
                description: 'Desenvolvido seguindo padrões profissionais'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-lg mb-5">
                  <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para começar seus estudos?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Acesse agora mesmo e explore prontuários, escalas e muito mais.
            </p>
            <Link to={createPageUrl('Prontuarios')}>
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-xl shadow-xl"
              >
                Começar Agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}