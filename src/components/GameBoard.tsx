import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Minus, Plus, Trophy, ChevronLeft, ChevronRight, Eye, Users, AlertTriangle, Layout, Play, Loader2, Ghost, Rocket, Zap, Flame, Crown, Star, Heart, Smile, Moon, Sun, Cloud, Music, Coffee, Pizza, Gamepad2, Camera, Gift, Target, Flag, Sparkles, Fish, Waves, Anchor, Shell } from 'lucide-react';
import { Quiz, Team, Question } from '../types';

const IconComponent = ({ name, size = 24, className = "" }: { name: string, size?: number, className?: string }) => {
  const icons: Record<string, any> = {
    Fish, Waves, Anchor, Shell, Ghost, Rocket, Zap, Flame, Crown, Star, Heart, Smile, 
    Moon, Sun, Cloud, Music, Coffee, Pizza, Gamepad2, 
    Camera, Gift, Target, Flag, Sparkles, Trophy, Users, Layout, Plus, Play, Eye, X, Check, Minus, AlertTriangle, Loader2
  };
  const Icon = icons[name] || Fish;
  return <Icon size={size} className={className} />;
};

interface GameBoardProps {
  quiz: Quiz;
  teams: Team[];
  onUpdateTeams: (teams: Team[]) => void;
  onExit: () => void;
}

const TEAM_COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#f97316', // Orange
];

export default function GameBoard({ quiz, teams, onUpdateTeams, onExit }: GameBoardProps) {
  const [gameState, setGameState] = useState<'selectingTeam' | 'intro' | 'countdown' | 'playing' | 'roundComplete' | 'finalStandings'>('selectingTeam');
  const [countdown, setCountdown] = useState(3);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<{ catIdx: number, qIdx: number } | null>(null);
  const [revealedIds, setRevealedIds] = useState<Record<string, string | null>>({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [questionScores, setQuestionScores] = useState<Record<string, number>>({});
  const [selectedTeamIdx, setSelectedTeamIdx] = useState(0);
  const [finalSelectedTeam, setFinalSelectedTeam] = useState<Team | null>(null);
  const [showEndRoundConfirm, setShowEndRoundConfirm] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isPreloading, setIsPreloading] = useState(false);

  const currentRound = quiz.rounds[currentRoundIdx];

  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Resolve anyway to not get stuck
    });
  };

  // Team Selection logic
  React.useEffect(() => {
    if (gameState === 'selectingTeam') {
      let iterations = 0;
      const maxIterations = 20;
      const interval = setInterval(() => {
        setSelectedTeamIdx(prev => (prev + 1) % teams.length);
        iterations++;
        if (iterations >= maxIterations) {
          clearInterval(interval);
          const winnerIdx = Math.floor(Math.random() * teams.length);
          setSelectedTeamIdx(winnerIdx);
          setFinalSelectedTeam(teams[winnerIdx]);
          setTimeout(() => setGameState('intro'), 2000);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [gameState, teams]);

  // Countdown logic
  React.useEffect(() => {
    if (gameState === 'countdown') {
      if (countdown >= 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setGameState('playing');
        setCountdown(3); // Reset for next time
      }
    }
  }, [countdown, gameState]);

  // Check if round is complete
  const isRoundComplete = () => {
    const totalQuestions = currentRound.categories.reduce((acc, cat) => acc + cat.questions.length, 0);
    const revealedInCurrentRound = Object.keys(revealedIds).filter(id => 
      currentRound.categories.some(cat => cat.questions.some(q => q.id === id))
    ).length;
    return revealedInCurrentRound === totalQuestions;
  };

  const handleQuestionClick = async (catIdx: number, qIdx: number) => {
    const question = currentRound.categories[catIdx].questions[qIdx];
    if (revealedIds[question.id] !== undefined) return;
    
    if (question.questionImage) {
      setIsPreloading(true);
      await preloadImage(question.questionImage);
      setIsPreloading(false);
    }
    
    setSelectedQuestion({ catIdx, qIdx });
    setShowAnswer(false);
    setQuestionScores({});
  };

  const handleRevealAnswer = async () => {
    if (!selectedQuestion) return;
    const question = currentRound.categories[selectedQuestion.catIdx].questions[selectedQuestion.qIdx];
    
    if (question.answerImage) {
      setIsPreloading(true);
      await preloadImage(question.answerImage);
      setIsPreloading(false);
    }
    setShowAnswer(true);
  };

  const markAsRevealed = (id: string) => {
    // Find the team that got it right (positive score)
    const winningTeamId = Object.keys(questionScores).find(teamId => questionScores[teamId] > 0) || null;

    // Apply all pending scores from this question
    const newTeams = teams.map(team => ({
      ...team,
      score: team.score + (questionScores[team.id] || 0)
    }));
    onUpdateTeams(newTeams);
    
    setRevealedIds(prev => ({ ...prev, [id]: winningTeamId }));
    setSelectedQuestion(null);

    // Check if that was the last question of the round
    const totalQuestions = currentRound.categories.reduce((acc, cat) => acc + cat.questions.length, 0);
    const revealedInCurrentRound = Object.keys(revealedIds).filter(qid => 
      currentRound.categories.some(cat => cat.questions.some(q => q.id === qid))
    ).length + 1; // +1 because we just added one

    if (revealedInCurrentRound === totalQuestions) {
      setTimeout(() => {
        if (currentRoundIdx === quiz.rounds.length - 1) {
          setGameState('finalStandings');
        } else {
          setGameState('roundComplete');
        }
      }, 1000);
    }
  };

  const getRoundTheme = (idx: number) => {
    const themes = [
      { bg: 'bg-blue-900', border: 'border-blue-700/50', shadow: 'rgba(30,58,138,0.3)', text: 'text-blue-400', hover: 'hover:bg-blue-800', qBg: 'bg-blue-950/40', qBorder: 'border-blue-700/30' },
      { bg: 'bg-cyan-700', border: 'border-cyan-500/50', shadow: 'rgba(6,182,212,0.3)', text: 'text-cyan-400', hover: 'hover:bg-cyan-600', qBg: 'bg-cyan-900/40', qBorder: 'border-cyan-500/30' },
      { bg: 'bg-rose-700', border: 'border-rose-500/50', shadow: 'rgba(244,63,94,0.3)', text: 'text-rose-400', hover: 'hover:bg-rose-600', qBg: 'bg-rose-900/40', qBorder: 'border-rose-500/30' },
      { bg: 'bg-amber-700', border: 'border-amber-500/50', shadow: 'rgba(245,158,11,0.3)', text: 'text-amber-400', hover: 'hover:bg-amber-600', qBg: 'bg-amber-900/40', qBorder: 'border-amber-500/30' },
    ];
    return themes[idx % themes.length];
  };

  const currentTheme = getRoundTheme(currentRoundIdx);

  const toggleQuestionScore = (teamId: string, points: number, isCorrect: boolean) => {
    setQuestionScores(prev => {
      const current = prev[teamId] || 0;
      const target = isCorrect ? points : -points;
      
      // If clicking the same button again, clear it
      if (current === target) {
        const { [teamId]: _, ...rest } = prev;
        return rest;
      }

      const next = { ...prev };

      // Rule: Only one team can be correct
      if (isCorrect) {
        // Remove positive scores from all other teams
        Object.keys(next).forEach(id => {
          if (next[id] > 0) {
            delete next[id];
          }
        });
      }
      
      next[teamId] = target;
      return next;
    });
  };

  if (gameState === 'selectingTeam') {
    return (
      <div className="fixed inset-0 z-[100] bg-sky-950 flex flex-col items-center justify-center text-white p-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <h2 className={`${currentTheme.text} font-black uppercase tracking-[0.3em] text-2xl mb-4`}>Starting Show</h2>
          <h1 className="text-7xl font-black italic tracking-tighter">Who Goes First?</h1>
        </motion.div>

        <div className="w-full max-w-4xl grid grid-cols-1 gap-4 mb-16">
          {teams.map((team, idx) => (
            <motion.div
              key={team.id}
              animate={{
                scale: selectedTeamIdx === idx ? 1.05 : 1,
                opacity: selectedTeamIdx === idx ? 1 : 0.4,
                backgroundColor: selectedTeamIdx === idx ? team.color : '#0c4a6e', // bg-sky-900
              }}
              className="p-8 rounded-3xl flex items-center justify-between shadow-2xl transition-all border border-sky-800"
            >
              <div className="flex items-center gap-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-inner bg-white/10`}>
                  {team.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-4xl font-black">{team.name}</span>
              </div>
              {finalSelectedTeam?.id === team.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-white text-sky-950 px-6 py-2 rounded-full font-black uppercase tracking-widest text-sm"
                >
                  GOES FIRST!
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (gameState === 'intro') {
    return (
      <div className="fixed inset-0 z-[100] bg-sky-950 flex flex-col items-center justify-center text-white p-12 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${currentTheme.bg} opacity-20 blur-[120px] rounded-full`} />
          <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] ${currentTheme.bg} opacity-20 blur-[120px] rounded-full`} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-6xl text-center"
        >
          <div className={`inline-flex items-center gap-3 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8`}>
            <Layout size={18} className={currentTheme.text} />
            <span className="text-sm font-black text-white uppercase tracking-[0.3em]">{currentRound.name}</span>
          </div>

          <h2 className="text-7xl font-black text-white mb-16 tracking-tighter italic">
            Round Categories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {currentRound.categories.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] group hover:bg-white/10 transition-all hover:border-white/20"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-black text-white">{idx + 1}</span>
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">{category.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-6">
                  {category.questions.map(q => q.points).filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b).map(points => (
                    <div key={points} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-sky-400">
                      {points}
                    </div>
                  ))}
                </div>
                <div className={`h-1 w-12 ${currentTheme.bg} mx-auto rounded-full opacity-50 group-hover:w-24 transition-all`} />
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-10">
            {finalSelectedTeam && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-6 px-10 py-5 bg-white/5 border border-white/10 rounded-[2rem]"
              >
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-1">Starting Team</span>
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-xl shadow-lg"
                      style={{ backgroundColor: finalSelectedTeam.color }}
                    />
                    <span className="text-3xl font-black text-white">{finalSelectedTeam.name}</span>
                  </div>
                </div>
              </motion.div>
            )}

            <button
              onClick={() => setGameState('countdown')}
              className={`px-16 py-6 ${currentTheme.bg} ${currentTheme.hover} text-white text-3xl font-black rounded-[2.5rem] transition-all shadow-2xl active:scale-95 flex items-center gap-4 group`}
            >
              <Play size={32} fill="currentColor" className="group-hover:scale-110 transition-transform" />
              START ROUND
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'countdown') {
    return (
      <div className="fixed inset-0 z-[100] bg-sky-950 flex flex-col items-center justify-center text-white">
        <motion.div
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          exit={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-[15rem] font-black italic ${currentTheme.text} drop-shadow-[0_0_50px_${currentTheme.shadow}]`}
        >
          {countdown === 0 ? 'GO!' : countdown}
        </motion.div>
        <div className="mt-12 text-sky-500 font-black uppercase tracking-[0.5em] text-2xl animate-pulse">
          Get Ready...
        </div>
      </div>
    );
  }

  if (gameState === 'roundComplete') {
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
    return (
      <div className="fixed inset-0 z-[100] bg-sky-950 flex flex-col items-center justify-center text-white p-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <h2 className={`${currentTheme.text} font-black uppercase tracking-[0.3em] text-2xl mb-4`}>End of Round</h2>
          <h1 className="text-7xl font-black italic tracking-tighter">{currentRound.name} Complete</h1>
        </motion.div>

        <div className="w-full max-w-4xl grid grid-cols-1 gap-4 mb-16">
          {sortedTeams.map((team, idx) => (
            <motion.div
              key={team.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-sky-900 border border-sky-800 p-6 rounded-3xl flex items-center justify-between shadow-xl"
              style={{ borderLeft: `8px solid ${team.color}` }}
            >
              <div className="flex items-center gap-6">
                <span className="text-4xl font-black text-sky-700 w-12">#{idx + 1}</span>
                <span className="text-3xl font-black">{team.name}</span>
              </div>
              <span className="text-5xl font-black text-sky-400">{team.score}</span>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => {
            setCurrentRoundIdx(prev => prev + 1);
            setGameState('intro');
          }}
          className={`px-12 py-6 ${currentTheme.bg} ${currentTheme.hover} text-white rounded-2xl text-3xl font-black transition-all shadow-2xl active:scale-95`}
        >
          CONTINUE TO NEXT ROUND
        </button>
      </div>
    );
  }

  if (gameState === 'finalStandings') {
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
    return (
      <div className="fixed inset-0 z-[100] bg-sky-950 flex flex-col items-center justify-center text-white p-12 overflow-hidden">
        {/* Confetti-like background effect */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500 rounded-full blur-[150px] animate-pulse" />
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-16 relative z-10"
        >
          <div className="relative inline-block mb-8">
            <Trophy size={120} className="text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]" />
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-sky-500 p-4 rounded-2xl border-4 border-sky-200 shadow-xl"
            >
              <Fish className="text-white" size={32} />
            </motion.div>
          </div>
          <h2 className="text-amber-500 font-black uppercase tracking-[0.5em] text-2xl mb-4 italic">Final Standings</h2>
          <h1 className="text-8xl font-black italic tracking-tighter text-white drop-shadow-[0_4px_0_rgba(14,165,233,1)]">WE HAVE A WINNER!</h1>
        </motion.div>

        <div className="w-full max-w-5xl grid grid-cols-1 gap-6 mb-16 relative z-10">
          {sortedTeams.map((team, idx) => (
            <motion.div
              key={team.id}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + (idx * 0.2) }}
              className={`p-8 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all border-4 border-sky-100 ${
                idx === 0 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 scale-110 shadow-xl' 
                  : 'bg-sky-900 shadow-lg'
              }`}
            >
              <div className="flex items-center gap-8">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-white border-4 border-sky-200 shadow-md ${
                  idx === 0 ? 'bg-amber-400' : 'bg-sky-800'
                }`}>
                  <IconComponent name={team.icon} size={48} />
                </div>
                <div>
                  <h3 className={`text-5xl font-black italic ${idx === 0 ? 'text-white' : 'text-sky-100'}`}>{team.name}</h3>
                  {idx === 0 && <p className="text-amber-200 font-black uppercase tracking-widest text-sm mt-1">Grand Champion</p>}
                </div>
              </div>
              <div className="text-right">
                <span className={`text-7xl font-black italic ${idx === 0 ? 'text-white' : 'text-sky-400'}`}>{team.score}</span>
                <p className={`text-xs font-black uppercase tracking-widest ${idx === 0 ? 'text-amber-200' : 'text-sky-400'}`}>Total Points</p>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={onExit}
          className="px-12 py-6 bg-white text-sky-950 rounded-2xl text-2xl font-black hover:bg-sky-200 transition-all active:scale-95 relative z-10"
        >
          RETURN TO LOBBY
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-sky-950 text-white overflow-hidden font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-sky-900 border-b border-sky-800">
        <div className="flex items-center gap-6">
          <button onClick={onExit} className="p-2 hover:bg-sky-800 rounded-full transition-colors">
            <X size={20} />
          </button>
          <h1 className={`text-xl font-black uppercase tracking-tighter ${currentTheme.text}`}>{quiz.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-sky-800 rounded-lg p-1">
            <button
              disabled={currentRoundIdx === 0}
              onClick={() => setCurrentRoundIdx(prev => prev - 1)}
              className="p-2 hover:bg-sky-700 rounded-md disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 font-bold uppercase text-sm tracking-widest">{currentRound.name}</span>
          </div>
          
          <button
            onClick={() => setShowEndRoundConfirm(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-lg transition-all uppercase tracking-tighter flex items-center gap-2 shadow-lg shadow-rose-500/10"
          >
            <AlertTriangle size={14} />
            End Round
          </button>
        </div>
      </div>

      {/* Main Board Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* The Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-5 gap-4 h-full min-h-[600px]">
            {currentRound.categories.map((category, catIdx) => (
              <div key={category.id} className="flex flex-col gap-4">
                <div className={`${currentTheme.bg} p-4 rounded-xl shadow-[0_0_20px_${currentTheme.shadow}] flex items-center justify-center text-center h-24 border-2 ${currentTheme.border}`}>
                  <h2 className="font-black uppercase text-lg leading-tight tracking-tight drop-shadow-md">
                    {category.name}
                  </h2>
                </div>
                {category.questions.map((question, qIdx) => {
                  const winnerId = revealedIds[question.id];
                  const winningTeam = teams.find(t => t.id === winnerId);
                  
                  return (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionClick(catIdx, qIdx)}
                      disabled={winnerId !== undefined}
                      className={`flex-1 rounded-xl flex flex-col items-center justify-center transition-all duration-300 border-2 ${
                        winnerId !== undefined
                          ? winningTeam 
                            ? 'border-transparent text-white shadow-lg' 
                            : 'bg-sky-900 border-sky-800 text-sky-700'
                          : `${currentTheme.qBg} ${currentTheme.qBorder} ${currentTheme.text} ${currentTheme.hover} hover:text-white hover:scale-[1.02] hover:shadow-[0_0_30px_${currentTheme.shadow}] hover:border-white/50`
                      }`}
                      style={winnerId !== undefined && winningTeam ? { backgroundColor: winningTeam.color } : {}}
                    >
                      {winnerId !== undefined ? (
                        <div className="flex flex-col items-center gap-1">
                          {winningTeam ? (
                            <>
                              <span className="text-xs font-black uppercase tracking-tighter opacity-80">Correct</span>
                              <span className="text-lg font-black leading-none text-center px-2">{winningTeam.name}</span>
                            </>
                          ) : (
                            <span className="text-xs font-black uppercase tracking-tighter opacity-40">No Winner</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-4xl font-black">{question.points}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar - Teams & Scoring */}
        <div className="w-80 bg-sky-900 border-l border-sky-800 p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-sky-500 uppercase tracking-[0.2em]">Team Scores</h3>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto">
            {teams.map(team => (
              <div 
                key={team.id} 
                className="bg-sky-800/50 p-4 rounded-3xl border-2 border-sky-700 shadow-lg group flex items-center gap-4"
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white border-2 border-sky-200 shadow-md shrink-0"
                  style={{ backgroundColor: team.color }}
                >
                  <IconComponent name={team.icon} size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col min-w-0">
                    <span className="font-black text-sky-50 truncate italic">{team.name}</span>
                    <span className={`text-2xl font-black ${team.score >= 0 ? 'text-sky-400' : 'text-rose-500'}`}>
                      {team.score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {teams.length === 0 && (
              <div className="text-center py-12 text-sky-600 italic text-sm flex flex-col items-center gap-2">
                <Users size={24} />
                No teams added yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Question Modal Overlay */}
      <AnimatePresence>
        {selectedQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-sky-950/95 p-12 backdrop-blur-sm"
          >
            <div className="w-full max-w-6xl h-full flex flex-col gap-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className={`${currentTheme.text} font-black uppercase tracking-widest text-sm`}>
                    {currentRound.categories[selectedQuestion.catIdx].name}
                  </span>
                  <span className="text-4xl font-black">{currentRound.categories[selectedQuestion.catIdx].questions[selectedQuestion.qIdx].points} Points</span>
                </div>
                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="p-3 hover:bg-sky-800 rounded-full transition-colors"
                >
                  <X size={32} />
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-8 overflow-hidden relative">
                {isPreloading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-6"
                  >
                    <div className="relative">
                      <Loader2 className="w-24 h-24 text-white animate-spin opacity-20" />
                      <Loader2 className="w-24 h-24 text-sky-500 animate-spin absolute inset-0 [animation-duration:1.5s]" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl font-black text-white uppercase tracking-[0.2em]">Loading Assets</span>
                      <span className="text-sm font-bold text-sky-500 uppercase tracking-widest">Synchronizing text and media...</span>
                    </div>
                  </motion.div>
                ) : !showAnswer ? (
                  <motion.div
                    key="question"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center gap-8 w-full"
                  >
                    {currentRound.categories[selectedQuestion.catIdx].questions[selectedQuestion.qIdx].questionImage && (
                      <div className="max-h-[40vh] w-full flex justify-center">
                        <img
                          src={currentRound.categories[selectedQuestion.catIdx].questions[selectedQuestion.qIdx].questionImage}
                          alt="Question"
                          className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl border-4 border-sky-800 cursor-zoom-in hover:scale-[1.02] transition-transform"
                          referrerPolicy="no-referrer"
                          onClick={() => setZoomedImage(currentRound.categories[selectedQuestion.catIdx].questions[selectedQuestion.qIdx].questionImage!)}
                        />
                      </div>
                    )}
                    <h2 className="text-5xl md:text-7xl font-black leading-tight max-w-5xl">
                      {currentRound.categories[selectedQuestion.catIdx].questions[selectedQuestion.qIdx].questionText}
                    </h2>
                  </motion.div>
                ) : (
                  <motion.div
                    key="answer"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-8 w-full"
                  >
                    <div className={`${currentTheme.text} font-black uppercase tracking-[0.3em] text-xl`}>The Answer</div>
                    {currentRound.categories[selectedQuestion.catIdx].questions[selectedQuestion.qIdx].answerImage && (
                      <div className="max-h-[40vh] w-full flex justify-center">
                        <img
                          src={currentRound.categories[selectedQuestion.catIdx].questions[selectedQuestion.qIdx].answerImage}
                          alt="Answer"
                          className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl border-4 border-sky-500/30 cursor-zoom-in hover:scale-[1.02] transition-transform"
                          referrerPolicy="no-referrer"
                          onClick={() => setZoomedImage(currentRound.categories[selectedQuestion.catIdx].questions[selectedQuestion.qIdx].answerImage!)}
                        />
                      </div>
                    )}
                    <h2 className="text-5xl md:text-7xl font-black text-sky-400 leading-tight max-w-5xl italic">
                      "{currentRound.categories[selectedQuestion.catIdx].questions[selectedQuestion.qIdx].answerText}"
                    </h2>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer Controls - Multi-Team Scoring */}
              <div className="flex flex-col items-center gap-6 pb-8">
                <div className="flex flex-wrap justify-center gap-4 max-w-full overflow-x-auto p-2">
                  {teams.map(team => {
                    const currentPoints = currentRound.categories[selectedQuestion.catIdx].questions[selectedQuestion.qIdx].points;
                    const teamScore = questionScores[team.id];
                    
                    return (
                      <div 
                        key={team.id} 
                        className="flex flex-col items-center gap-2 bg-sky-900/50 p-3 rounded-2xl border border-sky-800"
                        style={{ borderTop: `4px solid ${team.color}` }}
                      >
                        <span className="text-xs font-bold text-sky-400 uppercase truncate max-w-[100px]">{team.name}</span>
                        <div className="flex gap-2">
                          <button
                            disabled={!showAnswer}
                            onClick={() => toggleQuestionScore(team.id, currentPoints, false)}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all border ${
                              !showAnswer ? 'opacity-20 cursor-not-allowed bg-sky-800 text-sky-600 border-sky-700' :
                              teamScore === -currentPoints 
                                ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
                                : 'bg-sky-800 text-rose-500 border-rose-500/30 hover:bg-rose-900/20'
                            }`}
                          >
                            <span className="font-black">-{currentPoints}</span>
                          </button>
                          <button
                            disabled={!showAnswer}
                            onClick={() => toggleQuestionScore(team.id, currentPoints, true)}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all border ${
                              !showAnswer ? 'opacity-20 cursor-not-allowed bg-sky-800 text-sky-600 border-sky-700' :
                              teamScore === currentPoints 
                                ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                                : 'bg-sky-800 text-sky-500 border-sky-500/30 hover:bg-sky-900/20'
                            }`}
                          >
                            <span className="font-black">+{currentPoints}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4">
                  {!showAnswer && (
                    <button
                      onClick={handleRevealAnswer}
                      className={`${currentTheme.bg} ${currentTheme.hover} text-white px-12 py-6 rounded-2xl text-2xl font-black transition-all shadow-xl flex items-center gap-3`}
                    >
                      <Eye size={28} />
                      REVEAL ANSWER
                    </button>
                  )}
                  <button
                    disabled={!showAnswer}
                    onClick={() => markAsRevealed(currentRound.categories[selectedQuestion.catIdx].questions[selectedQuestion.qIdx].id)}
                    className={`flex items-center gap-3 px-12 py-6 rounded-2xl text-2xl font-black transition-all border ${
                      !showAnswer 
                        ? 'bg-sky-900 text-sky-700 border-sky-800 cursor-not-allowed opacity-50' 
                        : 'bg-sky-800 hover:bg-sky-700 text-white border-sky-700'
                    }`}
                  >
                    <Check size={28} />
                    FINISH QUESTION
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Zoom Overlay */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 p-4 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={zoomedImage}
              alt="Zoomed"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <button 
              className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              onClick={() => setZoomedImage(null)}
            >
              <X size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* End Round Confirmation Modal */}
      <AnimatePresence>
        {showEndRoundConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-sky-950/90 backdrop-blur-md p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-sky-900 border border-sky-800 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h2 className="text-3xl font-black mb-4">End Round Early?</h2>
              <p className="text-sky-400 mb-8">
                There are still unanswered questions in this round. Are you sure you want to end {currentRound.name} now?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowEndRoundConfirm(false)}
                  className="flex-1 py-4 bg-sky-800 hover:bg-sky-700 text-white font-bold rounded-xl transition-all"
                >
                  CANCEL
                </button>
                <button 
                  onClick={() => {
                    setShowEndRoundConfirm(false);
                    if (currentRoundIdx === quiz.rounds.length - 1) {
                      setGameState('finalStandings');
                    } else {
                      setGameState('roundComplete');
                    }
                  }}
                  className="flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-500/20"
                >
                  END ROUND
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
