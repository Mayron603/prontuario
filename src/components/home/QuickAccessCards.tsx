import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ClipboardList, 
  FileText, 
  Calculator, 
  BookOpen,
  ArrowRight 
} from 'lucide-react';

const cards = [
  {
    title: 'Prontuários Simulados',
    description: 'Acesse casos clínicos completos com histórico, sinais vitais, evoluções e prescrições.',
    icon: ClipboardList,
    href: 'Prontuarios',
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30'
  },
  {
    title: 'Anotações de Enfermagem',
    description: 'Modelos SOAP, SBAR e padrão. Pratique suas anotações com exemplos reais.',
    icon: FileText,
    href: 'Anotacoes',
    gradient: 'from-sky-500 to-cyan-500',
    bgGradient: 'from-sky-50 to-cyan-100 dark:from-sky-900/30 dark:to-cyan-800/30'
  },
  {
    title: 'Escalas e Classificações',
    description: 'Glasgow, Dor, Braden, NEWS e mais. Calculadoras interativas para prática.',
    icon: Calculator,
    href: 'Escalas',
    gradient: 'from-indigo-500 to-purple-500',
    bgGradient: 'from-indigo-50 to-purple-100 dark:from-indigo-900/30 dark:to-purple-800/30'
  },
  {
    title: 'Biblioteca',
    description: 'PDFs, artigos, protocolos e resumos essenciais para técnicos e enfermeiros.',
    icon: BookOpen,
    href: 'Biblioteca',
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-800/30'
  }
];

export default function QuickAccessCards() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Tudo que você precisa para{' '}
            <span className="text-blue-600 dark:text-blue-400">estudar</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Recursos organizados para facilitar seu aprendizado em enfermagem
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={createPageUrl(card.href)}>
                <div className={`group relative h-full bg-gradient-to-br ${card.bgGradient} rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1`}>
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.gradient} text-white mb-5 shadow-lg`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {card.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                    {card.description}
                  </p>

                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                    Acessar
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}