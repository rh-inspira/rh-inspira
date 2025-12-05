
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, LayoutDashboard, LineChart, Save, Check } from 'lucide-react';
import { generateWeeks, initialStrategicData } from './services/mockData';
import { WeeklyData, Category, PipelineCandidate, StrategicData, StrategicGoal, MonthlyReportSection, MonthKey } from './types';
import PriorityHeader from './components/PriorityHeader';
import WeeklyReportBoard from './components/WeeklyReportBoard';
import VacancyDashboard from './components/VacancyDashboard';
import StrategicGoalsBoard from './components/StrategicGoalsBoard';
import MonthlyReportBoard from './components/MonthlyReportBoard';

type ViewMode = 'operational' | 'strategic';

const STORAGE_KEY = 'rh_dashboard_data_v1';

const App: React.FC = () => {
  // State for all weekly data
  const [weeks, setWeeks] = useState<WeeklyData[]>([]);
  // State for strategic data
  const [strategicData, setStrategicData] = useState<StrategicData>(initialStrategicData);
  // State for current view index (0 = current week, 1 = last week, etc.)
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('operational');
  // Last saved time
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  // Manual save loading state
  const [isSaving, setIsSaving] = useState(false);

  // Refs to hold current state for the interval (to avoid stale closures)
  const stateRef = useRef({ weeks, strategicData });

  // Update ref whenever state changes
  useEffect(() => {
    stateRef.current = { weeks, strategicData };
  }, [weeks, strategicData]);

  // Initial Load
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.weeks && parsed.strategicData) {
          setWeeks(parsed.weeks);
          setStrategicData(parsed.strategicData);
          setLastSaved(new Date()); // Assume current state matches storage on load
        } else {
          // Fallback if structure is invalid
          setWeeks(generateWeeks());
        }
      } catch (e) {
        console.error("Failed to load saved data", e);
        setWeeks(generateWeeks());
      }
    } else {
      setWeeks(generateWeeks());
    }
  }, []);

  // Centralized Save Function
  const saveData = () => {
    const dataToSave = {
      weeks: stateRef.current.weeks,
      strategicData: stateRef.current.strategicData
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    setLastSaved(new Date());
  };

  // Auto-save Interval (Every 1 minute)
  useEffect(() => {
    const intervalId = setInterval(() => {
      saveData();
      console.log('Autosaved data at', new Date().toLocaleTimeString());
    }, 60000); // 60000 ms = 1 minute

    return () => clearInterval(intervalId);
  }, []);

  // Manual Save Handler
  const handleManualSave = () => {
    setIsSaving(true);
    // Use setTimeout to allow UI to update and show "Saving..." state briefly
    setTimeout(() => {
      saveData();
      setIsSaving(false);
    }, 500);
  };

  if (weeks.length === 0) return <div className="min-h-screen flex items-center justify-center text-slate-500">Carregando Dashboard...</div>;

  const activeWeek = weeks[currentWeekIndex];
  const isCurrentWeek = currentWeekIndex === 0;

  // --- Handlers for Operational View ---
  const handlePriorityUpdate = (newPriorities: [string, string, string, string]) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[currentWeekIndex] = {
      ...activeWeek,
      topPriorities: newPriorities
    };
    setWeeks(updatedWeeks);
  };

  const handleReportUpdate = (section: 'thisWeek' | 'nextWeek', category: Category, value: string) => {
    const updatedWeeks = [...weeks];
    const sectionKey = section === 'thisWeek' ? 'reportThisWeek' : 'reportNextWeek';
    const catKey = category.toLowerCase() as keyof typeof activeWeek.reportThisWeek;

    updatedWeeks[currentWeekIndex] = {
      ...activeWeek,
      [sectionKey]: {
        ...activeWeek[sectionKey],
        [catKey]: value
      }
    };
    setWeeks(updatedWeeks);
  };

  const handlePipelineUpdate = (priorityIndex: number, newCandidates: PipelineCandidate[]) => {
    const updatedWeeks = [...weeks];
    const newPipelines = [...activeWeek.priorityPipelines] as [PipelineCandidate[], PipelineCandidate[], PipelineCandidate[], PipelineCandidate[]];
    newPipelines[priorityIndex] = newCandidates;

    updatedWeeks[currentWeekIndex] = {
      ...activeWeek,
      priorityPipelines: newPipelines
    };
    setWeeks(updatedWeeks);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentWeekIndex < weeks.length - 1) setCurrentWeekIndex(curr => curr + 1);
    } else {
      if (currentWeekIndex > 0) setCurrentWeekIndex(curr => curr - 1);
    }
  };

  // --- Handlers for Strategic View ---
  const handleStrategicGoalUpdate = (semester: 1 | 2, goals: StrategicGoal[]) => {
    if (semester === 1) {
      setStrategicData({ ...strategicData, semester1Goals: goals });
    } else {
      setStrategicData({ ...strategicData, semester2Goals: goals });
    }
  };

  const handleMonthlyReportUpdate = (month: MonthKey, section: keyof MonthlyReportSection, value: string) => {
    setStrategicData({
      ...strategicData,
      monthlyReports: {
        ...strategicData.monthlyReports,
        [month]: {
          ...strategicData.monthlyReports[month],
          [section]: value
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-slate-800 leading-none">RH Inspira</h1>
                <span className="text-xs text-slate-500 font-medium tracking-wide">DASHBOARD 1:1 RH</span>
              </div>
            </div>

            {/* Right Side: Week Nav & View Toggle */}
            <div className="flex items-center gap-4 lg:gap-6">
              
              {/* Manual Save Button */}
              <button
                onClick={handleManualSave}
                disabled={isSaving}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all shadow-sm ${
                  isSaving 
                    ? 'bg-green-100 text-green-700 cursor-wait' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
                title="Salvar alterações agora"
              >
                {isSaving ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span className="hidden sm:inline">{isSaving ? 'Salvando...' : 'Salvar'}</span>
              </button>

              {/* Autosave Indicator */}
              {lastSaved && (
                <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 font-medium animate-in fade-in">
                  <span>(auto: {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                </div>
              )}

              {/* Week Navigation (Only visible in Operational mode) */}
              {viewMode === 'operational' && (
                <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                  <button 
                    onClick={() => navigateWeek('prev')}
                    disabled={currentWeekIndex === weeks.length - 1}
                    className="p-1.5 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all text-slate-600"
                    title="Semana Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="px-3 text-center min-w-[140px] md:min-w-[160px]">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      {currentWeekIndex === 0 ? 'Semana Atual' : 'Histórico'}
                    </span>
                    <span className="block text-xs md:text-sm font-semibold text-slate-800 whitespace-nowrap">
                      {activeWeek.weekRange}
                    </span>
                  </div>
                  <button 
                    onClick={() => navigateWeek('next')}
                    disabled={currentWeekIndex === 0}
                    className="p-1.5 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all text-slate-600"
                    title="Próxima Semana"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* View Toggle Tabs (Right of Week Nav) */}
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setViewMode('operational')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'operational' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">1:1 Semanal</span>
                </button>
                <button
                  onClick={() => setViewMode('strategic')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'strategic' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <LineChart className="w-4 h-4" />
                  <span className="hidden sm:inline">Reporte Mensal</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {viewMode === 'operational' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
             {/* Top Section: Priorities */}
            <section>
              <PriorityHeader 
                priorities={activeWeek.topPriorities} 
                onUpdate={handlePriorityUpdate}
                isCurrentWeek={isCurrentWeek}
              />
            </section>

            {/* Middle Section: Vacancies (Linked to Priorities) */}
            <section>
              <VacancyDashboard 
                priorities={activeWeek.topPriorities}
                pipelines={activeWeek.priorityPipelines}
                onUpdatePipeline={handlePipelineUpdate}
                isEditable={isCurrentWeek}
              />
            </section>

            {/* Bottom Section: Weekly Reports Grid (Stacked) */}
            <section>
              <WeeklyReportBoard 
                data={activeWeek}
                isCurrentWeek={isCurrentWeek}
                onUpdateReport={handleReportUpdate}
              />
            </section>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Strategic Goals Section */}
            <section>
              <StrategicGoalsBoard 
                sem1Goals={strategicData.semester1Goals}
                sem2Goals={strategicData.semester2Goals}
                onUpdateGoals={handleStrategicGoalUpdate}
              />
            </section>

            {/* Monthly Executive Report */}
            <section>
              <MonthlyReportBoard 
                monthlyReports={strategicData.monthlyReports}
                onUpdateReport={handleMonthlyReportUpdate}
              />
            </section>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
