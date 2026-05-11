'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, BookOpen, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                className="text-4xl lg:text-6xl font-bold leading-tight"
              >
                Otkrijte Moć
                <span className="block text-lean-green">Lean Metodologije</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg lg:text-xl text-white/90 max-w-lg"
              >
                Transformišite vašu poslovnu efikasnost kroz interaktivnu edukaciju i simulacije Lean tehnologija u Industriji 4.0 eri.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="bg-white text-lean-blue hover:bg-gray-100">
                Započnite Besplatno
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-lean-blue">
                <Play className="mr-2 h-4 w-4" />
                Pogledajte Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-lean-green">500+</div>
                <div className="text-sm text-white/80">Korisnika</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-lean-green">50+</div>
                <div className="text-sm text-white/80">Kompanija</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-lean-green">95%</div>
                <div className="text-sm text-white/80">Zadovoljstva</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
            >
              <BookOpen className="h-12 w-12 text-lean-green mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interaktivna Učenja</h3>
              <p className="text-white/80 text-sm">
                Učite kroz praktične simulacije i realne scenarije iz industrije.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
            >
              <Target className="h-12 w-12 text-lean-green mb-4" />
              <h3 className="text-xl font-semibold mb-2">Merljivi Rezultati</h3>
              <p className="text-white/80 text-sm">
                Pratite napredak i vidite konkretne poboljšanja u procesima.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 sm:col-span-2"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-lean-green rounded-full p-3">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Video Vodiči</h3>
                  <p className="text-white/80 text-sm">
                    Stručni vodiči za svaki Lean alat i metodologiju.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
