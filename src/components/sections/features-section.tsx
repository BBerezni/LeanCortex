'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Users, Award, Clock, BarChart3, Shield } from 'lucide-react'

const features = [
  {
    icon: CheckCircle,
    title: 'Praktična Znanja',
    description: 'Učite kroz realne scenarije i simulacije koje možete odmah primeniti u praksi.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Users,
    title: 'Timski Rad',
    description: 'Razvijajte veštine timskog rada kroz interaktivne grupne aktivnosti.',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: Award,
    title: 'Certifikacija',
    description: ' dobijte priznate certifikate za svaku završenu Lean metodologiju.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    icon: Clock,
    title: 'Učite u Svoje Vreme',
    description: 'Pristupite materijalima 24/7 sa bilo koje lokacije i uređaja.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    icon: BarChart3,
    title: 'Analitika Napretka',
    description: 'Pratite svoj napredak kroz detaljne izveštaje i analitiku.',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    icon: Shield,
    title: 'Podrška Eksperta',
    description: 'dobijte podršku od iskusnih Lean konsultanata i trenera.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  }
]

export function FeaturesSection() {
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
            Zašto Izabrati LeanCortex?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Naša platforma nudi sve što vam je potrebno za uspešno implementiranje Lean principa u vašoj organizaciji.
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

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Spremni da počnete vašu Lean transformaciju?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Pridružite se hiljadama profesionalaca koji su već transformisali svoje poslovanje kroz Lean metodologiju.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-lean-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Započnite Besplatno
              </button>
              <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Zakazite Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
