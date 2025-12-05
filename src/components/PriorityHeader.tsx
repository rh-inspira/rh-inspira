import React, { useState } from 'react';
import { Edit2, Check } from 'lucide-react';

interface PriorityHeaderProps {
  priorities: [string, string, string, string];
  onUpdate: (newPriorities: [string, string, string, string]) => void;
  isCurrentWeek: boolean;
}

const PriorityHeader: React.FC<PriorityHeaderProps> = ({ priorities, onUpdate, isCurrentWeek }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempPriorities, setTempPriorities] = useState<[string, string, string, string]>([...priorities]);

  const handleSave = () => {
    onUpdate(tempPriorities);
    setIsEditing(false);
  };

  const handleChange = (index: number, value: string) => {
    const newP = [...tempPriorities] as [string, string, string, string];
    newP[index] = value;
    setTempPriorities(newP);
  };

  // Helper to determine styling for each index
  const getStyle = (idx: number) => {
    if (idx === 0) return { badge: 'bg-red-100 text-red-700', label: '#1' };
    if (idx === 1) return { badge: 'bg-orange-100 text-orange-700', label: '#2' };
    if (idx === 2) return { badge: 'bg-blue-100 text-blue-700', label: '#3' };
    return { badge: 'bg-purple-100 text-purple-700', label: '★' }; // 4th item
  };

  // We only want to show the first 3 priorities in this header
  const visiblePriorities = isEditing ? tempPriorities.slice(0, 3) : priorities.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">
          Vagas em Ordem de Prioridade
        </h2>
        {isCurrentWeek && (
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`p-2 rounded-full transition-colors ${isEditing ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {isEditing ? <Check className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visiblePriorities.map((p, idx) => {
          const style = getStyle(idx);
          return (
            <div key={idx} className="relative group">
              <div className={`absolute -top-3 left-4 px-2 text-xs font-bold uppercase tracking-wider ${style.badge} rounded border border-white z-10`}>
                {style.label}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={p}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  className="w-full p-4 pt-5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700"
                />
              ) : (
                <div className="w-full p-4 pt-5 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-lg shadow-sm flex items-center min-h-[80px]">
                  <p className="font-semibold text-slate-700 text-sm md:text-base leading-tight">{p}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriorityHeader;