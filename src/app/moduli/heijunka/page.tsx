'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Scale, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'
import { useState, useMemo } from 'react'

// Language dictionary for Heijunka page
const heijunkaTranslations = {
  sr: {
    pageTitle: 'Heijunka (Nivelacija proizvodnje)',
    description: 'Heijunka je tehnika balansiranja proizvodnje kojom se izbegavaju nagli skokovi i padovi u obimu rada. Umesto proizvodnje u velikim serijama (što stvara ogromne zalihe i uska grla), Heijunka ravnomerno raspoređuje različite proizvode tokom vremena.',
    demandTitle: 'Potražnja kupaca (Nedeljni plan)',
    traditionalTitle: 'Tradicionalna proizvodnja (Velike serije)',
    heijunkaTitle: 'Heijunka Box (Nivelisan tok)',
    cardPreview: 'Nivelacija i balansiranje proizvodnje.',
    products: {
      a: 'Proizvod A',
      b: 'Proizvod B',
      c: 'Proizvod C'
    },
    backToModules: 'Nazad na module',
    demandLabel: 'Podesite nedeljnu potražnju kupaca (Ukupno: 20 komada)',
    totalAssigned: 'Ukupno raspoređeno',
    remainingSlots: 'Preostalo slotova',
    capacityFull: '✓ Kapacitet popunjen',
    capacityLabels: 'Raspoređeno: {assigned} / 20',
    days: ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak'],
    comparisonHeading: 'Uporedni prikaz proizvodnih planova',
    traditionalBadge: 'Nenivelisano — Velike serije (Visok WIP)',
    heijunkaBadge: 'Nivelisano — Optimalan tok (Minimalan WIP)',
    metricsHeading: 'Analiza performansi i Lean balans',
    wipMetric: 'Nivo zaliha (WIP)',
    wipTraditional: 'Tradicionalno: Visok (Gomilanje)',
    wipHeijunka: 'Heijunka: Minimalan (Glatki tok)',
    leadTimeMetric: 'Vreme čekanja kupca (Lead Time)',
    leadTimeTraditional: 'Tradicionalno: Do 5 dana',
    leadTimeHeijunka: 'Heijunka: Isporuka istog dana',
    changeoverMetric: 'Učestalost izmena alata',
    changeoverTraditional: 'Tradicionalno: Retko (2x)',
    changeoverHeijunka: 'Heijunka: Često ({count}x)',
    smedBadge: 'Zahteva SMED',
    leanInsight: 'Inženjerska napomena: Heijunka namerno povećava broj izmena alata kako bi eliminisala zalihe i čekanje. Da bi ovaj sistem funkcionisao u praksi, neophodno je implementirati SMED metodu i smanjiti vreme podešavanja mašina na minimum.'
  },
  en: {
    pageTitle: 'Heijunka (Production Leveling)',
    description: 'Heijunka is a production leveling technique used to avoid sudden spikes and drops in workload. Instead of batching large quantities (which creates massive inventory and bottlenecks), Heijunka evenly distributes different products over time.',
    demandTitle: 'Customer Demand (Weekly Plan)',
    traditionalTitle: 'Traditional Batching (Large Lots)',
    heijunkaTitle: 'Heijunka Box (Leveled Flow)',
    cardPreview: 'Production leveling and balancing.',
    products: {
      a: 'Product A',
      b: 'Product B',
      c: 'Product C'
    },
    backToModules: 'Back to Modules',
    demandLabel: 'Adjust weekly customer demand (Total: 20 units)',
    totalAssigned: 'Total Assigned',
    remainingSlots: 'Remaining Slots',
    capacityFull: '✓ Capacity Full',
    capacityLabels: 'Assigned: {assigned} / 20',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    comparisonHeading: 'Production Schedule Comparison',
    traditionalBadge: 'Un-leveled — Mass Batching (High WIP)',
    heijunkaBadge: 'Leveled — Smooth Flow (Low WIP)',
    metricsHeading: 'Performance Analysis & Lean Balance',
    wipMetric: 'WIP Inventory Level',
    wipTraditional: 'Traditional: High (Stagnant)',
    wipHeijunka: 'Heijunka: Minimal (Continuous Flow)',
    leadTimeMetric: 'Customer Lead Time',
    leadTimeTraditional: 'Traditional: Up to 5 days',
    leadTimeHeijunka: 'Heijunka: Same-day shipping',
    changeoverMetric: 'Changeover Frequency',
    changeoverTraditional: 'Traditional: Low (2x)',
    changeoverHeijunka: 'Heijunka: High ({count}x)',
    smedBadge: 'Requires SMED',
    leanInsight: 'Engineering Note: Heijunka deliberately increases the number of changeovers to eliminate waste and waiting time. For this system to succeed in practice, implementing the SMED method to minimize setup times is strictly required.'
  }
}

// Helper function to calculate traditional batching array
function calculateTraditionalBatching(demand: { a: number; b: number; c: number }): string[] {
  const result: string[] = []
  // Group all A's first, then B's, then C's
  for (let i = 0; i < demand.a; i++) result.push('A')
  for (let i = 0; i < demand.b; i++) result.push('B')
  for (let i = 0; i < demand.c; i++) result.push('C')
  return result
}

// Helper function to calculate Heijunka leveled flow array
function calculateHeijunkaFlow(demand: { a: number; b: number; c: number }): string[] {
  const result: string[] = []
  const total = demand.a + demand.b + demand.c
  
  // Create a balanced pattern by distributing products evenly
  // For 10A, 5B, 5C -> we want pattern like A, B, A, C repeated
  const pattern: string[] = []
  const counts = { ...demand }
  
  // Build pattern by always picking the product with highest remaining count
  while (counts.a > 0 || counts.b > 0 || counts.c > 0) {
    let maxCount = 0
    let product = 'A'
    
    if (counts.a > maxCount) { maxCount = counts.a; product = 'A' }
    if (counts.b > maxCount) { maxCount = counts.b; product = 'B' }
    if (counts.c > maxCount) { maxCount = counts.c; product = 'C' }
    
    pattern.push(product)
    counts[product.toLowerCase() as keyof typeof counts]--
  }
  
  // Fill result with pattern repeated to exactly 20 slots
  for (let i = 0; i < 20; i++) {
    result.push(pattern[i % pattern.length])
  }
  
  return result
}

export default function HeijunkaPage() {
  const { language } = useLanguage()
  const t = heijunkaTranslations[language]
  
  // Demand state management
  const [demand, setDemand] = useState({ a: 10, b: 5, c: 5 })
  const TOTAL_CAPACITY = 20
  
  // Calculate schedules based on current demand
  const traditionalArray = useMemo(() => calculateTraditionalBatching(demand), [demand])
  const heijunkaArray = useMemo(() => calculateHeijunkaFlow(demand), [demand])
  
  // Handle demand change with constraint logic
  const handleDemandChange = (product: 'a' | 'b' | 'c', delta: number) => {
    setDemand(prev => {
      const newValue = prev[product] + delta
      
      // Prevent negative values
      if (newValue < 0) return prev
      
      // Calculate new total
      const otherProducts = { a: prev.a, b: prev.b, c: prev.c }
      otherProducts[product] = newValue
      const newTotal = otherProducts.a + otherProducts.b + otherProducts.c
      
      // Prevent exceeding total capacity
      if (newTotal > TOTAL_CAPACITY) return prev
      
      return otherProducts
    })
  }
  
  const totalAssigned = demand.a + demand.b + demand.c
  const remainingSlots = TOTAL_CAPACITY - totalAssigned
  
  // Calculate metrics
  const metrics = useMemo(() => {
    // Count changeovers in traditional (transitions between different products)
    let traditionalChangeovers = 0
    for (let i = 1; i < traditionalArray.length; i++) {
      if (traditionalArray[i] !== traditionalArray[i - 1]) {
        traditionalChangeovers++
      }
    }
    
    // Count changeovers in heijunka
    let heijunkaChangeovers = 0
    for (let i = 1; i < heijunkaArray.length; i++) {
      if (heijunkaArray[i] !== heijunkaArray[i - 1]) {
        heijunkaChangeovers++
      }
    }
    
    return {
      traditionalChangeovers,
      heijunkaChangeovers
    }
  }, [traditionalArray, heijunkaArray])

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
          <Link href="/moduli">
            <Button variant="ghost" className="mb-6 text-gray-300 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.backToModules}
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-pink-600 to-pink-800">
              <Scale className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              {t.pageTitle}
            </h1>
          </div>
          
          <p className="mt-4 text-lg text-gray-400 max-w-4xl">
            {t.description}
          </p>
        </motion.div>

        {/* Demand Control Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-xl border border-slate-700 bg-slate-800/50 p-8 backdrop-blur-sm"
        >
          <h2 className="text-2xl font-bold text-white mb-6">{t.demandLabel}</h2>
          
          {/* Product Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Product A */}
            <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-white">{t.products.a}</span>
                <span className="text-3xl font-bold text-pink-400">{demand.a}</span>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => handleDemandChange('a', -1)}
                  disabled={demand.a === 0}
                  variant="outline"
                  className="flex-1 bg-slate-800/50 border-slate-600 hover:bg-slate-700 hover:border-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDemandChange('a', 1)}
                  disabled={totalAssigned >= TOTAL_CAPACITY}
                  variant="outline"
                  className="flex-1 bg-slate-800/50 border-slate-600 hover:bg-slate-700 hover:border-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Product B */}
            <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-white">{t.products.b}</span>
                <span className="text-3xl font-bold text-cyan-400">{demand.b}</span>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => handleDemandChange('b', -1)}
                  disabled={demand.b === 0}
                  variant="outline"
                  className="flex-1 bg-slate-800/50 border-slate-600 hover:bg-slate-700 hover:border-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDemandChange('b', 1)}
                  disabled={totalAssigned >= TOTAL_CAPACITY}
                  variant="outline"
                  className="flex-1 bg-slate-800/50 border-slate-600 hover:bg-slate-700 hover:border-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Product C */}
            <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-white">{t.products.c}</span>
                <span className="text-3xl font-bold text-amber-400">{demand.c}</span>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => handleDemandChange('c', -1)}
                  disabled={demand.c === 0}
                  variant="outline"
                  className="flex-1 bg-slate-800/50 border-slate-600 hover:bg-slate-700 hover:border-amber-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDemandChange('c', 1)}
                  disabled={totalAssigned >= TOTAL_CAPACITY}
                  variant="outline"
                  className="flex-1 bg-slate-800/50 border-slate-600 hover:bg-slate-700 hover:border-amber-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-sm text-gray-400">{t.totalAssigned}:</span>
                <span className="ml-2 text-xl font-bold text-white">{totalAssigned}</span>
              </div>
              <div>
                <span className="text-sm text-gray-400">{t.remainingSlots}:</span>
                <span className="ml-2 text-xl font-bold text-white">{remainingSlots}</span>
              </div>
            </div>
            <div className={`text-sm font-semibold ${remainingSlots === 0 ? 'text-green-400' : 'text-amber-400'}`}>
              {remainingSlots === 0 ? t.capacityFull : `${remainingSlots} ${language === 'sr' ? 'slotova dostupno' : 'slots available'}`}
            </div>
          </div>
        </motion.div>

        {/* Production Schedule Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-white mb-6">{t.comparisonHeading}</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Traditional Batching Board */}
            <div className="border-2 border-red-500/30 rounded-xl p-4 bg-slate-900/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-pink-400">{t.traditionalTitle}</h4>
                <span className="text-xs font-semibold px-3 py-1 bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
                  {t.traditionalBadge}
                </span>
              </div>
              
              {/* Weekly Grid */}
              <div className="grid grid-cols-5 gap-2">
                {t.days.map((day, dayIndex) => (
                  <div key={day} className="flex flex-col">
                    <div className="text-xs font-medium text-gray-400 mb-2 text-center">{day}</div>
                    <div className="flex flex-col gap-1">
                      {traditionalArray.slice(dayIndex * 4, (dayIndex + 1) * 4).map((product, slotIndex) => (
                        <div
                          key={slotIndex}
                          className={`h-8 rounded-md flex items-center justify-center text-xs font-bold text-white ${
                            product === 'A' 
                              ? 'bg-gradient-to-br from-pink-500 to-pink-700' 
                              : product === 'B' 
                              ? 'bg-gradient-to-br from-cyan-500 to-cyan-700' 
                              : 'bg-gradient-to-br from-amber-500 to-amber-700'
                          }`}
                        >
                          {product}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Heijunka Box Board */}
            <div className="border-2 border-green-500/30 rounded-xl p-4 bg-slate-900/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-cyan-400">{t.heijunkaTitle}</h4>
                <span className="text-xs font-semibold px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                  {t.heijunkaBadge}
                </span>
              </div>
              
              {/* Weekly Grid */}
              <div className="grid grid-cols-5 gap-2">
                {t.days.map((day, dayIndex) => (
                  <div key={day} className="flex flex-col">
                    <div className="text-xs font-medium text-gray-400 mb-2 text-center">{day}</div>
                    <div className="flex flex-col gap-1">
                      {heijunkaArray.slice(dayIndex * 4, (dayIndex + 1) * 4).map((product, slotIndex) => (
                        <div
                          key={slotIndex}
                          className={`h-8 rounded-md flex items-center justify-center text-xs font-bold text-white ${
                            product === 'A' 
                              ? 'bg-gradient-to-br from-pink-500 to-pink-700' 
                              : product === 'B' 
                              ? 'bg-gradient-to-br from-cyan-500 to-cyan-700' 
                              : 'bg-gradient-to-br from-amber-500 to-amber-700'
                          }`}
                        >
                          {product}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-white mb-6">{t.metricsHeading}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* WIP Inventory Level */}
            <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700">
              <h4 className="text-sm font-semibold text-gray-300 mb-4">{t.wipMetric}</h4>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{t.wipTraditional}</span>
                    <span className="text-red-400 font-semibold">~85%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{t.wipHeijunka}</span>
                    <span className="text-emerald-400 font-semibold">~18%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Lead Time */}
            <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700">
              <h4 className="text-sm font-semibold text-gray-300 mb-4">{t.leadTimeMetric}</h4>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{t.leadTimeTraditional}</span>
                    <span className="text-red-400 font-semibold">~4-5d</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{t.leadTimeHeijunka}</span>
                    <span className="text-emerald-400 font-semibold">~0d</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Changeover Frequency */}
            <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700">
              <h4 className="text-sm font-semibold text-gray-300 mb-4">{t.changeoverMetric}</h4>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{t.changeoverTraditional}</span>
                    <span className="text-emerald-400 font-semibold">{metrics.traditionalChangeovers}x</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{t.changeoverHeijunka.replace('{count}', metrics.heijunkaChangeovers.toString())}</span>
                    <span className="text-red-400 font-semibold">{metrics.heijunkaChangeovers}x</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                    {t.smedBadge}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lean Insight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 rounded-xl border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-6 backdrop-blur-sm"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-amber-500/20">
              <Scale className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-400 mb-2">{language === 'sr' ? 'Lean Uvid' : 'Lean Insight'}</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t.leanInsight}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
