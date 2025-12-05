
import React, { useState } from 'react';
import { Users, UserMinus, BookOpen, Briefcase } from 'lucide-react';
import { WeeklyData, Category } from '../types';
import ContentEditor from './ContentEditor';

interface WeeklyReportBoardProps {
  data: WeeklyData;
  isCurrentWeek: boolean;
  onUpdateReport: (section: 'thisWeek' | 'nextWeek', category: Category, value: string) => void;
}

const ReportSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  colorClass: string;
  isEditable: boolean;
}> = ({ title, icon, value, onChange, colorClass, isEditable }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col h-full min-h-[160px]">
      <div className={`px-4 py-3 border-b border-slate-100 flex items-center gap-2 ${colorClass} bg-opacity-10`}>
        <div className={`p-1.5 rounded-md ${colorClass} text-white`}>
          {icon}
        </div>
        <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <div className="flex-1 p-0 relative">
        <ContentEditor
          value={value}
          onChange={onChange}
          readOnly={!isEditable}
          placeholder={isEditable ? "Descreva as atividades..." : "Nenhuma atividade registrada."}
          className={`w-full h-full p-4 text-slate-700 text-sm ${!isEditable ? 'bg-slate-50/50 text-slate-500' : 'bg-white'}`}
        />
      </div>
    </div>
  );
};

const WeeklyReportBoard: React.FC<WeeklyReportBoardProps> = ({ data, isCurrentWeek, onUpdateReport }) => {
  const [activeTab, setActiveTab] = useState<'thisWeek' | 'nextWeek'>('thisWeek');

  const reportData = activeTab === 'thisWeek' ? data.reportThisWeek : data.reportNextWeek;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
      {/* Header Tabs */}
      <div className="flex border-b border-slate-100 flex-shrink-0">
        <button
          onClick={() => setActiveTab('thisWeek')}
          className={`flex-1 py-4 text-sm font-medium text-center transition-colors relative ${
            activeTab === 'thisWeek' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          Reporte da Semana
          {activeTab === 'thisWeek' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('nextWeek')}
          className={`flex-1 py-4 text-sm font-medium text-center transition-colors relative ${
            activeTab === 'nextWeek' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          Próxima Semana (Planejamento)
          {activeTab === 'nextWeek' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />
          )}
        </button>
      </div>

      {/* Grid Content */}
      <div className="p-6 bg-slate-50/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReportSection 
            title="Recrutamento e Seleção"
            icon={<Users className="w-5 h-5" />}
            value={reportData.recruitment}
            onChange={(val) => onUpdateReport(activeTab, 'RECRUITMENT', val)}
            colorClass="bg-blue-500"
            isEditable={isCurrentWeek}
          />
          <ReportSection 
            title="Contratação / Desligamento"
            icon={<UserMinus className="w-5 h-5" />}
            value={reportData.turnover}
            onChange={(val) => onUpdateReport(activeTab, 'TURNOVER', val)}
            colorClass="bg-red-500"
            isEditable={isCurrentWeek}
          />
          <ReportSection 
            title="DHO"
            icon={<BookOpen className="w-5 h-5" />}
            value={reportData.dho}
            onChange={(val) => onUpdateReport(activeTab, 'DHO', val)}
            colorClass="bg-emerald-500"
            isEditable={isCurrentWeek}
          />
          <ReportSection 
            title="Projetos / Processos"
            icon={<Briefcase className="w-5 h-5" />}
            value={reportData.projects}
            onChange={(val) => onUpdateReport(activeTab, 'PROJECTS', val)}
            colorClass="bg-amber-500"
            isEditable={isCurrentWeek}
          />
        </div>
      </div>
    </div>
  );
};

export default WeeklyReportBoard;
