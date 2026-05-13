'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Lock, Layers, TrendingUp, Target, Users, Shield, Scale, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const viewport = {
  themeColor: '#0f172a',
}

const modules = [
  {
    id: '5s',
    title: '5S Metodologija',
    description: 'Organizovati (Seiton) - Pravo mesto za sve i sve na svom mestu',
    icon: Layers,
    color: 'from-blue-600 to-blue-800',
    active: true,
    link: '/moduli/5s' as const
  },
  {
    id: 'kaizen',
    title: 'Kaizen',
    description: 'Kontinuirano poboljšanje procesa',
    icon: TrendingUp,
    color: 'from-green-600 to-green-800',
    active: false,
    link: '' as const
  },
  {
    id: 'vsm',
    title: 'VSM Mapiranje',
    description: 'Vrednosno mapiranje tokova',
    icon: Target,
    color: 'from-orange-600 to-orange-800',
    active: false,
    link: '' as const
  },
  {
    id: 'smed',
    title: 'SMED',
    description: 'Brza promena alata',
    icon: Users,
    color: 'from-purple-600 to-purple-800',
    active: false,
    link: '' as const
  },
  {
    id: 'poka-yoke',
    title: 'Poka Yoke',
    description: 'Sprečavanje grešaka',
    icon: Shield,
    color: 'from-cyan-600 to-cyan-800',
    active: false,
    link: '' as const
  },
  {
    id: 'heijunka',
    title: 'Heijunka',
    description: 'Balansiranje produkcije',
    icon: Scale,
    color: 'from-pink-600 to-pink-800',
    active: false,
    link: '' as const
  },
  {
    id: 'oee',
    title: 'OEE',
    description: 'Ukupna efikasnost opreme',
    icon: Activity,
    color: 'from-red-600 to-red-800',
    active: false,
    link: '' as const
  }
]

export default function ModuliPage() {
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
              Nazad na početnu
            </Button>
          </Link>
          
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Lean Moduli
          </h1>
          <p className="mt-2 text-lg text-gray-400 sm:text-xl">
            Interaktivni alati za implementaciju Lean metodologije
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
              className="relative"
            >
              {module.active ? (
                <Link href={module.link}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl transition-all hover:border-slate-500 hover:shadow-blue-500/20"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-10 transition-opacity hover:opacity-20`} />
                    
                    <div className="relative z-10">
                      <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${module.color} p-3`}>
                        <module.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="mb-2 text-xl font-bold text-white">
                        {module.title}
                      </h3>
                      
                      <p className="text-sm text-gray-400">
                        {module.description}
                      </p>
                      
                      <div className="mt-4 flex items-center text-sm font-semibold text-blue-400">
                        Zapocnite
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ) : (
                <motion.div
                  className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-6 opacity-60"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                  
                  <div className="relative z-10">
                    <div className="mb-4 inline-flex rounded-lg bg-slate-800 p-3">
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
                    
                    <div className="mt-4 inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-gray-500">
                      Uskoro
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
            Mapa razvoja
          </h3>
          <p className="text-sm text-gray-400">
            Trenutno je dostupan modul 5S Metodologija. Ostali moduli su u razvoju i biće objavljeni uskoro. 
            Svaki modul je dizajniran da pruži praktična znanja kroz interaktivne simulacije.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
