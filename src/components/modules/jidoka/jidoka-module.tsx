'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Activity, AlertCircle, Package, Wrench, Play, Pause, AlertTriangle, RefreshCw, Clock, Target, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Part type definition
type Part = {
  id: string;
  isDefective: boolean;
  status: 'moving' | 'blocked';
};

type SimulationState = 'IDLE' | 'RUNNING' | 'STOPPED_DEFECT' | 'COMPLETED';

// Language dictionary
const translations = {
  sr: {
    backToModules: 'Nazad na module',
    title: 'Jidoka Analiza',
    subtitle: 'Autonomatizacija i ugrađeni kvalitet',
    andonStatus: 'Andon Status',
    conveyor: 'Proizvodna linija',
    metrics: 'Metrike',
    totalParts: 'Ukupno delova',
    lineStops: 'Zaustavljanja linije',
    fixedDefects: 'Rešeni defekti',
    startSimulation: 'Pokreni simulaciju',
    pause: 'Pauziraj',
    defectDetected: 'Kvar detektovan na izvoru! Linija je automatski zaustavljena.',
    resolveRootCause: 'Ukloni škart i resetuj liniju',
    instructionsTitle: 'Uputstvo i teorija',
    principlesTitle: 'Jidoka Principi (Autonomatizacija)',
    step1Title: 'Otkrivanje abnormalnosti',
    step1Desc: 'Mašina ili operater automatski detektuju grešku ili feler u procesu.',
    step2Title: 'Zaustavljanje linije',
    step2Desc: 'Proizvodnja se odmah prekida (povlačenje Andon vrpce) kako se škart ne bi širio dalje.',
    step3Title: 'Brzo rešavanje problema',
    step3Desc: 'Hitna intervencija kako bi se uklonio trenutni zastoj i proces vratio u normalu.',
    step4Title: 'Istraga korenitog uzroka',
    step4Desc: 'Primena alata poput "5 Zašto" da se trajno eliminiše uzrok i spreči ponavljanje greške.',
    machineConfig: 'Konfiguracija mašine',
    cycleTime: 'Takt mašine',
    defectRate: 'Stopa defekata',
    targetBatch: 'Ciljna serija',
    batchCompleted: 'Serija završena!',
    newSimulation: 'Nova simulacija',
  },
  en: {
    backToModules: 'Back to Modules',
    title: 'Jidoka Analysis',
    subtitle: 'Autonomation & Built-in Quality',
    andonStatus: 'Andon Status',
    conveyor: 'Production Line',
    metrics: 'Metrics',
    totalParts: 'Total Parts',
    lineStops: 'Line Stops',
    fixedDefects: 'Fixed Defects',
    startSimulation: 'Start Simulation',
    pause: 'Pause',
    defectDetected: 'Defect detected at source! Line automatically stopped.',
    resolveRootCause: 'Remove Defect & Reset Line',
    instructionsTitle: 'Instructions & Theory',
    principlesTitle: 'Jidoka Principles (Autonomation)',
    step1Title: 'Detect the Anomaly',
    step1Desc: 'The machine or operator automatically spots a defect or operational error.',
    step2Title: 'Stop the Line',
    step2Desc: 'Production is immediately halted (Andon cord pulled) to prevent passing the defect downstream.',
    step3Title: 'Fix the Immediate Problem',
    step3Desc: 'Quick response to clear the issue and restore normal workflow.',
    step4Title: 'Investigate Root Cause',
    step4Desc: 'Use tools like the "5 Whys" to solve the ultimate cause and prevent recurrence.',
    machineConfig: 'Machine Configuration',
    cycleTime: 'Cycle Time',
    defectRate: 'Defect Rate',
    targetBatch: 'Target Batch',
    batchCompleted: 'Batch Completed!',
    newSimulation: 'New Simulation',
  }
};

export function JidokaModule() {
  const { language } = useLanguage();
  const t = translations[language];

  // State
  const [simulationState, setSimulationState] = useState<SimulationState>('IDLE');
  const [parts, setParts] = useState<Part[]>([]);
  const [totalParts, setTotalParts] = useState(0);
  const [lineStops, setLineStops] = useState(0);
  const [fixedDefects, setFixedDefects] = useState(0);
  
  // Machine configuration
  const [cycleTime, setCycleTime] = useState(2); // seconds
  const [defectRate, setDefectRate] = useState(15); // percentage
  const [targetBatch, setTargetBatch] = useState(20); // parts
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const partIdCounter = useRef(0);

  // Simulation logic
  useEffect(() => {
    if (simulationState === 'RUNNING') {
      intervalRef.current = setInterval(() => {
        const isDefective = Math.random() < (defectRate / 100);
        const newPart: Part = {
          id: `part-${partIdCounter.current++}`,
          isDefective,
          status: 'moving'
        };

        setParts(prev => {
          const updated = [...prev, newPart];
          // Limit to 6 parts
          if (updated.length > 6) {
            updated.shift();
          }
          return updated;
        });

        setTotalParts(prev => {
          const newTotal = prev + 1;
          // Check if target batch reached
          if (newTotal >= targetBatch) {
            setSimulationState('COMPLETED');
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
          return newTotal;
        });

        // CRITICAL JIDOKA RULE: Stop immediately on defect
        if (isDefective) {
          setSimulationState('STOPPED_DEFECT');
          setLineStops(prev => prev + 1);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, cycleTime * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [simulationState, cycleTime, defectRate, targetBatch]);

  const handleStartSimulation = () => {
    setSimulationState('RUNNING');
  };

  const handlePause = () => {
    setSimulationState('IDLE');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleResolveRootCause = () => {
    // Clear defective parts
    setParts(prev => prev.filter(part => !part.isDefective));
    setFixedDefects(prev => prev + 1);
    setSimulationState('RUNNING');
  };

  const handleNewSimulation = () => {
    // Reset all state
    setSimulationState('IDLE');
    setParts([]);
    setTotalParts(0);
    setLineStops(0);
    setFixedDefects(0);
    partIdCounter.current = 0;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-b border-white/20 bg-black/30 p-4 backdrop-blur-sm sm:p-6"
        >
          <div className="flex items-center justify-between">
            <Link href="/moduli">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">{t.backToModules}</span>
              </motion.button>
            </Link>
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-white sm:text-4xl">
                {t.title}
              </h1>
              <p className="mt-2 text-sm text-gray-300 sm:text-lg">
                {t.subtitle}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-8">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-4">
            
            {/* Left Panel - Andon Status */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm"
            >
              <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-400" />
                {t.andonStatus}
              </h2>
              
              {/* Traffic Light - Vertical Layout */}
              <div className="flex flex-col items-center gap-4">
                {/* Green Light */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ 
                    scale: simulationState === 'IDLE' || simulationState === 'RUNNING' || simulationState === 'COMPLETED' ? 1 : 0.7,
                    boxShadow: simulationState === 'IDLE' || simulationState === 'RUNNING' || simulationState === 'COMPLETED'
                      ? '0 0 30px rgba(34,197,94,0.8)' 
                      : '0 0 10px rgba(34,197,94,0.2)'
                  }}
                  transition={{ duration: 0.3 }}
                  className={`h-20 w-20 rounded-full border-4 ${
                    simulationState === 'IDLE' || simulationState === 'RUNNING' || simulationState === 'COMPLETED'
                      ? 'bg-green-500 border-green-600'
                      : 'bg-green-900 border-green-950'
                  }`}
                />
                
                {/* Yellow Light */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 0.7 }}
                  className="h-20 w-20 rounded-full bg-yellow-900 border-4 border-yellow-950 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                />
                
                {/* Red Light */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ 
                    scale: simulationState === 'STOPPED_DEFECT' ? 1 : 0.7,
                    boxShadow: simulationState === 'STOPPED_DEFECT' 
                      ? '0 0 30px rgba(239,68,68,0.8)' 
                      : '0 0 10px rgba(239,68,68,0.2)'
                  }}
                  transition={{ duration: 0.3 }}
                  className={`h-20 w-20 rounded-full border-4 ${
                    simulationState === 'STOPPED_DEFECT'
                      ? 'bg-red-500 border-red-600'
                      : 'bg-red-900 border-red-950'
                  }`}
                />
              </div>
            </motion.div>

            {/* Center Panel - Conveyor Belt */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2 rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm"
            >
              <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400" />
                {t.conveyor}
              </h2>
              
              {/* Conveyor Belt Container */}
              <div className="h-64 rounded-lg border-2 border-slate-600 bg-slate-900/50 flex items-center justify-center overflow-hidden relative">
                {/* Parts on conveyor belt */}
                <div className="flex items-center justify-around gap-4 px-6 w-full">
                  {parts.length === 0 ? (
                    <div className="text-center">
                      <Activity className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-500 text-sm">Conveyor Belt Simulation</p>
                    </div>
                  ) : (
                    parts.map((part) => (
                      <motion.div
                        key={part.id}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`relative h-16 w-16 rounded-lg flex items-center justify-center border-2 ${
                          part.isDefective
                            ? 'bg-red-500/20 border-red-500'
                            : 'bg-green-500/20 border-green-500'
                        }`}
                      >
                        {part.isDefective && (
                          <AlertTriangle className="h-8 w-8 text-red-400" />
                        )}
                        {!part.isDefective && (
                          <Package className="h-8 w-8 text-green-400" />
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Controls Area */}
              <div className="mt-4 space-y-3">
                {simulationState === 'IDLE' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartSimulation}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 text-white font-semibold transition-all hover:from-green-500 hover:to-green-600"
                  >
                    <Play className="h-5 w-5" />
                    {t.startSimulation}
                  </motion.button>
                )}

                {simulationState === 'RUNNING' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePause}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-3 text-white font-semibold transition-all hover:from-amber-500 hover:to-amber-600"
                  >
                    <Pause className="h-5 w-5" />
                    {t.pause}
                  </motion.button>
                )}

                {simulationState === 'STOPPED_DEFECT' && (
                  <div className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border-2 border-red-500 bg-red-900/30 p-4 text-center"
                    >
                      <AlertTriangle className="h-6 w-6 text-red-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-red-300">{t.defectDetected}</p>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResolveRootCause}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white font-semibold transition-all hover:from-blue-500 hover:to-blue-600"
                    >
                      <Wrench className="h-5 w-5" />
                      {t.resolveRootCause}
                    </motion.button>
                  </div>
                )}

                {simulationState === 'COMPLETED' && (
                  <div className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border-2 border-green-500 bg-green-900/30 p-4 text-center"
                    >
                      <Activity className="h-6 w-6 text-green-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-green-300">{t.batchCompleted}</p>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNewSimulation}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 text-white font-semibold transition-all hover:from-purple-500 hover:to-purple-600"
                    >
                      <RefreshCw className="h-5 w-5" />
                      {t.newSimulation}
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right Panel - Metrics */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-400" />
                {t.metrics}
              </h2>
              
              {/* Total Parts */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="rounded-xl border border-blue-500/30 bg-blue-900/20 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 text-blue-300 mb-2">
                  <Package className="h-4 w-4" />
                  <span className="text-sm font-semibold">{t.totalParts}</span>
                </div>
                <p className="text-3xl font-bold text-white">{totalParts}</p>
              </motion.div>

              {/* Line Stops */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="rounded-xl border border-red-500/30 bg-red-900/20 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 text-red-300 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-semibold">{t.lineStops}</span>
                </div>
                <p className="text-3xl font-bold text-white">{lineStops}</p>
              </motion.div>

              {/* Fixed Defects */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="rounded-xl border border-green-500/30 bg-green-900/20 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 text-green-300 mb-2">
                  <Wrench className="h-4 w-4" />
                  <span className="text-sm font-semibold">{t.fixedDefects}</span>
                </div>
                <p className="text-3xl font-bold text-white">{fixedDefects}</p>
              </motion.div>

              {/* Machine Configuration */}
              <div className="rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-400" />
                  {t.machineConfig}
                </h3>
                
                {/* Cycle Time */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-300">
                      <Clock className="h-3 w-3 text-cyan-400" />
                      {t.cycleTime}
                    </label>
                    <span className="text-xs font-bold text-white">{cycleTime}s</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={cycleTime}
                    onChange={(e) => setCycleTime(parseFloat(e.target.value))}
                    disabled={simulationState === 'RUNNING'}
                    className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"
                  />
                </div>

                {/* Defect Rate */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-300">
                      <Zap className="h-3 w-3 text-amber-400" />
                      {t.defectRate}
                    </label>
                    <span className="text-xs font-bold text-white">{defectRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={defectRate}
                    onChange={(e) => setDefectRate(parseInt(e.target.value))}
                    disabled={simulationState === 'RUNNING'}
                    className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer accent-amber-500 disabled:opacity-50"
                  />
                </div>

                {/* Target Batch */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-300">
                      <Target className="h-3 w-3 text-purple-400" />
                      {t.targetBatch}
                    </label>
                    <span className="text-xs font-bold text-white">{targetBatch}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={targetBatch}
                    onChange={(e) => setTargetBatch(parseInt(e.target.value))}
                    disabled={simulationState === 'RUNNING'}
                    className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer accent-purple-500 disabled:opacity-50"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Educational Instructions Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mx-auto max-w-7xl px-4 pb-8 sm:px-8"
          >
            <div className="rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-xl font-bold text-white">{t.instructionsTitle}</h3>
              <h4 className="mb-6 text-lg font-semibold text-amber-300">{t.principlesTitle}</h4>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Step 1 */}
                <div className="rounded-lg bg-blue-900/20 p-4 border border-blue-500/30">
                  <h5 className="mb-2 text-sm font-semibold text-blue-300">1. {t.step1Title}</h5>
                  <p className="text-xs text-slate-300">{t.step1Desc}</p>
                </div>

                {/* Step 2 */}
                <div className="rounded-lg bg-red-900/20 p-4 border border-red-500/30">
                  <h5 className="mb-2 text-sm font-semibold text-red-300">2. {t.step2Title}</h5>
                  <p className="text-xs text-slate-300">{t.step2Desc}</p>
                </div>

                {/* Step 3 */}
                <div className="rounded-lg bg-amber-900/20 p-4 border border-amber-500/30">
                  <h5 className="mb-2 text-sm font-semibold text-amber-300">3. {t.step3Title}</h5>
                  <p className="text-xs text-slate-300">{t.step3Desc}</p>
                </div>

                {/* Step 4 */}
                <div className="rounded-lg bg-green-900/20 p-4 border border-green-500/30">
                  <h5 className="mb-2 text-sm font-semibold text-green-300">4. {t.step4Title}</h5>
                  <p className="text-xs text-slate-300">{t.step4Desc}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
