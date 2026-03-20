import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Shuffle, Check, Users, UserPlus, RefreshCw, Ghost, Rocket, Zap, Flame, Crown, Star, Heart, Smile, Moon, Sun, Cloud, Music, Coffee, Pizza, Gamepad2, Camera, Gift, Target, Flag, Sparkles, Fish, Waves, Anchor, Shell } from 'lucide-react';
import { Team } from '../types';

const IconComponent = ({ name, size = 24, className = "" }: { name: string, size?: number, className?: string }) => {
  const icons: Record<string, any> = {
    Fish, Waves, Anchor, Shell, Ghost, Rocket, Zap, Flame, Crown, Star, Heart, Smile, 
    Moon, Sun, Cloud, Music, Coffee, Pizza, Gamepad2, 
    Camera, Gift, Target, Flag, Sparkles, Trophy: Star, Users, X, Shuffle, Plus, Trash2, Check, UserPlus, RefreshCw
  };
  const Icon = icons[name] || Fish;
  return <Icon size={size} className={className} />;
};

interface TeamGeneratorProps {
  onConfirm: (teams: Team[]) => void;
  onCancel: () => void;
  colors: string[];
}

const TEAM_ICONS = [
  'Fish', 'Waves', 'Anchor', 'Shell', 'Ghost', 'Rocket', 'Zap', 'Flame', 'Crown', 'Star', 'Heart', 'Smile', 
  'Moon', 'Sun', 'Cloud', 'Music', 'Coffee', 'Pizza', 'Gamepad2', 
  'Camera', 'Gift', 'Target', 'Flag', 'Sparkles'
];

export default function TeamGenerator({ onConfirm, onCancel, colors }: TeamGeneratorProps) {
  const [people, setPeople] = useState<string[]>([]);
  const [newPerson, setNewPerson] = useState('');
  const [phase, setPhase] = useState<'input' | 'juggling' | 'confirm'>('input');
  const [shuffledPeople, setShuffledPeople] = useState<string[]>([]);
  const [generatedTeams, setGeneratedTeams] = useState<Team[]>([]);

  const addPerson = () => {
    if (newPerson.trim()) {
      setPeople([...people, newPerson.trim()]);
      setNewPerson('');
    }
  };

  const removePerson = (index: number) => {
    setPeople(people.filter((_, i) => i !== index));
  };

  const startJuggling = () => {
    if (people.length < 1) return;
    setPhase('juggling');
    
    // Simulate juggling animation
    let count = 0;
    const interval = setInterval(() => {
      setShuffledPeople([...people].sort(() => Math.random() - 0.5));
      count++;
      if (count > 20) {
        clearInterval(interval);
        generateTeams();
      }
    }, 100);
  };

  const generateTeams = () => {
    const shuffled = [...people].sort(() => Math.random() - 0.5);
    const teams: Team[] = [];
    
    for (let i = 0; i < shuffled.length; i += 2) {
      const members = shuffled.slice(i, i + 2);
      const teamName = members.length === 2 
        ? `${members[0]} & ${members[1]}` 
        : members[0];
        
      teams.push({
        id: crypto.randomUUID(),
        name: teamName,
        score: 0,
        color: colors[teams.length % colors.length],
        icon: TEAM_ICONS[teams.length % TEAM_ICONS.length],
        members: members
      });
    }
    
    setGeneratedTeams(teams);
    setPhase('confirm');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-sky-950 flex items-center justify-center p-6 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-4xl h-[80vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-sky-100 flex items-center justify-between bg-sky-50">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-sky-900">Team Generator</h2>
            <p className="text-sm text-sky-500 font-medium mt-1">Add participants and split them into pairs</p>
          </div>
          <button
            onClick={onCancel}
            className="w-12 h-12 flex items-center justify-center hover:bg-sky-200 rounded-2xl transition-colors text-sky-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-12">
          {phase === 'input' && (
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-4 mb-8">
                <div className="flex-1 relative">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
                  <input
                    type="text"
                    placeholder="Enter participant name..."
                    className="w-full pl-12 pr-4 py-4 bg-sky-100 rounded-2xl font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={newPerson}
                    onChange={(e) => setNewPerson(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addPerson()}
                  />
                </div>
                <button
                  onClick={addPerson}
                  className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                >
                  ADD
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <AnimatePresence>
                  {people.map((person, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center justify-between p-4 bg-sky-50 rounded-xl border border-sky-100 group hover:border-blue-200 hover:bg-white transition-all"
                    >
                      <span className="font-bold text-sky-700">{person}</span>
                      <button
                        onClick={() => removePerson(index)}
                        className="p-2 text-sky-400 hover:text-rose-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {people.length === 0 && (
                <div className="text-center py-24 text-sky-300">
                  <Users size={64} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-sm">No participants added yet</p>
                </div>
              )}
            </div>
          )}

          {phase === 'juggling' && (
            <div className="h-full flex flex-col items-center justify-center gap-12">
              <div className="relative w-64 h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-dashed border-blue-200 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shuffle size={64} className="text-blue-600 animate-pulse" />
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4 max-w-2xl">
                {shuffledPeople.map((person, i) => (
                  <motion.div
                    key={i}
                    layout
                    className="px-4 py-2 bg-blue-50 text-blue-600 font-black rounded-full border border-blue-100"
                  >
                    {person}
                  </motion.div>
                ))}
              </div>
              <h3 className="text-2xl font-black text-sky-400 uppercase tracking-[0.3em] animate-pulse">Juggling Participants...</h3>
            </div>
          )}

          {phase === 'confirm' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedTeams.map((team, i) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border-2 border-sky-100 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group hover:border-blue-200 transition-all"
                >
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: team.color }}
                  />
                  <div className="relative z-10">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-6 shadow-lg border-2 border-sky-100"
                      style={{ backgroundColor: team.color }}
                    >
                      <IconComponent name={team.icon} size={32} />
                    </div>
                    <div className="space-y-2">
                      {team.members.map((member, mi) => (
                        <div key={mi} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-sky-300" />
                          <span className="text-xl font-black text-sky-800">{member}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-sky-100">
                      <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Team Name</span>
                      <p className="font-bold text-sky-600 truncate">{team.name}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-sky-50 border-t border-sky-100 flex gap-4">
          {phase === 'input' && (
            <>
              <button
                onClick={onCancel}
                className="px-8 py-4 bg-sky-200 text-sky-700 font-black rounded-2xl hover:bg-sky-300 transition-all active:scale-95"
              >
                CANCEL
              </button>
              <button
                disabled={people.length < 1}
                onClick={startJuggling}
                className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shuffle size={24} />
                CREATE TEAMS
              </button>
            </>
          )}

          {phase === 'confirm' && (
            <>
              <button
                onClick={() => setPhase('input')}
                className="px-8 py-4 bg-sky-200 text-sky-700 font-black rounded-2xl hover:bg-sky-300 transition-all active:scale-95 flex items-center gap-2"
              >
                <RefreshCw size={20} />
                RE-JUGGLE
              </button>
              <button
                onClick={() => onConfirm(generatedTeams)}
                className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
              >
                <Check size={24} />
                CONFIRM TEAMS
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
