'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { SeisoTool } from './seiso-stage';
import {
  Wrench,
  Trash2,
  FileText,
  Package,
  Hammer,
  Cog,
  AlertTriangle,
  Clock,
  Archive,
  FileX,
  X,
  CheckCircle,
  AlertCircle,
  Hand
} from 'lucide-react';

// Translations dictionary
const translations = {
  sr: {
    // Phase 1 (Seiri)
    phase1Title: 'Faza 1: Sortiranje (Seiri)',
    phase1Description: 'Odvojite potrebne predmete od nepotrebnih',
    phase1Counter: 'Sređeno:',
    // Phase 2 (Seiton)
    phase2Title: 'Faza 2: Seiton (Organizovati)',
    phase2Description: 'Postavite alat na njegovo predviđeno mesto na Shadowboard',
    phase2Counter: 'Organizovano:',
    // Alerts & Popups
    sortedPopup: '+1 Sređeno!',
    requiredError: 'Ovaj predmet je potreban za rad!',
    silhouetteError: 'Postavite alat na odgovarajuću siluetu!',
    // Panels & Dropzones
    workspaceTitle: 'Radni prostor',
    workspaceDescPhase1: 'Ovde su svi predmeti trenutno na radnom stolu',
    workspaceDescPhase2: 'Ovde su alati koje treba organizovati',
    redTagAreaTitle: 'Zona crvenih etiketa',
    redTagAreaDesc: 'Ovde stavite nepotrebne ili polomljene predmete',
    dropHint: 'Prevucite predmete ovde',
    dropHintSub: 'Predmeti koji su polomljeni, nepotrebnih ili retko korišćeni',
    shadowboardTitle: 'Shadowboard',
    shadowboardDesc: 'Postavite alat na njegovo predviđeno mesto',
    // Instructions Phase 1
    instructionsTitle: 'Uputstva:',
    phase1Instruction1: 'Identifikujte predmete koji su neophodni za svakodnevni rad',
    phase1Instruction2: 'Označite i premestite nepotrebne predmete u Zonu crvenih etiketa',
    phase1Instruction3: 'Zadržite samo esencijalne predmete u Radnom prostoru',
    phase1Instruction4: 'Dokumentujte odluke za svaki predmet',
    // Instructions Phase 2
    phase2Instruction1: 'Postavite svaki predmet na njegovu označenu siluetu na Shadowboard-u',
    phase2Instruction2: 'Pratite oznake ispod silueta kako biste osigurali tačnost.',
    phase2Instruction3: 'Cilj je da svaki alat ima svoje odgovarajuće mesto.',
    phase2Instruction4: 'Organizovan radni prostor smanjuje vreme traženja alata',
    // Success Modal
    successTitle: 'Svaka čast!',
    phase1SuccessDesc: 'Prvi korak (Sortiranje) je uspešno završen. Da li ste spremni za Seiton (Organizovati)?',
    phase2SuccessDesc: 'Odlično! Sve je na svom mestu. Da li ste spremni za Fazu 3: Seiso (Očistiti)?',
    phase1SuccessButton: 'Bravo! Pređi na sledeći korak: Seiton (Organizovati)',
    phase2SuccessButton: 'Bravo! Pređi na sledeći korak: Seiso (Očistiti)'
  },
  en: {
    // Phase 1 (Seiri)
    phase1Title: 'Phase 1: Sort (Seiri)',
    phase1Description: 'Separate necessary items from unnecessary ones',
    phase1Counter: 'Sorted:',
    // Phase 2 (Seiton)
    phase2Title: 'Phase 2: Seiton (Set in Order)',
    phase2Description: 'Place tools in their designated spots on the Shadowboard',
    phase2Counter: 'Organized:',
    // Alerts & Popups
    sortedPopup: '+1 Sorted!',
    requiredError: 'This item is required for work!',
    silhouetteError: 'Place the tool on the correct silhouette!',
    // Panels & Dropzones
    workspaceTitle: 'Workspace',
    workspaceDescPhase1: 'All items are currently on the workbench',
    workspaceDescPhase2: 'Here are the tools that need to be organized',
    redTagAreaTitle: 'Red Tag Area',
    redTagAreaDesc: 'Place unnecessary or broken items here',
    dropHint: 'Drag items here',
    dropHintSub: 'Items that are broken, unnecessary, or rarely used',
    shadowboardTitle: 'Shadowboard',
    shadowboardDesc: 'Place the tool in its designated spot',
    // Instructions Phase 1
    instructionsTitle: 'Instructions:',
    phase1Instruction1: 'Identify items that are necessary for daily work',
    phase1Instruction2: 'Mark and move unnecessary items to the Red Tag Area',
    phase1Instruction3: 'Keep only essential items in the Workspace',
    phase1Instruction4: 'Document decisions for each item',
    // Instructions Phase 2
    phase2Instruction1: 'Place each item on its marked silhouette on the Shadowboard',
    phase2Instruction2: 'Follow the labels below silhouettes to ensure accuracy.',
    phase2Instruction3: 'The goal is for every tool to have its designated place.',
    phase2Instruction4: 'An organized workspace reduces tool search time',
    // Success Modal
    successTitle: 'Well done!',
    phase1SuccessDesc: 'The first step (Sort) has been successfully completed. Are you ready for Seiton (Set in Order)?',
    phase2SuccessDesc: 'Excellent! Everything is in its place. Are you ready for Phase 3: Seiso (Shine)?',
    phase1SuccessButton: 'Great! Move to the next step: Seiton (Set in Order)',
    phase2SuccessButton: 'Great! Move to the next step: Seiso (Shine)'
  }
};

interface Item {
  id: string;
  nameSr: string;
  nameEn: string;
  icon: React.ElementType;
  type: 'trash' | 'broken' | 'valid';
  color: string;
  shadowId?: string; // For Phase 2 shadowboard matching
}

interface SeitonTool {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  shadowId: string;
  isOrganized: boolean;
  position: { x: number; y: number };
}

const baseItems: Item[] = [
  { id: '1', nameSr: 'Polomljen alat', nameEn: 'Broken Tool', icon: X, type: 'broken', color: 'red' },
  { id: '2', nameSr: 'Smeće', nameEn: 'Trash', icon: Trash2, type: 'trash', color: 'gray' },
  { id: '3', nameSr: 'Važeći dokument', nameEn: 'Valid Document', icon: FileText, type: 'valid', color: 'green', shadowId: 'document' },
  { id: '4', nameSr: 'Čist alat', nameEn: 'Clean Tool', icon: Wrench, type: 'valid', color: 'blue', shadowId: 'wrench' },
  { id: '5', nameSr: 'Zastareo dokument', nameEn: 'Expired Document', icon: FileX, type: 'trash', color: 'gray' },
  { id: '6', nameSr: 'Rezervni deo', nameEn: 'Spare Part', icon: Package, type: 'valid', color: 'purple', shadowId: 'package' },
  { id: '7', nameSr: 'Oštećen čekić', nameEn: 'Damaged Hammer', icon: Hammer, type: 'broken', color: 'red' },
  { id: '8', nameSr: 'Stara kutija', nameEn: 'Old Box', icon: Archive, type: 'trash', color: 'gray' },
  { id: '9', nameSr: 'Radno uputstvo', nameEn: 'Work Instruction', icon: FileText, type: 'valid', color: 'green', shadowId: 'manual' },
  { id: '10', nameSr: 'Polomljen zupčanik', nameEn: 'Broken Gear', icon: Cog, type: 'broken', color: 'red' },
  { id: '11', nameSr: 'Upozorenje', nameEn: 'Warning', icon: AlertTriangle, type: 'broken', color: 'red' },
  { id: '12', nameSr: 'Stari sat', nameEn: 'Old Clock', icon: Clock, type: 'trash', color: 'gray' },
  { id: '13', nameSr: 'Ključ', nameEn: 'Key', icon: Wrench, type: 'valid', color: 'blue', shadowId: 'key' },
  { id: '14', nameSr: 'Pokvareni alat', nameEn: 'Broken Tool', icon: X, type: 'broken', color: 'red' },
  { id: '15', nameSr: 'Zgužvan papir', nameEn: 'Crumpled Paper', icon: FileText, type: 'trash', color: 'gray' },
  { id: '16', nameSr: 'Novi zupčanik', nameEn: 'New Gear', icon: Cog, type: 'valid', color: 'green', shadowId: 'cog' },
  { id: '17', nameSr: 'Otpad', nameEn: 'Waste', icon: Trash2, type: 'trash', color: 'gray' },
  { id: '18', nameSr: 'Sistemski dokument', nameEn: 'System Document', icon: FileText, type: 'valid', color: 'blue', shadowId: 'system' },
  { id: '19', nameSr: 'Prazna flaša', nameEn: 'Empty Bottle', icon: Trash2, type: 'trash', color: 'gray' },
  { id: '20', nameSr: 'Istekao sertifikat', nameEn: 'Expired Certificate', icon: FileX, type: 'trash', color: 'gray' },
];


// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate UUID for unique IDs
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Initialize Seiton phase with fresh state
const initializeSeiton = (sourceItems: Item[], language: 'sr' | 'en'): SeitonTool[] => {
  const necessaryTools = sourceItems.filter(item => item.type === 'valid' && item.shadowId);
  const seitonTools = necessaryTools.slice(0, 7).map(item => ({
    id: generateUUID(),
    name: language === 'sr' ? item.nameSr : item.nameEn,
    icon: item.icon,
    color: item.color,
    shadowId: item.shadowId!,
    isOrganized: false,
    position: {
      x: Math.random() * 100 - 50, // Random position between -50 and 50
      y: Math.random() * 100 - 50
    }
  }));
  return seitonTools;
};

// Calculate total unnecessary items
const totalUnnecessary = baseItems.filter(item => item.type === 'trash' || item.type === 'broken').length;

interface SortStageProps {
  onTransitionToPhase3?: (tools: SeisoTool[]) => void;
  language: 'sr' | 'en';
}

export function SortStage({ onTransitionToPhase3, language }: SortStageProps) {
  const t = translations[language];
  const [phase, setPhase] = useState(1); // Phase 1: Sort, Phase 2: Seiton
  const [sortedItems, setSortedItems] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isOverDropZone, setIsOverDropZone] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [hasStartedDragging, setHasStartedDragging] = useState(false);
  const [feedbackPopup, setFeedbackPopup] = useState<{ x: number; y: number } | null>(null);
  const [tutorialLoop, setTutorialLoop] = useState(0);
  const [shuffledItems, setShuffledItems] = useState<Item[]>(baseItems);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [successSound, setSuccessSound] = useState<HTMLAudioElement | null>(null);
  const [errorSound, setErrorSound] = useState<HTMLAudioElement | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Phase 2 state
  const [seitonTools, setSeitonTools] = useState<SeitonTool[]>([]);
  const [seitonProgress, setSeitonProgress] = useState<SeitonTool[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasInteractedInPhase2, setHasInteractedInPhase2] = useState(false);
  const shadowRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Shuffle items on mount (client-side only to avoid hydration error)
  useEffect(() => {
    setIsClient(true);
    setShuffledItems(shuffleArray(baseItems));
  }, []);

  // Transition to Phase 2 when Phase 1 is complete
  const transitionToPhase2 = useCallback(() => {
    setShowSuccessModal(false);
    // Wait 10ms for the state to propagate before changing the phase
    setTimeout(() => {
      setIsTransitioning(true);
      setPhase(2);
      // Reset interaction flag for Phase 2
      setHasInteractedInPhase2(false);
      
      // CRITICAL: Reset block - Force state reset for Phase 2
      const savedItemsFromPhase1 = baseItems.filter(item => item.type === 'valid' && item.shadowId);
      const freshTools: SeitonTool[] = savedItemsFromPhase1.slice(0, 7).map(item => ({
        id: `seiton-${item.id}-${Math.random()}`, // New unique IDs
        name: language === 'sr' ? item.nameSr : item.nameEn,
        icon: item.icon,
        color: item.color,
        shadowId: item.shadowId!, // Type assertion - we know it exists due to filter
        isOrganized: false,
        position: { x: Math.random() * 400 - 200, y: Math.random() * 400 - 200 } // More scattered random desk positions
      }));
      // Keep freshTools sorted for Shadowboard (logical order)
      // Shuffle for desk (scrambled order)
      const shuffledTools: SeitonTool[] = shuffleArray(freshTools);
      setSeitonProgress(freshTools); // Shadowboard stays sorted
      setSeitonTools(shuffledTools); // Desk is shuffled
      setErrorMessage(null);
      setIsTransitioning(false);
      
      console.log("Phase 2 Started - Count reset to: 0");
    }, 10); // 10ms delay for modal to unmount
  }, []);

  // Preload audio files
  useEffect(() => {
    const successAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    const errorAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3');
    
    successAudio.volume = 0.3;
    successAudio.load();
    errorAudio.volume = 0.3;
    errorAudio.load();
    
    setSuccessSound(successAudio);
    setErrorSound(errorAudio);
    
    console.log('Audio files preloaded');
  }, []);

  // Unlock audio on first user interaction
  const unlockAudio = useCallback(() => {
    if (!audioUnlocked) {
      if (successSound) {
        successSound.play().then(() => {
          successSound.pause();
          successSound.currentTime = 0;
        }).catch(e => console.log('Audio unlock failed:', e));
      }
      setAudioUnlocked(true);
      console.log('Audio unlocked');
    }
  }, [audioUnlocked, successSound]);

  // Add click listener to unlock audio
  useEffect(() => {
    document.addEventListener('click', unlockAudio);
    return () => document.removeEventListener('click', unlockAudio);
  }, [unlockAudio]);

  const handleDragEnd = useCallback((item: Item | SeitonTool, info: PanInfo) => {
    if (phase === 1) {
      // Phase 1: Sort to red zone
      const dropZone = dropZoneRef.current;
      if (!dropZone) return;

      const dropZoneRect = dropZone.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      const itemX = info.point.x;
      const itemY = info.point.y;

      // Compare absolute cursor position against zone bounds adjusted for scroll
      const isInDropZone = 
        itemX >= dropZoneRect.left + scrollX && 
        itemX <= dropZoneRect.right + scrollX && 
        itemY >= dropZoneRect.top + scrollY && 
        itemY <= dropZoneRect.bottom + scrollY;

      if (isInDropZone) {
        // Type guard to check if item is Item (Phase 1)
        if ('type' in item && (item.type === 'trash' || item.type === 'broken')) {
          // Correct sort - item is unnecessary
          console.log('Item type:', item.type, '- Unnecessary, removing from workspace');
          setSortedItems(prev => new Set(Array.from(prev).concat(item.id)));
          setErrorMessage(null);
          // Play success sound
          if (successSound) {
            console.log('Playing sound: success');
            successSound.currentTime = 0;
            successSound.play().catch((e: Error) => console.log('Audio play failed:', e));
          }
          // Show feedback popup at drop location
          setFeedbackPopup({ x: itemX, y: itemY });
          setTimeout(() => setFeedbackPopup(null), 1500);
          return true; // Successful drop - item should disappear
        } else {
          // Incorrect sort - item is necessary
          console.log('Item is necessary, bouncing back');
          setErrorMessage(t.requiredError);
          // Play error sound
          if (errorSound) {
            console.log('Playing sound: error');
            errorSound.currentTime = 0;
            errorSound.play().catch((e: Error) => console.log('Audio play failed:', e));
          }
          setTimeout(() => setErrorMessage(null), 2000);
          return false; // Indicate unsuccessful drop - bounce back
        }
      }
      // Dropped outside red zone - always bounce back to grid position
      return false;
    } else {
      // Phase 2: Organize to shadowboard
      const itemX = info.point.x;
      const itemY = info.point.y;
      
      // Type guard to check if item is SeitonTool (Phase 2)
      if (!('shadowId' in item)) return false;
      
      // Check if dropped near correct shadow
      let matchedShadow = null;
      for (const tool of seitonProgress) {
        const shadowEl = shadowRefs.current[tool.shadowId];
        if (shadowEl) {
          const shadowRect = shadowEl.getBoundingClientRect();
          const scrollX = window.scrollX || window.pageXOffset;
          const scrollY = window.scrollY || window.pageYOffset;
          
          const shadowCenterX = shadowRect.left + shadowRect.width / 2 + scrollX;
          const shadowCenterY = shadowRect.top + shadowRect.height / 2 + scrollY;
          
          const distance = Math.sqrt(
            Math.pow(itemX - shadowCenterX, 2) + 
            Math.pow(itemY - shadowCenterY, 2)
          );
          
          // Snap if within 100px
          if (distance < 100) {
            matchedShadow = tool.shadowId;
            break;
          }
        }
      }
      
      if (matchedShadow && item.shadowId === matchedShadow) {
        // Correct placement - mark tool as organized
        console.log('Tool placed on correct shadow:', matchedShadow);
        setSeitonProgress(prev => prev.map(tool => 
          tool.shadowId === matchedShadow ? { ...tool, isOrganized: true } : tool
        ));
        setSeitonTools(prev => prev.map(tool => 
          tool.shadowId === matchedShadow ? { ...tool, isOrganized: true } : tool
        ));
        setErrorMessage(null);
        if (successSound) {
          console.log('Playing sound: success');
          successSound.currentTime = 0;
          successSound.play().catch((e: Error) => console.log('Audio play failed:', e));
        }
        return true; // Successful placement
      } else {
        // Wrong placement or no shadow
        console.log('Tool not placed correctly');
        setErrorMessage(t.silhouetteError);
        if (errorSound) {
          console.log('Playing sound: error');
          errorSound.currentTime = 0;
          errorSound.play().catch((e: Error) => console.log('Audio play failed:', e));
        }
        setTimeout(() => setErrorMessage(null), 2000);
        return false; // Bounce back
      }
    }
  }, [successSound, errorSound, phase, seitonProgress]);

  const handleDrag = useCallback((info: PanInfo) => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    const dropZoneRect = dropZone.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const itemX = info.point.x;
    const itemY = info.point.y;

    // Compare absolute cursor position against zone bounds adjusted for scroll
    const isInDropZone = 
      itemX >= dropZoneRect.left + scrollX && 
      itemX <= dropZoneRect.right + scrollX && 
      itemY >= dropZoneRect.top + scrollY && 
      itemY <= dropZoneRect.bottom + scrollY;

    setIsOverDropZone(isInDropZone);
  }, []);

  const handleDragStart = useCallback(() => {
    setIsOverDropZone(false);
    setHasStartedDragging(true);
    setShowTutorial(false);
    setTutorialLoop(3); // Stop tutorial loops
    // Track user interaction in Phase 2
    if (phase === 2) {
      setHasInteractedInPhase2(true);
    }
  }, [phase]);

  // Check if all unnecessary items are sorted (Phase 1)
  const sortedCount = sortedItems.size;
  const isComplete = sortedCount === totalUnnecessary;

  // Check if all tools are organized (Phase 2)
  const organizedCount = seitonProgress.filter(t => t.isOrganized).length;
  const isPhase2Complete = organizedCount === seitonProgress.length;

  // Show success modal when phases complete
  useEffect(() => {
    if (isComplete && !showSuccessModal && phase === 1) {
      setShowSuccessModal(true);
    }
    // Phase 2: Only show success modal if user has interacted and all tools are organized
    // CRITICAL: Must only check seitonProgress array and prevent showing during transition
    if (phase === 2 && seitonProgress.length > 0 && organizedCount === seitonProgress.length && hasInteractedInPhase2 && !showSuccessModal && !isTransitioning) {
      setShowSuccessModal(true);
    }
    // If organizedCount is 0, the modal MUST be hidden
    if (phase === 2 && organizedCount === 0) {
      setShowSuccessModal(false);
    }
  }, [isComplete, organizedCount, seitonProgress.length, showSuccessModal, phase, hasInteractedInPhase2]);

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
          {phase === 1 ? t.phase1Title : t.phase2Title}
        </h2>
        <p className="mt-2 text-base text-gray-300 sm:text-lg">
          {phase === 1 ? t.phase1Description : t.phase2Description}
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
            {phase === 1 ? `${t.phase1Counter} ${sortedCount} / ${totalUnnecessary}` : `${t.phase2Counter} ${organizedCount} / ${seitonProgress.length}`}
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

      {/* Feedback Popup */}
      <AnimatePresence>
        {feedbackPopup && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -30, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="fixed pointer-events-none z-50"
            style={{
              left: feedbackPopup.x,
              top: feedbackPopup.y
            }}
          >
            <div className="flex items-center gap-2 rounded-full bg-green-500/90 px-4 py-2 backdrop-blur-sm shadow-lg">
              <CheckCircle className="h-5 w-5 text-white" />
              <span className="text-sm font-semibold text-white">{t.sortedPopup}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Workspace - Radni prostor */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="order-1 relative z-20 rounded-xl border-2 border-white/20 bg-white/5 p-4 backdrop-blur-sm lg:order-1 sm:p-6"
        >
          <h3 className="mb-3 text-xl font-semibold text-white sm:mb-4 sm:text-2xl">
            {t.workspaceTitle}
          </h3>
          <p className="mb-4 text-xs text-gray-300 sm:mb-6 sm:text-sm">
            {phase === 1 ? t.workspaceDescPhase1 : t.workspaceDescPhase2}
          </p>
          
          {/* Items in Workspace - Messy grid layout */}
          <div className="relative grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
            {(phase === 1 ? shuffledItems : seitonTools)
              .filter(item => {
                if (phase === 1) {
                  return !sortedItems.has((item as Item).id);
                } else {
                  // Phase 2: filter out items that have been organized
                  return !(item as SeitonTool).isOrganized;
                }
              })
              .map((item, index) => (
              <DraggableItem
                key={item.id}
                item={item}
                index={index}
                onDragEnd={handleDragEnd}
                onDrag={handleDrag}
                onDragStart={handleDragStart}
                showError={errorMessage !== null}
                isTransitioning={isTransitioning}
                phase={phase}
                language={language}
              />
            ))}
            
            {/* Animated Tutorial Hand */}
            <AnimatePresence>
              {showTutorial && !hasStartedDragging && tutorialLoop < 3 && isClient && (
                <motion.div
                  className="absolute pointer-events-none z-50"
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 1, 0],
                    x: window.innerWidth > 768 ? [0, 0, 150, 150, 150] : [0, 0, 0, 0, 0],
                    y: window.innerWidth > 768 ? [0, 0, -50, -50, -50] : [0, 0, 200, 200, 200]
                  }}
                  transition={{
                    delay: 2,
                    duration: 2.5,
                    times: [0, 0.1, 0.7, 0.85, 1],
                    ease: "easeInOut",
                    repeat: tutorialLoop < 2 ? Infinity : 0,
                    repeatDelay: 0.5
                  }}
                  onAnimationComplete={() => {
                    setTutorialLoop(prev => prev + 1);
                    if (tutorialLoop >= 2) {
                      setShowTutorial(false);
                    }
                  }}
                  style={{
                    right: '20px',
                    top: window.innerWidth > 768 ? '60px' : '20px'
                  }}
                >
                  <Hand className="h-12 w-12 text-yellow-300 drop-shadow-2xl" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Red Tag Area - Zona crvenih etiketa (Phase 1) */}
        {phase === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="order-2 relative z-10 rounded-xl border-2 border-red-400/50 bg-red-900/30 p-4 backdrop-blur-sm lg:order-2 sm:p-6"
          >
            <h3 className="mb-3 text-xl font-semibold text-red-300 sm:mb-4 sm:text-2xl">
              {t.redTagAreaTitle}
            </h3>
            <p className="mb-4 text-xs text-gray-300 sm:mb-6 sm:text-sm">
              {t.redTagAreaDesc}
            </p>
            
            {/* Drop Zone */}
            <motion.div
              ref={dropZoneRef}
              animate={{
                borderWidth: isOverDropZone ? '6px' : '4px',
                borderStyle: isOverDropZone ? 'solid' : 'dashed',
                borderColor: isOverDropZone ? 'rgb(250, 204, 21)' : 'rgba(239, 68, 68, 0.6)',
                backgroundColor: isOverDropZone ? 'rgba(127, 29, 29, 0.7)' : 'rgba(69, 10, 10, 0.4)'
              }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex min-h-[200px] items-center justify-center rounded-lg border-4 border-dashed border-red-500/60 bg-red-950/40 sm:min-h-[300px]"
            >
              <div className="text-center">
                <p className="text-base text-red-400 sm:text-lg">
                  {t.dropHint}
                </p>
                <p className="mt-2 text-xs text-gray-400 sm:mt-2 sm:text-sm">
                  {t.dropHintSub}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Shadowboard (Phase 2) */}
        {phase === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="order-2 relative z-10 rounded-xl border-2 border-gray-400/50 bg-gray-800/50 p-4 backdrop-blur-sm lg:order-2 sm:p-6"
          >
            <h3 className="mb-3 text-xl font-semibold text-gray-200 sm:mb-4 sm:text-2xl">
              {t.shadowboardTitle}
            </h3>
            <p className="mb-4 text-xs text-gray-300 sm:mb-6 sm:text-sm">
              {t.shadowboardDesc}
            </p>
            
            {/* Shadowboard Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {seitonProgress.map((tool) => (
                <motion.div
                  key={tool.shadowId}
                  ref={(el) => { shadowRefs.current[tool.shadowId] = el; }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + seitonProgress.indexOf(tool) * 0.1 }}
                  className={`relative rounded-lg border-2 p-3 transition-colors sm:p-4 ${
                    tool.isOrganized
                      ? 'border-green-400/50 bg-green-900/20'
                      : 'border-white/40 bg-gray-900/40'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <tool.icon className={`h-10 w-10 sm:h-12 sm:w-12 ${
                      tool.isOrganized ? 'text-green-400' : 'text-gray-400'
                    }`} />
                    <p className={`mt-2 text-xs font-semibold sm:text-sm ${
                      tool.isOrganized ? 'text-green-300' : 'text-gray-300'
                    }`}>
                      {tool.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
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
          {phase === 1 ? (
            <>
              <li>{t.phase1Instruction1}</li>
              <li>{t.phase1Instruction2}</li>
              <li>{t.phase1Instruction3}</li>
              <li>{t.phase1Instruction4}</li>
            </>
          ) : (
            <>
              <li>{t.phase2Instruction1}</li>
              <li>{t.phase2Instruction2}</li>
              <li>{t.phase2Instruction3}</li>
              <li>{t.phase2Instruction4}</li>
            </>
          )}
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
              {phase === 1 
                ? t.phase1SuccessDesc
                : t.phase2SuccessDesc
              }
            </p>
            {phase === 1 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowSuccessModal(false);
                  transitionToPhase2();
                }}
                className="w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-green-500/25"
              >
                {t.phase1SuccessButton}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowSuccessModal(false);
                  if (onTransitionToPhase3) {
                    // Convert SeitonTool to SeisoTool format
                    const toolsForPhase3: SeisoTool[] = seitonProgress.map((tool: any) => ({
                      id: tool.id,
                      name: tool.name,
                      icon: tool.icon,
                      color: tool.color,
                      shadowId: tool.shadowId,
                      cleanliness: 0
                    }));
                    onTransitionToPhase3(toolsForPhase3);
                  }
                }}
                className="w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-green-500/25"
              >
                {t.phase2SuccessButton}
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

function DraggableItem({ item, index, onDragEnd, onDrag, onDragStart, showError, isTransitioning, phase, language }: { 
  item: Item | SeitonTool; 
  index: number; 
  onDragEnd: (item: Item | SeitonTool, info: PanInfo) => boolean | void;
  onDrag: (info: PanInfo) => void;
  onDragStart: () => void;
  showError: boolean;
  isTransitioning?: boolean;
  phase?: number;
  language: 'sr' | 'en';
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useTransform(x, [-100, 0, 100], [0.9, 1, 0.9]);

  const handleDragEnd = (e: any, info: PanInfo) => {
    const result = onDragEnd(item, info);
    // If drop was unsuccessful, animate back to origin
    if (result === false) {
      x.set(0);
      y.set(0);
    }
  };

  // Fade out trash/broken items during transition to Phase 2
  const shouldFadeOut = isTransitioning && phase === 1 && 'type' in item && (item.type === 'trash' || item.type === 'broken');

  return (
    <motion.div
      drag={!shouldFadeOut}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={onDragStart}
      onDrag={(e, info) => onDrag(info)}
      onDragEnd={handleDragEnd}
      style={{
        x,
        y,
        scale,
        backgroundColor: item.color === 'red' ? 'rgba(127, 29, 29, 0.4)' :
                       item.color === 'gray' ? 'rgba(31, 41, 55, 0.4)' :
                       item.color === 'green' ? 'rgba(20, 83, 45, 0.4)' :
                       item.color === 'blue' ? 'rgba(30, 58, 138, 0.4)' :
                       item.color === 'purple' ? 'rgba(88, 28, 135, 0.4)' :
                       item.color === 'yellow' ? 'rgba(161, 98, 7, 0.4)' : 'rgba(31, 41, 55, 0.4)',
        borderColor: showError && 'type' in item && item.type === 'valid' ? 'rgba(239, 68, 68, 0.8)' :
                    item.color === 'red' ? 'rgba(239, 68, 68, 0.3)' :
                    item.color === 'gray' ? 'rgba(75, 85, 99, 0.3)' :
                    item.color === 'green' ? 'rgba(34, 197, 94, 0.3)' :
                    item.color === 'blue' ? 'rgba(59, 130, 246, 0.3)' :
                    item.color === 'purple' ? 'rgba(168, 85, 247, 0.3)' :
                    item.color === 'yellow' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(75, 85, 99, 0.3)'
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: shouldFadeOut ? 0 : 1, 
        scale: shouldFadeOut ? 0.5 : 1 
      }}
      transition={{ delay: 0.5 + (index * 0.05), duration: shouldFadeOut ? 0.5 : 0.3 }}
      whileHover={{ scale: shouldFadeOut ? 1 : 1.05 }}
      whileTap={{ scale: shouldFadeOut ? 1 : 0.95 }}
      whileDrag={{ 
        scale: 1.1, 
        zIndex: 100, 
        cursor: 'grabbing',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
      }}
      className={`cursor-grab rounded-lg p-3 border sm:p-4 touch-none relative ${shouldFadeOut ? 'pointer-events-none' : ''}`}
    >
      <item.icon className="mx-auto h-8 w-8 sm:h-12 sm:w-12" 
        style={{ color: item.color === 'red' ? '#f87171' :
                        item.color === 'gray' ? '#9ca3af' :
                        item.color === 'green' ? '#4ade80' :
                        item.color === 'blue' ? '#60a5fa' :
                        item.color === 'purple' ? '#c084fc' :
                        item.color === 'yellow' ? '#fbbf24' : '#9ca3af' }}
      />
      <p className="mt-1 text-center text-[10px] sm:mt-2 sm:text-xs"
        style={{ color: item.color === 'red' ? '#fca5a5' :
                        item.color === 'gray' ? '#d1d5db' :
                        item.color === 'green' ? '#86efac' :
                        item.color === 'blue' ? '#93c5fd' :
                        item.color === 'purple' ? '#d8b4fe' :
                        item.color === 'yellow' ? '#fde68a' : '#d1d5db' }}
      >
        {language === 'sr' ? (item as any).nameSr || (item as any).name : (item as any).nameEn || (item as any).name}
      </p>
    </motion.div>
  );
}
