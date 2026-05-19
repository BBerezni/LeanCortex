'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Layers, TrendingUp, Users, Target, Kanban, Shield, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const modules = [
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
    description: 'Sistem vizuelnog menadžmenta koji kontroliše tok materijala i informacija.',
    icon: Kanban,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    features: ['Pull sistem', 'Kanban kartice', 'WIP limiti', 'Just-in-Time'],
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
    description: 'Automatizacija sa ljudskom inteligencijom - zaustavljanje linije pri problemu.',
    icon: AlertCircle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    features: ['Andon sistemi', 'Autonomacija', 'Kvalitet na izvoru', 'Problem solving'],
    difficulty: 'Napredni nivo'
  }
]

export function ModulesSection() {
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
            Lean Moduli za Vaš Razvoj
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Svaki modul je dizajniran da pruži praktična znanja i veštine kroz interaktivne simulacije i realne scenarije.
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
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
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
                <div className="space-y-2 mb-4">
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
                  {module.features.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{module.features.length - 3} još
                    </span>
                  )}
                </div>

                {/* CTA Button */}
                <Link href="/moduli">
                  <Button variant="outline" className="w-full">
                    Saznajte više
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
