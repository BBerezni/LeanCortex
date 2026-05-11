'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
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
  X as CloseIcon,
  Hand
} from 'lucide-react';

interface Item {
  id: string;
  name: string;
  icon: React.ElementType;
  type: 'trash' | 'broken' | 'valid';
  color: string;
}

const baseItems: Item[] = [
  { id: '1', name: 'Polomljen alat', icon: X, type: 'broken', color: 'red' },
  { id: '2', name: 'Smeće', icon: Trash2, type: 'trash', color: 'gray' },
  { id: '3', name: 'Važeći dokument', icon: FileText, type: 'valid', color: 'green' },
  { id: '4', name: 'Čist alat', icon: Wrench, type: 'valid', color: 'blue' },
  { id: '5', name: 'Zastareo dokument', icon: FileX, type: 'trash', color: 'gray' },
  { id: '6', name: 'Rezervni deo', icon: Package, type: 'valid', color: 'purple' },
  { id: '7', name: 'Oštećen čekić', icon: Hammer, type: 'broken', color: 'red' },
  { id: '8', name: 'Stara kutija', icon: Archive, type: 'trash', color: 'gray' },
  { id: '9', name: 'Radno uputstvo', icon: FileText, type: 'valid', color: 'green' },
  { id: '10', name: 'Polomljen zupčanik', icon: Cog, type: 'broken', color: 'red' },
  { id: '11', name: 'Upozorenje', icon: AlertTriangle, type: 'broken', color: 'red' },
  { id: '12', name: 'Stari sat', icon: Clock, type: 'trash', color: 'gray' },
  { id: '13', name: 'Ključ', icon: Wrench, type: 'valid', color: 'blue' },
  { id: '14', name: 'Pokvareni alat', icon: X, type: 'broken', color: 'red' },
  { id: '15', name: 'Zgužvan papir', icon: FileText, type: 'trash', color: 'gray' },
  { id: '16', name: 'Novi zupčanik', icon: Cog, type: 'valid', color: 'green' },
  { id: '17', name: 'Otpad', icon: Trash2, type: 'trash', color: 'gray' },
  { id: '18', name: 'Sistemski dokument', icon: FileText, type: 'valid', color: 'blue' },
  { id: '19', name: 'Prazna flaša', icon: Trash2, type: 'trash', color: 'gray' },
  { id: '20', name: 'Istekao sertifikat', icon: FileX, type: 'trash', color: 'gray' },
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

// Calculate total unnecessary items
const totalUnnecessary = baseItems.filter(item => item.type === 'trash' || item.type === 'broken').length;

export function SortStage() {
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

  // Shuffle items on mount (client-side only to avoid hydration error)
  useEffect(() => {
    setShuffledItems(shuffleArray(baseItems));
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

  const handleDragEnd = useCallback((item: Item, info: PanInfo) => {
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
      console.log('✓ INSIDE DROP ZONE - Cursor physically inside dashed lines');
    }
    
    console.log('Dropped at:', { x: itemX, y: itemY });
    console.log('Zone bounds (viewport):', { 
      left: dropZoneRect.left, 
      right: dropZoneRect.right, 
      top: dropZoneRect.top, 
      bottom: dropZoneRect.bottom
    });
    console.log('Zone bounds (absolute with scroll):', { 
      left: dropZoneRect.left + scrollX,
      right: dropZoneRect.right + scrollX,
      top: dropZoneRect.top + scrollY,
      bottom: dropZoneRect.bottom + scrollY
    });
    console.log('Scroll offset:', { x: scrollX, y: scrollY });
    console.log('Result:', isInDropZone ? 'Success' : 'Fail');

    setIsOverDropZone(false);

    if (isInDropZone) {
      if (item.type === 'trash' || item.type === 'broken') {
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
      } else {
        // Incorrect sort - item is necessary
        console.log('Item type:', item.type, '- Necessary, bouncing back');
        setErrorMessage('Ovaj predmet je potreban za rad!');
        // Play error sound
        if (errorSound) {
          console.log('Playing sound: error');
          errorSound.currentTime = 0;
          errorSound.play().catch((e: Error) => console.log('Audio play failed:', e));
        }
        setTimeout(() => setErrorMessage(null), 2000);
        return false; // Indicate unsuccessful drop
      }
    }
    return true; // Indicate successful drop or not in drop zone
  }, [successSound, errorSound]);

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
  }, []);

  // Check if all unnecessary items are sorted
  const sortedCount = sortedItems.size;
  const isComplete = sortedCount === totalUnnecessary;

  if (isComplete && !showSuccessModal) {
    setShowSuccessModal(true);
  }

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
          Faza 1: Sortiranje (Seiri)
        </h2>
        <p className="mt-2 text-base text-gray-300 sm:text-lg">
          Odvojite potrebne predmete od nepotrebnih
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
            Sređeno: {sortedCount} / {totalUnnecessary}
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
              <span className="text-sm font-semibold text-white">+1 Sređeno!</span>
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
          className="order-1 relative z-20 rounded-xl border-2 border-blue-400/50 bg-blue-900/30 p-4 backdrop-blur-sm lg:order-1 sm:p-6"
        >
          <h3 className="mb-2 text-xl font-semibold text-blue-300 sm:mb-3 sm:text-2xl">
            Očisti radni prostor
          </h3>
          <p className="mb-4 text-sm text-blue-200 sm:mb-6 sm:text-base">
            Nepotrebne stvari baci u crvenu zonu.
          </p>
          
          {/* Items in Workspace - Messy grid layout */}
          <div className="relative grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
            {shuffledItems
              .filter(item => !sortedItems.has(item.id))
              .map((item, index) => (
              <DraggableItem
                key={item.id}
                item={item}
                index={index}
                onDragEnd={handleDragEnd}
                onDrag={handleDrag}
                onDragStart={handleDragStart}
                showError={errorMessage !== null}
              />
            ))}
            
            {/* Animated Tutorial Hand */}
            <AnimatePresence>
              {showTutorial && !hasStartedDragging && tutorialLoop < 3 && (
                <motion.div
                  className="absolute pointer-events-none z-50"
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 1, 0],
                    x: [0, 0, 150, 150, 150],
                    y: [0, 0, -50, -50, -50]
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
                    top: '60px'
                  }}
                >
                  <Hand className="h-12 w-12 text-yellow-300 drop-shadow-2xl" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Red Tag Area - Zona crvenih etiketa */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="order-2 relative z-10 rounded-xl border-2 border-red-400/50 bg-red-900/30 p-4 backdrop-blur-sm lg:order-2 sm:p-6"
        >
          <h3 className="mb-3 text-xl font-semibold text-red-300 sm:mb-4 sm:text-2xl">
            Zona crvenih etiketa
          </h3>
          <p className="mb-4 text-xs text-gray-300 sm:mb-6 sm:text-sm">
            Ovde stavite nepotrebne ili polomljene predmete
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
                Prevucite predmete ovde
              </p>
              <p className="mt-2 text-xs text-gray-400 sm:mt-2 sm:text-sm">
                Predmeti koji su polomljeni, nepotrebnih ili retko korišćeni
              </p>
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
          Uputstva:
        </h4>
        <ul className="list-inside list-disc space-y-1 text-xs text-gray-300 sm:text-sm">
          <li>Identifikujte predmete koji su neophodni za svakodnevni rad</li>
          <li>Označite i premestite nepotrebne predmete u Zonu crvenih etiketa</li>
          <li>Zadržite samo esencijalne predmete u Radnom prostoru</li>
          <li>Dokumentujte odluke za svaki predmet</li>
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
              Svaka čast!
            </h3>
            <p className="mb-6 text-center text-gray-300">
              Prvi korak (Sortiranje) je uspešno završen. Spremni ste za Seiton (Sređivanje)?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSuccessModal(false)}
              className="w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-green-500/25"
            >
              Nastavi
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

function DraggableItem({ item, index, onDragEnd, onDrag, onDragStart, showError }: { 
  item: Item; 
  index: number; 
  onDragEnd: (item: Item, info: PanInfo) => boolean | void;
  onDrag: (info: PanInfo) => void;
  onDragStart: () => void;
  showError: boolean;
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

  return (
    <motion.div
      drag
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
        borderColor: showError && item.type === 'valid' ? 'rgba(239, 68, 68, 0.8)' :
                    item.color === 'red' ? 'rgba(239, 68, 68, 0.3)' :
                    item.color === 'gray' ? 'rgba(75, 85, 99, 0.3)' :
                    item.color === 'green' ? 'rgba(34, 197, 94, 0.3)' :
                    item.color === 'blue' ? 'rgba(59, 130, 246, 0.3)' :
                    item.color === 'purple' ? 'rgba(168, 85, 247, 0.3)' :
                    item.color === 'yellow' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(75, 85, 99, 0.3)'
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 + (index * 0.05) }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      whileDrag={{ 
        scale: 1.1, 
        zIndex: 100, 
        cursor: 'grabbing',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
      }}
      className="cursor-grab rounded-lg p-3 border sm:p-4 touch-none relative"
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
        {item.name}
      </p>
    </motion.div>
  );
}
