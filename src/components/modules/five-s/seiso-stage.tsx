'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

// Translations dictionary
const translations = {
  sr: {
    phaseTitle: 'Faza 3: Seiso (Očistiti)',
    phaseDescription: 'Očistite alate na Shadowboard-u pomoću pokreta miša ili prsta',
    counter: 'Očišćeno:',
    instructionsTitle: 'Uputstva:',
    instruction1: 'Pomerajte miš ili prst preko alata da biste ih očistili',
    instruction2: 'Pratite procenat očišćenosti na svakom alatu',
    instruction3: 'Kada alat dostigne 100%, prljavština nestaje',
    instruction4: 'Očistite sve 7 alata da biste završili fazu',
    successTitle: 'Svaka čast!',
    successDesc: 'Faza 3 (Seiso - Očistiti) je uspešno završena. Svi alati su sada čisti!',
    successButton: 'Pređi na Fazu 4: Seiketsu (Standardizovati)'
  },
  en: {
    phaseTitle: 'Phase 3: Seiso (Shine)',
    phaseDescription: 'Clean the tools on the Shadowboard using mouse or finger movements',
    counter: 'Cleaned:',
    instructionsTitle: 'Instructions:',
    instruction1: 'Move mouse or finger over tools to clean them',
    instruction2: 'Monitor the cleanliness percentage on each tool',
    instruction3: 'When a tool reaches 100%, dirt disappears',
    instruction4: 'Clean all 7 tools to complete the phase',
    successTitle: 'Well done!',
    successDesc: 'Phase 3 (Seiso - Shine) has been successfully completed. All tools are now clean!',
    successButton: 'Move to Phase 4: Seiketsu (Standardize)'
  }
};

export interface SeisoTool {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  shadowId: string;
  cleanliness: number; // 0 to 100
}

interface SeisoStageProps {
  tools: SeisoTool[];
  onTransitionToPhase4?: () => void;
  language: 'sr' | 'en';
}

export function SeisoStage({ tools: initialTools, onTransitionToPhase4, language }: SeisoStageProps) {
  const t = translations[language];
  const [tools, setTools] = useState<SeisoTool[]>(
    initialTools.map(tool => ({ ...tool, cleanliness: 0 }))
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMouseMove = useCallback((toolId: string) => {
    setTools(prev => prev.map(tool => {
      if (tool.id === toolId && tool.cleanliness < 100) {
        return { ...tool, cleanliness: Math.min(100, tool.cleanliness + 2) };
      }
      return tool;
    }));
    setErrorMessage(null);
  }, []);

  const handleTouchMove = useCallback((toolId: string) => {
    setTools(prev => prev.map(tool => {
      if (tool.id === toolId && tool.cleanliness < 100) {
        return { ...tool, cleanliness: Math.min(100, tool.cleanliness + 3) };
      }
      return tool;
    }));
    setErrorMessage(null);
  }, []);

  // Check if all tools are cleaned
  const cleanedCount = tools.filter(t => t.cleanliness >= 100).length;
  const isComplete = cleanedCount === tools.length;

  // Show success modal when all tools are cleaned
  useEffect(() => {
    if (isComplete && !showSuccessModal) {
      setShowSuccessModal(true);
    }
  }, [isComplete, showSuccessModal]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-7xl px-2 sm:px-4"
    >
      {/* Stage Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6 text-center sm:mb-8"
      >
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          {t.phaseTitle}
        </h2>
        <p className="mt-2 text-base text-gray-300 sm:text-lg">
          {t.phaseDescription}
        </p>
        
        {/* Progress Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm"
        >
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span className="text-sm font-semibold text-white sm:text-base">
            {t.counter} {cleanedCount} / {tools.length}
          </span>
        </motion.div>
      </motion.div>

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-red-900/50 p-3 backdrop-blur-sm"
        >
          <AlertCircle className="h-5 w-5 text-red-400" />
          <span className="text-sm font-semibold text-red-300">{errorMessage}</span>
        </motion.div>
      )}

      {/* Shadowboard Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className={`relative rounded-lg border-2 p-3 sm:p-4 ${
              tool.cleanliness >= 100
                ? 'border-green-400/50 bg-green-900/20'
                : 'border-white/40 bg-gray-900/40'
            }`}
            onMouseMove={() => handleMouseMove(tool.id)}
            onTouchMove={() => handleTouchMove(tool.id)}
          >
            {/* Tool Icon */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full ${
                tool.cleanliness >= 100 ? 'bg-green-500/20' : 'bg-white/10'
              }`}>
                <tool.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${
                  tool.cleanliness >= 100 ? 'text-green-400' : 'text-gray-400'
                }`} />
              </div>
              <p className={`mt-2 text-xs font-semibold sm:text-sm ${
                tool.cleanliness >= 100 ? 'text-green-300' : 'text-gray-300'
              }`}>
                {tool.name}
              </p>
            </div>

            {/* Brown Dirt Overlay */}
            <div
              className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
              style={{
                backgroundColor: 'rgba(139, 69, 19, 0.7)',
                opacity: tool.cleanliness >= 100 ? 0 : 1 - (tool.cleanliness / 100),
                transition: 'opacity 0.1s ease-out'
              }}
            >
              {/* Dirt texture pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1 left-1 w-2 h-2 bg-amber-900 rounded-full" />
                <div className="absolute top-3 right-2 w-3 h-3 bg-amber-800 rounded-full" />
                <div className="absolute bottom-2 left-3 w-2 h-2 bg-amber-900 rounded-full" />
                <div className="absolute bottom-4 right-1 w-2 h-2 bg-amber-800 rounded-full" />
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-amber-900 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-lg overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-green-500"
                initial={{ width: '0%' }}
                animate={{ width: `${tool.cleanliness}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Cleanliness Percentage */}
            <div className="absolute top-2 right-2 text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">
              {Math.round(tool.cleanliness)}%
            </div>

            {/* Checkmark when complete */}
            {tool.cleanliness >= 100 && (
              <div className="absolute top-2 left-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 rounded-lg bg-white/10 p-3 backdrop-blur-sm sm:mt-8 sm:p-4"
      >
        <h4 className="mb-2 text-base font-semibold text-white sm:text-lg">
          {t.instructionsTitle}
        </h4>
        <ul className="list-inside list-disc space-y-1 text-xs text-gray-300 sm:text-sm">
          <li>{t.instruction1}</li>
          <li>{t.instruction2}</li>
          <li>{t.instruction3}</li>
          <li>{t.instruction4}</li>
        </ul>
      </motion.div>

      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 25 }}
            className="mx-4 max-w-md rounded-2xl bg-gradient-to-br from-green-900/90 to-blue-900/90 p-6 backdrop-blur-lg border border-green-500/30 shadow-2xl"
          >
            <div className="mb-4 flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="rounded-full bg-green-500/20 p-4"
              >
                <CheckCircle className="h-12 w-12 text-green-400" />
              </motion.div>
            </div>
            <h3 className="mb-3 text-center text-2xl font-bold text-white">
              {t.successTitle}
            </h3>
            <p className="mb-6 text-center text-gray-300">
              {t.successDesc}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowSuccessModal(false);
                if (onTransitionToPhase4) {
                  onTransitionToPhase4();
                }
              }}
              className="w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-green-500/25"
            >
              {t.successButton}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
