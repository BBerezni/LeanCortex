'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, ClipboardCheck, Shield, Clock, Tag } from 'lucide-react';
import { SeisoTool } from './seiso-stage';

// Translations dictionary
const translations = {
  sr: {
    phaseTitle: 'Faza 4: Seiketsu (Standardizovati)',
    phaseDescription: 'Kreirajte vizuelne standarde i pravila za održavanje radnog mesta.',
    counter: 'Aktivno:',
    shadowboardTitle: 'Finalni Shadowboard (Reference)',
    shadowboardDesc: 'Ovo je vaš savršeno organizovan i očišćen radni prostor.',
    formTitle: 'Formular Standardizacije',
    formDesc: 'Aktivirajte pravila da biste kreirali zvanični standard.',
    rule1: 'Svaki alat mora biti vraćen na svoju siluetu odmah nakon korišćenja.',
    rule2: 'Čišćenje i inspekcija se vrše svakog dana na kraju smene (5 minuta).',
    rule3: 'Crvene etikete se proveravaju svakog petka.',
    rule4: 'Svi standardi se vizuelno prikazuju na radnom mestu.',
    activeLabel: 'AKTIVNO',
    inactiveLabel: 'NEAKTIVNO',
    standardTitle: 'Zvanični Standard',
    standardComplete: 'Sva pravila su aktivirana. Standard je uspostavljen!',
    standardIncomplete: ' pravila još uvek treba aktivirati.',
    instructionsTitle: 'Uputstva:',
    instruction1: 'Seiketsu osigurava da se prve tri faze (Sortiraj, Organizuj, Očisti) sprovode svakodnevno.',
    instruction2: 'Standardizacija podrazumeva kreiranje jasnih vizuelnih uputstava i check-lista.',
    instruction3: 'Aktivirajte sva pravila kako biste generisali zvanični 5S sertifikat radnog mesta.',
    instruction4: 'Kliknite na pravilo da biste ga promenili iz NEAKTIVNO u AKTIVNO stanje.',
    successTitle: 'Faza 4 Uspešno Završena!',
    successDesc: 'Spremni ste za održavanje standarda (Shitsuke).',
    successButton: 'Bravo! Pređi na poslednji korak: Shitsuke (Održavati)'
  },
  en: {
    phaseTitle: 'Phase 4: Seiketsu (Standardize)',
    phaseDescription: 'Create visual standards and rules for maintaining the workplace.',
    counter: 'Active:',
    shadowboardTitle: 'Final Shadowboard (Reference)',
    shadowboardDesc: 'This is your perfectly organized and cleaned workspace.',
    formTitle: 'Standardization Form',
    formDesc: 'Activate rules to create the official standard.',
    rule1: 'Every tool must be returned to its silhouette immediately after use.',
    rule2: 'Cleaning and inspection are performed daily at the end of shift (5 minutes).',
    rule3: 'Red tags are checked every Friday.',
    rule4: 'All standards are visually displayed at the workplace.',
    activeLabel: 'ACTIVE',
    inactiveLabel: 'INACTIVE',
    standardTitle: 'Official Standard',
    standardComplete: 'All rules have been activated. Standard is established!',
    standardIncomplete: ' rules still need to be activated.',
    instructionsTitle: 'Instructions:',
    instruction1: 'Seiketsu ensures that the first three phases (Sort, Set in Order, Shine) are performed daily.',
    instruction2: 'Standardization involves creating clear visual instructions and checklists.',
    instruction3: 'Activate all rules to generate the official 5S workplace certificate.',
    instruction4: 'Click on a rule to change it from INACTIVE to ACTIVE state.',
    successTitle: 'Phase 4 Successfully Completed!',
    successDesc: 'You are ready for sustaining the standard (Shitsuke).',
    successButton: 'Great! Move to the final step: Shitsuke (Sustain)'
  }
};

interface StandardizationRule {
  id: string;
  text: string;
  icon: React.ElementType;
  isActive: boolean;
}

const getStandardizationRules = (language: 'sr' | 'en'): StandardizationRule[] => {
  const t = translations[language];
  return [
    { 
      id: '1', 
      text: t.rule1, 
      icon: ClipboardCheck, 
      isActive: false 
    },
    { 
      id: '2', 
      text: t.rule2, 
      icon: Clock, 
      isActive: false 
    },
    { 
      id: '3', 
      text: t.rule3, 
      icon: Tag, 
      isActive: false 
    },
    { 
      id: '4', 
      text: t.rule4, 
      icon: Shield, 
      isActive: false 
    },
  ];
};

interface SeiketsuStageProps {
  tools: SeisoTool[];
  onTransitionToPhase5?: () => void;
  language: 'sr' | 'en';
}

export function SeiketsuStage({ tools, onTransitionToPhase5, language }: SeiketsuStageProps) {
  const t = translations[language];
  const [rules, setRules] = useState<StandardizationRule[]>(getStandardizationRules(language));
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleRuleToggle = useCallback((ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  }, []);

  // Check if all rules are activated
  const activeCount = rules.filter(r => r.isActive).length;
  const isComplete = activeCount === rules.length;

  // Show success modal when all rules are activated
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
            {t.counter} {activeCount} / {rules.length}
          </span>
        </motion.div>
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Reference Shadowboard */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="order-2 relative z-10 rounded-xl border-2 border-green-400/50 bg-green-900/20 p-4 backdrop-blur-sm lg:order-1 sm:p-6"
        >
          <h3 className="mb-3 text-xl font-semibold text-green-300 sm:mb-4 sm:text-2xl">
            {t.shadowboardTitle}
          </h3>
          <p className="mb-4 text-xs text-gray-300 sm:mb-6 sm:text-sm">
            {t.shadowboardDesc}
          </p>
          
          {/* Shadowboard Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="relative rounded-lg border-2 border-green-400/50 bg-green-900/30 p-3 sm:p-4"
              >
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-green-500/20">
                    <tool.icon className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-green-300 sm:text-sm">
                    {tool.name}
                  </p>
                </div>
                <div className="absolute top-2 left-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Standardization Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="order-1 relative z-10 rounded-xl border-2 border-blue-400/50 bg-blue-900/20 p-4 backdrop-blur-sm lg:order-2 sm:p-6"
        >
          <h3 className="mb-3 text-xl font-semibold text-blue-300 sm:mb-4 sm:text-2xl">
            {t.formTitle}
          </h3>
          <p className="mb-4 text-xs text-gray-300 sm:mb-6 sm:text-sm">
            {t.formDesc}
          </p>
          
          {/* Rules List */}
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                onClick={() => handleRuleToggle(rule.id)}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  rule.isActive
                    ? 'border-green-400/50 bg-green-900/30'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 rounded-full p-2 ${
                    rule.isActive ? 'bg-green-500/20' : 'bg-white/10'
                  }`}>
                    <rule.icon className={`h-5 w-5 ${
                      rule.isActive ? 'text-green-400' : 'text-gray-300'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${
                      rule.isActive ? 'text-green-300' : 'text-white'
                    }`}>
                      {rule.text}
                    </p>
                    <div className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      rule.isActive
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {rule.isActive ? t.activeLabel : t.inactiveLabel}
                    </div>
                  </div>
                  {rule.isActive && (
                    <CheckCircle className="mt-1 h-5 w-5 text-green-400" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Official Standard Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className={`mt-6 rounded-lg border-2 p-4 ${
              isComplete
                ? 'border-green-400/50 bg-green-900/30'
                : 'border-dashed border-gray-500/50 bg-gray-900/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <Shield className={`h-6 w-6 ${
                isComplete ? 'text-green-400' : 'text-gray-400'
              }`} />
              <div>
                <h4 className={`font-semibold ${
                  isComplete ? 'text-green-300' : 'text-gray-300'
                }`}>
                  {t.standardTitle}
                </h4>
                <p className="text-xs text-gray-400">
                  {isComplete 
                    ? t.standardComplete
                    : `${rules.length - activeCount}${t.standardIncomplete}`
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
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
                onTransitionToPhase5?.();
              }}
              className="w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-green-500/25"
            >
              {t.successButton}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
