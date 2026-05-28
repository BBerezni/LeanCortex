'use client';

import { useState, useRef, useEffect } from 'react';
import { useAnimation } from 'framer-motion';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

// Product types configuration
type ProductType = 'pcb' | 'cpu' | 'connector';

// Static baseline production sequence - immune to React StrictMode re-renders
const BASE_PRODUCTION_SEQUENCE = [
  { type: 'pcb' as const },
  { type: 'cpu' as const },
  { type: 'connector' as const }
];

// Language dictionary
const translations = {
  sr: {
    backToModules: 'Nazad na module',
    title: 'Modul: Poka Yoke (Sprečavanje grešaka)',
    description: 'Naučite i primenite principe sprečavanja grešaka kroz interaktivnu montažu elektronskih komponenti.',
    step1Title: 'KORAK 1: Nezaštićena montaža',
    step2Title: 'KORAK 2: Izbor rešenja',
    step3Title: 'KORAK 3: Validacija sa Poka-Yoke',
    defectUpsideDown: 'Škart! Proizvod je montiran naopako jer ležište nema zaštitu!',
    successAssembly: 'Uspela montaža!',
    pokaYokeBlock: 'Geometrijska blokada! Poka-Yoke ležište fizički onemogućava netačnu orijentaciju (0€ gubitka).',
    defectScore: 'Greške smanjene:',
    batchProgress: 'Napredak serije:',
    basePlate: 'Osnovna ploča',
    doubleClickRotate: 'Dvoklik za rotaciju',
    designSolution: 'Dizajniraj rešenje',
    visualLabel: 'Vizuelna nalepnica',
    visualLabelFeedback: 'Nalepnice ne sprečavaju nepažnju! Radnik i dalje može pogrešiti.',
    physicalPin: 'Fizička modifikacija oblika',
    tryAgain: 'Pokušaj ponovo',
    batchComplete: 'Serija završena!',
    allComplete: 'Greške smanjene: 100% | Ukupno ušteđeno: 150€ po seriji',
    pcb: 'PCB pločica',
    cpu: 'CPU procesor',
    connector: 'Konektor',
    dragToAssemble: 'Prevucite komponentu na osnovnu ploču',
    dragToAssembleEn: 'Drag component to base plate',
    financialLoss: 'Finansijski gubitak (Škart): +50€',
    errors: 'Greške:',
    copqCost: 'Trošak lošeg kvaliteta:',
    moneySaved: 'Ušteđena sredstva:',
    geometricBlockade: 'Geometrijska blokada! Poka-Yoke ležište fizički onemogućava netačnu orijentaciju (0€ gubitka).',
    copqModalTitle: 'Izveštaj o troškovima lošeg kvaliteta / COPQ Analysis',
    totalDefects: 'Broj škarta:',
    financialLossTotal: 'Finansijski gubitak:',
    managementAlert: 'Stop! Tradicionalni proces sklapanja uzrokuje visoke troškove zbog nepažnje radnika. Kliknite ispod da pokrenete inženjerski redizajn radnog mesta.',
    proceedToDesign: 'Pređite na dizajniranje rešenja',
    potentialCostPrevented: 'Sprečen potencijalni trošak:',
    eduPanelTitle: 'Uputstvo za modul: Poka-Yoke & COPQ (Cost of Poor Quality)',
    eduPhase1Title: 'Faza 1: Tradicionalna proizvodnja',
    eduPhase1Text: 'Sklapate komponente na osnovu vizuelne procene. Obratite pažnju na orijentaciju delova (rotaciju). Svaka pogrešno okrenuta komponenta stvara škart i direktno generiše trošak lošeg kvaliteta (**COPQ** — *Cost of Poor Quality*) od 50€ po delu.',
    eduPhase2Title: 'Faza 2: Analiza i Poka-Yoke dizajn',
    eduPhase2Text: 'Analizirate nastale greške i birate adekvatno tehničko rešenje (geometrijsko ograničenje/osiguranje) koje fizički onemogućava pogrešno spajanje.',
    eduPhase3Title: 'Faza 3: Optimizovana proizvodnja',
    eduPhase3Text: 'Primenom izabranog Poka-Yoke rešenja, sistem vam fizički ne dozvoljava da pogrešite. Uspešnim sklapanjem dokazujete eliminaciju škarta, a prethodno izgubljeni novac pretvarate u **Ušteđena sredstva**.',
  },
  en: {
    backToModules: 'Back to Modules',
    title: 'Module: Poka Yoke (Error Proofing)',
    description: 'Learn and apply error proofing principles through interactive electronic component assembly.',
    step1Title: 'STEP 1: Unprotected Assembly',
    step2Title: 'STEP 2: Choose Solution',
    step3Title: 'STEP 3: Poka-Yoke Validation',
    defectUpsideDown: 'Defect! Product mounted upside down because base plate has no protection!',
    successAssembly: 'Successful assembly!',
    pokaYokeBlock: 'Geometric blockage! Poka-Yoke socket physically prevents incorrect orientation (0€ loss).',
    defectScore: 'Defects Reduced:',
    batchProgress: 'Batch Progress:',
    basePlate: 'Base Plate',
    doubleClickRotate: 'Double-click to rotate',
    designSolution: 'Design Solution',
    visualLabel: 'Visual Label',
    visualLabelFeedback: 'Labels don\'t prevent carelessness! Workers can still make mistakes.',
    physicalPin: 'Physical Shape Modification',
    tryAgain: 'Try Again',
    batchComplete: 'Batch Complete!',
    allComplete: 'Defects Reduced: 100% | Total Saved: 150€ per batch',
    pcb: 'PCB Board',
    cpu: 'CPU Processor',
    connector: 'Connector',
    dragToAssemble: 'Prevucite komponentu na osnovnu ploču',
    dragToAssembleEn: 'Drag component to base plate',
    financialLoss: 'Financial Loss (Scrap): +50€',
    errors: 'Errors:',
    copqCost: 'Cost of Poor Quality:',
    moneySaved: 'Funds Saved:',
    geometricBlockade: 'Geometric blockage! Poka-Yoke socket physically prevents incorrect orientation (0€ loss).',
    copqModalTitle: 'Cost of Poor Quality Report / COPQ Analysis',
    totalDefects: 'Total Defects:',
    financialLossTotal: 'Financial Loss:',
    managementAlert: 'Stop! Traditional assembly process causes high costs due to worker carelessness. Click below to initiate engineering redesign of the workstation.',
    proceedToDesign: 'Proceed to Solution Design',
    potentialCostPrevented: 'Potential Cost Prevented:',
    eduPanelTitle: 'Module Instructions: Poka-Yoke & COPQ (Cost of Poor Quality)',
    eduPhase1Title: 'Phase 1: Traditional Production',
    eduPhase1Text: 'You assemble components based on visual assessment. Pay close attention to the orientation of the parts (rotation). Each incorrectly oriented component creates scrap and directly generates a cost of poor quality (**COPQ** — *Cost of Poor Quality*) of 50€ per part.',
    eduPhase2Title: 'Phase 2: Analysis & Poka-Yoke Design',
    eduPhase2Text: 'You analyze the resulting errors and choose an appropriate technical solution (geometric constraint/safeguard) that physically prevents incorrect assembly.',
    eduPhase3Title: 'Phase 3: Optimized Production',
    eduPhase3Text: 'By applying the chosen Poka-Yoke solution, the system physically prevents you from making a mistake. Through successful assembly, you prove the elimination of scrap and convert previously lost money into **Saved Funds**.',
  }
};

interface PokaYokeGameProps {
  language?: 'sr' | 'en';
}

export function PokaYokeGame({ language: propLanguage }: PokaYokeGameProps = {}) {
  const { language: contextLanguage } = useLanguage();
  const language = propLanguage || contextLanguage;
  const t = translations[language];
  
  // Game state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [defectCount, setDefectCount] = useState(0);
  const [defectsReduced, setDefectsReduced] = useState(0);
  const [showFeedback, setShowFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [selectedSolution, setSelectedSolution] = useState<null | 'label' | 'pin'>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copqCost, setCopqCost] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [showCopqModal, setShowCopqModal] = useState(false);
  const [step1CopqLoss, setStep1CopqLoss] = useState(0);
  const [step1LockedLoss, setStep1LockedLoss] = useState(0);
  const [lockedSavings, setLockedSavings] = useState(0);
  
  // Batch processing state
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0); // 0, 1, 2 for 3 products
  const [batchRotations, setBatchRotations] = useState<number[]>([]); // Track rotations for current batch
  
  // Refs
  const basePlateRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  // Initialize batch with random rotations using static sequence
  const initializeBatch = () => {
    // Generate random rotations for each product in the static sequence
    const rotations = BASE_PRODUCTION_SEQUENCE.map(() => (Math.random() > 0.5 ? 180 : 0) as number);
    
    // Safeguard: if all 3 are 0, force one random index to 180
    if (rotations.every(r => r === 0)) {
      const randomIndex = Math.floor(Math.random() * 3);
      (rotations as number[])[randomIndex] = 180;
    }
    
    setBatchRotations(rotations as number[]);
    return rotations as number[];
  };
  
  // Initialize batch on mount
  useEffect(() => {
    initializeBatch();
    setCurrentBatchIndex(() => 0);
  }, []);
  
  // Derived state - current product type and rotation from index
  const currentProductType = BASE_PRODUCTION_SEQUENCE[currentBatchIndex]?.type;
  const currentProductRotation = batchRotations[currentBatchIndex] ?? 0;
  
  const handleFeedback = (type: 'success' | 'error' | 'info', message: string) => {
    setShowFeedback({ type, message });
    setTimeout(() => setShowFeedback(null), 3000);
  };
  
  const handleDoubleClick = () => {
    const newRotation = currentProductRotation === 0 ? 180 : 0;
    const updatedRotations = [...batchRotations];
    updatedRotations[currentBatchIndex] = newRotation;
    setBatchRotations(updatedRotations);
    controls.start({ rotate: newRotation });
  };
  
  const handleDragEnd = (event: any, info: any) => {
    // Robust coordinate offset check - dragged upward into socket area
    const draggedUpward = info.offset.y < -50;
    
    if (draggedUpward) {
      if (currentStep === 1) {
        // Step 1: Unprotected assembly - accepts both orientations
        if (currentProductRotation === 180) {
          // Upside down - defect with financial impact
          setDefectCount(prev => prev + 1);
          setCopqCost(prev => prev + 50);
          handleFeedback('error', t.financialLoss);
        } else {
          // Correct orientation - success
          handleFeedback('success', t.successAssembly);
        }
        // Reset and advance to next component
        controls.start({ x: 0, y: 0 });
        setTimeout(() => {
          if (currentBatchIndex < 2) {
            setCurrentBatchIndex(prev => prev + 1);
          } else {
            // Batch complete - save Step 1 COPQ loss and show COPQ modal
            setStep1CopqLoss(copqCost);
            // Freeze the final accumulated loss into step1LockedLoss
            setStep1LockedLoss(defectCount * 50);
            setShowCopqModal(true);
          }
        }, 500);
      } else if (currentStep === 3) {
        // Step 3: Poka-Yoke protected
        if (currentProductRotation === 180) {
          // Upside down - Poka-Yoke blocks it with geometric feedback
          handleFeedback('error', t.geometricBlockade);
          controls.start({ x: 0, y: 0 });
          // Do NOT advance index - user must rotate correctly
        } else {
          // Correct orientation - success
          handleFeedback('success', t.successAssembly);
          controls.start({ x: 0, y: 0 });
          setTimeout(() => {
            if (currentBatchIndex < 2) {
              setCurrentBatchIndex(prev => prev + 1);
            } else {
              // All complete - 100% defects reduced
              setIsSuccess(true);
              setDefectsReduced(100);
              handleFeedback('success', t.allComplete);
            }
          }, 500);
        }
      }
    } else {
      // Dropped outside - animate back to origin
      controls.start({ x: 0, y: 0 });
    }
  };
  
  const handleSolutionSelect = (solution: 'label' | 'pin') => {
    if (solution === 'label') {
      handleFeedback('info', t.visualLabelFeedback);
    } else {
      setSelectedSolution('pin');
      // Reset for step 3 with COPQ tracking
      setCurrentBatchIndex(() => 0);
      setCopqCost(0);
      // Set money saved to lockedSavings (or 150€ if 0 errors)
      setMoneySaved(lockedSavings > 0 ? lockedSavings : 150);
      // Reset batch rotations for Step 3
      setBatchRotations([]);
      controls.start({ x: 0, y: 0, rotate: 0 });
      setTimeout(() => {
        initializeBatch();
        setCurrentStep(3);
      }, 100);
    }
  };
  
  const handleDesignSolution = () => {
    // Freeze the baseline loss when transitioning from Step 1 to Step 2
    setLockedSavings(defectCount * 50);
    setShowCopqModal(false);
    setCurrentStep(2);
  };
  
  const handleReset = () => {
    setCurrentStep(1);
    setDefectCount(0);
    setDefectsReduced(0);
    setCurrentBatchIndex(() => 0);
    setSelectedSolution(null);
    setIsSuccess(false);
    setCopqCost(0);
    setMoneySaved(0);
    setShowCopqModal(false);
    setStep1CopqLoss(0);
    setStep1LockedLoss(0);
    setLockedSavings(0);
    setBatchRotations([]);
    controls.start({ x: 0, y: 0, rotate: 0 });
    setTimeout(() => {
      initializeBatch();
    }, 100);
  };

  // Render CAD-style product component based on type
  const renderProduct = (product: ProductType) => {
    switch (product) {
      case 'pcb':
        return (
          <motion.div
            key={`pcb-${currentBatchIndex}`}
            ref={componentRef}
            drag
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            onDoubleClick={handleDoubleClick}
            animate={controls}
            initial={{ x: 0, y: 0, rotate: currentProductRotation }}
            className="w-36 h-20 cursor-grab active:cursor-grabbing relative shadow-xl"
            style={{ width: '144px', height: '80px' }}
          >
            <svg width="144" height="80" viewBox="0 0 144 80">
              {/* Dark green matte fiberglass base */}
              <rect x="2" y="2" width="140" height="76" fill="#1a472a" stroke="#2d5a3d" strokeWidth="2" rx="2" />
              
              {/* Copper trace pattern - grid lines */}
              <g stroke="#b87333" strokeWidth="0.5" opacity="0.6">
                <line x1="10" y1="10" x2="10" y2="70" />
                <line x1="20" y1="10" x2="20" y2="70" />
                <line x1="30" y1="10" x2="30" y2="70" />
                <line x1="40" y1="10" x2="40" y2="70" />
                <line x1="50" y1="10" x2="50" y2="70" />
                <line x1="60" y1="10" x2="60" y2="70" />
                <line x1="70" y1="10" x2="70" y2="70" />
                <line x1="80" y1="10" x2="80" y2="70" />
                <line x1="90" y1="10" x2="90" y2="70" />
                <line x1="100" y1="10" x2="100" y2="70" />
                <line x1="110" y1="10" x2="110" y2="70" />
                <line x1="120" y1="10" x2="120" y2="70" />
                <line x1="130" y1="10" x2="130" y2="70" />
                <line x1="10" y1="20" x2="134" y2="20" />
                <line x1="10" y1="30" x2="134" y2="30" />
                <line x1="10" y1="40" x2="134" y2="40" />
                <line x1="10" y1="50" x2="134" y2="50" />
                <line x1="10" y1="60" x2="134" y2="60" />
              </g>
              
              {/* Gold contact fingers on bottom edge only */}
              <g fill="#ffd700">
                <rect x="12" y="72" width="4" height="6" rx="0.5" />
                <rect x="20" y="72" width="4" height="6" rx="0.5" />
                <rect x="28" y="72" width="4" height="6" rx="0.5" />
                <rect x="36" y="72" width="4" height="6" rx="0.5" />
                <rect x="44" y="72" width="4" height="6" rx="0.5" />
                <rect x="52" y="72" width="4" height="6" rx="0.5" />
                <rect x="60" y="72" width="4" height="6" rx="0.5" />
                <rect x="68" y="72" width="4" height="6" rx="0.5" />
                <rect x="76" y="72" width="4" height="6" rx="0.5" />
                <rect x="84" y="72" width="4" height="6" rx="0.5" />
                <rect x="92" y="72" width="4" height="6" rx="0.5" />
                <rect x="100" y="72" width="4" height="6" rx="0.5" />
                <rect x="108" y="72" width="4" height="6" rx="0.5" />
                <rect x="116" y="72" width="4" height="6" rx="0.5" />
                <rect x="124" y="72" width="4" height="6" rx="0.5" />
              </g>
              
              {/* Mounting holes */}
              <circle cx="8" cy="8" r="3" fill="#0d2818" stroke="#2d5a3d" strokeWidth="1" />
              <circle cx="136" cy="8" r="3" fill="#0d2818" stroke="#2d5a3d" strokeWidth="1" />
              <circle cx="8" cy="72" r="3" fill="#0d2818" stroke="#2d5a3d" strokeWidth="1" />
              <circle cx="136" cy="72" r="3" fill="#0d2818" stroke="#2d5a3d" strokeWidth="1" />
            </svg>
          </motion.div>
        );
      case 'cpu':
        return (
          <motion.div
            key={`cpu-${currentBatchIndex}`}
            ref={componentRef}
            drag
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            onDoubleClick={handleDoubleClick}
            animate={controls}
            initial={{ x: 0, y: 0, rotate: currentProductRotation }}
            className="cursor-grab active:cursor-grabbing relative shadow-xl"
            style={{ width: '80px', height: '80px' }}
          >
            <svg width="80" height="80" viewBox="0 0 80 80">
              {/* Dark slate base with chamfered top-left corner */}
              <path d="M 12 0 L 80 0 L 80 80 L 0 80 L 0 12 L 12 12 Z" fill="#2c3e50" stroke="#34495e" strokeWidth="2" />
              
              {/* Metallic pin-grid array matrix - pattern of tiny dots */}
              <g fill="#7f8c8d">
                {[...Array(8)].map((_, row) =>
                  [...Array(8)].map((_, col) => (
                    <circle
                      key={`${row}-${col}`}
                      cx={16 + col * 6}
                      cy={16 + row * 6}
                      r="1.5"
                    />
                  ))
                )}
              </g>
              
              {/* Central die area */}
              <rect x="24" y="24" width="32" height="32" fill="#1a252f" stroke="#34495e" strokeWidth="1" rx="2" />
              
              {/* Chamfered corner highlight */}
              <path d="M 0 12 L 12 12 L 12 0" fill="none" stroke="#5dade2" strokeWidth="2" />
              
              {/* Orientation marker */}
              <circle cx="6" cy="6" r="2" fill="#e74c3c" />
            </svg>
          </motion.div>
        );
      case 'connector':
        return (
          <motion.div
            key={`connector-${currentBatchIndex}`}
            ref={componentRef}
            drag
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            onDoubleClick={handleDoubleClick}
            animate={controls}
            initial={{ x: 0, y: 0, rotate: currentProductRotation }}
            className="cursor-grab active:cursor-grabbing relative shadow-xl"
            style={{ width: '96px', height: '48px' }}
          >
            <svg width="96" height="48" viewBox="0 0 96 48">
              {/* Heavy industrial plastic shroud - textured dark charcoal grey - HORIZONTAL */}
              <rect x="4" y="4" width="88" height="40" fill="#2c2c2c" stroke="#404040" strokeWidth="2" rx="3" />
              
              {/* Texture pattern */}
              <g fill="#3d3d3d" opacity="0.5">
                <rect x="8" y="8" width="2" height="2" />
                <rect x="14" y="8" width="2" height="2" />
                <rect x="20" y="8" width="2" height="2" />
                <rect x="26" y="8" width="2" height="2" />
                <rect x="32" y="8" width="2" height="2" />
                <rect x="38" y="8" width="2" height="2" />
                <rect x="44" y="8" width="2" height="2" />
                <rect x="50" y="8" width="2" height="2" />
                <rect x="56" y="8" width="2" height="2" />
                <rect x="62" y="8" width="2" height="2" />
                <rect x="68" y="8" width="2" height="2" />
                <rect x="74" y="8" width="2" height="2" />
                <rect x="80" y="8" width="2" height="2" />
                <rect x="8" y="14" width="2" height="2" />
                <rect x="14" y="14" width="2" height="2" />
                <rect x="20" y="14" width="2" height="2" />
                <rect x="26" y="14" width="2" height="2" />
                <rect x="32" y="14" width="2" height="2" />
                <rect x="38" y="14" width="2" height="2" />
                <rect x="44" y="14" width="2" height="2" />
                <rect x="50" y="14" width="2" height="2" />
                <rect x="56" y="14" width="2" height="2" />
                <rect x="62" y="14" width="2" height="2" />
                <rect x="68" y="14" width="2" height="2" />
                <rect x="74" y="14" width="2" height="2" />
                <rect x="80" y="14" width="2" height="2" />
                <rect x="8" y="32" width="2" height="2" />
                <rect x="14" y="32" width="2" height="2" />
                <rect x="20" y="32" width="2" height="2" />
                <rect x="26" y="32" width="2" height="2" />
                <rect x="32" y="32" width="2" height="2" />
                <rect x="38" y="32" width="2" height="2" />
                <rect x="44" y="32" width="2" height="2" />
                <rect x="50" y="32" width="2" height="2" />
                <rect x="56" y="32" width="2" height="2" />
                <rect x="62" y="32" width="2" height="2" />
                <rect x="68" y="32" width="2" height="2" />
                <rect x="74" y="32" width="2" height="2" />
                <rect x="80" y="32" width="2" height="2" />
              </g>
              
              {/* Asymmetrical keying rail/protrusion on TOP side (rotated 90 degrees) */}
              <rect x="30" y="0" width="36" height="8" fill="#1a1a1a" stroke="#404040" strokeWidth="1" rx="2" />
              <rect x="40" y="0" width="16" height="6" fill="#0d0d0d" rx="1" />
              
              {/* Contact pins inside */}
              <g fill="#ffd700">
                <rect x="30" y="12" width="8" height="3" rx="0.5" />
                <rect x="30" y="18" width="8" height="3" rx="0.5" />
                <rect x="30" y="24" width="8" height="3" rx="0.5" />
                <rect x="30" y="30" width="8" height="3" rx="0.5" />
                <rect x="30" y="36" width="8" height="3" rx="0.5" />
              </g>
              
              {/* Left and right housing details */}
              <rect x="8" y="8" width="4" height="32" fill="#1a1a1a" rx="1" />
              <rect x="84" y="8" width="4" height="32" fill="#1a1a1a" rx="1" />
            </svg>
          </motion.div>
        );
    }
  };

  // Render CAD-style base plate with dynamic inner negative outline socket
  const renderBasePlate = () => {
    // Use currentProductType directly derived from index
    const product = currentProductType;
    
    if (currentStep === 1) {
      // Step 1: Generic flat socket - no physical keying
      return (
        <div 
          ref={basePlateRef}
          className="relative"
          style={{ width: '200px', height: '160px' }}
        >
          <svg width="200" height="160" viewBox="0 0 200 160">
            {/* Technical housing base */}
            <rect x="10" y="10" width="180" height="140" fill="#1e293b" stroke="#475569" strokeWidth="3" rx="4" />
            
            {/* Inner socket area - flat and universal */}
            <rect x="30" y="40" width="140" height="80" fill="#0f172a" stroke="#334155" strokeWidth="2" rx="2" />
            
            {/* Technical grid lines */}
            <g stroke="#334155" strokeWidth="0.5" opacity="0.3">
              <line x1="30" y1="60" x2="170" y2="60" />
              <line x1="30" y1="80" x2="170" y2="80" />
              <line x1="30" y1="100" x2="170" y2="100" />
              <line x1="30" y1="120" x2="170" y2="120" />
              <line x1="60" y1="40" x2="60" y2="120" />
              <line x1="90" y1="40" x2="90" y2="120" />
              <line x1="120" y1="40" x2="120" y2="120" />
              <line x1="150" y1="40" x2="150" y2="120" />
            </g>
            
            {/* Mounting holes */}
            <circle cx="20" cy="20" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <circle cx="180" cy="20" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <circle cx="20" cy="140" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <circle cx="180" cy="140" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
          </svg>
        </div>
      );
    } else if (currentStep === 3) {
      // Step 3: Poka-Yoke socket with physical restrictions
      // Use currentProductType directly derived from index
      switch (currentProductType) {
        case 'pcb':
          return (
            <div 
              ref={basePlateRef}
              className="relative"
              style={{ width: '200px', height: '160px' }}
            >
              <svg width="200" height="160" viewBox="0 0 200 160">
                {/* Technical housing base */}
                <rect x="10" y="10" width="180" height="140" fill="#1e293b" stroke="#475569" strokeWidth="3" rx="4" />
                
                {/* Inner socket with guide pins for PCB */}
                <rect x="30" y="40" width="140" height="80" fill="#0f172a" stroke="#334155" strokeWidth="2" rx="2" />
                
                {/* Ghost silhouette - PCB outline in correct orientation */}
                <g opacity="0.15" stroke="#4ade80" strokeWidth="1" strokeDasharray="4 2" fill="none">
                  <rect x="32" y="42" width="136" height="76" rx="2" />
                  {/* Gold contact fingers ghost */}
                  {[...Array(15)].map((_, i) => (
                    <rect key={i} x={44 + i * 8} y="110" width="4" height="6" rx="0.5" />
                  ))}
                  {/* Mounting holes ghost */}
                  <circle cx="40" cy="50" r="3" />
                  <circle cx="160" cy="50" r="3" />
                  <circle cx="40" cy="110" r="3" />
                  <circle cx="160" cy="110" r="3" />
                </g>
                
                {/* Guide pins - physical restrictions */}
                <rect x="40" y="110" width="4" height="8" fill="#64748b" stroke="#94a3b8" strokeWidth="1" rx="1" />
                <rect x="60" y="110" width="4" height="8" fill="#64748b" stroke="#94a3b8" strokeWidth="1" rx="1" />
                <rect x="80" y="110" width="4" height="8" fill="#64748b" stroke="#94a3b8" strokeWidth="1" rx="1" />
                <rect x="100" y="110" width="4" height="8" fill="#64748b" stroke="#94a3b8" strokeWidth="1" rx="1" />
                <rect x="120" y="110" width="4" height="8" fill="#64748b" stroke="#94a3b8" strokeWidth="1" rx="1" />
                <rect x="140" y="110" width="4" height="8" fill="#64748b" stroke="#94a3b8" strokeWidth="1" rx="1" />
                <rect x="160" y="110" width="4" height="8" fill="#64748b" stroke="#94a3b8" strokeWidth="1" rx="1" />
                
                {/* Technical grid lines */}
                <g stroke="#334155" strokeWidth="0.5" opacity="0.3">
                  <line x1="30" y1="60" x2="170" y2="60" />
                  <line x1="30" y1="80" x2="170" y2="80" />
                  <line x1="30" y1="100" x2="170" y2="100" />
                  <line x1="60" y1="40" x2="60" y2="120" />
                  <line x1="90" y1="40" x2="90" y2="120" />
                  <line x1="120" y1="40" x2="120" y2="120" />
                  <line x1="150" y1="40" x2="150" y2="120" />
                </g>
                
                {/* Mounting holes */}
                <circle cx="20" cy="20" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                <circle cx="180" cy="20" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                <circle cx="20" cy="140" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                <circle cx="180" cy="140" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              </svg>
            </div>
          );
        case 'cpu':
          return (
            <div 
              ref={basePlateRef}
              className="relative"
              style={{ width: '200px', height: '160px' }}
            >
              <svg width="200" height="160" viewBox="0 0 200 160">
                {/* Technical housing base */}
                <rect x="10" y="10" width="180" height="140" fill="#1e293b" stroke="#475569" strokeWidth="3" rx="4" />
                
                {/* Inner socket with corner block for CPU */}
                <rect x="30" y="40" width="140" height="80" fill="#0f172a" stroke="#334155" strokeWidth="2" rx="2" />
                
                {/* Ghost silhouette - CPU outline in correct orientation */}
                <g opacity="0.15" stroke="#4ade80" strokeWidth="1" strokeDasharray="4 2" fill="none">
                  <path d="M 62 40 L 138 40 L 138 120 L 60 120 L 60 52 L 62 52 Z" />
                  {/* Pin grid array ghost */}
                  {[...Array(6)].map((_, row) =>
                    [...Array(6)].map((_, col) => (
                      <circle
                        key={`${row}-${col}`}
                        cx={70 + col * 10}
                        cy={55 + row * 10}
                        r="1.5"
                      />
                    ))
                  )}
                  {/* Orientation marker ghost */}
                  <circle cx="66" cy="46" r="2" />
                </g>
                
                {/* Corner guide block - physical restriction */}
                <path d="M 30 40 L 50 40 L 50 50 L 40 50 L 40 60 L 30 60 Z" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
                
                {/* Pin grid array holes */}
                <g fill="#0f172a" stroke="#64748b" strokeWidth="0.5">
                  {[...Array(6)].map((_, row) =>
                    [...Array(6)].map((_, col) => (
                      <circle
                        key={`${row}-${col}`}
                        cx={60 + col * 10}
                        cy={55 + row * 10}
                        r="2"
                      />
                    ))
                  )}
                </g>
                
                {/* Technical grid lines */}
                <g stroke="#334155" strokeWidth="0.5" opacity="0.3">
                  <line x1="30" y1="60" x2="170" y2="60" />
                  <line x1="30" y1="80" x2="170" y2="80" />
                  <line x1="30" y1="100" x2="170" y2="100" />
                  <line x1="60" y1="40" x2="60" y2="120" />
                  <line x1="90" y1="40" x2="90" y2="120" />
                  <line x1="120" y1="40" x2="120" y2="120" />
                  <line x1="150" y1="40" x2="150" y2="120" />
                </g>
                
                {/* Mounting holes */}
                <circle cx="20" cy="20" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                <circle cx="180" cy="20" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                <circle cx="20" cy="140" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                <circle cx="180" cy="140" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              </svg>
            </div>
          );
        case 'connector':
          return (
            <div 
              ref={basePlateRef}
              className="relative"
              style={{ width: '200px', height: '160px' }}
            >
              <svg width="200" height="160" viewBox="0 0 200 160">
                {/* Technical housing base */}
                <rect x="10" y="10" width="180" height="140" fill="#1e293b" stroke="#475569" strokeWidth="3" rx="4" />
                
                {/* Inner socket with groove channel for connector - HORIZONTAL */}
                <rect x="30" y="50" width="140" height="60" fill="#0f172a" stroke="#334155" strokeWidth="2" rx="2" />
                
                {/* Ghost silhouette - Connector outline in correct orientation */}
                <g opacity="0.15" stroke="#4ade80" strokeWidth="1" strokeDasharray="4 2" fill="none">
                  <rect x="52" y="56" width="96" height="48" rx="3" />
                  {/* Keying rail ghost */}
                  <rect x="72" y="48" width="36" height="8" rx="2" />
                  {/* Contact pins ghost */}
                  {[...Array(5)].map((_, i) => (
                    <rect key={i} x="72" y="68" width="8" height="4" rx="1" />
                  ))}
                  {[...Array(5)].map((_, i) => (
                    <rect key={i} x="72" y={76 + i * 6} width="8" height="4" rx="1" />
                  ))}
                </g>
                
                {/* TOP groove channel - physical restriction (rotated 90 degrees) */}
                <rect x="55" y="42" width="50" height="10" fill="#64748b" stroke="#94a3b8" strokeWidth="1" rx="2" />
                <rect x="65" y="44" width="30" height="6" fill="#0f172a" rx="1" />
                
                {/* Contact pin holes - HORIZONTAL layout */}
                <g fill="#0f172a" stroke="#64748b" strokeWidth="0.5">
                  <rect x="65" y="60" width="8" height="4" rx="1" />
                  <rect x="65" y="70" width="8" height="4" rx="1" />
                  <rect x="65" y="80" width="8" height="4" rx="1" />
                  <rect x="65" y="90" width="8" height="4" rx="1" />
                  <rect x="65" y="100" width="8" height="4" rx="1" />
                </g>
                
                {/* Technical grid lines */}
                <g stroke="#334155" strokeWidth="0.5" opacity="0.3">
                  <line x1="30" y1="60" x2="170" y2="60" />
                  <line x1="30" y1="80" x2="170" y2="80" />
                  <line x1="30" y1="100" x2="170" y2="100" />
                  <line x1="60" y1="50" x2="60" y2="110" />
                  <line x1="90" y1="50" x2="90" y2="110" />
                  <line x1="120" y1="50" x2="120" y2="110" />
                  <line x1="150" y1="50" x2="150" y2="110" />
                </g>
                
                {/* Mounting holes */}
                <circle cx="20" cy="20" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                <circle cx="180" cy="20" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                <circle cx="20" cy="140" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                <circle cx="180" cy="140" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              </svg>
            </div>
          );
      }
    }
    return null;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80"
          alt="Assembly Line Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Game Content */}
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
                className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20 backdrop-blur-sm"
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
                {t.description}
              </p>
            </div>
            <Button onClick={handleReset} variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
              {t.tryAgain}
            </Button>
          </div>
        </motion.div>

        {/* Stats Display - COPQ Financial Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-3xl px-4"
        >
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm text-center border border-white/10">
              <div className="text-sm text-gray-300">{t.defectScore}</div>
              <motion.div 
                className={`text-2xl font-bold ${isSuccess ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]' : 'text-white'}`}
                animate={isSuccess ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {defectsReduced}%
              </motion.div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm text-center border border-white/10">
              <div className="text-sm text-gray-300">{t.errors}</div>
              <div className={`text-2xl font-bold ${defectCount > 0 ? 'text-red-400' : 'text-white'}`}>
                {defectCount}
              </div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm text-center border border-white/10">
              <div className="text-sm text-gray-300">
                {currentStep === 3 
                  ? (lockedSavings > 0 ? t.moneySaved : t.potentialCostPrevented) 
                  : t.copqCost}
              </div>
              <motion.div 
                className={`text-2xl font-bold ${currentStep === 3 ? (moneySaved > 0 ? 'text-green-400' : 'text-white') : (copqCost > 0 ? 'text-red-400' : 'text-white')}`}
                animate={copqCost > 0 ? { scale: [1, 1.1, 1] } : moneySaved > 0 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 3 ? `${moneySaved}€` : `${copqCost}€`}
              </motion.div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm text-center border border-white/10">
              <div className="text-sm text-gray-300">{t.batchProgress}</div>
              <div className="text-2xl font-bold text-white">
                {currentBatchIndex + 1}/3
              </div>
            </div>
          </div>
        </motion.div>

        {/* Single Pane Game Area */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            {/* Step Title */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white">
                {currentStep === 1 && t.step1Title}
                {currentStep === 2 && t.step2Title}
                {currentStep === 3 && t.step3Title}
              </h2>
            </div>

            {/* Game Area */}
            <div className="relative h-[500px] rounded-2xl bg-black/40 border-2 border-white/20 backdrop-blur-sm overflow-hidden">
              
              {/* STEP 1: Unprotected Assembly */}
              {currentStep === 1 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <p className="text-gray-400 text-sm mb-6 text-center">
                    {language === 'sr' ? t.dragToAssemble : t.dragToAssembleEn}
                    <br />
                    <span className="text-xs text-gray-500">{currentProductType === 'pcb' ? t.pcb : currentProductType === 'cpu' ? t.cpu : t.connector} ({currentBatchIndex + 1}/3)</span>
                  </p>
                  
                  {renderBasePlate()}

                  <div className="mt-12">
                    {renderProduct(currentProductType)}
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-gray-400 text-sm">
                    <RotateCcw className="h-4 w-4" />
                    <span>{t.doubleClickRotate}</span>
                  </div>
                </div>
              )}

              {/* STEP 2: Choose Solution */}
              {currentStep === 2 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <p className="text-gray-400 text-sm mb-8 text-center">
                    {language === 'sr' 
                      ? 'Izaberite Poka-Yoke rešenje za sprečavanje grešaka' 
                      : 'Choose a Poka-Yoke solution to prevent errors'}
                  </p>
                  
                  {/* Base Plate Preview */}
                  <div className="relative mb-8" style={{ width: '200px', height: '160px' }}>
                    <svg width="200" height="160" viewBox="0 0 200 160">
                      <rect x="10" y="10" width="180" height="140" fill="#1e293b" stroke="#475569" strokeWidth="3" rx="4" />
                      <rect x="30" y="40" width="140" height="80" fill="#0f172a" stroke="#334155" strokeWidth="2" rx="2" />
                      <circle cx="20" cy="20" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                      <circle cx="180" cy="20" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                      <circle cx="20" cy="140" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                      <circle cx="180" cy="140" r="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                    </svg>
                  </div>

                  {/* Solution Options */}
                  <div className="flex gap-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSolutionSelect('label')}
                      className="flex flex-col items-center gap-3 p-6 rounded-xl bg-yellow-900/30 border-2 border-yellow-500 hover:bg-yellow-900/50 transition-colors backdrop-blur-sm"
                    >
                      <div className="w-20 h-20 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/30">
                        <span className="text-3xl">🏷️</span>
                      </div>
                      <span className="text-yellow-300 text-sm font-semibold text-center">{t.visualLabel}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSolutionSelect('pin')}
                      className="flex flex-col items-center gap-3 p-6 rounded-xl bg-blue-900/30 border-2 border-blue-500 hover:bg-blue-900/50 transition-colors backdrop-blur-sm"
                    >
                      <div className="w-20 h-20 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                        <div className="w-6 h-6 bg-blue-400 rounded-full" />
                      </div>
                      <span className="text-blue-300 text-sm font-semibold text-center">{t.physicalPin}</span>
                    </motion.button>
                  </div>
                </div>
              )}

              {/* STEP 3: Error-Proofed Validation */}
              {currentStep === 3 && !isSuccess && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <p className="text-gray-400 text-sm mb-6 text-center">
                    {language === 'sr' 
                      ? 'Poka-Yoke sprečava pogrešnu montažu!' 
                      : 'Poka-Yoke prevents incorrect assembly!'}
                    <br />
                    <span className="text-xs text-gray-500">{currentProductType === 'pcb' ? t.pcb : currentProductType === 'cpu' ? t.cpu : t.connector} ({currentBatchIndex + 1}/3)</span>
                  </p>
                  
                  {renderBasePlate()}

                  <div className="mt-12">
                    {renderProduct(currentProductType)}
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-gray-400 text-sm">
                    <RotateCcw className="h-4 w-4" />
                    <span>{t.doubleClickRotate}</span>
                  </div>
                </div>
              )}

              {/* FINAL SUCCESS SCREEN */}
              {currentStep === 3 && isSuccess && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-green-900/40 to-blue-900/40">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          '0 0 20px rgba(74, 222, 128, 0.4)',
                          '0 0 40px rgba(74, 222, 128, 0.8)',
                          '0 0 20px rgba(74, 222, 128, 0.4)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mb-6"
                    >
                      <CheckCircle className="w-24 h-24 text-green-400 mx-auto" />
                    </motion.div>
                    
                    <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]">
                      {t.allComplete}
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm border border-green-500/30">
                        <div className="text-sm text-gray-300">{t.defectScore}</div>
                        <div className="text-3xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]">
                          100%
                        </div>
                      </div>
                      <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm border border-green-500/30">
                        <div className="text-sm text-gray-300">{lockedSavings > 0 ? t.moneySaved : t.potentialCostPrevented}</div>
                        <div className="text-3xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]">
                          {lockedSavings > 0 ? `${lockedSavings}€` : '150€'}
                        </div>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-8 flex gap-4 justify-center"
                    >
                      <Button onClick={handleReset} className="bg-green-600 hover:bg-green-700 backdrop-blur-sm text-white font-semibold px-8 py-3">
                        {t.tryAgain}
                      </Button>
                      <Link href="/moduli">
                        <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm font-semibold px-8 py-3">
                          {t.backToModules}
                        </Button>
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Feedback Toast */}
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div
              className={`flex items-center gap-3 rounded-lg px-6 py-4 backdrop-blur-sm ${
                showFeedback.type === 'success'
                  ? 'bg-green-900/90 border border-green-500'
                  : showFeedback.type === 'error'
                  ? 'bg-red-900/90 border border-red-500'
                  : 'bg-blue-900/90 border border-blue-500'
              }`}
            >
              {showFeedback.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : showFeedback.type === 'error' ? (
                <AlertCircle className="h-5 w-5 text-red-400" />
              ) : (
                <CheckCircle className="h-5 w-5 text-blue-400" />
              )}
              <span className="text-white font-medium">{showFeedback.message}</span>
            </div>
          </motion.div>
        )}

        {/* COPQ Summary Modal */}
        {showCopqModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-lg rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-2 border-slate-600/50 backdrop-blur-xl p-8 shadow-2xl"
            >
              <div className="text-center">
                <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
                
                <h2 className="mb-6 text-2xl font-bold text-white">
                  {t.copqModalTitle}
                </h2>
                
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-red-900/30 border border-red-500/30 p-4">
                    <div className="text-sm text-gray-300">{t.totalDefects}</div>
                    <div className="text-3xl font-bold text-red-400">{defectCount}</div>
                  </div>
                  <div className="rounded-lg bg-red-900/30 border border-red-500/30 p-4">
                    <div className="text-sm text-gray-300">{t.financialLossTotal}</div>
                    <div className="text-3xl font-bold text-red-400">{copqCost}€</div>
                  </div>
                </div>
                
                <div className="mb-8 rounded-lg bg-yellow-900/20 border border-yellow-500/30 p-4">
                  <p className="text-sm text-yellow-200 font-medium">
                    {t.managementAlert}
                  </p>
                </div>
                
                <Button
                  onClick={handleDesignSolution}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6"
                >
                  {t.proceedToDesign}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Educational Panel */}
        <div className="mt-8 mb-6 rounded-lg bg-white/10 p-6 backdrop-blur-sm border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">{t.eduPanelTitle}</h3>
          <div className="space-y-4 text-gray-200">
            <div>
              <h4 className="font-semibold text-green-400 mb-1">{t.eduPhase1Title}</h4>
              <p className="text-sm" dangerouslySetInnerHTML={{ __html: t.eduPhase1Text }} />
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-1">{t.eduPhase2Title}</h4>
              <p className="text-sm">{t.eduPhase2Text}</p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-400 mb-1">{t.eduPhase3Title}</h4>
              <p className="text-sm" dangerouslySetInnerHTML={{ __html: t.eduPhase3Text }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
