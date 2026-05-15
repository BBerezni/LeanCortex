'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SortStage } from './sort-stage';
import { SeisoStage, SeisoTool } from './seiso-stage';

export function FiveSGame() {
  const [currentPhase, setCurrentPhase] = useState(1); // 1: Sort, 2: Seiton, 3: Seiso
  const [phase3Tools, setPhase3Tools] = useState<SeisoTool[]>([]);

  const handleTransitionToPhase3 = (tools: SeisoTool[]) => {
    setPhase3Tools(tools);
    setCurrentPhase(3);
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
                <span className="text-sm">Nazad</span>
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
          {currentPhase === 3 ? (
            <SeisoStage tools={phase3Tools} />
          ) : (
            <SortStage onTransitionToPhase3={handleTransitionToPhase3} />
          )}
        </div>
      </div>
    </div>
  );
}
