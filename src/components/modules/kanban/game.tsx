'use client'

import { useState, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, Factory, Truck, Box } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function KanbanGame() {
  const { language } = useLanguage()
  const router = useRouter()
  const [currentPhase, setCurrentPhase] = useState(1)
  const [bufferItems, setBufferItems] = useState(0)
  const [inventoryCost, setInventoryCost] = useState(0)
  const [wipLimit, setWipLimit] = useState(0)
  const [isProducing, setIsProducing] = useState(false)
  const [leadTime, setLeadTime] = useState(0)
  const [stockouts, setStockouts] = useState(0)
  const [machineUtilization, setMachineUtilization] = useState(0)
  const [simulationActive, setSimulationActive] = useState(false)
  const [taktTime, setTaktTime] = useState(1500)
  const [ordersCompleted, setOrdersCompleted] = useState(0)
  const [showDefect, setShowDefect] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const activeProductionTimeRef = useRef(0)
  const simulationStartTimeRef = useRef(0)
  const utilizationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // i18n content
  const translations = {
    en: {
      backToModules: 'Back to Modules',
      title: 'Kanban & Pull System',
      inventoryCost: 'Inventory Cost',
      wipLimit: 'WIP Limit',
      supplier: 'Supplier / Machine 1',
      inventoryBuffer: 'Inventory Buffer',
      customer: 'Customer / Machine 2',
      instructionsTitle: 'Module Instructions: Kanban & Pull System',
      phase1Title: 'Phase 1: Push System',
      phase1Desc: 'Production is driven by the starting machine regardless of actual demand. Parts pile up in the buffer, causing overproduction (Muda) and high inventory holding costs.',
      phase2Title: 'Phase 2: Setting WIP Limits',
      phase2Desc: 'You analyze the bottleneck and introduce Kanban rules. Set a strict Work-In-Progress (WIP) limit to define the maximum allowed inventory between stations.',
      phase3Title: 'Phase 3: Pull System & Optimization',
      phase3Desc: 'Manage Takt time and test system resilience. The goal is to find the ideal WIP limit that prevents customer stockouts while minimizing inventory costs and lead time amidst upstream variability.',
      producePart: 'Produce Part',
      nextPhase: 'Next Phase',
      setWipLimit: 'Set WIP Limit (Maximum Inventory)',
      orderPart: 'Order Part',
      producing: 'Producing...',
      defect: 'Defect!',
      startSimulation: 'Start Simulation',
      taktTime: 'Takt Time',
      stockouts: 'Customer Stockouts',
      leadTime: 'Lead Time',
      machineUtil: 'Machine Utilization',
      ordersCompleted: 'Orders Completed',
      simulationResults: 'Simulation Results',
      badPerformance: 'The system is unstable. You had ${stockouts} customer stockouts due to upstream variability. Your WIP limit is too low for the current throughput or the Takt time is too fast.',
      subOptimal: 'The system was stable (0 stockouts), but inventory costs are high and Lead Time is long due to a large WIP limit. Try reducing the limit to balance the line.',
      perfectBalance: 'Excellent! You achieved a balanced system with 0 stockouts and efficient inventory levels. This is an ideal Lean system!',
      closeResults: 'Close Results',
      changeWipLimit: 'Change WIP Limit',
      newSimulation: 'New Simulation',
    },
    sr: {
      backToModules: 'Nazad na module',
      title: 'Kanban i Pull sistem',
      inventoryCost: 'Troškovi zaliha',
      wipLimit: 'WIP limit',
      supplier: 'Dobavljač / Mašina 1',
      inventoryBuffer: 'Skladišni bafer',
      customer: 'Kupac / Mašina 2',
      instructionsTitle: 'Uputstvo za modul: Kanban i Pull sistem',
      phase1Title: 'Faza 1: Push sistem',
      phase1Desc: 'Proizvodnju diktira prva mašina bez obzira na stvarnu potražnju. Delovi se gomilaju, što izaziva prekomernu proizvodnju (Muda) i visoke troškove skladištenja zaliha.',
      phase2Title: 'Faza 2: Postavljanje WIP limita',
      phase2Desc: 'Analizirate usko grlo i uvodite Kanban pravila. Postavljate striktan WIP limit (Work-In-Progress) koji definiše maksimalno dozvoljene zalihe između stanica.',
      phase3Title: 'Faza 3: Pull sistem i Optimizacija',
      phase3Desc: 'Upravljajte Takt vremenom i testirajte izdržljivost sistema. Cilj je pronaći idealan balans (WIP limit) koji sprečava zastoje kupca, a istovremeno minimizuje troškove zaliha i vreme prolaza usled uzvodnog varijabiliteta.',
      producePart: 'Proizvedi deo',
      nextPhase: 'Sledeća faza',
      setWipLimit: 'Postavite WIP Limit (Maksimalne zalihe)',
      orderPart: 'Naruči deo',
      producing: 'Proizvodnja...',
      defect: 'Škart!',
      startSimulation: 'Pokreni simulaciju',
      taktTime: 'Takt vreme',
      stockouts: 'Zastoji kupca',
      leadTime: 'Vreme prolaza',
      machineUtil: 'Iskorišćenje mašine',
      ordersCompleted: 'Izvršene narudžbine',
      simulationResults: 'Rezultati simulacije',
      badPerformance: 'Sistem nije stabilan. Imali ste ${stockouts} zastoja kupca zbog uzvodne varijabilnosti i predugog takta u odnosu na brzinu mašine. Vaš WIP limit je prenizak za trenutnu proizvodnost ili je Takt vreme prebrzo.',
      subOptimal: 'Sistem je bio stabilan (0 zastoja), ali su troškovi zaliha visoki, a Lead Time dugačak zbog velikog WIP limita. Pokušajte da smanjite limit i balansirate liniju.',
      perfectBalance: 'Odlično! Postigli ste balansiran sistem sa 0 zastojima i efikasnim nivoima zaliha. Ovo je idealan Lean sistem!',
      closeResults: 'Zatvori rezultate',
      changeWipLimit: 'Promeni WIP limit',
      newSimulation: 'Nova simulacija',
    }
  }

  const t = translations[language]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/moduli">
            <Button variant="ghost" className="mb-4 text-gray-300 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.backToModules}
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white">{t.title}</h1>
        </div>

        {/* Metrics Header */}
        <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Package className="h-5 w-5" />
              <span className="text-sm font-medium">{t.inventoryCost}</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-white">${inventoryCost}</div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Box className="h-5 w-5" />
              <span className="text-sm font-medium">{t.wipLimit}</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-white">{wipLimit}</div>
          </div>
          {currentPhase === 3 && (
            <>
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Truck className="h-5 w-5" />
                  <span className="text-sm font-medium">{t.stockouts}</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-white">{stockouts}</div>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Factory className="h-5 w-5" />
                  <span className="text-sm font-medium">{t.machineUtil}</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-white">{machineUtilization.toFixed(1)}%</div>
              </div>
            </>
          )}
        </div>

        {/* Production Line Area */}
        <div className="relative mb-6 rounded-xl border border-slate-700 bg-slate-800/30 p-6 backdrop-blur-sm">
          {currentPhase === 3 && !simulationActive && (
            <div className="mb-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                {t.taktTime}: {taktTime}ms
              </label>
              <input
                type="range"
                min="1000"
                max="3000"
                step="100"
                value={taktTime}
                onChange={(e) => setTaktTime(Number(e.target.value))}
                className="w-full accent-green-500"
                disabled={simulationActive}
              />
            </div>
          )}
          {currentPhase === 1 && (
            <div className="absolute bottom-4 right-4">
              <Button
                onClick={() => setCurrentPhase(2)}
                disabled={bufferItems < 5}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.nextPhase}
              </Button>
            </div>
          )}
          {currentPhase === 2 && (
            <div className="absolute bottom-4 right-4">
              <Button
                onClick={() => {
                  setCurrentPhase(3)
                  setBufferItems(wipLimit)
                }}
                disabled={wipLimit === 0}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.nextPhase}
              </Button>
            </div>
          )}
          <div className="grid grid-cols-3 gap-6">
            {/* Supplier / Machine 1 */}
            <div className="flex flex-col items-center">
              <div className="relative mb-3 flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-cyan-500/50 bg-cyan-500/10">
                <Factory className={`h-12 w-12 ${isProducing ? 'text-cyan-300 animate-pulse' : 'text-cyan-400'}`} />
                {isProducing && (
                  <div className="absolute top-2 right-2 rounded-full bg-cyan-500 px-2 py-1 text-xs font-semibold text-white">
                    {t.producing}
                  </div>
                )}
                {showDefect && (
                  <div className="absolute top-2 left-2 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white animate-pulse">
                    {t.defect}
                  </div>
                )}
              </div>
              <h3 className="text-center text-sm font-semibold text-white">{t.supplier}</h3>
              {currentPhase === 1 && (
                <Button
                  onClick={() => {
                    setBufferItems(prev => prev + 1)
                    setInventoryCost(prev => prev + 50)
                  }}
                  className="mt-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-semibold"
                >
                  {t.producePart}
                </Button>
              )}
            </div>

            {/* Inventory Buffer */}
            <div className="flex flex-col items-center">
              <div className="mb-3 flex h-32 w-full flex-wrap content-start justify-center gap-2 overflow-y-auto rounded-lg border-2 border-dashed border-amber-500/50 bg-amber-500/10 p-3">
                {currentPhase === 1 ? (
                  bufferItems === 0 ? (
                    <Box className="h-12 w-12 text-amber-400" />
                  ) : (
                    Array.from({ length: bufferItems }).map((_, i) => (
                      <div
                        key={i}
                        className="flex h-8 w-8 items-center justify-center rounded bg-amber-500/30 border border-amber-500/50"
                      >
                        <Box className="h-5 w-5 text-amber-400" />
                      </div>
                    ))
                  )
                ) : currentPhase === 2 ? (
                  wipLimit === 0 ? (
                    <Box className="h-12 w-12 text-amber-400" />
                  ) : (
                    Array.from({ length: wipLimit }).map((_, i) => (
                      <div
                        key={i}
                        className="flex h-8 w-8 items-center justify-center rounded border-2 border-dashed border-amber-500/50 bg-amber-500/10"
                      >
                        <Box className="h-5 w-5 text-amber-400/50" />
                      </div>
                    ))
                  )
                ) : (
                  // Phase 3 - Pull system with filled/empty slots
                  Array.from({ length: wipLimit }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex h-8 w-8 items-center justify-center rounded ${
                        i < bufferItems
                          ? 'bg-amber-500/30 border border-amber-500/50'
                          : 'border-2 border-dashed border-amber-500/50 bg-amber-500/10'
                      }`}
                    >
                      <Box className={`h-5 w-5 ${i < bufferItems ? 'text-amber-400' : 'text-amber-400/50'}`} />
                    </div>
                  ))
                )}
              </div>
              <h3 className="text-center text-sm font-semibold text-white">{t.inventoryBuffer}</h3>
              {currentPhase === 2 && (
                <div className="mt-3 w-full">
                  <p className="mb-2 text-center text-xs font-medium text-gray-300">{t.setWipLimit}</p>
                  <div className="flex justify-center gap-2">
                    {[2, 3, 4].map((limit) => (
                      <Button
                        key={limit}
                        onClick={() => setWipLimit(limit)}
                        variant={wipLimit === limit ? 'default' : 'outline'}
                        className={
                          wipLimit === limit
                            ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold'
                            : 'border-amber-500/50 text-amber-400 hover:bg-amber-500/10'
                        }
                      >
                        {limit}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Customer / Machine 2 */}
            <div className="flex flex-col items-center">
              <div className="mb-3 flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-green-500/50 bg-green-500/10">
                <Truck className="h-12 w-12 text-green-400" />
              </div>
              <h3 className="text-center text-sm font-semibold text-white">{t.customer}</h3>
              {currentPhase === 3 && !simulationActive && (
                <Button
                  onClick={() => {
                    // Clear any existing interval
                    if (intervalRef.current) {
                      clearInterval(intervalRef.current)
                    }
                    
                    // Reset all simulation state
                    setSimulationActive(true)
                    setOrdersCompleted(0)
                    setStockouts(0)
                    setInventoryCost(0)
                    setMachineUtilization(0)
                    setBufferItems(wipLimit)
                    setIsProducing(false)
                    setShowDefect(false)
                    activeProductionTimeRef.current = 0
                    simulationStartTimeRef.current = Date.now()
                    
                    // Start live utilization update loop
                    utilizationIntervalRef.current = setInterval(() => {
                      const elapsed = Date.now() - simulationStartTimeRef.current
                      if (elapsed > 0) {
                        const currentUtil = (activeProductionTimeRef.current / elapsed) * 100
                        const clampedUtil = Math.min(Math.max(currentUtil, 0), 100)
                        setMachineUtilization(clampedUtil)
                      }
                    }, 500)
                    
                    intervalRef.current = setInterval(() => {
                      setOrdersCompleted(prev => {
                        if (prev >= 19) {
                          if (intervalRef.current) {
                            clearInterval(intervalRef.current)
                          }
                          if (utilizationIntervalRef.current) {
                            clearInterval(utilizationIntervalRef.current)
                          }
                          // Final machine utilization calculation
                          const totalSimulationTime = Date.now() - simulationStartTimeRef.current
                          let utilization = (activeProductionTimeRef.current / totalSimulationTime) * 100
                          utilization = Math.min(Math.max(utilization, 0), 100)
                          setMachineUtilization(utilization)
                          
                          setSimulationActive(false)
                          setShowResults(true)
                          return prev
                        }
                        
                        setBufferItems(currentBuffer => {
                          if (currentBuffer > 0) {
                            // Customer pulls item
                            const newBuffer = currentBuffer - 1
                            
                            // Trigger upstream production
                            setIsProducing(true)
                            const isDefect = Math.random() < 0.05
                            const cycleTime = Math.random() * 1200 + 600
                            
                            // Track active production time
                            if (!isDefect) {
                              activeProductionTimeRef.current += cycleTime
                            }
                            
                            if (isDefect) {
                              setShowDefect(true)
                              setTimeout(() => setShowDefect(false), 500)
                            }
                            
                            setTimeout(() => {
                              if (!isDefect) {
                                setBufferItems(b => b + 1)
                              }
                              setIsProducing(false)
                            }, cycleTime)
                            
                            return newBuffer
                          } else {
                            // Stockout - buffer empty
                            setStockouts(s => s + 1)
                            return 0
                          }
                        })
                        
                        // Update inventory cost based on current buffer
                        setInventoryCost(prev => prev + bufferItems * 2)
                        
                        // Update machine utilization
                        setMachineUtilization(prev => {
                          const newUtil = prev + (isProducing ? 5 : 0)
                          return Math.min(newUtil, 100)
                        })
                        
                        return prev + 1
                      })
                    }, taktTime)
                  }}
                  className="mt-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold"
                >
                  {t.startSimulation}
                </Button>
              )}
              {currentPhase === 3 && simulationActive && (
                <div className="mt-3 text-center">
                  <div className="text-sm font-semibold text-green-400">{t.ordersCompleted}: {ordersCompleted}/20</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Educational Panel */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-bold text-white">{t.instructionsTitle}</h2>
          <div className="space-y-4">
            <div className={`rounded-lg border p-4 ${currentPhase === 1 ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700 bg-slate-800/30'}`}>
              <h3 className="mb-2 font-semibold text-white">{t.phase1Title}</h3>
              <p className="text-sm text-gray-400">{t.phase1Desc}</p>
            </div>
            <div className={`rounded-lg border p-4 ${currentPhase === 2 ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 bg-slate-800/30'}`}>
              <h3 className="mb-2 font-semibold text-white">{t.phase2Title}</h3>
              <p className="text-sm text-gray-400">{t.phase2Desc}</p>
            </div>
            <div className={`rounded-lg border p-4 ${currentPhase === 3 ? 'border-green-500 bg-green-500/10' : 'border-slate-700 bg-slate-800/30'}`}>
              <h3 className="mb-2 font-semibold text-white">{t.phase3Title}</h3>
              <p className="text-sm text-gray-400">{t.phase3Desc}</p>
            </div>
          </div>
        </div>

        {/* Simulation Results Modal */}
        {showResults && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="mx-4 max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
              <h2 className="mb-4 text-2xl font-bold text-white">{t.simulationResults}</h2>
              
              <div className="mb-6 space-y-3">
                <div className="flex justify-between rounded-lg bg-slate-800/50 p-3">
                  <span className="text-gray-400">{t.ordersCompleted}:</span>
                  <span className="font-semibold text-white">20/20</span>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-800/50 p-3">
                  <span className="text-gray-400">{t.stockouts}:</span>
                  <span className={`font-semibold ${stockouts === 0 ? 'text-green-400' : 'text-red-400'}`}>{stockouts}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-800/50 p-3">
                  <span className="text-gray-400">{t.inventoryCost}:</span>
                  <span className="font-semibold text-white">${inventoryCost}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-800/50 p-3">
                  <span className="text-gray-400">{t.machineUtil}:</span>
                  <span className="font-semibold text-white">{machineUtilization.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-800/50 p-3">
                  <span className="text-gray-400">{t.wipLimit}:</span>
                  <span className="font-semibold text-white">{wipLimit}</span>
                </div>
              </div>

              <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                <p className="text-sm text-gray-300">
                  {stockouts > 0
                    ? language === 'en'
                      ? `The system is unstable. You had ${stockouts} customer stockouts due to upstream variability. Your WIP limit is too low for the current throughput or the Takt time is too fast.`
                      : `Sistem nije stabilan. Imali ste ${stockouts} zastoja kupca zbog uzvodne varijabilnosti i predugog takta u odnosu na brzinu mašine. Vaš WIP limit je prenizak za trenutnu proizvodnost ili je Takt vreme prebrzo.`
                    : stockouts === 0 && wipLimit >= 4
                    ? t.subOptimal
                    : t.perfectBalance}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowResults(false)
                    // Reset simulation state only (do not auto-start)
                    setOrdersCompleted(0)
                    setStockouts(0)
                    setInventoryCost(0)
                    setMachineUtilization(0)
                    setBufferItems(wipLimit)
                    setIsProducing(false)
                    setShowDefect(false)
                    // Clear utilization interval if still running
                    if (utilizationIntervalRef.current) {
                      clearInterval(utilizationIntervalRef.current)
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-semibold"
                >
                  {t.newSimulation}
                </Button>
                <Button
                  onClick={() => {
                    setShowResults(false)
                    setCurrentPhase(2)
                    setWipLimit(0)
                    setBufferItems(0)
                  }}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold"
                >
                  {t.changeWipLimit}
                </Button>
                <Button
                  onClick={() => router.push('/moduli')}
                  className="flex-1 border border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  {t.backToModules}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
