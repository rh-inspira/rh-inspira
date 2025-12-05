import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface ReportItem {
  id: string;
  text: string;
}

interface ReportCardProps {
  title: string;
  icon: React.ReactNode;
  items: ReportItem[];
  colorClass: string;
  isEditable: boolean;
  onAddItem?: (text: string) => void;
  onRemoveItem?: (id: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ 
  title, 
  icon, 
  items, 
  colorClass, 
  isEditable,
  onAddItem,
  onRemoveItem 
}) => {
  const [newItemText, setNewItemText] = React.useState('');

  const handleAdd = () => {
    if (newItemText.trim() && onAddItem) {
      onAddItem(newItemText);
      setNewItemText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden transition-all hover:shadow-md`}>
      <div className={`p-3 border-b border-slate-100 flex items-center gap-2 ${colorClass} bg-opacity-10`}>
        <div className={`p-1.5 rounded-md ${colorClass} text-white`}>
          {icon}
        </div>
        <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">{title}</h3>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto max-h-[200px] min-h-[150px]">
        {items.length === 0 ? (
          <p className="text-slate-400 text-sm italic text-center mt-4">Nenhum item reportado.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="group flex items-start gap-2 text-sm text-slate-600">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${colorClass.replace('bg-', 'bg-')}`} />
                <span className="flex-1 leading-relaxed">{item.text}</span>
                {isEditable && onRemoveItem && (
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {isEditable && (
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Novo item..."
            className="flex-1 text-sm bg-white border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:border-indigo-400"
          />
          <button 
            onClick={handleAdd}
            className="bg-indigo-600 text-white p-1.5 rounded hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportCard;