'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Clock, AlertTriangle, Wrench, Package, Settings, ChevronRight, Play, Clipboard, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

// Language dictionary
const translations = {
  sr: {
    backToModules: 'Nazad na module',
    title: 'SMED - Brza Promena Alata',
    subtitle: 'Smanjite vreme promene alata na manje od 10 minuta kroz optimizaciju procesa',
    machineDown: 'Mašina u zastoju',
    currentTime: 'Trenutno vreme',
    changeoverTasks: 'Zadaci promene alata',
    tasks: [
      'Priprema i provera tehničke dokumentacije i kontrolnog lista (check-liste)',
      'Donošenje novog alata (kalupa) iz magacina kolicima pored mašine',
      'Donošenje potrebnih steznih alata (ključeva, imbusa) do same mašine',
      'Pregrevanje novog alata na radnu temperaturu',
      'Zaustavljanje mašine i isključivanje pritiska',
      'Odvrtanje i skidanje starog alata sa mašine',
      'Čišćenje i podmazivanje ležišta na mašini',
      'Fizičko centriranje i nivelisanje novog alata na radnom stolu',
      'Povezivanje hidrauličnih i električnih instalacija na novi alat',
      'Postavljanje i zavrtanje novog alata',
      'Pokretanje mašine i probni rad (prva tri komada)',
      'Odlaganje starog alata nazad u magacin i čišćenje radnog prostora'
    ],
    instructions: 'Uputstva',
    whatIsSmed: 'Šta je SMED?',
    smedDescription: 'SMED (Single-Minute Exchange of Die) je metodologija Lean proizvodnje koja ima za cilj drastično smanjenje vremena potrebnog za promenu alata ili kalupa na proizvodnoj liniji.',
    internalTime: 'Interno vreme (IED)',
    internalTimeDesc: 'Operacije koje se moraju izvršiti dok je mašina zaustavljena (npr. zamena alata, podešavanje).',
    externalTime: 'Eksterno vreme (OED)',
    externalTimeDesc: 'Operacije koje se mogu izvršiti dok mašina još radi (npr. priprema alata, dovlačenje materijala).',
    simulationGoal: 'Cilj simulacije',
    simulationGoalDesc: 'Identifikujte koje operacije mogu biti prebačene iz interne u eksternu vremensku kategoriju kako biste smanjili ukupno vreme zastoja mašine.',
    startOptimization: 'Započni optimizaciju',
    classifyAs: 'Klasifikuj kao',
    internal: 'Interno (IED)',
    external: 'Eksterno (OED)',
    internalColumn: 'Interno Vreme (IED)',
    externalColumn: 'Eksterno Vreme (OED)',
    activeTask: 'Aktivan zadatak',
    classifyTask: 'Klasifikuj ovaj zadatak',
    successClassification: 'Uspešno klasifikovano!',
    errorTask1External: 'Ova operacija se može izvršiti dok mašina radi - priprema dokumentacije ne zahteva zaustavljanje mašine.',
    errorTask2External: 'Ova operacija se može izvršiti dok mašina radi - donošenje alata ne zahteva zaustavljanje mašine.',
    errorTask3External: 'Ova operacija se može izvršiti dok mašina radi - donošenje alata ne zahteva zaustavljanje mašine.',
    errorTask4External: 'Ova operacija se može izvršiti dok mašina radi - pregrevanje se može pripremiti unapred.',
    errorTask5External: 'Ova operacija je striktno interna jer se mašina mora potpuno zaustaviti i osigurati pre bilo kakve intervencije.',
    errorTask6External: 'Odvrtanje starog kalupa se fizički ne može raditi dok presa radi, te spada u interno vreme.',
    errorTask7External: 'Čišćenje i podmazivanje kliznih površina zahteva statičku mašinu radi bezbednosti operatera.',
    errorTask8External: 'Nivelisanje i precizno centriranje novog kalupa se radi direktno na mašini dok ona stoji.',
    errorTask9External: 'Priključivanje energetskih i hidrauličnih vodova vrši se isključivo na zaustavljenoj mašini.',
    errorTask10External: 'Fiksiranje novog alata za glavu prese zahteva da mašina miruje.',
    errorTask11External: 'Probni rad i fina podešavanja zahtevaju zaustavljanje regularne proizvodnje, što ovo vreme čini internim.',
    errorTask12Internal: 'Ova operacija se može izvršiti dok mašina radi - odlaganje starog alata ne zahteva mašinu.',
    currentProcessLength: 'Trenutna dužina procesa',
    analyzingChangeover: 'Analiza toka zamene alata...',
    processOptimized: 'Proces uspešno optimizovan!',
    machineRunning: 'Mašina u radu',
    productionInProgress: 'Status: Proizvodnja u toku (Prethodna serija)',
    externalPrep: 'Status: Eksterna priprema (Mašina i dalje radi)',
    machineStopped: 'Status: Mašina zaustavljena — Zamena alata u toku',
    newProductionStarted: 'Status: Pokrenuta nova proizvodnja (Optimizovano vreme: 08:30)',
    genericError: 'Pogrešna klasifikacija. Pokušajte ponovo.',
    congratulations: 'Čestitamo!',
    successMessage: 'Uspešno ste smanjili vreme promene alata na 08:30 minuta!',
    resetSimulation: 'Ponovi simulaciju',
    tasksClassified: 'zadataka klasifikovano'
  },
  en: {
    backToModules: 'Back to Modules',
    title: 'SMED - Single-Minute Exchange of Die',
    subtitle: 'Reduce changeover time to under 10 minutes through process optimization',
    machineDown: 'Machine Down',
    currentTime: 'Current Time',
    changeoverTasks: 'Changeover Tasks',
    tasks: [
      'Preparation and verification of technical documentation and check-list',
      'Bringing the new tool (die) from the warehouse to the machine side',
      'Bringing the necessary clamping tools (wrenches, allen keys) to the machine',
      'Preheating the new tool to operating temperature',
      'Stopping the machine and shutting off pressure',
      'Unscrewing and removing the old tool from the machine',
      'Cleaning and lubricating the machine bed',
      'Physical centering and leveling of the new tool on the machine bed',
      'Connecting hydraulic and electrical lines to the new tool',
      'Mounting and clamping the new tool',
      'Starting the machine and test running (first three pieces)',
      'Returning the old tool to the warehouse and cleaning the workspace'
    ],
    instructions: 'Instructions',
    whatIsSmed: 'What is SMED?',
    smedDescription: 'SMED (Single-Minute Exchange of Die) is a Lean manufacturing methodology aimed at drastically reducing the time required to change tools or molds on a production line.',
    internalTime: 'Internal Time (IED)',
    internalTimeDesc: 'Operations that must be performed while the machine is stopped (e.g., tool replacement, adjustment).',
    externalTime: 'External Time (OED)',
    externalTimeDesc: 'Operations that can be performed while the machine is still running (e.g., tool preparation, material retrieval).',
    simulationGoal: 'Simulation Goal',
    simulationGoalDesc: 'Identify which operations can be moved from internal to external time category to reduce overall machine downtime.',
    startOptimization: 'Start Optimization',
    classifyAs: 'Classify as',
    internal: 'Internal (IED)',
    external: 'External (OED)',
    internalColumn: 'Internal Time (IED)',
    externalColumn: 'External Time (OED)',
    activeTask: 'Active Task',
    classifyTask: 'Classify this task',
    successClassification: 'Successfully classified!',
    errorTask1External: 'This operation CAN be performed while the machine is running - documentation preparation does not require stopping the machine.',
    errorTask2External: 'This operation CAN be performed while the machine is running - bringing tools does not require stopping the machine.',
    errorTask3External: 'This operation CAN be performed while the machine is running - bringing tools does not require stopping the machine.',
    errorTask4External: 'This operation CAN be performed while the machine is running - preheating can be prepared in advance.',
    errorTask5External: 'This operation is strictly internal as the machine must be completely stopped and secured before any intervention.',
    errorTask6External: 'Unscrewing the old mold cannot physically be done while the press is running, so it falls under internal time.',
    errorTask7External: 'Cleaning and lubricating sliding surfaces requires a static machine for operator safety.',
    errorTask8External: 'Leveling and precise centering of the new mold is done directly on the machine while it is stopped.',
    errorTask9External: 'Connecting energy and hydraulic lines is performed exclusively on a stopped machine.',
    errorTask10External: 'Fixing the new tool to the press head requires the machine to be idle.',
    errorTask11External: 'Test running and fine adjustments require stopping regular production, making this time internal.',
    errorTask12Internal: 'This operation CAN be performed while the machine is running - returning old tools does not require the machine.',
    currentProcessLength: 'Current process length',
    analyzingChangeover: 'Analyzing changeover flow...',
    processOptimized: 'Process successfully optimized!',
    machineRunning: 'Machine Running',
    productionInProgress: 'Status: Production in progress (Previous batch)',
    externalPrep: 'Status: External prep (Machine is running)',
    machineStopped: 'Status: Machine stopped — Changeover in progress',
    newProductionStarted: 'Status: New production started (Optimized time: 08:30)',
    genericError: 'Incorrect classification. Try again.',
    congratulations: 'Congratulations!',
    successMessage: 'Successfully reduced changeover time to 08:30 minutes!',
    resetSimulation: 'Reset Simulation',
    tasksClassified: 'tasks classified'
  }
};

type Language = 'sr' | 'en';
type TaskStatus = 'unassigned' | 'internal' | 'external';

// Correct classifications: External tasks are 0, 1, 2, 3, 11; Internal tasks are 4, 5, 6, 7, 8, 9, 10
const correctClassifications: TaskStatus[] = ['external', 'external', 'external', 'external', 'internal', 'internal', 'internal', 'internal', 'internal', 'internal', 'internal', 'external'];

// Timer reductions for each external task (in minutes)
const timerReductions: number[] = [4, 8, 5, 11, 0, 0, 0, 0, 0, 0, 0, 8.5];

export default function SmedPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [isSimulating, setIsSimulating] = useState(false);
  const [taskStatus, setTaskStatus] = useState<TaskStatus[]>(Array(12).fill('unassigned'));
  const [currentTime, setCurrentTime] = useState(45); // 45 minutes
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);

  const startSimulation = () => {
    setIsSimulating(true);
    setTaskStatus(Array(12).fill('unassigned'));
    setCurrentTime(45);
    setErrorMessage(null);
    setActiveTaskIndex(0);
  };

  const classifyTask = (taskIndex: number, classification: TaskStatus) => {
    const correctClassification = correctClassifications[taskIndex];
    
    if (classification === correctClassification) {
      // Correct classification
      const newStatus = [...taskStatus];
      newStatus[taskIndex] = classification;
      setTaskStatus(newStatus);
      setErrorMessage(null);
      
      // Reduce time if classified as external (use specific reduction for this task)
      if (classification === 'external') {
        setCurrentTime(prev => Math.max(8.5, prev - timerReductions[taskIndex]));
      }
      
      // Move to next unassigned task
      const nextUnassigned = newStatus.findIndex((status, idx) => status === 'unassigned' && idx > taskIndex);
      if (nextUnassigned === -1) {
        // All tasks classified - set final optimized time
        setCurrentTime(8.5);
        setActiveTaskIndex(null);
        setShowSuccessModal(true);
      } else {
        setActiveTaskIndex(nextUnassigned);
      }
    } else {
      // Incorrect classification - show educational error message
      let errorMsg = '';
      if (language === 'sr') {
        if (taskIndex === 0 && classification === 'internal') errorMsg = t.errorTask1External;
        else if (taskIndex === 1 && classification === 'internal') errorMsg = t.errorTask2External;
        else if (taskIndex === 2 && classification === 'internal') errorMsg = t.errorTask3External;
        else if (taskIndex === 3 && classification === 'internal') errorMsg = t.errorTask4External;
        else if (taskIndex === 4 && classification === 'external') errorMsg = t.errorTask5External;
        else if (taskIndex === 5 && classification === 'external') errorMsg = t.errorTask6External;
        else if (taskIndex === 6 && classification === 'external') errorMsg = t.errorTask7External;
        else if (taskIndex === 7 && classification === 'external') errorMsg = t.errorTask8External;
        else if (taskIndex === 8 && classification === 'external') errorMsg = t.errorTask9External;
        else if (taskIndex === 9 && classification === 'external') errorMsg = t.errorTask10External;
        else if (taskIndex === 10 && classification === 'external') errorMsg = t.errorTask11External;
        else if (taskIndex === 11 && classification === 'internal') errorMsg = t.errorTask12Internal;
        else errorMsg = t.genericError;
      } else {
        if (taskIndex === 0 && classification === 'internal') errorMsg = t.errorTask1External;
        else if (taskIndex === 1 && classification === 'internal') errorMsg = t.errorTask2External;
        else if (taskIndex === 2 && classification === 'internal') errorMsg = t.errorTask3External;
        else if (taskIndex === 3 && classification === 'internal') errorMsg = t.errorTask4External;
        else if (taskIndex === 4 && classification === 'external') errorMsg = t.errorTask5External;
        else if (taskIndex === 5 && classification === 'external') errorMsg = t.errorTask6External;
        else if (taskIndex === 6 && classification === 'external') errorMsg = t.errorTask7External;
        else if (taskIndex === 7 && classification === 'external') errorMsg = t.errorTask8External;
        else if (taskIndex === 8 && classification === 'external') errorMsg = t.errorTask9External;
        else if (taskIndex === 9 && classification === 'external') errorMsg = t.errorTask10External;
        else if (taskIndex === 10 && classification === 'external') errorMsg = t.errorTask11External;
        else if (taskIndex === 11 && classification === 'internal') errorMsg = t.errorTask12Internal;
        else errorMsg = t.genericError;
      }
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setTaskStatus(Array(12).fill('unassigned'));
    setCurrentTime(45);
    setErrorMessage(null);
    setShowSuccessModal(false);
    setActiveTaskIndex(null);
  };

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTaskIcon = (index: number) => {
    switch (index) {
      case 0: return <Settings className="h-4 w-4 text-purple-400" />;
      case 1: return <Package className="h-4 w-4 text-purple-400" />;
      case 2: return <Wrench className="h-4 w-4 text-purple-400" />;
      case 3: return <Wrench className="h-4 w-4 text-purple-400" />;
      case 4: return <Wrench className="h-4 w-4 text-purple-400" />;
      case 5: return <Package className="h-4 w-4 text-purple-400" />;
      case 6: return <Settings className="h-4 w-4 text-purple-400" />;
      case 7: return <Settings className="h-4 w-4 text-purple-400" />;
      case 8: return <Settings className="h-4 w-4 text-purple-400" />;
      case 9: return <Settings className="h-4 w-4 text-purple-400" />;
      case 10: return <Play className="h-4 w-4 text-purple-400" />;
      case 11: return <Clipboard className="h-4 w-4 text-purple-400" />;
      default: return <Settings className="h-4 w-4 text-purple-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Top Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <Link href="/moduli">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-slate-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backToModules}
              </Button>
            </Link>
          </div>
          
          <div className="mt-6 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              {t.title}
            </h1>
            <p className="mt-3 text-lg text-gray-400 sm:text-xl">
              {t.subtitle}
            </p>
          </div>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Side - Machine/Stopwatch */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl border-2 border-red-400/30 bg-gradient-to-br from-red-900/20 to-slate-900/50 p-6 backdrop-blur-sm"
          >
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white">
                {isSimulating ? t.currentProcessLength : t.currentTime}
              </h3>
            </div>
            
            {/* Machine Visual */}
            <div className="relative mb-6 rounded-lg bg-slate-800/50 p-8 border border-slate-700">
              <div className="flex items-center justify-center">
                <div className="relative">
                  {/* Stopwatch/Timer */}
                  <div className={`flex items-center justify-center rounded-full bg-slate-900 border-4 w-48 h-48 sm:w-56 sm:h-56 shadow-2xl ${showSuccessModal ? 'border-green-500/50 shadow-green-500/20' : 'border-red-500/50 shadow-red-500/20'}`}>
                    {/* Time Display */}
                    <span className={`text-5xl font-bold sm:text-6xl ${showSuccessModal ? 'text-green-400' : 'text-red-400'}`}>
                      {formatTime(currentTime)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="mt-6 flex items-center justify-center">
                {showSuccessModal ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 rounded-full bg-green-900/80 px-4 py-2 border border-green-500/50"
                  >
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="font-semibold text-green-300">{t.processOptimized}</span>
                  </motion.div>
                ) : isSimulating ? (
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-900/80 px-4 py-2 border border-blue-500/50"
                  >
                    <AlertTriangle className="h-5 w-5 text-blue-400" />
                    <span className="font-semibold text-blue-300">{t.analyzingChangeover}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-green-900/80 px-4 py-2 border border-green-500/50"
                  >
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="font-semibold text-green-300">{t.machineRunning}</span>
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Machine Status */}
            <div className="rounded-lg bg-slate-800/30 p-4 border border-slate-700">
              <div className="flex items-center gap-3">
                {showSuccessModal ? (
                  <>
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-green-400">{t.newProductionStarted}</span>
                  </>
                ) : isSimulating ? (
                  <>
                    {activeTaskIndex !== null && activeTaskIndex < 4 ? (
                      <>
                        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-green-400">{t.externalPrep}</span>
                      </>
                    ) : (
                      <>
                        <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-sm text-red-400">{t.machineStopped}</span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-green-400">{t.productionInProgress}</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Changeover Tasks or Simulation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-xl border-2 border-slate-600/30 bg-gradient-to-br from-slate-800/30 to-slate-900/50 p-6 backdrop-blur-sm"
          >
            {!isSimulating ? (
              <>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white">{t.changeoverTasks}</h3>
                </div>
                
                {/* Task List */}
                <div className="space-y-3">
                  {t.tasks.map((task, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + (index * 0.1) }}
                      className="flex items-center gap-3 rounded-lg bg-slate-800/50 p-4 border border-slate-700 hover:border-slate-600 hover:bg-slate-800/70 transition-all cursor-pointer group"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600/20 border border-purple-500/30">
                        {getTaskIcon(index)}
                      </div>
                      <span className="flex-1 text-sm text-gray-300 group-hover:text-white transition-colors">
                        {task}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                    </motion.div>
                  ))}
                </div>
                
                {/* Start Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="mt-6"
                >
                  <Button 
                    onClick={startSimulation}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                  >
                    {t.startOptimization}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </>
            ) : (
              <>
                {/* Simulation Dashboard */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white">{t.classifyTask}</h3>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 rounded-lg bg-red-900/30 border border-red-500/50 p-3"
                  >
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-300">{errorMessage}</p>
                    </div>
                  </motion.div>
                )}

                {/* Active Task Card */}
                {activeTaskIndex !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 rounded-xl bg-gradient-to-br from-purple-900/30 to-slate-900/50 p-6 border-2 border-purple-500/50"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/30 border border-purple-500/50">
                        {getTaskIcon(activeTaskIndex)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-purple-300 mb-1">{t.activeTask} #{activeTaskIndex + 1}</p>
                        <p className="text-base font-semibold text-white">{t.tasks[activeTaskIndex]}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => classifyTask(activeTaskIndex, 'internal')}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold border border-red-500/50"
                      >
                        {t.internal}
                      </Button>
                      <Button
                        onClick={() => classifyTask(activeTaskIndex, 'external')}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold border border-green-500/50"
                      >
                        {t.external}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Classification Columns */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Internal Column */}
                  <div className="rounded-xl border-2 border-red-500/30 bg-red-900/10 p-4">
                    <h4 className="mb-3 text-sm font-semibold text-red-400 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      {t.internalColumn}
                    </h4>
                    <div className="space-y-2">
                      {taskStatus.map((status, index) => 
                        status === 'internal' ? (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 rounded-lg bg-red-900/30 p-3 border border-red-500/30"
                          >
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600/20">
                              {getTaskIcon(index)}
                            </div>
                            <span className="text-xs text-red-200 line-clamp-2">{t.tasks[index]}</span>
                          </motion.div>
                        ) : null
                      )}
                    </div>
                  </div>

                  {/* External Column */}
                  <div className="rounded-xl border-2 border-green-500/30 bg-green-900/10 p-4">
                    <h4 className="mb-3 text-sm font-semibold text-green-400 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      {t.externalColumn}
                    </h4>
                    <div className="space-y-2">
                      {taskStatus.map((status, index) => 
                        status === 'external' ? (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 rounded-lg bg-green-900/30 p-3 border border-green-500/30"
                          >
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600/20">
                              {getTaskIcon(index)}
                            </div>
                            <span className="text-xs text-green-200 line-clamp-2">{t.tasks[index]}</span>
                          </motion.div>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4 rounded-lg bg-slate-800/50 p-3 border border-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {taskStatus.filter(s => s !== 'unassigned').length} / 12 {t.tasksClassified}
                    </span>
                    <span className="text-purple-400 font-semibold">
                      {Math.round((taskStatus.filter(s => s !== 'unassigned').length / 12) * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-700 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${(taskStatus.filter(s => s !== 'unassigned').length / 12) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Bottom Instructions Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 rounded-xl border border-slate-700 bg-slate-800/30 p-6 backdrop-blur-sm"
        >
          <h3 className="mb-4 text-xl font-semibold text-white">{t.instructions}</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* What is SMED */}
            <div className="rounded-lg bg-slate-900/50 p-4 border border-slate-700">
              <h4 className="mb-2 font-semibold text-purple-400">{t.whatIsSmed}</h4>
              <p className="text-sm text-gray-400">{t.smedDescription}</p>
            </div>
            
            {/* Internal Time */}
            <div className="rounded-lg bg-slate-900/50 p-4 border border-slate-700">
              <h4 className="mb-2 font-semibold text-red-400">{t.internalTime}</h4>
              <p className="text-sm text-gray-400">{t.internalTimeDesc}</p>
            </div>
            
            {/* External Time */}
            <div className="rounded-lg bg-slate-900/50 p-4 border border-slate-700">
              <h4 className="mb-2 font-semibold text-green-400">{t.externalTime}</h4>
              <p className="text-sm text-gray-400">{t.externalTimeDesc}</p>
            </div>
            
            {/* Simulation Goal */}
            <div className="rounded-lg bg-slate-900/50 p-4 border border-slate-700">
              <h4 className="mb-2 font-semibold text-blue-400">{t.simulationGoal}</h4>
              <p className="text-sm text-gray-400">{t.simulationGoalDesc}</p>
            </div>
          </div>
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
                {t.congratulations}
              </h3>
              <p className="mb-6 text-center text-gray-300">
                {t.successMessage}
              </p>
              <div className="grid gap-3">
                <Button
                  onClick={resetSimulation}
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
