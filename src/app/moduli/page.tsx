'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Lock, Layers, TrendingUp, Target, Users, Shield, Scale, Activity, Kanban, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'

export const viewport = {
  themeColor: '#0f172a',
}

// Language dictionary for modules dashboard
const dashboardTranslations = {
  sr: {
    backToHome: 'Nazad na početnu',
    title: 'Lean Moduli',
    subtitle: 'Interaktivni alati za implementaciju Lean metodologije',
    start: 'Zapocnite',
    comingSoon: 'Uskoro',
    developmentMap: 'Mapa razvoja',
    developmentMapDesc: 'Trenutno je dostupan modul 5S Metodologija. Ostali moduli su u razvoju i biće objavljeni uskoro. Svaki modul je dizajniran da pruži praktična znanja kroz interaktivne simulacije.',
    modules: [
      {
        id: '5s',
        title: '5S Metodologija',
        description: 'Organizacija radnog mesta i vizuelni menadžment.',
        icon: Layers,
        color: 'from-blue-600 to-blue-800',
        active: true,
        link: '/moduli/5s' as const
      },
      {
        id: 'kaizen',
        title: 'Kaizen',
        description: 'Kontinuirano poboljšanje procesa i eliminacija gubitaka.',
        icon: TrendingUp,
        color: 'from-green-600 to-green-800',
        active: true,
        link: '/moduli/kaizen' as const
      },
      {
        id: 'kanban',
        title: 'Kanban',
        description: 'Upravljanje tokom materijala pomoću pull sistema.',
        icon: Kanban,
        color: 'from-cyan-600 to-cyan-800',
        active: true,
        link: '/moduli/kanban' as const
      },
      {
        id: 'vsm',
        title: 'VSM Mapiranje',
        description: 'Vrednosno mapiranje tokova i identifikacija rasipanja.',
        icon: Target,
        color: 'from-orange-600 to-orange-800',
        active: true,
        link: '/moduli/vsm' as const
      },
      {
        id: 'smed',
        title: 'SMED',
        description: 'Brza promena alata i smanjenje vremena podešavanja.',
        icon: Users,
        color: 'from-purple-600 to-purple-800',
        active: true,
        link: '/moduli/smed' as const
      },
      {
        id: 'poka-yoke',
        title: 'Poka-Yoke',
        description: 'Sprečavanje grešaka na samom izvoru procesa.',
        icon: Shield,
        color: 'from-cyan-600 to-cyan-800',
        active: true,
        link: '/moduli/poka-yoke' as const
      },
      {
        id: 'jidoka',
        title: 'Jidoka',
        description: 'Inteligentna automatizacija sa ljudskim dodirom.',
        icon: AlertCircle,
        color: 'from-amber-600 to-amber-800',
        active: true,
        link: '/moduli/jidoka' as const
      },
      {
        id: 'heijunka',
        title: 'Heijunka',
        description: 'Nivelisanje i balansiranje obima proizvodnje.',
        icon: Scale,
        color: 'from-pink-600 to-pink-800',
        active: true,
        link: '/moduli/heijunka' as const
      },
      {
        id: 'oee',
        title: 'OEE',
        description: 'Merenje i analiza ukupne efikasnosti opreme.',
        icon: Activity,
        color: 'from-red-600 to-red-800',
        active: true,
        link: '/moduli/oee' as const
      }
    ]
  },
  en: {
    backToHome: 'Back to Home',
    title: 'Lean Modules',
    subtitle: 'Interactive tools for Lean methodology implementation',
    start: 'Start',
    comingSoon: 'Coming Soon',
    developmentMap: 'Development Roadmap',
    developmentMapDesc: 'Currently, the 5S Methodology module is available. Other modules are under development and will be released soon. Each module is designed to provide practical knowledge through interactive simulations.',
    modules: [
      {
        id: '5s',
        title: '5S Methodology',
        description: 'Workspace organization and visual management.',
        icon: Layers,
        color: 'from-blue-600 to-blue-800',
        active: true,
        link: '/moduli/5s' as const
      },
      {
        id: 'kaizen',
        title: 'Kaizen',
        description: 'Continuous process improvement and waste elimination.',
        icon: TrendingUp,
        color: 'from-green-600 to-green-800',
        active: true,
        link: '/moduli/kaizen' as const
      },
      {
        id: 'kanban',
        title: 'Kanban',
        description: 'Material and information flow control via pull systems.',
        icon: Kanban,
        color: 'from-cyan-600 to-cyan-800',
        active: true,
        link: '/moduli/kanban' as const
      },
      {
        id: 'vsm',
        title: 'VSM Mapping',
        description: 'Value stream mapping and waste identification.',
        icon: Target,
        color: 'from-orange-600 to-orange-800',
        active: true,
        link: '/moduli/vsm' as const
      },
      {
        id: 'smed',
        title: 'SMED',
        description: 'Quick changeover and setup time reduction.',
        icon: Users,
        color: 'from-purple-600 to-purple-800',
        active: true,
        link: '/moduli/smed' as const
      },
      {
        id: 'poka-yoke',
        title: 'Poka-Yoke',
        description: 'Error-proofing and defect prevention at the source.',
        icon: Shield,
        color: 'from-cyan-600 to-cyan-800',
        active: true,
        link: '/moduli/poka-yoke' as const
      },
      {
        id: 'jidoka',
        title: 'Jidoka',
        description: 'Intelligent automation with a human touch.',
        icon: AlertCircle,
        color: 'from-amber-600 to-amber-800',
        active: true,
        link: '/moduli/jidoka' as const
      },
      {
        id: 'heijunka',
        title: 'Heijunka',
        description: 'Production leveling and demand smoothing.',
        icon: Scale,
        color: 'from-pink-600 to-pink-800',
        active: true,
        link: '/moduli/heijunka' as const
      },
      {
        id: 'oee',
        title: 'OEE',
        description: 'Measurement and analysis of overall equipment effectiveness.',
        icon: Activity,
        color: 'from-red-600 to-red-800',
        active: true,
        link: '/moduli/oee' as const
      }
    ]
  }
}

export default function ModuliPage() {
  const { language } = useLanguage()
  const t = dashboardTranslations[language]
  const modules = t.modules
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-gray-300 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.backToHome}
            </Button>
          </Link>
          
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-2 text-lg text-gray-400 sm:text-xl">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Module Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative h-full"
            >
              {module.active ? (
                <Link href={module.link}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl transition-all hover:border-slate-500 hover:shadow-blue-500/20 h-full flex flex-col"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-10 transition-opacity hover:opacity-20`} />
                    
                    <div className="relative z-10 flex-1 flex flex-col">
                      <div className={`mb-4 w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br ${module.color}`}>
                        <module.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="mb-2 text-xl font-bold text-white">
                        {module.title}
                      </h3>
                      
                      <p className="text-sm text-gray-400">
                        {module.description}
                      </p>
                      
                      <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-blue-400">
                        {t.start}
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ) : (
                <motion.div
                  className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-6 opacity-60 h-full flex flex-col"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                  
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-lg bg-slate-800">
                      <module.icon className="h-8 w-8 text-gray-500" />
                    </div>
                    
                    <div className="absolute right-4 top-4">
                      <Lock className="h-5 w-5 text-gray-600" />
                    </div>
                    
                    <h3 className="mb-2 text-xl font-bold text-gray-400">
                      {module.title}
                    </h3>
                    
                    <p className="text-sm text-gray-500">
                      {module.description}
                    </p>
                    
                    <div className="mt-auto pt-4 inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-gray-500">
                      {t.comingSoon}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm"
        >
          <h3 className="mb-3 text-lg font-semibold text-white">
            {t.developmentMap}
          </h3>
          <p className="text-sm text-gray-400">
            {t.developmentMapDesc}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
