
import React, { useState } from 'react';
import { Plus, Trash2, User } from 'lucide-react';
import { PipelineCandidate, PipelineStatus } from '../types';

interface VacancyDashboardProps {
  priorities: [string, string, string, string];
  pipelines: [PipelineCandidate[], PipelineCandidate[], PipelineCandidate[], PipelineCandidate[]];
  onUpdatePipeline: (index: number, newCandidates: PipelineCandidate[]) => void;
  isEditable: boolean;
}

interface PriorityColumnProps {
  index: number;
  title: string;
  candidates: PipelineCandidate[];
  isEditable: boolean;
  onUpdatePipeline: (index: number, newCandidates: PipelineCandidate[]) => void;
}

const STATUS_CONFIG: Record<PipelineStatus, { label: string; classes: string }> = {
  'INTERACTION': { 
    label: 'Em interação', 
    classes: 'bg-blue-600 text-white border-blue-700' // Azul vibrante
  },
  'INTERVIEW_MARCO': { 
    label: 'Entrevistado Marco', 
    classes: 'bg-teal-600 text-white border-teal-700' // Verde azulado
  },
  'INTERVIEW_MANAGER': { 
    label: 'Entrevista Gestão', 
    classes: 'bg-sky-300 text-slate-900 border-sky-400' // Azul bebê
  },
  'PROPOSAL': { 
    label: 'Em proposta', 
    classes: 'bg-green-500 text-white border-green-600' // Verde normal
  }
};

const PriorityColumn: React.FC<PriorityColumnProps> = ({ index, title, candidates, isEditable, onUpdatePipeline }) => {
  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState<PipelineStatus>('INTERACTION');
  
  // Determine header color based on index
  let bgClass, textClass, borderClass, badgeContent;
  
  if (index === 0) {
    bgClass = 'bg-red-500'; textClass = 'text-red-700'; borderClass = 'border-red-500'; badgeContent = '#1';
  } else if (index === 1) {
    bgClass = 'bg-orange-500'; textClass = 'text-orange-700'; borderClass = 'border-orange-500'; badgeContent = '#2';
  } else if (index === 2) {
    bgClass = 'bg-blue-500'; textClass = 'text-blue-700'; borderClass = 'border-blue-500'; badgeContent = '#3';
  } else {
    // 4th Item: Possíveis Entradas
    bgClass = 'bg-purple-500'; textClass = 'text-purple-700'; borderClass = 'border-purple-500'; badgeContent = '★';
  }

  const handleAdd = () => {
    if (newName.trim() && isEditable) {
      const newCandidate: PipelineCandidate = {
        id: Date.now().toString(),
        name: newName.trim(),
        status: newStatus
      };
      onUpdatePipeline(index, [...candidates, newCandidate]);
      setNewName('');
      setNewStatus('INTERACTION'); // Reset to default
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  const handleRemove = (idToRemove: string) => {
    if(isEditable) {
      onUpdatePipeline(index, candidates.filter(c => c.id !== idToRemove));
    }
  };

  const handleChangeStatus = (candidateId: string, currentStatus: PipelineStatus) => {
    if (!isEditable) return;
    
    // Cycle through statuses for simple interaction
    const statuses: PipelineStatus[] = ['INTERACTION', 'INTERVIEW_MARCO', 'INTERVIEW_MANAGER', 'PROPOSAL'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    const updatedCandidates = candidates.map(c => 
      c.id === candidateId ? { ...c, status: nextStatus } : c
    );
    onUpdatePipeline(index, updatedCandidates);
  };

  return (
    <div className="flex-1 flex flex-col w-full min-w-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden h-full">
      {/* Header */}
      <div className={`p-3 md:p-4 border-b-2 ${borderClass} bg-slate-50 flex flex-col gap-1`}>
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-2">
              <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold text-white ${bgClass}`}>
                  {badgeContent}
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider hidden sm:inline">
                {index === 3 ? 'Banco' : 'Prioridade'}
              </span>
           </div>
           <span className="text-[10px] font-semibold bg-white px-1.5 py-0.5 rounded-full text-slate-600 border border-slate-200">
              {candidates.length}
           </span>
        </div>
        <h3 className={`font-bold text-xs md:text-sm ${textClass} mt-1 line-clamp-2 min-h-[32px] md:min-h-[40px] flex items-center`}>
          {title || `(Não definida)`}
        </h3>
      </div>
      
      {/* List */}
      <div className="flex-1 p-2 md:p-3 space-y-2 overflow-y-auto bg-slate-50/50">
          {candidates.length === 0 ? (
               <div className="text-center py-6 text-slate-400 text-[10px] md:text-xs italic">
                  Vazio...
               </div>
          ) : (
              candidates.map((candidate) => (
                  <div 
                    key={candidate.id} 
                    className={`group relative p-2 md:p-3 rounded border shadow-sm flex items-center justify-between transition-all cursor-pointer ${STATUS_CONFIG[candidate.status].classes}`}
                    onClick={() => handleChangeStatus(candidate.id, candidate.status)}
                    title={isEditable ? "Clique para mudar o status" : ""}
                  >
                      <div className="flex items-center gap-2 overflow-hidden flex-1">
                          <div className={`hidden lg:flex p-1.5 rounded-full flex-shrink-0 ${candidate.status === 'INTERVIEW_MANAGER' ? 'bg-white/50 text-slate-700' : 'bg-white/20 text-white'}`}>
                              <User className="w-3 h-3" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs md:text-sm font-bold truncate">{candidate.name}</span>
                            <span className={`text-[9px] md:text-[10px] uppercase tracking-wide font-medium truncate ${candidate.status === 'INTERVIEW_MANAGER' ? 'text-slate-600' : 'text-white/80'}`}>
                              {STATUS_CONFIG[candidate.status].label}
                            </span>
                          </div>
                      </div>
                      {isEditable && (
                          <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(candidate.id);
                              }}
                              className={`opacity-0 group-hover:opacity-100 transition-opacity p-0.5 md:p-1 rounded hover:bg-black/10 ${candidate.status === 'INTERVIEW_MANAGER' ? 'text-slate-500 hover:text-red-600' : 'text-white hover:text-red-200'}`}
                          >
                              <Trash2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          </button>
                      )}
                  </div>
              ))
          )}
      </div>

      {/* Add Input */}
      {isEditable && (
          <div className="p-2 md:p-3 border-t border-slate-100 bg-white flex flex-col gap-2">
               <div className="flex gap-1 md:gap-2">
                  <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Nome..."
                      className="flex-1 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors min-w-0 text-slate-700"
                  />
                  <button 
                      onClick={handleAdd}
                      className={`p-1.5 md:p-2 rounded text-white transition-colors ${bgClass} hover:brightness-90 flex-shrink-0`}
                  >
                      <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value as PipelineStatus)}
                  className="flex-1 text-[10px] md:text-xs bg-slate-50 border border-slate-200 rounded px-1 py-1 focus:outline-none focus:border-indigo-400 text-slate-700"
                >
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
          </div>
      )}
    </div>
  );
};

const VacancyDashboard: React.FC<VacancyDashboardProps> = ({ priorities, pipelines, onUpdatePipeline, isEditable }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Leads por Vaga
          </h2>
          <p className="text-sm text-slate-500 mt-1">Acompanhamento e status dos leads para as vagas prioritárias e possíveis entradas.</p>
        </div>
        
        {/* Legend */}
        <div className="hidden lg:flex flex-wrap gap-3 max-w-lg justify-end">
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${config.classes.split(' ')[0]}`}></div>
                <span className="text-xs text-slate-500 font-medium">{config.label}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Force 4 columns on MD and larger screens to keep them side-by-side as requested */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto min-h-[500px]">
        {priorities.map((priority, idx) => (
            <PriorityColumn 
                key={idx} 
                index={idx} 
                title={priority} 
                candidates={pipelines[idx] || []}
                isEditable={isEditable}
                onUpdatePipeline={onUpdatePipeline}
            />
        ))}
      </div>
    </div>
  );
};

export default VacancyDashboard;
