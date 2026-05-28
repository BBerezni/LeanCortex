'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { SortStage } from './sort-stage';
import { SeisoStage, SeisoTool } from './seiso-stage';
import { SeiketsuStage } from './seiketsu-stage';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

// Language dictionary
const translations = {
  sr: {
    backToModules: 'Nazad na module',
    title: 'Igra 5S Metodologije',
    subtitle: 'Naučite i vežbajte 5S metodologiju kroz interaktivne faze',
    phase5Title: 'Faza 5: Shitsuke (Održavati)',
    phase5Description: 'Čestitamo! Uspešno ste prošli kroz proces Sortiranja, Organizacije, Čišćenja i Standardizacije.',
    congratulations: 'Čestitamo!',
    successMessage: 'Uspešno ste završili sve faze 5S metodologije!',
    resetSimulation: 'Ponovi simulaciju',
    shitsukeTitle: 'Shitsuke (Održavanje)',
    shitsukeDescription1: 'Shitsuke (Održavanje) predstavlja krunu 5S metodologije i podrazumeva pretvaranje pravila u svakodnevnu naviku kroz samodisciplinu.',
    shitsukeDescription2: 'Bez ove faze, radni prostor se brzo vraća u prvobitni nered.',
    shitsukeDescription3: 'Čestitamo na uspešno završenoj simulaciji! Vaš prostor je sada primer Industry 4.0 ekosistema.',
    simulationResetting: 'Simulacija se resetuje...'
  },
  en: {
    backToModules: 'Back to Modules',
    title: '5S Methodology Game',
    subtitle: 'Learn and practice 5S methodology through interactive phases',
    phase5Title: 'Phase 5: Shitsuke (Sustain)',
    phase5Description: 'Congratulations! You have successfully completed the process of Sorting, Organizing, Cleaning, and Standardizing.',
    congratulations: 'Congratulations!',
    successMessage: 'You have successfully completed all phases of the 5S methodology!',
    resetSimulation: 'Repeat Simulation',
    shitsukeTitle: 'Shitsuke (Sustain)',
    shitsukeDescription1: 'Shitsuke (Sustain) represents the crown of the 5S methodology and implies turning rules into daily habits through self-discipline.',
    shitsukeDescription2: 'Without this phase, the workspace quickly returns to its original disorder.',
    shitsukeDescription3: 'Congratulations on successfully completing the simulation! Your space is now an example of an Industry 4.0 ecosystem.',
    simulationResetting: 'Simulation is resetting...'
  }
};

export function FiveSGame() {
  const { language } = useLanguage();
  const t = translations[language];
  const [currentPhase, setCurrentPhase] = useState(1); // 1: Sort, 2: Seiton, 3: Seiso, 4: Seiketsu, 5: Shitsuke
  const [phase3Tools, setPhase3Tools] = useState<SeisoTool[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleTransitionToPhase3 = (tools: SeisoTool[]) => {
    setPhase3Tools(tools);
    setCurrentPhase(3);
  };

  const handleTransitionToPhase4 = () => {
    setCurrentPhase(4);
  };

  const handleTransitionToPhase5 = () => {
    setCurrentPhase(5);
  };

  const handleReset = () => {
    setShowCelebration(true);
    setTimeout(() => {
      setCurrentPhase(1);
      setPhase3Tools([]);
      setShowCelebration(false);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80"
          alt="Workshop Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Game Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
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

        <div className="flex-1 p-4 sm:p-8">
          {currentPhase === 5 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-4xl"
            >
              {/* Phase 5 Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 text-center"
              >
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  {t.phase5Title}
                </h2>
                <p className="mt-4 text-lg text-gray-300 sm:text-xl">
                  {t.phase5Description}
                </p>
              </motion.div>

              {/* Final Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-2 gap-3 max-w-md mx-auto"
              >
                <Button
                  onClick={handleReset}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold"
                >
                  {t.resetSimulation}
                </Button>
                <Link href="/moduli">
                  <Button
                    variant="outline"
                    className="w-full border-slate-600 bg-slate-800/50 text-gray-300 hover:bg-slate-700 hover:text-white"
                  >
                    {t.backToModules}
                  </Button>
                </Link>
              </motion.div>

              {/* Phase 5 Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 rounded-lg bg-white/10 p-4 backdrop-blur-sm sm:p-6"
              >
                <h4 className="mb-3 text-lg font-semibold text-white sm:text-xl">
                  {t.shitsukeTitle}
                </h4>
                <ul className="list-inside list-disc space-y-2 text-sm text-gray-300 sm:text-base">
                  <li>{t.shitsukeDescription1}</li>
                  <li>{t.shitsukeDescription2}</li>
                  <li>{t.shitsukeDescription3}</li>
                </ul>
              </motion.div>

              {/* Celebration Effect */}
              {showCelebration && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="text-center"
                  >
                    <CheckCircle className="mx-auto h-24 w-24 text-green-400" />
                    <h3 className="mt-4 text-3xl font-bold text-white">
                      {t.congratulations}
                    </h3>
                    <p className="mt-2 text-xl text-gray-300">
                      {t.simulationResetting}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          ) : currentPhase === 4 ? (
            <SeiketsuStage tools={phase3Tools} onTransitionToPhase5={handleTransitionToPhase5} language={language} />
          ) : currentPhase === 3 ? (
            <SeisoStage tools={phase3Tools} onTransitionToPhase4={handleTransitionToPhase4} language={language} />
          ) : (
            <SortStage onTransitionToPhase3={handleTransitionToPhase3} language={language} />
          )}
        </div>
      </div>
    </div>
  );
}
