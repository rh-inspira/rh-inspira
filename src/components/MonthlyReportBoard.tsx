
import React, { useState } from 'react';
import { Users, UserMinus, BookOpen, Briefcase } from 'lucide-react';
import { MonthlyReportSection, MonthKey } from '../types';
import ContentEditor from './ContentEditor';

interface MonthlyReportBoardProps {
  monthlyReports: Record<MonthKey, MonthlyReportSection>;
  onUpdateReport: (month: MonthKey, section: keyof MonthlyReportSection, value: string) => void;
}

const ReportSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  colorClass: string;
}> = ({ title, icon, value, onChange, colorClass }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col">
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
          placeholder="Escreva o relatório executivo aqui..."
          className="w-full h-full min-h-[140px] p-4 text-slate-700 text-sm bg-white"
        />
      </div>
    </div>
  );
};

const MONTHS: { key: MonthKey; label: string }[] = [
  { key: 'jan', label: 'Jan' },
  { key: 'fev', label: 'Fev' },
  { key: 'mar', label: 'Mar' },
  { key: 'abr', label: 'Abr' },
  { key: 'mai', label: 'Mai' },
  { key: 'jun', label: 'Jun' },
  { key: 'jul', label: 'Jul' },
  { key: 'ago', label: 'Ago' },
  { key: 'set', label: 'Set' },
  { key: 'out', label: 'Out' },
  { key: 'nov', label: 'Nov' },
  { key: 'dez', label: 'Dez' },
];

const MonthlyReportBoard: React.FC<MonthlyReportBoardProps> = ({ monthlyReports, onUpdateReport }) => {
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>('dez'); // Default to December

  const currentReport = monthlyReports[selectedMonth];

  return (
    <div className="bg-slate-50 rounded-xl p-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Relatório Mensal</h2>
          <p className="text-sm text-slate-500">Reporte consolidado para a diretoria.</p>
        </div>
        
        {/* Month Selector */}
        <div className="flex flex-wrap gap-1 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
          {MONTHS.map((m) => (
            <button
              key={m.key}
              onClick={() => setSelectedMonth(m.key)}
              className={`px-2.5 py-1.5 text-xs font-bold rounded transition-colors ${
                selectedMonth === m.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300 key={selectedMonth}">
        <ReportSection
          title="Recrutamento e Seleção"
          icon={<Users className="w-4 h-4" />}
          value={currentReport.recruitment}
          onChange={(v) => onUpdateReport(selectedMonth, 'recruitment', v)}
          colorClass="bg-blue-500"
        />
        <ReportSection
          title="Contratação / Desligamento"
          icon={<UserMinus className="w-4 h-4" />}
          value={currentReport.turnover}
          onChange={(v) => onUpdateReport(selectedMonth, 'turnover', v)}
          colorClass="bg-red-500"
        />
        <ReportSection
          title="DHO"
          icon={<BookOpen className="w-4 h-4" />}
          value={currentReport.dho}
          onChange={(v) => onUpdateReport(selectedMonth, 'dho', v)}
          colorClass="bg-emerald-500"
        />
        <ReportSection
          title="Projetos / Processos"
          icon={<Briefcase className="w-4 h-4" />}
          value={currentReport.projects}
          onChange={(v) => onUpdateReport(selectedMonth, 'projects', v)}
          colorClass="bg-amber-500"
        />
      </div>
    </div>
  );
};

export default MonthlyReportBoard;
