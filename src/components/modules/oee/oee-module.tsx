'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Wrench, Clock, Zap, AlertTriangle, TrendingDown, Activity } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Default values (can be overridden by user configuration)
const DEFAULT_SHIFT_TIME_MINUTES = 480; // 8-hour shift
const DEFAULT_IDEAL_CYCLE_TIME_SECONDS = 10; // 10 seconds per part

// Interface for OEE Losses
interface OEELosses {
  breakdownsMinutes: number;      // Availability losses
  setupMinutes: number;           // Availability losses
  minorStopsMinutes: number;     // Performance losses
  reducedSpeedPercentage: number; // Performance losses
  scrapCount: number;             // Quality losses
  startupDefectsCount: number;    // Quality losses
  breakTimeMinutes: number;      // Planned break time
}

// Language dictionary
const translations = {
  sr: {
    backToModules: 'Nazad na module',
    title: 'OEE Analiza',
    subtitle: 'Ukupna efikasnost opreme - Interaktivni kalkulator',
    availability: 'Dostupnost (A)',
    performance: 'Performanse (P)',
    quality: 'Kvalitet (Q)',
    factoryHealth: 'Zdravlje fabrike',
    excellent: 'Odlično',
    good: 'Dobro',
    poor: 'Loše',
    breakdowns: 'Kvarovi (min)',
    setup: 'Podešavanje (min)',
    minorStops: 'Manja zaustavljanja (min)',
    reducedSpeed: 'Smanjena brzina (%)',
    scrap: 'Otpad (kom)',
    startupDefects: 'Početni nedostaci (kom)',
    breakTime: 'Pauza (min)',
    configTitle: 'Konfiguracija proizvodne linije',
    shiftDuration: 'Trajanje smene (min)',
    idealCycleTime: 'Idealno vreme ciklusa (s)',
    totalOEE: 'Ukupni OEE',
    shiftTime: 'Vreme smene',
    plannedProductionTime: 'Planirano vreme proizvodnje',
    totalParts: 'Ukupno delova',
    goodParts: 'Dobrih delova',
    runTime: 'Vreme rada',
    downtime: 'Vreme neaktivnosti',
    sixBigLosses: 'Šest velikih gubitaka',
    adjustLosses: 'Podesite gubitke da biste videli uticaj na OEE',
    availabilityLosses: 'Gubici dostupnosti',
    performanceLosses: 'Gubici performansi',
    qualityLosses: 'Gubici kvaliteta',
    instructionsTitle: 'Uputstvo i formule',
    oeeFormula: 'OEE = A × P × Q',
    availabilityFormula: 'A (Dostupnost) = (Planirano vreme - Zastoji) / Planirano vreme',
    performanceFormula: 'P (Performanse) = (Idealni ciklus × Ukupno komada) / Vreme rada',
    qualityFormula: 'Q (Kvalitet) = (Dobri komadi / Ukupno komada)',
    sixBigLossesTitle: 'Šest velikih gubitaka',
    breakdownsDesc: 'Nenadani i neplanirani zastoji u radu mašine koji prekidaju proizvodnju.',
    setupDesc: 'Planirano vreme potrebno za zamenu alata, kalibraciju ili prelazak na novi proizvod (Setup/Changeover).',
    minorStopsDesc: 'Kratkotrajni zastoji (često kraći od 2 minuta) koje operater rešava odmah na licu mesta bez tehničke službe.',
    reducedSpeedDesc: 'Rad mašine brzinom koja je sporija od njene maksimalne, projektovane (idealne) brzine ciklusa.',
    scrapDesc: 'Proizvedeni delovi koji ne ispunjavaju standarde kvaliteta i moraju se baciti ili poslati na doradu.',
    startupDefectsDesc: 'Škart ili nestabilan kvalitet koji nastaje u fazi uhodavanja mašine, odmah nakon pokretanja proizvodnje ili izmene alata.',
  },
  en: {
    backToModules: 'Back to Modules',
    title: 'OEE Analysis',
    subtitle: 'Overall Equipment Effectiveness - Interactive Calculator',
    availability: 'Availability (A)',
    performance: 'Performance (P)',
    quality: 'Quality (Q)',
    factoryHealth: 'Factory Health',
    excellent: 'Excellent',
    good: 'Good',
    poor: 'Poor',
    breakdowns: 'Breakdowns (min)',
    setup: 'Setup (min)',
    minorStops: 'Minor Stops (min)',
    reducedSpeed: 'Reduced Speed (%)',
    scrap: 'Scrap (pcs)',
    startupDefects: 'Startup Defects (pcs)',
    breakTime: 'Break Time (min)',
    configTitle: 'Production Line Configuration',
    shiftDuration: 'Shift Duration (min)',
    idealCycleTime: 'Ideal Cycle Time (s)',
    totalOEE: 'Total OEE',
    shiftTime: 'Shift Time',
    plannedProductionTime: 'Planned Production Time',
    totalParts: 'Total Parts',
    goodParts: 'Good Parts',
    runTime: 'Run Time',
    downtime: 'Downtime',
    sixBigLosses: 'Six Big Losses',
    adjustLosses: 'Adjust losses to see impact on OEE',
    availabilityLosses: 'Availability Losses',
    performanceLosses: 'Performance Losses',
    qualityLosses: 'Quality Losses',
    instructionsTitle: 'Instructions & Formulas',
    oeeFormula: 'OEE = A × P × Q',
    availabilityFormula: 'A (Availability) = (Planned Time - Downtime) / Planned Time',
    performanceFormula: 'P (Performance) = (Ideal Cycle × Total Count) / Run Time',
    qualityFormula: 'Q (Quality) = (Good Parts / Total Parts)',
    sixBigLossesTitle: 'Six Big Losses',
    breakdownsDesc: 'Unplanned and unexpected machine downtime that interrupts production.',
    setupDesc: 'Planned time required for tool change, calibration, or changeover to a new product.',
    minorStopsDesc: 'Short stops (often less than 2 minutes) that operators resolve immediately on-site without technical support.',
    reducedSpeedDesc: 'Machine running at a speed slower than its maximum designed (ideal) cycle speed.',
    scrapDesc: 'Produced parts that do not meet quality standards and must be scrapped or reworked.',
    startupDefectsDesc: 'Scrap or unstable quality that occurs during machine warm-up, immediately after production start or tool change.',
  }
};

export function OEEModule() {
  const { language } = useLanguage();
  const t = translations[language];

  // State for the 6 losses + break time
  const [losses, setLosses] = useState<OEELosses>({
    breakdownsMinutes: 30,
    setupMinutes: 20,
    minorStopsMinutes: 15,
    reducedSpeedPercentage: 5,
    scrapCount: 10,
    startupDefectsCount: 5,
    breakTimeMinutes: 30,
  });

  // State for production line configuration
  const [shiftDuration, setShiftDuration] = useState(DEFAULT_SHIFT_TIME_MINUTES);
  const [idealCycleTime, setIdealCycleTime] = useState(DEFAULT_IDEAL_CYCLE_TIME_SECONDS);

  // Calculate OEE metrics using useMemo for instant updates
  const metrics = useMemo(() => {
    const plannedProductionTime = shiftDuration - losses.breakTimeMinutes;
    const unplannedDowntime = losses.breakdownsMinutes + losses.setupMinutes + losses.minorStopsMinutes;
    const runTime = plannedProductionTime - unplannedDowntime;
    
    // Availability = (Planned Production Time - Unplanned Downtime) / Planned Production Time
    const availability = plannedProductionTime > 0 
      ? Math.max(0, Math.min(1, runTime / plannedProductionTime))
      : 0;
    
    // Calculate total parts produced
    const totalParts = Math.floor((runTime * 60) / (idealCycleTime * (1 + losses.reducedSpeedPercentage / 100)));
    
    // Good parts = Total - Scrap - Startup Defects
    const goodParts = Math.max(0, totalParts - losses.scrapCount - losses.startupDefectsCount);
    
    // Performance = (Ideal Cycle Time * Total Count) / Run Time
    const performance = totalParts > 0 
      ? Math.max(0, Math.min(1, (idealCycleTime * totalParts) / (runTime * 60)))
      : 0;
    
    // Quality = Good Count / Total Count
    const quality = totalParts > 0 
      ? Math.max(0, Math.min(1, goodParts / totalParts))
      : 0;
    
    // OEE = Availability * Performance * Quality
    const oee = availability * performance * quality;
    
    return {
      availability,
      performance,
      quality,
      oee,
      totalDowntime: unplannedDowntime,
      runTime,
      totalParts,
      goodParts,
      plannedProductionTime,
    };
  }, [losses, shiftDuration, idealCycleTime]);

  // Factory health status
  const factoryHealth = useMemo(() => {
    if (metrics.oee >= 0.85) return { status: t.excellent, color: 'text-green-400', bgColor: 'bg-green-500/20' };
    if (metrics.oee >= 0.65) return { status: t.good, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    return { status: t.poor, color: 'text-red-400', bgColor: 'bg-red-500/20' };
  }, [metrics.oee, t]);

  // Handle slider change
  const handleLossChange = (key: keyof OEELosses, value: number) => {
    setLosses(prev => ({ ...prev, [key]: value }));
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

        {/* Main Content - Split Screen */}
        <div className="flex-1 p-4 sm:p-8">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2">
            
            {/* Left Panel - Controls */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm"
            >
              {/* Production Line Configuration */}
              <div className="mb-6 space-y-4 rounded-lg bg-white/5 p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {t.configTitle}
                </h3>
                
                {/* Shift Duration */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Clock className="h-4 w-4 text-purple-400" />
                      {t.shiftDuration}
                    </label>
                    <span className="text-sm font-bold text-white">{shiftDuration} min</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="720"
                    value={shiftDuration}
                    onChange={(e) => setShiftDuration(parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                {/* Ideal Cycle Time */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <TrendingDown className="h-4 w-4 text-purple-400" />
                      {t.idealCycleTime}
                    </label>
                    <span className="text-sm font-bold text-white">{idealCycleTime} s</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="120"
                    value={idealCycleTime}
                    onChange={(e) => setIdealCycleTime(parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              </div>

              <h2 className="mb-6 text-2xl font-bold text-white flex items-center gap-2">
                <Activity className="h-6 w-6 text-red-400" />
                {t.sixBigLosses}
              </h2>
              <p className="mb-6 text-sm text-gray-300">
                {t.adjustLosses}
              </p>

              {/* Availability Losses */}
              <div className="mb-6 space-y-4">
                <h3 className="text-lg font-semibold text-blue-300">{t.availabilityLosses}</h3>
                
                {/* Breakdowns */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Wrench className="h-4 w-4 text-red-400" />
                      {t.breakdowns}
                    </label>
                    <span className="text-sm font-bold text-white">{losses.breakdownsMinutes} min</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    value={losses.breakdownsMinutes}
                    onChange={(e) => handleLossChange('breakdownsMinutes', parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer accent-red-500"
                  />
                </div>

                {/* Setup */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Clock className="h-4 w-4 text-orange-400" />
                      {t.setup}
                    </label>
                    <span className="text-sm font-bold text-white">{losses.setupMinutes} min</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={losses.setupMinutes}
                    onChange={(e) => handleLossChange('setupMinutes', parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer accent-orange-500"
                  />
                </div>
              </div>

              {/* Performance Losses */}
              <div className="mb-6 space-y-4">
                <h3 className="text-lg font-semibold text-green-300">{t.performanceLosses}</h3>
                
                {/* Minor Stops */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      {t.minorStops}
                    </label>
                    <span className="text-sm font-bold text-white">{losses.minorStopsMinutes} min</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={losses.minorStopsMinutes}
                    onChange={(e) => handleLossChange('minorStopsMinutes', parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer accent-yellow-500"
                  />
                </div>

                {/* Reduced Speed */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <TrendingDown className="h-4 w-4 text-purple-400" />
                      {t.reducedSpeed}
                    </label>
                    <span className="text-sm font-bold text-white">{losses.reducedSpeedPercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={losses.reducedSpeedPercentage}
                    onChange={(e) => handleLossChange('reducedSpeedPercentage', parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              </div>

              {/* Quality Losses */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pink-300">{t.qualityLosses}</h3>
                
                {/* Scrap */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      {t.scrap}
                    </label>
                    <span className="text-sm font-bold text-white">{losses.scrapCount} {language === 'sr' ? 'kom' : 'pcs'}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={losses.scrapCount}
                    onChange={(e) => handleLossChange('scrapCount', parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer accent-red-500"
                  />
                </div>

                {/* Startup Defects */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <AlertTriangle className="h-4 w-4 text-orange-400" />
                      {t.startupDefects}
                    </label>
                    <span className="text-sm font-bold text-white">{losses.startupDefectsCount} {language === 'sr' ? 'kom' : 'pcs'}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={losses.startupDefectsCount}
                    onChange={(e) => handleLossChange('startupDefectsCount', parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer accent-orange-500"
                  />
                </div>
              </div>

              {/* Break Time */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">{t.breakTime}</h3>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {t.breakTime}
                    </label>
                    <span className="text-sm font-bold text-white">{losses.breakTimeMinutes} min</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={losses.breakTimeMinutes}
                    onChange={(e) => handleLossChange('breakTimeMinutes', parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer accent-gray-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Panel - Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* OEE Gauge */}
              <div className="rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-2xl font-bold text-white text-center">{t.totalOEE}</h2>
                <div className="relative flex items-center justify-center">
                  {/* Circular Progress */}
                  <svg className="h-48 w-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke={metrics.oee >= 0.85 ? '#22c55e' : metrics.oee >= 0.65 ? '#eab308' : '#ef4444'}
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - metrics.oee)}`}
                      className="transition-all duration-300 ease-out"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-5xl font-bold text-white">
                      {(metrics.oee * 100).toFixed(1)}
                    </span>
                    <span className="text-2xl text-gray-400">%</span>
                  </div>
                </div>
                
                {/* Factory Health Badge */}
                <div className="mt-6 flex justify-center">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${factoryHealth.bgColor} ${factoryHealth.color} font-semibold`}
                  >
                    <Activity className="h-5 w-5" />
                    {t.factoryHealth}: {factoryHealth.status}
                  </motion.div>
                </div>
              </div>

              {/* A, P, Q Metric Cards */}
              <div className="grid grid-cols-3 gap-4">
                {/* Availability */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-xl border border-blue-500/30 bg-blue-900/20 p-4 backdrop-blur-sm"
                >
                  <h3 className="mb-2 text-sm font-semibold text-blue-300">{t.availability}</h3>
                  <p className="text-3xl font-bold text-white">
                    {(metrics.availability * 100).toFixed(1)}%
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {t.runTime}: {metrics.runTime} min
                  </p>
                </motion.div>

                {/* Performance */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-xl border border-green-500/30 bg-green-900/20 p-4 backdrop-blur-sm"
                >
                  <h3 className="mb-2 text-sm font-semibold text-green-300">{t.performance}</h3>
                  <p className="text-3xl font-bold text-white">
                    {(metrics.performance * 100).toFixed(1)}%
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {t.totalParts}: {metrics.totalParts}
                  </p>
                </motion.div>

                {/* Quality */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-xl border border-pink-500/30 bg-pink-900/20 p-4 backdrop-blur-sm"
                >
                  <h3 className="mb-2 text-sm font-semibold text-pink-300">{t.quality}</h3>
                  <p className="text-3xl font-bold text-white">
                    {(metrics.quality * 100).toFixed(1)}%
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {t.goodParts}: {metrics.goodParts}
                  </p>
                </motion.div>
              </div>

              {/* Additional Info */}
              <div className="rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">{t.shiftTime}:</span>
                    <span className="ml-2 font-bold text-white">{shiftDuration} min</span>
                  </div>
                  <div>
                    <span className="text-gray-400">{t.plannedProductionTime}:</span>
                    <span className="ml-2 font-bold text-white">{metrics.plannedProductionTime} min</span>
                  </div>
                  <div>
                    <span className="text-gray-400">{t.idealCycleTime}:</span>
                    <span className="ml-2 font-bold text-white">{idealCycleTime}s</span>
                  </div>
                  <div>
                    <span className="text-gray-400">{t.downtime}:</span>
                    <span className="ml-2 font-bold text-white">{metrics.totalDowntime} min</span>
                  </div>
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-white/5 p-4">
                  <p className="text-base font-semibold text-white">{t.oeeFormula}</p>
                </div>
                <div className="rounded-lg bg-blue-900/20 p-4 border border-blue-500/30">
                  <p className="text-sm text-blue-300">{t.availabilityFormula}</p>
                </div>
                <div className="rounded-lg bg-green-900/20 p-4 border border-green-500/30">
                  <p className="text-sm text-green-300">{t.performanceFormula}</p>
                </div>
                <div className="rounded-lg bg-pink-900/20 p-4 border border-pink-500/30">
                  <p className="text-sm text-pink-300">{t.qualityFormula}</p>
                </div>
              </div>

              {/* Six Big Losses Explanations */}
              <div className="mt-8">
                <h4 className="mb-4 text-lg font-semibold text-white">{t.sixBigLossesTitle}</h4>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Availability Losses */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-blue-300">{t.availabilityLosses}</h5>
                    <div className="space-y-2 text-xs text-slate-400">
                      <p><span className="font-semibold text-white">{t.breakdowns.split(' (')[0]}:</span> {t.breakdownsDesc}</p>
                      <p><span className="font-semibold text-white">{t.setup.split(' (')[0]}:</span> {t.setupDesc}</p>
                    </div>
                  </div>

                  {/* Performance Losses */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-green-300">{t.performanceLosses}</h5>
                    <div className="space-y-2 text-xs text-slate-400">
                      <p><span className="font-semibold text-white">{t.minorStops.split(' (')[0]}:</span> {t.minorStopsDesc}</p>
                      <p><span className="font-semibold text-white">{t.reducedSpeed.split(' (')[0]}:</span> {t.reducedSpeedDesc}</p>
                    </div>
                  </div>

                  {/* Quality Losses */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-pink-300">{t.qualityLosses}</h5>
                    <div className="space-y-2 text-xs text-slate-400">
                      <p><span className="font-semibold text-white">{t.scrap.split(' (')[0]}:</span> {t.scrapDesc}</p>
                      <p><span className="font-semibold text-white">{t.startupDefects.split(' (')[0]}:</span> {t.startupDefectsDesc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
