'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Translations dictionary for Kaizen module
const translations = {
  sr: {
    backToModules: 'Nazad na module',
    title: 'Kaizen',
    subtitle: 'Kontinuirano poboljšanje i PDCA',
    currentState: 'Trenutno stanje (Pre)',
    proposedState: 'Predlog poboljšanja (Posle)',
    metrics: 'Uticaj poboljšanja (ROI)',
    cycle: 'PDCA Ciklus',
    timeSavings: 'Ušteda vremena',
    financialSavings: 'Finansijska ušteda',
    productivityIncrease: 'Povećanje produktivnosti',
    cycleTimePerPart: 'Vreme ciklusa po komadu (minuti)',
    hourlyCost: 'Trošak radnog sata (€/h)',
    dailyVolume: 'Dnevni obim proizvodnje (komada)',
    newCycleTime: 'Novo vreme ciklusa (minuti)',
    implementationCost: 'Trošak implementacije (€)',
    hoursPerYear: 'h/god',
    eurosPerYear: '€/god',
    percentage: '%',
    pdcaPlan: 'PLAN (Planiraj)',
    pdcaDo: 'DO (Sprovedi)',
    pdcaCheck: 'CHECK (Proveri)',
    pdcaAct: 'ACT (Standardizuj)',
    pdcaPlanDesc: 'Identifikacija gubitka i planiranje promena.',
    pdcaDoDesc: 'Testiranje rešenja na malom uzorku.',
    pdcaCheckDesc: 'Analiza rezultata i provera uspešnosti.',
    pdcaActDesc: 'Standardizacija uspešnog rešenja i novi ciklus.',
    pdcaPlanDynamic: 'Cilj je smanjiti vreme ciklusa sa {oldCycleTime} min na {newCycleTime} min za dnevni obim od {dailyVolume} komada.',
    pdcaDoDynamic: 'Implementacija promene na liniji uz jednokratni trošak od {implementationCost} €.',
    pdcaCheckDynamic: 'Evaluacija pokazuje uštedu od {hoursSaved} radnih sati godišnje, što donosi neto finansijski efekat od {financialSavings} € u prvoj godini.',
    pdcaActDynamic: 'Produktivnost je porasla za {productivityIncrease}%. Uska grla su uklonjena, novi standard se usvaja, a proces se kontinuirano prati za sledeći Kaizen.',
    pdcaActDynamicNegative: 'Produktivnost je opala za {productivityIncrease}%. Potrebna je intervencija, a proces se analizira za sledeći Kaizen.'
  },
  en: {
    backToModules: 'Back to Modules',
    title: 'Kaizen',
    subtitle: 'Continuous Improvement & PDCA',
    currentState: 'Current State (Before)',
    proposedState: 'Proposed Improvement (After)',
    metrics: 'Improvement Impact (ROI)',
    cycle: 'PDCA Cycle',
    timeSavings: 'Time Savings',
    financialSavings: 'Financial Savings',
    productivityIncrease: 'Productivity Increase',
    cycleTimePerPart: 'Cycle Time per part (minutes)',
    hourlyCost: 'Hourly Labor/Machine Cost (€/h)',
    dailyVolume: 'Daily Production Volume (parts)',
    newCycleTime: 'New Cycle Time (minutes)',
    implementationCost: 'One-time Implementation Cost (€)',
    hoursPerYear: 'h/year',
    eurosPerYear: '€/year',
    percentage: '%',
    pdcaPlan: 'PLAN (Plan)',
    pdcaDo: 'DO (Implement)',
    pdcaCheck: 'CHECK (Verify)',
    pdcaAct: 'ACT (Standardize)',
    pdcaPlanDesc: 'Identify waste and plan changes.',
    pdcaDoDesc: 'Test solution on a small sample.',
    pdcaCheckDesc: 'Analyze results and verify success.',
    pdcaActDesc: 'Standardize successful solution and start new cycle.',
    pdcaPlanDynamic: 'Goal is to reduce cycle time from {oldCycleTime} min to {newCycleTime} min for a daily volume of {dailyVolume} parts.',
    pdcaDoDynamic: 'Implement change on the line with a one-time cost of {implementationCost} €.',
    pdcaCheckDynamic: 'Evaluation shows savings of {hoursSaved} working hours annually, delivering a net financial impact of {financialSavings} € in the first year.',
    pdcaActDynamic: 'Productivity increased by {productivityIncrease}%. Bottlenecks removed, new standard adopted, and process continuously monitored for the next Kaizen.',
    pdcaActDynamicNegative: 'Productivity decreased by {productivityIncrease}%. Intervention needed, and process analyzed for the next Kaizen.'
  }
};

export function KaizenModule() {
  const { language } = useLanguage();
  const t = translations[language];

  // Helper function to format number with thousands separator
  const formatNumber = (num: number, decimals: number = 0): string => {
    return num.toLocaleString(language === 'sr' ? 'sr-RS' : 'en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  // Helper function to format number without trailing .0
  const formatCleanNumber = (num: number, decimals: number = 1): string => {
    // Sanitize number to eliminate floating-point precision issues
    const cleanNum = Math.round(num * 10000) / 10000;
    const isWholeNumber = cleanNum % 1 === 0;
    if (isWholeNumber) {
      return cleanNum.toLocaleString(language === 'sr' ? 'sr-RS' : 'en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    }
    return cleanNum.toLocaleString(language === 'sr' ? 'sr-RS' : 'en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  // State for input fields (stored as strings to fix leading zero bug)
  const [cycleTimePerPart, setCycleTimePerPart] = useState('10');
  const [hourlyCost, setHourlyCost] = useState('20');
  const [dailyVolume, setDailyVolume] = useState('100');
  const [newCycleTime, setNewCycleTime] = useState('8');
  const [implementationCost, setImplementationCost] = useState('500');

  // ROI calculations using useMemo for real-time updates
  const metrics = useMemo(() => {
    const WORKING_DAYS_PER_YEAR = 250;
    
    // Parse string states to numbers
    const cycleTimePerPartNum = parseFloat(cycleTimePerPart) || 0;
    const hourlyCostNum = parseFloat(hourlyCost) || 0;
    const dailyVolumeNum = parseFloat(dailyVolume) || 0;
    const newCycleTimeNum = parseFloat(newCycleTime) || 0;
    const implementationCostNum = parseFloat(implementationCost) || 0;
    
    // Time Saved: (Old Cycle Time - New Cycle Time) * Daily Volume = Minutes saved per day
    const minutesSavedPerDay = (cycleTimePerPartNum - newCycleTimeNum) * dailyVolumeNum;
    const hoursSavedPerYear = (minutesSavedPerDay * WORKING_DAYS_PER_YEAR) / 60;
    
    // Financial Savings: (Annual Hours Saved * Hourly Cost) - One-time Implementation Cost
    const annualSavings = hoursSavedPerYear * hourlyCostNum;
    const netAnnualSavings = annualSavings - implementationCostNum;
    
    // Productivity Increase: ((Old Cycle Time / New Cycle Time) - 1) * 100
    const productivityIncrease = ((cycleTimePerPartNum / newCycleTimeNum) - 1) * 100;
    
    return {
      hoursSavedPerYear,
      netAnnualSavings,
      productivityIncrease
    };
  }, [cycleTimePerPart, hourlyCost, dailyVolume, newCycleTime, implementationCost]);

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

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column - Inputs */}
            <div className="space-y-6">
              {/* Current State Card */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl"
              >
                <h2 className="mb-4 text-xl font-semibold text-white">
                  {t.currentState}
                </h2>
                <div className="space-y-4">
                  {/* Cycle Time per Part */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t.cycleTimePerPart}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={cycleTimePerPart}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/^0+(?=\d)/, '');
                        setCycleTimePerPart(cleanValue);
                      }}
                      className="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Hourly Cost */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t.hourlyCost}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={hourlyCost}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/^0+(?=\d)/, '');
                        setHourlyCost(cleanValue);
                      }}
                      className="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Daily Volume */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t.dailyVolume}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={dailyVolume}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/^0+(?=\d)/, '');
                        setDailyVolume(cleanValue);
                      }}
                      className="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Proposed State Card */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl"
              >
                <h2 className="mb-4 text-xl font-semibold text-white">
                  {t.proposedState}
                </h2>
                <div className="space-y-4">
                  {/* New Cycle Time */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t.newCycleTime}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={newCycleTime}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/^0+(?=\d)/, '');
                        setNewCycleTime(cleanValue);
                      }}
                      className="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Implementation Cost */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t.implementationCost}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={implementationCost}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/^0+(?=\d)/, '');
                        setImplementationCost(cleanValue);
                      }}
                      className="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Outputs */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl"
            >
              <h2 className="mb-4 text-xl font-semibold text-white">
                {t.metrics}
              </h2>
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Time Savings */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-lg bg-slate-900/50 p-4"
                >
                  <p className="mb-2 text-sm text-gray-400">{t.timeSavings}</p>
                  <p className={`text-3xl font-bold ${
                    metrics.hoursSavedPerYear >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatCleanNumber(metrics.hoursSavedPerYear)}
                  </p>
                  <p className="text-xs text-gray-500">{t.hoursPerYear}</p>
                </motion.div>

                {/* Financial Savings */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-lg bg-slate-900/50 p-4"
                >
                  <p className="mb-2 text-sm text-gray-400">{t.financialSavings}</p>
                  <p className={`text-3xl font-bold ${
                    metrics.netAnnualSavings >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatNumber(metrics.netAnnualSavings)}
                  </p>
                  <p className="text-xs text-gray-500">{t.eurosPerYear}</p>
                </motion.div>

                {/* Productivity Increase */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-lg bg-slate-900/50 p-4"
                >
                  <p className="mb-2 text-sm text-gray-400">{t.productivityIncrease}</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {metrics.productivityIncrease >= 0 ? '+' : ''}{formatCleanNumber(metrics.productivityIncrease)}
                  </p>
                  <p className="text-xs text-gray-500">{t.percentage}</p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* PDCA Cycle Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mx-auto max-w-7xl rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl"
          >
            <h2 className="mb-6 text-xl font-semibold text-white">
              {t.cycle}
            </h2>
            
            {/* PDCA Steps Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* PLAN */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative rounded-xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-blue-950/20 p-5 backdrop-blur-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                    <span className="text-sm font-bold text-blue-400">1</span>
                  </div>
                  <h3 className="text-lg font-bold text-blue-300">{t.pdcaPlan}</h3>
                </div>
                <p className="mb-3 text-sm text-gray-400">{t.pdcaPlanDesc}</p>
                <div className="rounded-lg bg-blue-950/30 p-3">
                  <p className="text-xs text-blue-200">
                    {t.pdcaPlanDynamic
                      .replace('{oldCycleTime}', formatCleanNumber(parseFloat(cycleTimePerPart) || 0))
                      .replace('{newCycleTime}', formatCleanNumber(parseFloat(newCycleTime) || 0))
                      .replace('{dailyVolume}', formatNumber(parseFloat(dailyVolume) || 0))}
                  </p>
                </div>
              </motion.div>

              {/* DO */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative rounded-xl border-2 border-green-500/30 bg-gradient-to-br from-green-900/20 to-green-950/20 p-5 backdrop-blur-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                    <span className="text-sm font-bold text-green-400">2</span>
                  </div>
                  <h3 className="text-lg font-bold text-green-300">{t.pdcaDo}</h3>
                </div>
                <p className="mb-3 text-sm text-gray-400">{t.pdcaDoDesc}</p>
                <div className="rounded-lg bg-green-950/30 p-3">
                  <p className="text-xs text-green-200">
                    {t.pdcaDoDynamic.replace('{implementationCost}', formatNumber(parseFloat(implementationCost) || 0))}
                  </p>
                </div>
              </motion.div>

              {/* CHECK */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative rounded-xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-900/20 to-amber-950/20 p-5 backdrop-blur-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20">
                    <span className="text-sm font-bold text-amber-400">3</span>
                  </div>
                  <h3 className="text-lg font-bold text-amber-300">{t.pdcaCheck}</h3>
                </div>
                <p className="mb-3 text-sm text-gray-400">{t.pdcaCheckDesc}</p>
                <div className="rounded-lg bg-amber-950/30 p-3">
                  <p className="text-xs text-amber-200">
                    {t.pdcaCheckDynamic
                      .replace('{hoursSaved}', formatCleanNumber(metrics.hoursSavedPerYear))
                      .replace('{financialSavings}', formatNumber(metrics.netAnnualSavings))}
                  </p>
                </div>
              </motion.div>

              {/* ACT */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative rounded-xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-purple-950/20 p-5 backdrop-blur-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20">
                    <span className="text-sm font-bold text-purple-400">4</span>
                  </div>
                  <h3 className="text-lg font-bold text-purple-300">{t.pdcaAct}</h3>
                </div>
                <p className="mb-3 text-sm text-gray-400">{t.pdcaActDesc}</p>
                <div className="rounded-lg bg-purple-950/30 p-3">
                  <p className="text-xs text-purple-200">
                    {metrics.productivityIncrease < 0
                      ? t.pdcaActDynamicNegative.replace('{productivityIncrease}', formatCleanNumber(Math.abs(metrics.productivityIncrease)))
                      : t.pdcaActDynamic.replace('{productivityIncrease}', formatCleanNumber(metrics.productivityIncrease))}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Arrow indicators between steps (desktop only) */}
            <div className="mt-4 hidden items-center justify-center gap-2 lg:flex">
              <div className="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-green-500" />
              <div className="h-0.5 w-16 bg-gradient-to-r from-green-500 to-amber-500" />
              <div className="h-0.5 w-16 bg-gradient-to-r from-amber-500 to-purple-500" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
