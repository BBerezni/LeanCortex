'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Award, ShieldCheck, Medal, Sparkles } from 'lucide-react';
import { SortStage } from './sort-stage';
import { SeisoStage, SeisoTool } from './seiso-stage';
import { SeiketsuStage } from './seiketsu-stage';

export function FiveSGame() {
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
                <span className="text-sm">Nazad na module</span>
              </motion.button>
            </Link>
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-white sm:text-4xl">
                Igra 5S Metodologije
              </h1>
              <p className="mt-2 text-sm text-gray-300 sm:text-lg">
                Naučite i vežbajte 5S metodologiju kroz interaktivne faze
              </p>
            </div>
            <div className="w-24" /> {/* Spacer for center alignment */}
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
                  Faza 5: Shitsuke (Održavati)
                </h2>
                <p className="mt-4 text-lg text-gray-300 sm:text-xl">
                  Čestitamo! Uspešno ste prošli kroz proces Sortiranja, Organizacije, Čišćenja i Standardizacije.
                </p>
              </motion.div>

              {/* 5S Certificate */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8 rounded-2xl border-4 border-green-500/50 bg-gradient-to-br from-green-900/80 to-blue-900/80 p-6 backdrop-blur-lg shadow-2xl sm:p-8"
              >
                <div className="flex flex-col items-center">
                  {/* Certificate Header */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: 'spring' }}
                    className="mb-6 flex items-center gap-4"
                  >
                    <div className="rounded-full bg-yellow-500/20 p-4">
                      <Award className="h-12 w-12 text-yellow-400" />
                    </div>
                    <div className="rounded-full bg-green-500/20 p-4">
                      <ShieldCheck className="h-12 w-12 text-green-400" />
                    </div>
                    <div className="rounded-full bg-blue-500/20 p-4">
                      <Medal className="h-12 w-12 text-blue-400" />
                    </div>
                  </motion.div>

                  {/* Certificate Title */}
                  <h3 className="mb-6 text-center text-2xl font-bold text-yellow-300 sm:text-3xl">
                    5S Sertifikat Radne Stanice
                  </h3>

                  {/* Certificate Content */}
                  <div className="w-full space-y-4 rounded-xl bg-white/5 p-6 border border-white/10">
                    <div className="flex justify-between border-b border-white/20 pb-3">
                      <span className="text-gray-300">Projekat:</span>
                      <span className="font-semibold text-white">LeanCortex Radna Stanica</span>
                    </div>
                    <div className="flex justify-between border-b border-white/20 pb-3">
                      <span className="text-gray-300">Status:</span>
                      <span className="font-semibold text-green-300">100% Optimizovano, Očišćeno i Standardizovano</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Sertifikat izdat za:</span>
                      <span className="font-semibold text-white">Korisnika / Polaznika</span>
                    </div>
                  </div>

                  {/* Certificate Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-green-500/20 px-6 py-3 border border-yellow-500/30"
                  >
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold text-yellow-300">Industry 4.0 Ekosistem</span>
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Final Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col gap-4 sm:flex-row sm:justify-center"
              >
                <Link href="/moduli">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-green-500/25 text-lg sm:w-auto"
                  >
                    Završi obuku
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="w-full rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:bg-white/20 text-lg sm:w-auto"
                >
                  Pokreni ponovo
                </motion.button>
              </motion.div>

              {/* Phase 5 Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 rounded-lg bg-white/10 p-4 backdrop-blur-sm sm:p-6"
              >
                <h4 className="mb-3 text-lg font-semibold text-white sm:text-xl">
                  Shitsuke (Održavanje)
                </h4>
                <ul className="list-inside list-disc space-y-2 text-sm text-gray-300 sm:text-base">
                  <li>Shitsuke (Održavanje) predstavlja krunu 5S metodologije i podrazumeva pretvaranje pravila u svakodnevnu naviku kroz samodisciplinu.</li>
                  <li>Bez ove faze, radni prostor se brzo vraća u prvobitni nered.</li>
                  <li>Čestitamo na uspešno završenoj simulaciji! Vaš prostor je sada primer Industry 4.0 ekosistema.</li>
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
                    <Sparkles className="mx-auto h-24 w-24 text-yellow-400" />
                    <h3 className="mt-4 text-3xl font-bold text-white">
                      Čestitamo!
                    </h3>
                    <p className="mt-2 text-xl text-gray-300">
                      Simulacija se resetuje...
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          ) : currentPhase === 4 ? (
            <SeiketsuStage tools={phase3Tools} onTransitionToPhase5={handleTransitionToPhase5} />
          ) : currentPhase === 3 ? (
            <SeisoStage tools={phase3Tools} onTransitionToPhase4={handleTransitionToPhase4} />
          ) : (
            <SortStage onTransitionToPhase3={handleTransitionToPhase3} />
          )}
        </div>
      </div>
    </div>
  );
}
