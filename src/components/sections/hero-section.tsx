'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MousePointer2, Gamepad2, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

// Language dictionary for hero section
const heroTranslations = {
  sr: {
    title: 'LeanCortex — Interaktivna platforma za edukaciju i simulaciju Lean tehnologija',
    subtitle: 'Savladajte alate operativne izvrsnosti kroz praktične, vizuelne i dinamične scenarije prilagođene modernom inženjerskom menadžmentu.',
    exploreModules: 'Istražite Lean module',
    interactivity: 'Interaktivnost',
    interactivityDesc: 'Učenje kroz direktnu manipulaciju objektima i procesima.',
    gamification: 'Gejmifikacija',
    gamificationDesc: 'Elementi igre i simulacije stvarnih industrijskih problema za lakše pamćenje.',
    completeness: 'Kompletnost',
    completenessDesc: 'Obuhvaćeno svih 9 ključnih Lean modula na jednom mestu.'
  },
  en: {
    title: 'LeanCortex — Interactive Platform for Lean Technology Education and Simulation',
    subtitle: 'Master operational excellence tools through practical, visual, and dynamic scenarios tailored for modern engineering management.',
    exploreModules: 'Explore Lean Modules',
    interactivity: 'Interactivity',
    interactivityDesc: 'Learning through direct manipulation of objects and processes.',
    gamification: 'Gamification',
    gamificationDesc: 'Game elements and simulation of real industrial problems for easier retention.',
    completeness: 'Completeness',
    completenessDesc: 'All 9 key Lean modules covered in one place.'
  }
}

export function HeroSection() {
  const { language } = useLanguage()
  const t = heroTranslations[language]
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-lean-blue via-blue-600 to-lean-green text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl lg:text-5xl font-bold leading-snug"
              >
                {t.title}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg lg:text-xl text-white/90 max-w-lg"
              >
                {t.subtitle}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/moduli">
                <Button size="lg" className="bg-white text-lean-blue hover:bg-gray-100">
                  {t.exploreModules}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Educational Pillars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/20"
            >
              <div className="text-center">
                <MousePointer2 className="h-8 w-8 text-lean-green mx-auto mb-2" />
                <div className="text-lg font-semibold text-white">{t.interactivity}</div>
                <div className="text-sm text-white/80">{t.interactivityDesc}</div>
              </div>
              <div className="text-center">
                <Gamepad2 className="h-8 w-8 text-lean-green mx-auto mb-2" />
                <div className="text-lg font-semibold text-white">{t.gamification}</div>
                <div className="text-sm text-white/80">{t.gamificationDesc}</div>
              </div>
              <div className="text-center">
                <Layers className="h-8 w-8 text-lean-green mx-auto mb-2" />
                <div className="text-lg font-semibold text-white">{t.completeness}</div>
                <div className="text-sm text-white/80">{t.completenessDesc}</div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
