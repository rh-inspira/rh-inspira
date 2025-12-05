
import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { StrategicGoal } from '../types';

interface StrategicGoalsBoardProps {
  sem1Goals: StrategicGoal[];
  sem2Goals: StrategicGoal[];
  onUpdateGoals: (semester: 1 | 2, goals: StrategicGoal[]) => void;
}

const GoalList: React.FC<{
  title: string;
  goals: StrategicGoal[];
  onUpdate: (goals: StrategicGoal[]) => void;
  colorClass: string;
}> = ({ title, goals, onUpdate, colorClass }) => {
  const [newGoalText, setNewGoalText] = useState('');

  const handleAdd = () => {
    if (newGoalText.trim()) {
      const newGoal: StrategicGoal = {
        id: Date.now().toString(),
        text: newGoalText,
        achieved: false
      };
      onUpdate([...goals, newGoal]);
      setNewGoalText('');
    }
  };

  const toggleGoal = (id: string) => {
    onUpdate(goals.map(g => g.id === id ? { ...g, achieved: !g.achieved } : g));
  };

  const removeGoal = (id: string) => {
    onUpdate(goals.filter(g => g.id !== id));
  };

  return (
    <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
      <div className={`p-4 border-b border-slate-100 ${colorClass} bg-opacity-10`}>
        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
      </div>
      
      <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-[300px]">
        {goals.map(goal => (
          <div key={goal.id} className="group flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
            <button 
              onClick={() => toggleGoal(goal.id)}
              className={`mt-0.5 ${goal.achieved ? 'text-green-500' : 'text-slate-300 hover:text-slate-400'}`}
            >
              {goal.achieved ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            </button>
            <span className={`flex-1 text-sm ${goal.achieved ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
              {goal.text}
            </span>
            <button 
              onClick={() => removeGoal(goal.id)}
              className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {goals.length === 0 && (
          <p className="text-center text-slate-400 text-sm italic py-4">Nenhum objetivo definido.</p>
        )}
      </div>

      <div className="p-3 border-t border-slate-100 bg-slate-50 flex gap-2">
        <input 
          type="text" 
          value={newGoalText}
          onChange={(e) => setNewGoalText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Novo objetivo..."
          className="flex-1 text-sm bg-white border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-indigo-400 text-slate-700"
        />
        <button 
          onClick={handleAdd}
          className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const StrategicGoalsBoard: React.FC<StrategicGoalsBoardProps> = ({ sem1Goals, sem2Goals, onUpdateGoals }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-bold text-slate-800">Objetivos Semestrais</h2>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <GoalList 
          title="1º Semestre" 
          goals={sem1Goals} 
          onUpdate={(goals) => onUpdateGoals(1, goals)}
          colorClass="bg-blue-500"
        />
        <GoalList 
          title="2º Semestre" 
          goals={sem2Goals} 
          onUpdate={(goals) => onUpdateGoals(2, goals)}
          colorClass="bg-indigo-500"
        />
      </div>
    </div>
  );
};

export default StrategicGoalsBoard;
