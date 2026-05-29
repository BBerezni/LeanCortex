'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Layers, TrendingUp, Users, Target, Kanban, Shield, AlertCircle, Scale, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'

// Language dictionary for modules section
const modulesTranslations = {
  sr: {
    title: 'Lean Moduli za Vaš Razvoj',
    subtitle: 'Svaki modul je dizajniran da pruži praktična znanja i veštine kroz interaktivne simulacije i realne scenarije.',
    learnMore: 'Saznajte više',
    more: '+{count} još',
    modules: [
      {
        id: '5s',
        title: '5S Metodologija',
        description: 'Organizujte radni prostor kroz pet principa: Sortiraj, Sistematično, Čisto, Standardizuj, Održavaj.',
        icon: Layers,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        features: ['Sortiranje', 'Sistematičnost', 'Čistoća', 'Standardizacija', 'Održavanje'],
        difficulty: 'Početni nivo'
      },
      {
        id: 'smed',
        title: 'SMED',
        description: 'Single-Minute Exchange of Die - brza promena alata i podešavanja opreme.',
        icon: Users,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        features: ['Separacija', 'Konverzija', 'Standardizacija', 'Merenje vremena'],
        difficulty: 'Srednji nivo'
      },
      {
        id: 'vsm',
        title: 'VSM Mapiranje',
        description: 'Analizirajte i optimizujte vrednosne tokove da biste identifikovali gubitke.',
        icon: Target,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        features: ['Trenutno stanje', 'Buduće stanje', 'Identifikacija gubitaka', 'Akcion plan'],
        difficulty: 'Napredni nivo'
      },
      {
        id: 'kaizen',
        title: 'Kaizen',
        description: 'Kontinuirano poboljšanje kroz male, postupne promene koje dovode do velikih rezultata.',
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        features: ['PDCA ciklus', 'Gemba walks', 'Sugestije zaposlenih', 'Kaizen eventi'],
        difficulty: 'Srednji nivo'
      },
      {
        id: 'kanban',
        title: 'Kanban',
        description: 'Upravljanje zalihama i eliminacija prekomerne proizvodnje.',
        icon: Kanban,
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-50',
        features: ['Pull sistem', 'Kanban kartice', 'WIP limiti'],
        difficulty: 'Srednji nivo'
      },
      {
        id: 'poka-yoke',
        title: 'Poka-Yoke',
        description: 'Mehanizmi za sprečavanje grešaka kroz dizajn procesa i proizvoda.',
        icon: Shield,
        color: 'text-rose-600',
        bgColor: 'bg-rose-50',
        features: ['Detekcija grešaka', 'Prevencija', 'Dizajn za sigurnost', 'Automatizacija'],
        difficulty: 'Napredni nivo'
      },
      {
        id: 'jidoka',
        title: 'Jidoka',
        description: 'Autonomacija i zaustavljanje linije pri uočavanju škarta.',
        icon: AlertCircle,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        features: ['Andon sistemi', 'Autonomacija', 'Kvalitet na izvoru'],
        difficulty: 'Napredni nivo'
      },
      {
        id: 'heijunka',
        title: 'Heijunka',
        description: 'Ublažavanje fluktuacija u zahtevima i nivelisanje proizvodnje.',
        icon: Scale,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50',
        features: ['Nivelisanje proizvodnje', 'Ublažavanje fluktuacija', 'Minimiziranje rasipanja'],
        difficulty: 'Napredni nivo'
      },
      {
        id: 'oee',
        title: 'OEE',
        description: 'Praćenje, merenje i optimizacija efikasnosti opreme.',
        icon: Activity,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        features: ['Dostupnost', 'Performanse', 'Kvalitet rada'],
        difficulty: 'Napredni nivo'
      }
    ]
  },
  en: {
    title: 'Lean Modules for Your Development',
    subtitle: 'Each module is designed to provide practical knowledge and skills through interactive simulations and real scenarios.',
    learnMore: 'Learn More',
    more: '+{count} more',
    modules: [
      {
        id: '5s',
        title: '5S Methodology',
        description: 'Organize your workspace through five principles: Sort, Set in Order, Shine, Standardize, Sustain.',
        icon: Layers,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        features: ['Sorting', 'Systematic', 'Cleanliness', 'Standardization', 'Sustainment'],
        difficulty: 'Beginner Level'
      },
      {
        id: 'smed',
        title: 'SMED',
        description: 'Single-Minute Exchange of Die - rapid tool change and equipment setup.',
        icon: Users,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        features: ['Separation', 'Conversion', 'Standardization', 'Time Measurement'],
        difficulty: 'Intermediate Level'
      },
      {
        id: 'vsm',
        title: 'VSM Mapping',
        description: 'Analyze and optimize value streams to identify waste.',
        icon: Target,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        features: ['Current State', 'Future State', 'Waste Identification', 'Action Plan'],
        difficulty: 'Advanced Level'
      },
      {
        id: 'kaizen',
        title: 'Kaizen',
        description: 'Continuous improvement through small, incremental changes that lead to big results.',
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        features: ['PDCA Cycle', 'Gemba Walks', 'Employee Suggestions', 'Kaizen Events'],
        difficulty: 'Intermediate Level'
      },
      {
        id: 'kanban',
        title: 'Kanban',
        description: 'Manage inventory levels and eliminate overproduction.',
        icon: Kanban,
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-50',
        features: ['Pull System', 'Workflow Cards', 'WIP Limits'],
        difficulty: 'Intermediate Level'
      },
      {
        id: 'poka-yoke',
        title: 'Poka-Yoke',
        description: 'Mechanisms for preventing errors through process and product design.',
        icon: Shield,
        color: 'text-rose-600',
        bgColor: 'bg-rose-50',
        features: ['Error Detection', 'Prevention', 'Design for Safety', 'Automation'],
        difficulty: 'Advanced Level'
      },
      {
        id: 'jidoka',
        title: 'Jidoka',
        description: 'Autonomation and real-time defect containment.',
        icon: AlertCircle,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        features: ['Andon Systems', 'Autonomation', 'Quality at Source'],
        difficulty: 'Advanced Level'
      },
      {
        id: 'heijunka',
        title: 'Heijunka',
        description: 'Smooth out demand fluctuations and production volume.',
        icon: Scale,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50',
        features: ['Production Leveling', 'Demand Smoothing', 'Waste Minimization'],
        difficulty: 'Advanced Level'
      },
      {
        id: 'oee',
        title: 'OEE',
        description: 'Track, measure, and optimize machine efficiency.',
        icon: Activity,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        features: ['Availability', 'Performance', 'Output Quality'],
        difficulty: 'Advanced Level'
      }
    ]
  }
}

export function ModulesSection() {
  const { language } = useLanguage()
  const t = modulesTranslations[language]
  const modules = t.modules
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col">
                {/* Icon and Title */}
                <div className={`${module.bgColor} rounded-lg p-3 w-fit mb-4`}>
                  <module.icon className={`h-8 w-8 ${module.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {module.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {module.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-4 flex-1">
                  {module.features.slice(0, 3).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Difficulty Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {module.difficulty}
                  </span>
                </div>

                {/* CTA Button */}
                <Link href="/moduli">
                  <Button variant="outline" className="w-full">
                    {t.learnMore}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
