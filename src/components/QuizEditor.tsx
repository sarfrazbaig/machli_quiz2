import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronRight, ChevronDown, Image as ImageIcon, X, Save, Play } from 'lucide-react';
import { Quiz, Round, Category, Question } from '../types';

interface QuizEditorProps {
  onSave: (quiz: Quiz) => void;
  onCancel: () => void;
  initialQuiz?: Quiz;
}

const POINT_VALUES = [10, 20, 30, 40, 50];

export default function QuizEditor({ onSave, onCancel, initialQuiz }: QuizEditorProps) {
  const [title, setTitle] = useState(initialQuiz?.title || '');
  const [rounds, setRounds] = useState<Round[]>(initialQuiz?.rounds || [createEmptyRound(0)]);
  const [activeRoundIndex, setActiveRoundIndex] = useState(0);

  function createEmptyRound(index: number): Round {
    return {
      id: crypto.randomUUID(),
      name: `Round ${index + 1}`,
      categories: Array.from({ length: 5 }, (_, i) => ({
        id: crypto.randomUUID(),
        name: `Category ${i + 1}`,
        questions: POINT_VALUES.map(points => ({
          id: crypto.randomUUID(),
          points,
          questionText: '',
          answerText: '',
          isRevealed: false
        }))
      }))
    };
  }

  const addRound = () => {
    setRounds([...rounds, createEmptyRound(rounds.length)]);
    setActiveRoundIndex(rounds.length);
  };

  const removeRound = (index: number) => {
    if (rounds.length <= 1) return;
    const newRounds = rounds.filter((_, i) => i !== index);
    setRounds(newRounds);
    setActiveRoundIndex(Math.max(0, activeRoundIndex - 1));
  };

  const updateCategoryName = (roundIdx: number, catIdx: number, name: string) => {
    const newRounds = [...rounds];
    newRounds[roundIdx].categories[catIdx].name = name;
    setRounds(newRounds);
  };

  const updateQuestion = (roundIdx: number, catIdx: number, qIdx: number, field: keyof Question, value: any) => {
    const newRounds = [...rounds];
    (newRounds[roundIdx].categories[catIdx].questions[qIdx] as any)[field] = value;
    setRounds(newRounds);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a quiz title');
      return;
    }
    onSave({
      id: initialQuiz?.id || crypto.randomUUID(),
      title,
      rounds
    });
  };

  return (
    <div className="flex flex-col h-full bg-sky-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4 flex-1">
          <input
            type="text"
            placeholder="Quiz Title"
            className="text-2xl font-bold bg-transparent border-none focus:ring-0 w-full max-w-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Save size={18} />
            Save Quiz
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Rounds */}
        <div className="w-64 border-r bg-sky-50 p-4 flex flex-col gap-2 overflow-y-auto">
          <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Rounds</h3>
          {rounds.map((round, idx) => (
            <div
              key={round.id}
              className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                activeRoundIndex === idx ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm' : 'hover:bg-sky-100 text-sky-600'
              }`}
              onClick={() => setActiveRoundIndex(idx)}
            >
              <span className="font-medium truncate">{round.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); removeRound(idx); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={addRound}
            className="flex items-center justify-center gap-2 p-3 mt-2 border-2 border-dashed border-sky-200 rounded-lg text-sky-400 hover:border-blue-300 hover:text-blue-500 transition-all"
          >
            <Plus size={18} />
            Add Round
          </button>
        </div>

        {/* Main Content - Grid Editor */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-5 gap-4">
            {rounds[activeRoundIndex].categories.map((category, catIdx) => (
              <div key={category.id} className="flex flex-col gap-4">
                <input
                  type="text"
                  className="w-full p-3 bg-blue-600 text-white font-bold text-center rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 outline-none"
                  value={category.name}
                  onChange={(e) => updateCategoryName(activeRoundIndex, catIdx, e.target.value)}
                />
                {category.questions.map((question, qIdx) => (
                  <QuestionEditorItem
                    key={question.id}
                    question={question}
                    onChange={(field, value) => updateQuestion(activeRoundIndex, catIdx, qIdx, field, value)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuestionEditorItemProps {
  key?: string;
  question: Question;
  onChange: (field: keyof Question, value: any) => void;
}

function QuestionEditorItem({ question, onChange }: QuestionEditorItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col border rounded-lg bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-3 hover:bg-sky-50 transition-colors"
      >
        <span className="font-bold text-blue-600">{question.points}</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      
      {isOpen && (
        <div className="p-4 border-t bg-sky-50 flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-bold text-sky-400 uppercase mb-1 block">Question</label>
            <textarea
              className="w-full p-2 text-sm border rounded bg-white focus:ring-1 focus:ring-blue-500 outline-none min-h-[60px]"
              value={question.questionText}
              onChange={(e) => onChange('questionText', e.target.value)}
              placeholder="Enter question text..."
            />
            <ImageInput
              value={question.questionImage}
              onChange={(val) => onChange('questionImage', val)}
              label="Question Image URL"
            />
          </div>
          <div className="border-t pt-3">
            <label className="text-[10px] font-bold text-sky-400 uppercase mb-1 block">Answer</label>
            <textarea
              className="w-full p-2 text-sm border rounded bg-white focus:ring-1 focus:ring-blue-500 outline-none min-h-[60px]"
              value={question.answerText}
              onChange={(e) => onChange('answerText', e.target.value)}
              placeholder="Enter answer text..."
            />
            <ImageInput
              value={question.answerImage}
              onChange={(val) => onChange('answerImage', val)}
              label="Answer Image URL"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ImageInput({ value, onChange, label }: { value?: string, onChange: (val: string) => void, label: string }) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-2">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-sky-400 uppercase">{label}</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <ImageIcon size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-sky-400" />
            <input
              type="text"
              className="w-full pl-8 pr-2 py-1 text-xs border rounded bg-white focus:ring-1 focus:ring-blue-500 outline-none"
              value={value?.startsWith('data:') ? 'Local Image' : (value || '')}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste URL or upload below..."
              readOnly={value?.startsWith('data:')}
            />
          </div>
          {value && (
            <button onClick={() => onChange('')} className="text-sky-400 hover:text-red-500">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-600 text-xs font-bold rounded cursor-pointer transition-colors border border-sky-200">
            <Plus size={12} />
            Upload from PC
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
      {value && (
        <div className="mt-2 relative group aspect-video rounded border overflow-hidden bg-sky-200">
          <img src={value} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
      )}
    </div>
  );
}
