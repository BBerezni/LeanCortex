'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const vsmTranslations = {
  sr: {
    backToModules: 'Nazad na module',
    title: 'Mapiranje toka vrednosti (VSM)',
    subtitle: 'Analizirajte i optimizujte tok materijala i informacija',
    phases: ['Trenutno stanje', 'Proračun metrika', 'Buduće stanje'],
    phase1: 'Trenutno stanje',
    phase2: 'Proračun metrika',
    phase3: 'Buduće stanje',
    currentPhase: 'Trenutna faza',
    step: 'Korak',
    of: 'od',
    nextPhase: 'Sledeća faza',
    previousPhase: 'Prethodna faza',
    // Step 1 translations
    problemTitle: 'Izgradite tok proizvodnje',
    problemDescription: 'Poredajte elemente lanca snabdevanja u ispravnom logičkom redosledu za liniju za sklapanje zvučnika.',
    toolbox: 'Alatnica',
    verifyInfoFlow: 'Proveri tok informacija',
    verifyMaterialFlow: 'Proveri tok materijala',
    successMessage: 'Čestitamo! Tok je ispravan.',
    hintMessage: 'Pokušajte ponovo. Materijal teče od dobavljača do kupca.',
    infoFlowSuccess: 'Tok informacija je ispravan!',
    materialFlowSuccess: 'Tok materijala je ispravan!',
    // Specific error messages
    errorSupplierNotFirst: 'Svaki tok vrednosti počinje od spoljnog izvora sirovina. Postavite Dobavljača na sam početak lanca.',
    errorCustomerNotLast: 'Krajnji cilj Lean-a je isporuka vrednosti. Kupac uvek mora biti na samom kraju toka.',
    errorRawMaterialsAfterAssembly: 'Materijal od dobavljača prvo mora negde da se skladišti pre nego što uđe u proizvodni pogon.',
    errorQualityBeforeAssembly: 'Logički redosled: Proizvod prvo mora biti sklopljen u pogonu da bi uopšte mogao da prođe kontrolu kvaliteta.',
    errorFinishedGoodsMisplaced: 'Nakon što kontrola potvrdi da je proizvod ispravan, on ide u magacin gotovih proizvoda pre slanja kupcu.',
    errorInfoFlowIncorrect: 'Proverite tok informacija: Razmislite koja prognoza dolazi sa desne strane od kupca u MRP, šta MRP šalje levo ka dobavljaču, a šta šalje vertikalno dole direktno u pogon za Sklapanje.',
    errorMaterialFlowIncorrect: 'Proverite tok materijala: Tok mora teći uzastopno prateći lanac od dobavljača, preko skladišta i proizvodnih procesa, sve do krajnjeg kupca.',
    items: {
      supplier: 'Dobavljač',
      rawMaterials: 'Magacin sirovina',
      assembly: 'Pogon za sklapanje',
      qualityControl: 'Kontrola kvaliteta',
      finishedGoods: 'Magacin gotovih proizvoda',
      customer: 'Kupac',
      // Information flow items
      weeklyForecast: 'Nedeljna prognoza',
      productionControl: 'Upravljanje proizvodnjom (MRP)',
      monthlyForecast: 'Mesečna prognoza',
      dailyWorkOrders: 'Dnevni radni nalozi'
    },
    // Step 2 translations
    metricsTitle: 'Proračun metrika',
    metricsDescription: 'Izračunajte Lean metrike na osnovu podataka o proizvodnji zvučnika.',
    customerDemand: 'Potražnja kupca',
    assemblyCycleTime: 'Vreme ciklusa sklapanja (C/T)',
    qualityCycleTime: 'Vreme ciklusa kontrole (C/T)',
    rawMaterialsInventory: 'Zalihe sirovina',
    wipInventory: 'Zalihe u procesu (WIP)',
    unitsPerDay: 'jedinica/dan',
    minutes: 'minuta',
    units: 'jedinica',
    rawInventoryDays: 'Dani zaliha sirovina',
    wipInventoryDays: 'Dani zaliha u procesu',
    totalValueAddedTime: 'Ukupno vreme dodavanja vrednosti (VA) (sekunde)',
    totalNonValueAddedTime: 'Proizvodno Lead Time vreme (NVA) (dana)',
    days: 'dana',
    verifyMetrics: 'Proveri metrike',
    metricsSuccess: 'Čestitamo! Metrike su ispravne. Zalihe održavaju vreme isporuke na 7 dana.',
    metricsError: 'Pokušajte ponovo. Proverite svoje proračune.',
    timelineTitle: 'Vremenska linija toka vrednosti',
    rawMaterials: 'Sirovine',
    assembly: 'Sklapanje',
    qualityControl: 'Kontrola',
    finishedGoods: 'Gotovi proizvodi',
    valueAdded: 'VA (Dodavanje vrednosti)',
    nonValueAdded: 'NVA (Bez dodavanja vrednosti)',
    // Input placeholders and formula hints
    enterValue: 'Unesite vrednost',
    rawInventoryDaysHint: 'Količina zaliha sirovina / Dnevna tražnja',
    wipInventoryDaysHint: 'Količina WIP zaliha / Dnevna tražnja',
    totalValueAddedTimeHint: 'Zbir ciklusnih vremena svih procesa (C/T)',
    totalNonValueAddedTimeHint: 'Ukupan zbir dana provedenih u svim zalihama',
    continueToMetrics: 'Nastavi na proračun metrika',
    continueToFuture: 'Nastavi na buduće stanje',
    calculateLeanMetrics: 'Proračun Lean metrika',
    timelinePlaceholder: 'Vremenska linija će se generisati nakon tačnog proračuna metrika.',
    // PCE Summary translations
    totalLeadTime: 'Ukupno vreme isporuke (Lead Time)',
    totalProcessingTime: 'Ukupno vreme procesiranja (Processing Time)',
    processCycleEfficiency: 'Efikasnost ciklusa procesa (PCE)',
    pceTakeaway: 'Uočite kako proizvod provodi više od 99.9% vremena čekajući u zalihama! Naš cilj u sledećoj fazi je uvođenje Kanban sistema kako bismo drastično smanjili ove visoke stepenike čekanja.',
    // Information Flow translations
    informationFlow: 'Tok informacija',
    materialFlow: 'Tok materijala',
    productionControl: 'Upravljanje proizvodnjom (MRP)',
    weeklyForecast: 'Nedeljna prognoza',
    monthlyForecast: 'Mesečna prognoza',
    dailyWorkOrders: 'Dnevni radni nalozi',
    // Data Box translations
    dataBox: 'Podaci o procesu',
    cycleTime: 'Ciklusno vreme (C/T)',
    changeoverTime: 'Vreme promene (C/O)',
    availability: 'Dostupnost',
    // New time units
    seconds: 'sekundi',
    secondsShort: 's',
    // VSM Summary Block
    vsmSummary: 'VSM Pregled',
    leadTime: 'Vreme isporuke (Lead Time)',
    valueAddedTime: 'Vreme dodavanja vrednosti (VA)',
    // Updated PCE calculation
    pceCalculation: 'PCE = (90s / 201,600s) × 100% = 0.045% (bazirano na 8-satnoj smeni)',
    pceFullName: 'PCE (Efikasnost ciklusa procesa - Process Cycle Efficiency)',
    pceExplanation: 'PCE predstavlja udeo vremena u kojem se proizvodu stvarno dodaje vrednost u odnosu na ukupno vreme koje on provede u fabrici. Vrednost od 0.045% jasno pokazuje da proizvod skoro 99.95% vremena provodi čekajući u zalihama kao gubitak.',
    // Phase 3: Future State translations
    phase3Question: 'Koje Lean/Kaizen alate moramo primeniti kako bismo eliminisali gubitke? (Izaberite tačno 2 tačna odgovora)',
    kaizenOption1: 'Uvođenje Kontinualnog toka / Ćelijska proizvodnja',
    kaizenOption2: 'Uvođenje Kanban supermarketa za sirovine',
    kaizenOption3: 'Nabavka bržih transportnih kamiona',
    kaizenOption4: 'Zapošljavanje još 3 operatera na kontroli kvaliteta',
    applyImprovements: 'Primeni unapređenja',
    kaizenError: 'Pokušajte ponovo. Lean se fokusira na eliminaciju gubitaka (zalihe), a ne na ubrzanje kamiona ili povećanje broja zaposlenih.',
    kaizenSelectionError: 'Molimo izaberite tačno 2 Lean alata kako biste pokrenuli transformaciju.',
    kaizenSuccess: 'Čestitamo! Izabrali ste prave Kaizen alate. Kontinualni tok eliminiše WIP bafer na 0 jedinica (0 dana), a Kanban supermarket smanjuje zalihe sirovina sa 500 na kontrolnih 50 jedinica (0.5 dana).',
    restartSimulation: 'Ponovi simulaciju',
    futureStateTitle: 'Buduće stanje (TO-BE)',
    currentStateTitle: 'Postojeće stanje (AS-IS)',
    comparisonTable: 'Poređenje stanja',
    comparisonRawInventory: 'Zalihe sirovina',
    comparisonWipInventory: 'Zalihe u procesu (WIP)',
    comparisonTotalLeadTime: 'Ukupno vreme isporuke (Lead Time)',
    comparisonVaTime: 'Vreme dodavanja vrednosti (VA)',
    comparisonPceEfficiency: 'PCE Efikasnost',
    improvement: 'Poboljšanje',
    futurePceCalculation: 'PCE = (90s / 14,400s) × 100% = 0.625% (bazirano na 8-satnoj smeni)',
    congratulations: 'Čestitamo! Uspešno ste završili simulaciju Lean fabrike zvučnika. Naučili ste kako da identifikujete gubitke i primenite Kaizen alate za drastično poboljšanje efikasnosti procesa.',
  },
  en: {
    backToModules: 'Back to Modules',
    title: 'Value Stream Mapping (VSM)',
    subtitle: 'Analyze and optimize the flow of materials and information',
    phases: ['Current State', 'Metrics Calculation', 'Future State'],
    phase1: 'Current State',
    phase2: 'Metrics Calculation',
    phase3: 'Future State',
    currentPhase: 'Current Phase',
    step: 'Step',
    of: 'of',
    nextPhase: 'Next Phase',
    previousPhase: 'Previous Phase',
    // Step 1 translations
    problemTitle: 'Build the Production Flow',
    problemDescription: 'Arrange the supply chain elements in the correct logical sequence for a speaker assembly line.',
    toolbox: 'Toolbox',
    verifyInfoFlow: 'Verify Information Flow',
    verifyMaterialFlow: 'Verify Material Flow',
    successMessage: 'Congratulations! The flow is correct.',
    hintMessage: 'Try again. Material flows from supplier to customer.',
    infoFlowSuccess: 'Information flow is correct!',
    materialFlowSuccess: 'Material flow is correct!',
    // Specific error messages
    errorSupplierNotFirst: 'Every value stream starts with an external source of materials. Place the Supplier at the very beginning.',
    errorCustomerNotLast: 'The ultimate goal of Lean is delivering value. The Customer must always be at the very end of the stream.',
    errorRawMaterialsAfterAssembly: 'Materials from the supplier must first be stored somewhere before entering the assembly floor.',
    errorQualityBeforeAssembly: 'Logical sequence: A product must be assembled first before it can undergo quality control inspection.',
    errorFinishedGoodsMisplaced: 'Once quality control approves the product, it moves to the Finished Goods Warehouse before shipping.',
    errorInfoFlowIncorrect: 'Check your information flow: Consider which forecast comes from the customer on the right into MRP, what MRP sends left to the supplier, and what it dispatches vertically down into the Assembly shop.',
    errorMaterialFlowIncorrect: 'Check your material flow: The flow must run sequentially following the chain from the supplier, through warehouses and production processes, all the way to the end customer.',
    items: {
      supplier: 'Supplier',
      rawMaterials: 'Raw Materials Inventory',
      assembly: 'Assembly Process',
      qualityControl: 'Quality Control',
      finishedGoods: 'Finished Goods Warehouse',
      customer: 'Customer',
      // Information flow items
      weeklyForecast: 'Weekly Forecast',
      productionControl: 'Production Control (MRP)',
      monthlyForecast: 'Monthly Forecast',
      dailyWorkOrders: 'Daily Work Orders'
    },
    // Step 2 translations
    metricsTitle: 'Metrics Calculation',
    metricsDescription: 'Calculate Lean metrics based on the speaker production data.',
    customerDemand: 'Customer Demand',
    assemblyCycleTime: 'Assembly Cycle Time (C/T)',
    qualityCycleTime: 'Quality Cycle Time (C/T)',
    rawMaterialsInventory: 'Raw Materials Inventory',
    wipInventory: 'Work-in-Progress (WIP) Inventory',
    unitsPerDay: 'units/day',
    minutes: 'minutes',
    units: 'units',
    rawInventoryDays: 'Raw Inventory Days',
    wipInventoryDays: 'WIP Inventory Days',
    totalValueAddedTime: 'Total Value-Added (VA) Time (seconds)',
    totalNonValueAddedTime: 'Production Lead Time (NVA) (days)',
    days: 'days',
    verifyMetrics: 'Verify Metrics',
    metricsSuccess: 'Congratulations! Metrics are correct. Inventory is keeping the Lead Time at 7 days.',
    metricsError: 'Try again. Check your calculations.',
    timelineTitle: 'Value Stream Timeline',
    rawMaterials: 'Raw Materials',
    assembly: 'Assembly',
    qualityControl: 'Quality Control',
    finishedGoods: 'Finished Goods',
    valueAdded: 'VA (Value Added)',
    nonValueAdded: 'NVA (Non-Value Added)',
    // Input placeholders and formula hints
    enterValue: 'Enter value',
    rawInventoryDaysHint: 'Raw Materials Inventory Quantity / Daily Demand',
    wipInventoryDaysHint: 'WIP Inventory Quantity / Daily Demand',
    totalValueAddedTimeHint: 'Sum of process cycle times (C/T)',
    totalNonValueAddedTimeHint: 'Total sum of days spent in all inventories',
    continueToMetrics: 'Continue to Metrics Calculation',
    continueToFuture: 'Continue to Future State',
    calculateLeanMetrics: 'Calculate Lean Metrics',
    timelinePlaceholder: 'The value stream timeline will generate once metrics are calculated correctly.',
    // PCE Summary translations
    totalLeadTime: 'Total Lead Time',
    totalProcessingTime: 'Total Processing Time',
    processCycleEfficiency: 'Process Cycle Efficiency (PCE)',
    pceTakeaway: 'Notice how the product spends over 99.9% of its time waiting in inventory! Our goal in the next phase is implementing a Kanban system to drastically reduce these high waiting steps.',
    // Information Flow translations
    informationFlow: 'Information Flow',
    materialFlow: 'Material Flow',
    productionControl: 'Production Control (MRP)',
    weeklyForecast: 'Weekly Forecast',
    monthlyForecast: 'Monthly Forecast',
    dailyWorkOrders: 'Daily Work Orders',
    // Data Box translations
    dataBox: 'Process Data',
    cycleTime: 'Cycle Time (C/T)',
    changeoverTime: 'Changeover Time (C/O)',
    availability: 'Availability',
    // New time units
    seconds: 'seconds',
    secondsShort: 's',
    // VSM Summary Block
    vsmSummary: 'VSM Summary',
    leadTime: 'Lead Time',
    valueAddedTime: 'Value Added Time (VA)',
    // Updated PCE calculation
    pceCalculation: 'PCE = (90s / 201,600s) × 100% = 0.045% (based on 8-hour shift)',
    pceFullName: 'PCE (Process Cycle Efficiency)',
    pceExplanation: 'PCE represents the share of time during which value is actually added to the product relative to the total time it spends in the factory. A value of 0.045% clearly shows that the product spends nearly 99.95% of its time waiting in inventory as waste.',
    // Phase 3: Future State translations
    phase3Question: 'Which Lean/Kaizen tools must we apply to eliminate waste? (Select exactly 2 correct answers)',
    kaizenOption1: 'Implement Continuous Flow / Cellular Manufacturing',
    kaizenOption2: 'Implement Kanban Supermarket for Raw Materials',
    kaizenOption3: 'Purchase Faster Transport Trucks',
    kaizenOption4: 'Hire 3 More Quality Control Operators',
    applyImprovements: 'Apply Improvements',
    kaizenError: 'Try again. Lean focuses on eliminating waste (inventory), not speeding up trucks or adding headcount.',
    kaizenSelectionError: 'Please select exactly 2 Lean tools to initiate the transformation.',
    kaizenSuccess: 'Congratulations! You selected the correct Kaizen tools. Continuous flow eliminates WIP buffer to 0 units (0 days), and Kanban supermarket reduces raw warehouse inventory from 500 to controlled 50 units (0.5 days).',
    restartSimulation: 'Restart Simulation',
    futureStateTitle: 'Future State (TO-BE)',
    currentStateTitle: 'Current State (AS-IS)',
    comparisonTable: 'State Comparison',
    comparisonRawInventory: 'Raw Materials Inventory',
    comparisonWipInventory: 'Work-in-Progress (WIP) Inventory',
    comparisonTotalLeadTime: 'Total Lead Time',
    comparisonVaTime: 'Value Added Time (VA)',
    comparisonPceEfficiency: 'PCE Efficiency',
    improvement: 'Improvement',
    futurePceCalculation: 'PCE = (90s / 14,400s) × 100% = 0.625% (based on 8-hour shift)',
    congratulations: 'Congratulations! You have successfully completed the Lean Speaker Factory simulation. You learned how to identify waste and apply Kaizen tools to dramatically improve process efficiency.',
  }
};

export default function VSMPage() {
  const { language } = useLanguage();
  const t = vsmTranslations[language];
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);

  // Step 1 puzzle state
  const [slotAssignments, setSlotAssignments] = useState<(string | null)[]>(Array(6).fill(null));
  const [shuffledItems, setShuffledItems] = useState<string[]>([]);
  const [isMaterialFlowCorrect, setIsMaterialFlowCorrect] = useState(false);
  const [materialFeedback, setMaterialFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isStep1Complete, setIsStep1Complete] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{ type: 'material' | 'info', item: string } | null>(null);

  // Step 1 information flow puzzle state
  const [infoSlotAssignments, setInfoSlotAssignments] = useState<(string | null)[]>(Array(3).fill(null));
  const [shuffledInfoItems, setShuffledInfoItems] = useState<string[]>([]);
  const [isInfoFlowCorrect, setIsInfoFlowCorrect] = useState(false);
  const [infoFeedback, setInfoFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Correct order for material flow validation
  const correctOrder = ['supplier', 'rawMaterials', 'assembly', 'qualityControl', 'finishedGoods', 'customer'];

  // Correct order for information flow validation
  // Based on fixed structural direction: Right slot (from Customer) = monthlyForecast, Left slot (to Supplier) = weeklyForecast, Bottom slot (to Assembly) = dailyWorkOrders
  const correctInfoOrder = ['monthlyForecast', 'weeklyForecast', 'dailyWorkOrders'];

  // Step 2 metrics state
  const [metricsInputs, setMetricsInputs] = useState({
    rawInventoryDays: '',
    wipInventoryDays: '',
    totalValueAddedTime: '',
    totalNonValueAddedTime: ''
  });
  const [metricsFeedback, setMetricsFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isStep2Complete, setIsStep2Complete] = useState(false);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  // Step 3 Kaizen quiz state
  const [kaizenSelections, setKaizenSelections] = useState<{ [key: string]: boolean }>({
    option1: false,
    option2: false,
    option3: false,
    option4: false
  });
  const [kaizenFeedback, setKaizenFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isStep3Complete, setIsStep3Complete] = useState(false);

  // Initialize shuffled items on mount
  useEffect(() => {
    const items = [...correctOrder];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    setShuffledItems(items);

    const infoItems = [...correctInfoOrder];
    for (let i = infoItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [infoItems[i], infoItems[j]] = [infoItems[j], infoItems[i]];
    }
    setShuffledInfoItems(infoItems);
  }, []);

  const nextStep = () => {
    if (activeStep === 1 && !isStep1Complete) return;
    if (activeStep === 2 && !isStep2Complete) return;
    if (activeStep < 3) setActiveStep(activeStep + 1);
  };

  const previousStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  // Material flow drag & drop handlers
  const handleMaterialDragStart = (item: string) => {
    setDraggedItem({ type: 'material', item });
  };

  const handleMaterialDragEnd = () => {
    setDraggedItem(null);
  };

  const handleMaterialSlotDrop = (slotIndex: number) => {
    if (draggedItem && draggedItem.type === 'material' && !slotAssignments[slotIndex]) {
      const newAssignments = [...slotAssignments];
      newAssignments[slotIndex] = draggedItem.item;
      setSlotAssignments(newAssignments);
      setShuffledItems(shuffledItems.filter(i => i !== draggedItem.item));
      setMaterialFeedback(null);
    }
    setDraggedItem(null);
  };

  const handleSlotRemove = (slotIndex: number) => {
    const removedItem = slotAssignments[slotIndex];
    if (removedItem) {
      const newAssignments = [...slotAssignments];
      newAssignments[slotIndex] = null;
      setSlotAssignments(newAssignments);
      setShuffledItems([...shuffledItems, removedItem]);
      setMaterialFeedback(null);
      setIsMaterialFlowCorrect(false);
    }
  };

  // Information flow drag & drop handlers
  const handleInfoDragStart = (item: string) => {
    setDraggedItem({ type: 'info', item });
  };

  const handleInfoDragEnd = () => {
    setDraggedItem(null);
  };

  const handleInfoSlotDrop = (slotIndex: number) => {
    if (draggedItem && draggedItem.type === 'info' && !infoSlotAssignments[slotIndex]) {
      const newAssignments = [...infoSlotAssignments];
      newAssignments[slotIndex] = draggedItem.item;
      setInfoSlotAssignments(newAssignments);
      setShuffledInfoItems(shuffledInfoItems.filter(i => i !== draggedItem.item));
      setInfoFeedback(null);
    }
    setDraggedItem(null);
  };

  const handleInfoSlotRemove = (slotIndex: number) => {
    const removedItem = infoSlotAssignments[slotIndex];
    if (removedItem) {
      const newAssignments = [...infoSlotAssignments];
      newAssignments[slotIndex] = null;
      setInfoSlotAssignments(newAssignments);
      setShuffledInfoItems([...shuffledInfoItems, removedItem]);
      setInfoFeedback(null);
      setIsInfoFlowCorrect(false);
    }
  };

  const verifyInfoFlow = () => {
    // Check if all info slots are filled
    const isInfoComplete = infoSlotAssignments.every(slot => slot !== null);
    if (!isInfoComplete) {
      setInfoFeedback({ type: 'error', message: language === 'sr' ? 'Pokušajte ponovo. Razmislite koja prognoza dolazi sa desne strane od kupca u MRP, šta MRP šalje levo ka dobavljaču, a šta šalje vertikalno dole direktno u pogon za Sklapanje.' : 'Try again. Consider which forecast comes from the customer on the right into MRP, what MRP sends left to the supplier, and what it dispatches vertically down into the Assembly shop.' });
      return;
    }

    // Validate based on fixed structural direction:
    // Right slot (index 0) = monthlyForecast (from Customer)
    // Left slot (index 1) = weeklyForecast (to Supplier)
    // Bottom slot (index 2) = dailyWorkOrders (to Assembly)
    const isInfoCorrect = infoSlotAssignments.every((item, index) => item === correctInfoOrder[index]);
    if (!isInfoCorrect) {
      setInfoFeedback({ type: 'error', message: language === 'sr' ? 'Pokušajte ponovo. Razmislite koja prognoza dolazi sa desne strane od kupca u MRP, šta MRP šalje levo ka dobavljaču, a šta šalje vertikalno dole direktno u pogon za Sklapanje.' : 'Try again. Consider which forecast comes from the customer on the right into MRP, what MRP sends left to the supplier, and what it dispatches vertically down into the Assembly shop.' });
      setIsInfoFlowCorrect(false);
      return;
    }

    // Information flow is correct
    setInfoFeedback({ type: 'success', message: language === 'sr' ? 'Tok informacija je ispravan!' : 'Information flow is correct!' });
    setIsInfoFlowCorrect(true);

    // Check if both flows are correct to enable step progression
    if (isMaterialFlowCorrect) {
      setIsStep1Complete(true);
      // Auto-navigate to Step 2 after 1.5 seconds
      setTimeout(() => {
        setActiveStep(2);
      }, 1500);
    }
  };

  const verifyMaterialFlow = () => {
    // Check if all material slots are filled
    const isMaterialComplete = slotAssignments.every(slot => slot !== null);
    if (!isMaterialComplete) {
      setMaterialFeedback({ type: 'error', message: t.hintMessage });
      return;
    }

    // Verify material flow exact order
    const isMaterialCorrect = slotAssignments.every((item, index) => item === correctOrder[index]);
    if (!isMaterialCorrect) {
      setMaterialFeedback({ type: 'error', message: t.errorMaterialFlowIncorrect });
      setIsMaterialFlowCorrect(false);
      return;
    }

    // Material flow is correct
    setMaterialFeedback({ type: 'success', message: t.materialFlowSuccess });
    setIsMaterialFlowCorrect(true);

    // Check if both flows are correct to enable step progression
    if (isInfoFlowCorrect) {
      setIsStep1Complete(true);
      // Auto-navigate to Step 2 after 1.5 seconds
      setTimeout(() => {
        setActiveStep(2);
      }, 1500);
    }
  };

  const handleKaizenSelection = (option: string) => {
    setKaizenSelections(prev => ({ ...prev, [option]: !prev[option] }));
    setKaizenFeedback(null);
  };

  const verifyKaizenSelection = () => {
    // Count how many options are selected
    const selectedCount = Object.values(kaizenSelections).filter(Boolean).length;
    
    // Check if exactly 2 options are selected
    if (selectedCount !== 2) {
      setKaizenFeedback({ type: 'error', message: t.kaizenSelectionError });
      return;
    }
    
    // Correct options: option1 (Continuous Flow) and option2 (Kanban)
    const isCorrect = kaizenSelections.option1 && kaizenSelections.option2 && !kaizenSelections.option3 && !kaizenSelections.option4;
    
    if (isCorrect) {
      setKaizenFeedback({ type: 'success', message: t.kaizenSuccess });
      setIsStep3Complete(true);
    } else {
      setKaizenFeedback({ type: 'error', message: t.kaizenError });
    }
  };

  const restartSimulation = () => {
    // Reset all state to initial values
    setActiveStep(1);
    setSlotAssignments(Array(6).fill(null));
    setInfoSlotAssignments(Array(3).fill(null));
    setIsMaterialFlowCorrect(false);
    setIsInfoFlowCorrect(false);
    setIsStep1Complete(false);
    setIsStep2Complete(false);
    setIsStep3Complete(false);
    setMaterialFeedback(null);
    setInfoFeedback(null);
    setMetricsFeedback(null);
    setKaizenFeedback(null);
    setKaizenSelections({ option1: false, option2: false, option3: false, option4: false });
    setMetricsInputs({ rawInventoryDays: '', wipInventoryDays: '', totalValueAddedTime: '', totalNonValueAddedTime: '' });
    setInvalidFields([]);
    setDraggedItem(null);
    
    // Reshuffle items
    const items = [...correctOrder];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    setShuffledItems(items);

    const infoItems = [...correctInfoOrder];
    for (let i = infoItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [infoItems[i], infoItems[j]] = [infoItems[j], infoItems[i]];
    }
    setShuffledInfoItems(infoItems);
  };

  const resetPuzzle = () => {
    setDraggedItem(null);
    setSlotAssignments(Array(6).fill(null));
    const items = [...correctOrder];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    setShuffledItems(items);

    setInfoSlotAssignments(Array(3).fill(null));
    const infoItems = [...correctInfoOrder];
    for (let i = infoItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [infoItems[i], infoItems[j]] = [infoItems[j], infoItems[i]];
    }
    setShuffledInfoItems(infoItems);

    setMaterialFeedback(null);
    setInfoFeedback(null);
    setIsMaterialFlowCorrect(false);
    setIsInfoFlowCorrect(false);
    setIsStep1Complete(false);
  };

  const handleMetricsInputChange = (field: string, value: string) => {
    setMetricsInputs(prev => ({ ...prev, [field]: value }));
    setMetricsFeedback(null);
    setInvalidFields(prev => prev.filter(f => f !== field));
  };

  const verifyMetrics = () => {
    const targets = {
      rawInventoryDays: 5,
      wipInventoryDays: 2,
      totalValueAddedTime: 90,
      totalNonValueAddedTime: 7
    };

    const invalid: string[] = [];

    if (parseFloat(metricsInputs.rawInventoryDays) !== targets.rawInventoryDays) {
      invalid.push('rawInventoryDays');
    }
    if (parseFloat(metricsInputs.wipInventoryDays) !== targets.wipInventoryDays) {
      invalid.push('wipInventoryDays');
    }
    if (parseFloat(metricsInputs.totalValueAddedTime) !== targets.totalValueAddedTime) {
      invalid.push('totalValueAddedTime');
    }
    if (parseFloat(metricsInputs.totalNonValueAddedTime) !== targets.totalNonValueAddedTime) {
      invalid.push('totalNonValueAddedTime');
    }

    if (invalid.length === 0) {
      setMetricsFeedback({ type: 'success', message: t.metricsSuccess });
      setIsStep2Complete(true);
      setInvalidFields([]);
    } else {
      setMetricsFeedback({ type: 'error', message: t.metricsError });
      setInvalidFields(invalid);
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

        {/* Progress Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">{t.currentPhase}</span>
              <span className="text-sm text-purple-400 font-semibold">
                {t.step} {activeStep} {t.of} 3
              </span>
            </div>

            {/* Phase Tabs */}
            <div className="flex items-center gap-2">
              {t.phases.map((phase, index) => (
                <div key={index} className="flex-1">
                  {index < t.phases.length - 1 ? (
                    <div className="flex items-center">
                      <motion.div
                        className={`flex-1 rounded-lg border-2 p-4 text-center transition-all ${
                          activeStep === index + 1
                            ? 'border-purple-500 bg-purple-900/30'
                            : activeStep > index + 1
                            ? 'border-green-500/50 bg-green-900/20'
                            : 'border-slate-600 bg-slate-800/30'
                        }`}
                        whileHover={activeStep !== index + 1 ? { scale: 1.02 } : {}}
                        whileTap={activeStep !== index + 1 ? { scale: 0.98 } : {}}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {activeStep > index + 1 ? (
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                          ) : (
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold ${
                                activeStep === index + 1
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-slate-600 text-gray-400'
                              }`}
                            >
                              {index + 1}
                            </div>
                          )}
                          <span
                            className={`text-sm font-medium ${
                              activeStep === index + 1
                                ? 'text-white'
                                : activeStep > index + 1
                                ? 'text-green-300'
                                : 'text-gray-400'
                            }`}
                          >
                            {phase}
                          </span>
                        </div>
                      </motion.div>
                      <ChevronRight className="h-5 w-5 text-slate-600 mx-2 flex-shrink-0" />
                    </div>
                  ) : (
                    <motion.div
                      className={`flex-1 rounded-lg border-2 p-4 text-center transition-all ${
                        activeStep === index + 1
                          ? 'border-purple-500 bg-purple-900/30'
                          : activeStep > index + 1
                          ? 'border-green-500/50 bg-green-900/20'
                          : 'border-slate-600 bg-slate-800/30'
                      }`}
                      whileHover={activeStep !== index + 1 ? { scale: 1.02 } : {}}
                      whileTap={activeStep !== index + 1 ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {activeStep > index + 1 ? (
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                        ) : (
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold ${
                              activeStep === index + 1
                                ? 'bg-purple-500 text-white'
                                : 'bg-slate-600 text-gray-400'
                            }`}
                          >
                            {index + 1}
                          </div>
                        )}
                        <span
                          className={`text-sm font-medium ${
                            activeStep === index + 1
                              ? 'text-white'
                              : activeStep > index + 1
                              ? 'text-green-300'
                              : 'text-gray-400'
                          }`}
                        >
                          {phase}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-xl border-2 border-slate-600/30 bg-gradient-to-br from-slate-800/30 to-slate-900/50 p-6 backdrop-blur-sm"
        >
          <div className="min-h-[400px]">
            {activeStep === 1 && (
              <div className="space-y-6">
                {/* Problem Statement Card */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-gradient-to-br from-purple-900/30 to-slate-900/50 p-6 border-2 border-purple-500/30"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{t.problemTitle}</h3>
                  <p className="text-gray-300">{t.problemDescription}</p>
                </motion.div>

                {/* Information Flow Zone */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-xl bg-slate-800/30 p-6 border-2 border-blue-500/30"
                >
                  <h4 className="text-lg font-semibold text-blue-400 mb-4">{t.informationFlow}</h4>
                  <div className="space-y-4">
                    {/* Information Flow Slots */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {infoSlotAssignments.map((assignment, index) => (
                        <div key={index} className="flex items-center flex-shrink-0">
                          <motion.div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleInfoSlotDrop(index)}
                            className={`w-36 h-20 rounded-lg border-2 p-3 cursor-pointer transition-all ${
                              assignment
                                ? 'border-blue-500 bg-blue-900/30'
                                : draggedItem?.type === 'info'
                                ? 'border-green-500/50 bg-green-900/20 hover:bg-green-900/30'
                                : 'border-slate-600 bg-slate-800/30'
                            }`}
                            whileHover={{ scale: 1.02 }}
                          >
                            {assignment ? (
                              <div className="h-full flex flex-col justify-center">
                                <span className="text-sm font-medium text-white text-center">
                                  {t.items[assignment as keyof typeof t.items]}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleInfoSlotRemove(index);
                                  }}
                                  className="mt-1 text-xs text-red-400 hover:text-red-300 text-center"
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center">
                                <span className="text-slate-500 text-sm">{index + 1}</span>
                              </div>
                            )}
                          </motion.div>
                          {index < infoSlotAssignments.length - 1 && (
                            <ChevronRight className="h-6 w-6 text-blue-400 mx-1 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Information Flow Toolbox */}
                    <div className="flex flex-wrap gap-3">
                      {shuffledInfoItems.map((item) => (
                        <motion.div
                          key={item}
                          draggable
                          onDragStart={() => handleInfoDragStart(item)}
                          onDragEnd={handleInfoDragEnd}
                          className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all cursor-grab active:cursor-grabbing ${
                            draggedItem?.type === 'info' && draggedItem.item === item
                              ? 'border-blue-500 bg-blue-900/30 text-white opacity-50'
                              : 'border-slate-600 bg-slate-800/50 text-gray-300 hover:border-blue-500/50 hover:bg-blue-900/20'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {t.items[item as keyof typeof t.items]}
                        </motion.div>
                      ))}
                    </div>

                    {/* Information Flow Feedback */}
                    {infoFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-lg p-4 border-2 ${
                          infoFeedback.type === 'success'
                            ? 'bg-green-900/30 border-green-500/50'
                            : 'bg-red-900/30 border-red-500/50'
                        }`}
                      >
                        <p
                          className={`text-sm font-medium ${
                            infoFeedback.type === 'success' ? 'text-green-300' : 'text-red-300'
                          }`}
                        >
                          {infoFeedback.message}
                        </p>
                      </motion.div>
                    )}

                    {/* Information Flow Action Button */}
                    <Button
                      onClick={verifyInfoFlow}
                      disabled={isInfoFlowCorrect}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t.verifyInfoFlow}
                    </Button>
                  </div>
                </motion.div>

                {/* Material Flow Zone */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl bg-slate-800/30 p-6 border-2 border-green-500/30"
                >
                  <h4 className="text-lg font-semibold text-green-400 mb-4">{t.materialFlow}</h4>
                  <div className="space-y-4">
                    {/* Material Flow Slots */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {slotAssignments.map((assignment, index) => (
                        <div key={index} className="flex items-center flex-shrink-0">
                          <motion.div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleMaterialSlotDrop(index)}
                            className={`w-36 h-20 rounded-lg border-2 p-3 cursor-pointer transition-all ${
                              assignment
                                ? 'border-green-500 bg-green-900/30'
                                : draggedItem?.type === 'material'
                                ? 'border-green-500/50 bg-green-900/20 hover:bg-green-900/30'
                                : 'border-slate-600 bg-slate-800/30'
                            }`}
                            whileHover={{ scale: 1.02 }}
                          >
                            {assignment ? (
                              <div className="h-full flex flex-col justify-center">
                                <span className="text-sm font-medium text-white text-center">
                                  {t.items[assignment as keyof typeof t.items]}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSlotRemove(index);
                                  }}
                                  className="mt-1 text-xs text-red-400 hover:text-red-300 text-center"
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center">
                                <span className="text-slate-500 text-sm">{index + 1}</span>
                              </div>
                            )}
                          </motion.div>
                          {index < slotAssignments.length - 1 && (
                            <ChevronRight className="h-6 w-6 text-green-400 mx-1 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Material Flow Toolbox */}
                    <div className="flex flex-wrap gap-3">
                      {shuffledItems.map((item) => (
                        <motion.div
                          key={item}
                          draggable
                          onDragStart={() => handleMaterialDragStart(item)}
                          onDragEnd={handleMaterialDragEnd}
                          className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all cursor-grab active:cursor-grabbing ${
                            draggedItem?.type === 'material' && draggedItem.item === item
                              ? 'border-green-500 bg-green-900/30 text-white opacity-50'
                              : 'border-slate-600 bg-slate-800/50 text-gray-300 hover:border-green-500/50 hover:bg-green-900/20'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {t.items[item as keyof typeof t.items]}
                        </motion.div>
                      ))}
                    </div>

                    {/* Material Flow Feedback */}
                    {materialFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-lg p-4 border-2 ${
                          materialFeedback.type === 'success'
                            ? 'bg-green-900/30 border-green-500/50'
                            : 'bg-red-900/30 border-red-500/50'
                        }`}
                      >
                        <p
                          className={`text-sm font-medium ${
                            materialFeedback.type === 'success' ? 'text-green-300' : 'text-red-300'
                          }`}
                        >
                          {materialFeedback.message}
                        </p>
                      </motion.div>
                    )}

                    {/* Material Flow Action Button */}
                    <Button
                      onClick={verifyMaterialFlow}
                      disabled={isMaterialFlowCorrect}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t.verifyMaterialFlow}
                    </Button>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <Button
                    onClick={resetPuzzle}
                    variant="outline"
                    className="border-slate-600 bg-slate-800/50 text-gray-300 hover:bg-slate-700 hover:text-white"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                {/* Scenario Data Card */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-gradient-to-br from-blue-900/30 to-slate-900/50 p-6 border-2 border-blue-500/30"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{t.metricsTitle}</h3>
                  <p className="text-gray-300 mb-4">{t.metricsDescription}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                      <div className="text-sm text-gray-400 mb-1">{t.customerDemand}</div>
                      <div className="text-2xl font-bold text-white">100 <span className="text-sm font-normal text-gray-400">{t.unitsPerDay}</span></div>
                    </div>
                    <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                      <div className="text-sm text-gray-400 mb-1">{t.assemblyCycleTime}</div>
                      <div className="text-2xl font-bold text-white">60 <span className="text-sm font-normal text-gray-400">{t.secondsShort}</span></div>
                    </div>
                    <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                      <div className="text-sm text-gray-400 mb-1">{t.qualityCycleTime}</div>
                      <div className="text-2xl font-bold text-white">30 <span className="text-sm font-normal text-gray-400">{t.secondsShort}</span></div>
                    </div>
                    <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                      <div className="text-sm text-gray-400 mb-1">{t.rawMaterialsInventory}</div>
                      <div className="text-2xl font-bold text-white">500 <span className="text-sm font-normal text-gray-400">{t.units}</span></div>
                    </div>
                    <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                      <div className="text-sm text-gray-400 mb-1">{t.wipInventory}</div>
                      <div className="text-2xl font-bold text-white">200 <span className="text-sm font-normal text-gray-400">{t.units}</span></div>
                    </div>
                  </div>
                </motion.div>

                {/* Input Fields */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl bg-slate-800/30 p-6 border-2 border-slate-600/30"
                >
                  <h4 className="text-lg font-semibold text-white mb-4">{t.calculateLeanMetrics}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">{t.rawInventoryDays}</label>
                      <div className="text-xs text-purple-400 mb-2">{t.rawInventoryDaysHint}</div>
                      <div className="relative">
                        <input
                          type="number"
                          value={metricsInputs.rawInventoryDays}
                          onChange={(e) => handleMetricsInputChange('rawInventoryDays', e.target.value)}
                          disabled={isStep2Complete}
                          className={`w-full px-4 py-3 rounded-lg border-2 text-white transition-all ${
                            isStep2Complete
                              ? 'bg-green-900/20 border-green-500/50 cursor-not-allowed'
                              : invalidFields.includes('rawInventoryDays')
                              ? 'bg-slate-900/50 border-red-500 focus:border-red-500'
                              : 'bg-slate-900/50 border-slate-600 focus:border-purple-500'
                          }`}
                          placeholder={t.enterValue}
                        />
                        {isStep2Complete && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">{t.wipInventoryDays}</label>
                      <div className="text-xs text-purple-400 mb-2">{t.wipInventoryDaysHint}</div>
                      <div className="relative">
                        <input
                          type="number"
                          value={metricsInputs.wipInventoryDays}
                          onChange={(e) => handleMetricsInputChange('wipInventoryDays', e.target.value)}
                          disabled={isStep2Complete}
                          className={`w-full px-4 py-3 rounded-lg border-2 text-white transition-all ${
                            isStep2Complete
                              ? 'bg-green-900/20 border-green-500/50 cursor-not-allowed'
                              : invalidFields.includes('wipInventoryDays')
                              ? 'bg-slate-900/50 border-red-500 focus:border-red-500'
                              : 'bg-slate-900/50 border-slate-600 focus:border-purple-500'
                          }`}
                          placeholder={t.enterValue}
                        />
                        {isStep2Complete && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">{t.totalValueAddedTime}</label>
                      <div className="text-xs text-purple-400 mb-2">{t.totalValueAddedTimeHint}</div>
                      <div className="relative">
                        <input
                          type="number"
                          value={metricsInputs.totalValueAddedTime}
                          onChange={(e) => handleMetricsInputChange('totalValueAddedTime', e.target.value)}
                          disabled={isStep2Complete}
                          className={`w-full px-4 py-3 rounded-lg border-2 text-white transition-all ${
                            isStep2Complete
                              ? 'bg-green-900/20 border-green-500/50 cursor-not-allowed'
                              : invalidFields.includes('totalValueAddedTime')
                              ? 'bg-slate-900/50 border-red-500 focus:border-red-500'
                              : 'bg-slate-900/50 border-slate-600 focus:border-purple-500'
                          }`}
                          placeholder={t.enterValue}
                        />
                        {isStep2Complete && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">{t.totalNonValueAddedTime}</label>
                      <div className="text-xs text-purple-400 mb-2">{t.totalNonValueAddedTimeHint}</div>
                      <div className="relative">
                        <input
                          type="number"
                          value={metricsInputs.totalNonValueAddedTime}
                          onChange={(e) => handleMetricsInputChange('totalNonValueAddedTime', e.target.value)}
                          disabled={isStep2Complete}
                          className={`w-full px-4 py-3 rounded-lg border-2 text-white transition-all ${
                            isStep2Complete
                              ? 'bg-green-900/20 border-green-500/50 cursor-not-allowed'
                              : invalidFields.includes('totalNonValueAddedTime')
                              ? 'bg-slate-900/50 border-red-500 focus:border-red-500'
                              : 'bg-slate-900/50 border-slate-600 focus:border-purple-500'
                          }`}
                          placeholder={t.enterValue}
                        />
                        {isStep2Complete && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Visual Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-xl bg-slate-800/30 p-6 border-2 border-slate-600/30"
                >
                  <h4 className="text-lg font-semibold text-white mb-4">{t.timelineTitle}</h4>
                  {!isStep2Complete ? (
                    <div className="rounded-lg bg-slate-900/50 p-8 border-2 border-dashed border-slate-600 text-center">
                      <p className="text-gray-400">{t.timelinePlaceholder}</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Step-Shaped VSM Timeline */}
                      <div className="relative h-72">
                        {/* High Steps (NVA) - Top Level */}
                        <div className="absolute top-0 left-0 right-0 h-24">
                          <div className="flex items-center gap-6 h-full">
                            {/* Raw Materials - 5 days */}
                            <div className="flex-1 h-full bg-red-900/30 border-2 border-red-500/50 rounded-lg flex flex-col items-center justify-center">
                              <span className="text-white font-bold">{t.rawMaterials}</span>
                              <span className="text-white font-bold">5 {t.days}</span>
                              <span className="text-xs text-red-400 mt-1">{t.nonValueAdded}</span>
                            </div>
                            {/* WIP - 2 days */}
                            <div className="flex-1 h-full bg-red-900/30 border-2 border-red-500/50 rounded-lg flex flex-col items-center justify-center">
                              <span className="text-white font-bold">{t.wipInventory}</span>
                              <span className="text-white font-bold">2 {t.days}</span>
                              <span className="text-xs text-red-400 mt-1">{t.nonValueAdded}</span>
                            </div>
                          </div>
                        </div>

                        {/* Low Steps (VA) - Bottom Level */}
                        <div className="absolute bottom-0 left-0 right-0 h-16">
                          <div className="flex items-center gap-6 h-full">
                            {/* Assembly - 60 s */}
                            <div className="flex-1 h-full bg-green-900/30 border-2 border-green-500/50 rounded-lg flex flex-col items-center justify-center">
                              <span className="text-white font-bold text-sm">{t.assembly}</span>
                              <span className="text-white font-bold text-sm">60 {t.secondsShort}</span>
                              <span className="text-xs text-green-400 mt-1">{t.valueAdded}</span>
                              {/* Assembly Data Box */}
                              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-slate-800/90 border border-slate-600 rounded p-2 text-xs w-32">
                                <div className="text-gray-400">{t.cycleTime}: 60s</div>
                                <div className="text-gray-400">{t.changeoverTime}: 15min</div>
                                <div className="text-gray-400">{t.availability}: 100%</div>
                              </div>
                            </div>
                            {/* Quality Control - 30 s */}
                            <div className="flex-1 h-full bg-green-900/30 border-2 border-green-500/50 rounded-lg flex flex-col items-center justify-center">
                              <span className="text-white font-bold text-sm">{t.qualityControl}</span>
                              <span className="text-white font-bold text-sm">30 {t.secondsShort}</span>
                              <span className="text-xs text-green-400 mt-1">{t.valueAdded}</span>
                              {/* QC Data Box */}
                              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-slate-800/90 border border-slate-600 rounded p-2 text-xs w-32">
                                <div className="text-gray-400">{t.cycleTime}: 30s</div>
                                <div className="text-gray-400">{t.changeoverTime}: 0min</div>
                                <div className="text-gray-400">{t.availability}: 100%</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Connecting Lines (Sawtooth Pattern) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          {/* Line from Raw Materials to Assembly */}
                          <line x1="25%" y1="24" x2="25%" y2="152" stroke="#64748b" strokeWidth="2" />
                          {/* Line from Assembly to WIP */}
                          <line x1="25%" y1="152" x2="75%" y2="24" stroke="#64748b" strokeWidth="2" />
                          {/* Line from WIP to Quality Control */}
                          <line x1="75%" y1="24" x2="75%" y2="152" stroke="#64748b" strokeWidth="2" />
                          {/* Labels on lines */}
                          <text x="27%" y="88" className="text-xs font-semibold fill-gray-400">5 {t.days}</text>
                          <text x="27%" y="100" className="text-xs font-semibold fill-gray-400">60 {t.secondsShort}</text>
                          <text x="52%" y="88" className="text-xs font-semibold fill-gray-400">2 {t.days}</text>
                          <text x="77%" y="88" className="text-xs font-semibold fill-gray-400">30 {t.secondsShort}</text>
                        </svg>
                      </div>

                      {/* PCE Summary Box */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-xl bg-gradient-to-br from-purple-900/30 to-slate-900/50 p-6 border-2 border-purple-500/30"
                      >
                        <h5 className="text-lg font-bold text-white mb-4">{t.processCycleEfficiency}</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                            <div className="text-sm text-gray-400 mb-1">{t.totalLeadTime}</div>
                            <div className="text-2xl font-bold text-red-400">7 {t.days}</div>
                            <div className="text-xs text-red-400 mt-1">{t.nonValueAdded}</div>
                          </div>
                          <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                            <div className="text-sm text-gray-400 mb-1">{t.totalProcessingTime}</div>
                            <div className="text-2xl font-bold text-green-400">90 {t.secondsShort}</div>
                            <div className="text-xs text-green-400 mt-1">{t.valueAdded}</div>
                          </div>
                          <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                            <div className="text-sm text-gray-400 mb-1">{t.pceFullName}</div>
                            <div className="text-2xl font-bold text-purple-400">0.045%</div>
                            <div className="text-xs text-purple-400 mt-1">Efficiency</div>
                          </div>
                        </div>
                        <div className="rounded-lg bg-slate-900/50 p-4 border border-slate-700 mb-4">
                          <p className="text-sm text-gray-300">{t.pceCalculation}</p>
                          <p className="text-xs text-gray-400 mt-2">{t.pceExplanation}</p>
                        </div>
                        <div className="rounded-lg bg-slate-900/50 p-4 border border-slate-700">
                          <p className="text-sm text-gray-300">{t.pceTakeaway}</p>
                        </div>
                      </motion.div>

                      {/* VSM Summary Block */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="rounded-xl bg-gradient-to-br from-blue-900/30 to-slate-900/50 p-6 border-2 border-blue-500/30"
                      >
                        <h5 className="text-lg font-bold text-white mb-4">{t.vsmSummary}</h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                            <div className="text-sm text-gray-400">{t.leadTime}</div>
                            <div className="text-2xl font-bold text-red-400">7 {t.days}</div>
                          </div>
                          <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                            <div className="text-sm text-gray-400">{t.valueAddedTime}</div>
                            <div className="text-2xl font-bold text-green-400">90 {t.seconds}</div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>

                {/* Feedback Message */}
                {metricsFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-lg p-6 border-2 ${
                      metricsFeedback.type === 'success'
                        ? 'bg-green-900/30 border-green-500/50'
                        : 'bg-red-900/30 border-red-500/50'
                    }`}
                  >
                    <p
                      className={`text-base font-semibold mb-4 ${
                        metricsFeedback.type === 'success' ? 'text-green-300' : 'text-red-300'
                      }`}
                    >
                      {metricsFeedback.message}
                    </p>
                    {metricsFeedback.type === 'success' && isStep2Complete && (
                      <Button
                        onClick={() => setActiveStep(3)}
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg px-8 py-4 shadow-lg shadow-purple-500/30"
                      >
                        {t.continueToFuture}
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    )}
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <Button
                    onClick={verifyMetrics}
                    disabled={isStep2Complete}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t.verifyMetrics}
                  </Button>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-6">
                {/* Kaizen Quiz Section */}
                {!isStep3Complete && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-gradient-to-br from-purple-900/30 to-slate-900/50 p-6 border-2 border-purple-500/30"
                  >
                    <h3 className="text-xl font-bold text-white mb-2">{t.phase3}</h3>
                    <p className="text-gray-300 mb-6">{t.phase3Question}</p>
                    
                    <div className="space-y-3 mb-6">
                      <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 cursor-pointer transition-all">
                        <input
                          type="checkbox"
                          checked={kaizenSelections.option1}
                          onChange={() => handleKaizenSelection('option1')}
                          className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-slate-900"
                        />
                        <span className="text-gray-300">{t.kaizenOption1}</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 cursor-pointer transition-all">
                        <input
                          type="checkbox"
                          checked={kaizenSelections.option2}
                          onChange={() => handleKaizenSelection('option2')}
                          className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-slate-900"
                        />
                        <span className="text-gray-300">{t.kaizenOption2}</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 cursor-pointer transition-all">
                        <input
                          type="checkbox"
                          checked={kaizenSelections.option3}
                          onChange={() => handleKaizenSelection('option3')}
                          className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-slate-900"
                        />
                        <span className="text-gray-300">{t.kaizenOption3}</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 cursor-pointer transition-all">
                        <input
                          type="checkbox"
                          checked={kaizenSelections.option4}
                          onChange={() => handleKaizenSelection('option4')}
                          className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-slate-900"
                        />
                        <span className="text-gray-300">{t.kaizenOption4}</span>
                      </label>
                    </div>

                    {kaizenFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-lg p-4 border-2 mb-4 ${
                          kaizenFeedback.type === 'success'
                            ? 'bg-green-900/30 border-green-500/50'
                            : 'bg-red-900/30 border-red-500/50'
                        }`}
                      >
                        <p
                          className={`text-sm font-medium ${
                            kaizenFeedback.type === 'success' ? 'text-green-300' : 'text-red-300'
                          }`}
                        >
                          {kaizenFeedback.message}
                        </p>
                      </motion.div>
                    )}

                    <Button
                      onClick={verifyKaizenSelection}
                      disabled={isStep3Complete}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t.applyImprovements}
                    </Button>
                  </motion.div>
                )}

                {/* Future State Results */}
                {isStep3Complete && (
                  <>
                    {/* Future State Timeline */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl bg-gradient-to-br from-green-900/30 to-slate-900/50 p-6 border-2 border-green-500/30"
                    >
                      <h3 className="text-xl font-bold text-white mb-4">{t.futureStateTitle}</h3>
                      <div className="space-y-6">
                        {/* Future State Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                            <div className="text-sm text-gray-400 mb-1">{t.comparisonRawInventory}</div>
                            <div className="text-2xl font-bold text-green-400">50 {t.units}</div>
                            <div className="text-xs text-green-400 mt-1">0.5 {t.days}</div>
                          </div>
                          <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                            <div className="text-sm text-gray-400 mb-1">{t.comparisonWipInventory}</div>
                            <div className="text-2xl font-bold text-green-400">0 {t.units}</div>
                            <div className="text-xs text-green-400 mt-1">0 {t.days}</div>
                          </div>
                          <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                            <div className="text-sm text-gray-400 mb-1">{t.comparisonVaTime}</div>
                            <div className="text-2xl font-bold text-green-400">90 {t.secondsShort}</div>
                            <div className="text-xs text-green-400 mt-1">{t.valueAdded}</div>
                          </div>
                          <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                            <div className="text-sm text-gray-400 mb-1">{t.comparisonTotalLeadTime}</div>
                            <div className="text-2xl font-bold text-green-400">0.5 {t.days}</div>
                            <div className="text-xs text-green-400 mt-1">{t.nonValueAdded}</div>
                          </div>
                        </div>

                        {/* Future PCE Calculation */}
                        <div className="rounded-lg bg-slate-900/50 p-4 border border-slate-700">
                          <p className="text-sm text-gray-300">{t.futurePceCalculation}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Comparison Table */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="rounded-xl bg-gradient-to-br from-blue-900/30 to-slate-900/50 p-6 border-2 border-blue-500/30"
                    >
                      <h3 className="text-xl font-bold text-white mb-4">{t.comparisonTable}</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-700">
                              <th className="text-left py-3 px-4 text-gray-400 font-medium">{t.comparisonTable}</th>
                              <th className="text-right py-3 px-4 text-gray-400 font-medium">{t.currentStateTitle}</th>
                              <th className="text-right py-3 px-4 text-gray-400 font-medium">{t.futureStateTitle}</th>
                              <th className="text-right py-3 px-4 text-gray-400 font-medium">{t.improvement}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-slate-700">
                              <td className="py-3 px-4 text-gray-300">{t.comparisonRawInventory}</td>
                              <td className="text-right py-3 px-4 text-gray-400">500 {t.units} (5 {t.days})</td>
                              <td className="text-right py-3 px-4 text-green-400">50 {t.units} (0.5 {t.days})</td>
                              <td className="text-right py-3 px-4 text-green-400">-90%</td>
                            </tr>
                            <tr className="border-b border-slate-700">
                              <td className="py-3 px-4 text-gray-300">{t.comparisonWipInventory}</td>
                              <td className="text-right py-3 px-4 text-gray-400">200 {t.units} (2 {t.days})</td>
                              <td className="text-right py-3 px-4 text-green-400">0 {t.units} (0 {t.days})</td>
                              <td className="text-right py-3 px-4 text-green-400">-100%</td>
                            </tr>
                            <tr className="border-b border-slate-700">
                              <td className="py-3 px-4 text-gray-300">{t.comparisonTotalLeadTime}</td>
                              <td className="text-right py-3 px-4 text-gray-400">7 {t.days}</td>
                              <td className="text-right py-3 px-4 text-green-400">0.5 {t.days}</td>
                              <td className="text-right py-3 px-4 text-green-400">-93%</td>
                            </tr>
                            <tr className="border-b border-slate-700">
                              <td className="py-3 px-4 text-gray-300">{t.comparisonVaTime}</td>
                              <td className="text-right py-3 px-4 text-gray-400">90 {t.secondsShort}</td>
                              <td className="text-right py-3 px-4 text-gray-400">90 {t.secondsShort}</td>
                              <td className="text-right py-3 px-4 text-gray-400">-</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-gray-300">{t.comparisonPceEfficiency}</td>
                              <td className="text-right py-3 px-4 text-red-400">0.045%</td>
                              <td className="text-right py-3 px-4 text-green-400">0.625%</td>
                              <td className="text-right py-3 px-4 text-green-400">+1289%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </motion.div>

                    {/* Congratulations Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="rounded-xl bg-gradient-to-br from-green-900/30 to-slate-900/50 p-6 border-2 border-green-500/30"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600/20 border border-green-500/30">
                          <span className="text-3xl">🎉</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">{t.congratulations}</h3>
                      </div>
                    </motion.div>

                    {/* Final Navigation Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <Button
                        onClick={restartSimulation}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-4"
                      >
                        <RotateCcw className="mr-2 h-5 w-5" />
                        {t.restartSimulation}
                      </Button>
                      <Button
                        onClick={() => router.push('/moduli')}
                        variant="outline"
                        className="flex-1 border-slate-600 bg-slate-800/50 text-gray-300 hover:bg-slate-700 hover:text-white px-6 py-4"
                      >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        {t.backToModules}
                      </Button>
                    </motion.div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700">
            {activeStep > 1 && (
              <Button
                onClick={previousStep}
                variant="outline"
                className="border-slate-600 bg-slate-800/50 text-gray-300 hover:bg-slate-700 hover:text-white"
              >
                {t.previousPhase}
              </Button>
            )}

            {(activeStep === 1 && isInfoFlowCorrect && isMaterialFlowCorrect) || (activeStep === 2 && isStep2Complete) ? (
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
              >
                {t.nextPhase}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
