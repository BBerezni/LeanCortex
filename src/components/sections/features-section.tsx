'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Eye, Clock, CheckSquare } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

// Language dictionary for features section
const featuresTranslations = {
  sr: {
    title: 'Zašto Izabrati LeanCortex?',
    subtitle: 'Naša platforma nudi sve što vam je potrebno za uspešno implementiranje Lean principa u vašoj organizaciji.',
    features: [
      {
        icon: CheckCircle,
        title: 'Praktična znanja',
        description: 'Savladavanje inženjerskih metoda kroz realne industrijske scenarije.',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        icon: Eye,
        title: 'Vizuelni menadžment',
        description: 'Jasni grafički prikazi stanja procesa i interaktivne simulacije.',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        icon: Clock,
        title: 'Samostalno učenje',
        description: 'Prolazak kroz module i simulacije sopstvenim tempom, prilagođeno studentima.',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      },
      {
        icon: CheckSquare,
        title: 'Validacija rezultata',
        description: 'Trenutna povratna informacija i detaljna edukativna objašnjenja za svaku klasifikaciju.',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      }
    ]
  },
  en: {
    title: 'Why Choose LeanCortex?',
    subtitle: 'Our platform offers everything you need for successful implementation of Lean principles in your organization.',
    features: [
      {
        icon: CheckCircle,
        title: 'Practical Knowledge',
        description: 'Master engineering methods through real industrial scenarios.',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        icon: Eye,
        title: 'Visual Management',
        description: 'Clear graphical representations of process states and interactive simulations.',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        icon: Clock,
        title: 'Self-Paced Learning',
        description: 'Progress through modules and simulations at your own pace, tailored for students.',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      },
      {
        icon: CheckSquare,
        title: 'Result Validation',
        description: 'Instant feedback and detailed educational explanations for each classification.',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      }
    ]
  }
}

export function FeaturesSection() {
  const { language } = useLanguage()
  const t = featuresTranslations[language]
  const features = t.features
  return (
    <section className="py-20 bg-white">
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

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 h-full">
                {/* Icon */}
                <div className={`${feature.bgColor} rounded-lg p-3 w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
