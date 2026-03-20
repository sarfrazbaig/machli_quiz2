import React, { useState, useEffect } from 'react';
import { Plus, Play, Edit2, Trash2, Layout, Trophy, Settings, Search, Users, X, Shuffle, Ghost, Rocket, Zap, Flame, Crown, Star, Heart, Smile, Moon, Sun, Cloud, Music, Coffee, Pizza, Gamepad2, Camera, Gift, Target, Flag, Sparkles, Fish, Waves, Anchor, Shell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Quiz, Team } from './types';
import QuizEditor from './components/QuizEditor';
import GameBoard from './components/GameBoard';
import TeamGenerator from './components/TeamGenerator';

const MOCK_QUIZ: Quiz = {
  id: 'mock-quiz-1',
  title: 'MACHLI QUIZ CHALLENGE',
  rounds: [
    {
      id: 'round-1',
      name: 'Round 1: The Basics',
      categories: [
        {
          id: 'cat-1',
          name: 'Geography',
          questions: [
            { id: 'q1', points: 10, questionText: 'What is the capital of France?', answerText: 'Paris', isRevealed: false, questionImage: 'https://picsum.photos/seed/paris/800/600' },
            { id: 'q2', points: 20, questionText: 'Which is the largest ocean on Earth?', answerText: 'Pacific Ocean', isRevealed: false, questionImage: 'https://picsum.photos/seed/ocean/800/600' },
            { id: 'q3', points: 30, questionText: 'What is the smallest country in the world?', answerText: 'Vatican City', isRevealed: false, answerImage: 'https://picsum.photos/seed/vatican/800/600' },
            { id: 'q4', points: 40, questionText: 'Which river flows through Egypt?', answerText: 'Nile', isRevealed: false, questionImage: 'https://picsum.photos/seed/nile/800/600' },
            { id: 'q5', points: 50, questionText: 'What is the highest mountain in the world?', answerText: 'Mount Everest', isRevealed: false, questionImage: 'https://picsum.photos/seed/everest/800/600', answerImage: 'https://picsum.photos/seed/everest-summit/800/600' }
          ]
        },
        {
          id: 'cat-2',
          name: 'Science',
          questions: [
            { id: 'q6', points: 10, questionText: 'What is the chemical symbol for water?', answerText: 'H2O', isRevealed: false, questionImage: 'https://picsum.photos/seed/water/800/600' },
            { id: 'q7', points: 20, questionText: 'What planet is known as the Red Planet?', answerText: 'Mars', isRevealed: false, questionImage: 'https://picsum.photos/seed/mars/800/600' },
            { id: 'q8', points: 30, questionText: 'What is the hardest natural substance on Earth?', answerText: 'Diamond', isRevealed: false, questionImage: 'https://picsum.photos/seed/diamond/800/600' },
            { id: 'q9', points: 40, questionText: 'How many bones are in the adult human body?', answerText: '206', isRevealed: false },
            { id: 'q10', points: 50, questionText: 'What is the speed of light?', answerText: '299,792,458 m/s', isRevealed: false, questionImage: 'https://picsum.photos/seed/light/800/600' }
          ]
        },
        {
          id: 'cat-3',
          name: 'History',
          questions: [
            { id: 'q11', points: 10, questionText: 'Who was the first President of the United States?', answerText: 'George Washington', isRevealed: false, questionImage: 'https://picsum.photos/seed/washington/800/600' },
            { id: 'q12', points: 20, questionText: 'In which year did World War II end?', answerText: '1945', isRevealed: false, questionImage: 'https://picsum.photos/seed/ww2/800/600' },
            { id: 'q13', points: 30, questionText: 'Who painted the Mona Lisa?', answerText: 'Leonardo da Vinci', isRevealed: false, questionImage: 'https://picsum.photos/seed/monalisa/800/600' },
            { id: 'q14', points: 40, questionText: 'Which ancient civilization built the pyramids?', answerText: 'Egyptians', isRevealed: false, questionImage: 'https://picsum.photos/seed/pyramids/800/600' },
            { id: 'q15', points: 50, questionText: 'Who was the first woman to win a Nobel Prize?', answerText: 'Marie Curie', isRevealed: false, questionImage: 'https://picsum.photos/seed/curie/800/600' }
          ]
        },
        {
          id: 'cat-4',
          name: 'Movies',
          questions: [
            { id: 'q16', points: 10, questionText: 'Which movie features a character named Jack Sparrow?', answerText: 'Pirates of the Caribbean', isRevealed: false },
            { id: 'q17', points: 20, questionText: 'What is the highest-grossing film of all time?', answerText: 'Avatar', isRevealed: false },
            { id: 'q18', points: 30, questionText: 'Who played Iron Man in the Marvel Cinematic Universe?', answerText: 'Robert Downey Jr.', isRevealed: false },
            { id: 'q19', points: 40, questionText: 'Which movie won the first-ever Academy Award for Best Picture?', answerText: 'Wings', isRevealed: false },
            { id: 'q20', points: 50, questionText: 'What is the name of the kingdom where Frozen takes place?', answerText: 'Arendelle', isRevealed: false }
          ]
        },
        {
          id: 'cat-5',
          name: 'Food',
          questions: [
            { id: 'q21', points: 10, questionText: 'What is the main ingredient in guacamole?', answerText: 'Avocado', isRevealed: false },
            { id: 'q22', points: 20, questionText: 'Which country is the origin of pizza?', answerText: 'Italy', isRevealed: false },
            { id: 'q23', points: 30, questionText: 'What is the most expensive spice in the world?', answerText: 'Saffron', isRevealed: false },
            { id: 'q24', points: 40, questionText: 'What kind of nut is used to make marzipan?', answerText: 'Almond', isRevealed: false },
            { id: 'q25', points: 50, questionText: 'Which fruit is known as the "King of Fruits" in Southeast Asia?', answerText: 'Durian', isRevealed: false }
          ]
        }
      ]
    },
    {
      id: 'round-2',
      name: 'Round 2: The Challenge',
      categories: [
        {
          id: 'cat-r2-1',
          name: 'Literature',
          questions: [
            { id: 'q26', points: 20, questionText: 'Who wrote "Romeo and Juliet"?', answerText: 'William Shakespeare', isRevealed: false },
            { id: 'q27', points: 40, questionText: 'What is the name of the first Harry Potter book?', answerText: "Harry Potter and the Philosopher's Stone", isRevealed: false },
            { id: 'q28', points: 60, questionText: 'Who wrote "1984"?', answerText: 'George Orwell', isRevealed: false },
            { id: 'q29', points: 80, questionText: 'What is the longest novel ever written?', answerText: 'In Search of Lost Time', isRevealed: false },
            { id: 'q30', points: 100, questionText: 'Who is the author of "The Great Gatsby"?', answerText: 'F. Scott Fitzgerald', isRevealed: false }
          ]
        },
        {
          id: 'cat-r2-2',
          name: 'Music',
          questions: [
            { id: 'q31', points: 20, questionText: 'Who is known as the "King of Pop"?', answerText: 'Michael Jackson', isRevealed: false },
            { id: 'q32', points: 40, questionText: 'Which band released the album "Abbey Road"?', answerText: 'The Beatles', isRevealed: false },
            { id: 'q33', points: 60, questionText: 'What is the best-selling album of all time?', answerText: 'Thriller', isRevealed: false },
            { id: 'q34', points: 80, questionText: 'Who is the lead singer of U2?', answerText: 'Bono', isRevealed: false },
            { id: 'q35', points: 100, questionText: 'How many strings does a standard guitar have?', answerText: '6', isRevealed: false }
          ]
        },
        {
          id: 'cat-r2-3',
          name: 'Sports',
          questions: [
            { id: 'q36', points: 20, questionText: 'Which country won the first FIFA World Cup?', answerText: 'Uruguay', isRevealed: false },
            { id: 'q37', points: 40, questionText: 'How many players are on a soccer team?', answerText: '11', isRevealed: false },
            { id: 'q38', points: 60, questionText: 'In which sport would you use a shuttlecock?', answerText: 'Badminton', isRevealed: false },
            { id: 'q39', points: 80, questionText: 'Who has won the most Olympic gold medals?', answerText: 'Michael Phelps', isRevealed: false },
            { id: 'q40', points: 100, questionText: 'What is the diameter of a basketball hoop?', answerText: '18 inches', isRevealed: false }
          ]
        },
        {
          id: 'cat-r2-4',
          name: 'Technology',
          questions: [
            { id: 'q41', points: 20, questionText: 'Who co-founded Microsoft?', answerText: 'Bill Gates', isRevealed: false },
            { id: 'q42', points: 40, questionText: 'What does "WWW" stand for?', answerText: 'World Wide Web', isRevealed: false },
            { id: 'q43', points: 60, questionText: 'What was the first social media site?', answerText: 'SixDegrees.com', isRevealed: false },
            { id: 'q44', points: 80, questionText: 'Which company created the iPhone?', answerText: 'Apple', isRevealed: false },
            { id: 'q45', points: 100, questionText: 'What is the main language used for Android apps?', answerText: 'Kotlin/Java', isRevealed: false }
          ]
        },
        {
          id: 'cat-r2-5',
          name: 'Animals',
          questions: [
            { id: 'q46', points: 20, questionText: 'What is the fastest land animal?', answerText: 'Cheetah', isRevealed: false },
            { id: 'q47', points: 40, questionText: 'What is the largest mammal in the world?', answerText: 'Blue Whale', isRevealed: false },
            { id: 'q48', points: 60, questionText: 'How many hearts does an octopus have?', answerText: '3', isRevealed: false },
            { id: 'q49', points: 80, questionText: 'What is a group of lions called?', answerText: 'A pride', isRevealed: false },
            { id: 'q50', points: 100, questionText: 'Which bird is the symbol of peace?', answerText: 'Dove', isRevealed: false }
          ]
        }
      ]
    }
  ]
};

const TEAM_COLORS = [
  '#0ea5e9', // Sky
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#f97316', // Orange
];

const TEAM_ICONS = [
  'Fish', 'Waves', 'Anchor', 'Shell', 'Ghost', 'Rocket', 'Zap', 'Flame', 'Crown', 'Star', 'Heart', 'Smile', 
  'Moon', 'Sun', 'Cloud', 'Music', 'Coffee', 'Pizza', 'Gamepad2', 
  'Camera', 'Gift', 'Target', 'Flag', 'Sparkles'
];

export const IconComponent = ({ name, size = 24, className = "" }: { name: string, size?: number, className?: string }) => {
  const icons: Record<string, any> = {
    Fish, Waves, Anchor, Shell, Ghost, Rocket, Zap, Flame, Crown, Star, Heart, Smile, 
    Moon, Sun, Cloud, Music, Coffee, Pizza, Gamepad2, 
    Camera, Gift, Target, Flag, Sparkles, Trophy, Users, Layout, Plus, Play, Edit2, Trash2, Settings, Search, X, Shuffle
  };
  const Icon = icons[name] || Fish;
  return <Icon size={size} className={className} />;
};

export default function App() {
  const [view, setView] = useState<'home' | 'editor' | 'game'>('home');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | undefined>();
  const [isTeamsModalOpen, setIsTeamsModalOpen] = useState(false);
  const [isTeamGeneratorOpen, setIsTeamGeneratorOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  // Load quizzes from localStorage
  useEffect(() => {
    const savedQuizzes = localStorage.getItem('quizboard_quizzes');
    if (savedQuizzes) {
      try {
        const parsed = JSON.parse(savedQuizzes);
        if (parsed.length > 0) {
          setQuizzes(parsed);
        } else {
          setQuizzes([MOCK_QUIZ]);
        }
      } catch (e) {
        console.error('Failed to parse quizzes', e);
        setQuizzes([MOCK_QUIZ]);
      }
    } else {
      setQuizzes([MOCK_QUIZ]);
    }
    
    const savedTeams = localStorage.getItem('quizboard_teams');
    if (savedTeams) {
      try {
        const parsedTeams = JSON.parse(savedTeams);
        setTeams(parsedTeams.map((t: any, i: number) => ({
          ...t,
          icon: t.icon || TEAM_ICONS[i % TEAM_ICONS.length]
        })));
      } catch (e) {
        console.error('Failed to parse teams', e);
      }
    }
  }, []);

  // Save quizzes to localStorage
  useEffect(() => {
    localStorage.setItem('quizboard_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  // Save teams to localStorage
  useEffect(() => {
    localStorage.setItem('quizboard_teams', JSON.stringify(teams));
  }, [teams]);

  const handleSaveQuiz = (quiz: Quiz) => {
    if (editingQuiz) {
      setQuizzes(quizzes.map(q => q.id === quiz.id ? quiz : q));
    } else {
      setQuizzes([...quizzes, quiz]);
    }
    setView('home');
    setEditingQuiz(undefined);
  };

  const [showTeamError, setShowTeamError] = useState(false);

  const handleDeleteQuiz = (id: string) => {
    setQuizzes(quizzes.filter(q => q.id !== id));
  };

  const startQuiz = (quiz: Quiz) => {
    if (teams.length === 0) {
      setShowTeamError(true);
      setTimeout(() => setShowTeamError(false), 3000);
      return;
    }
    // Reset scores for a new show
    setTeams(teams.map(t => ({ ...t, score: 0 })));
    setActiveQuiz(quiz);
    setView('game');
  };

  const addTeam = () => {
    const name = `Team ${teams.length + 1}`;
    const color = TEAM_COLORS[teams.length % TEAM_COLORS.length];
    const icon = TEAM_ICONS[teams.length % TEAM_ICONS.length];
    setTeams([...teams, { id: crypto.randomUUID(), name, score: 0, color, icon, members: [] }]);
  };

  const updateTeamName = (id: string, name: string) => {
    setTeams(teams.map(t => t.id === id ? { ...t, name } : t));
  };

  const handleGenerateTeams = (newTeams: Team[]) => {
    setTeams(newTeams);
    setIsTeamGeneratorOpen(false);
    setIsTeamsModalOpen(false);
  };

  const removeTeam = (id: string) => {
    setTeams(teams.filter(t => t.id !== id));
  };

  if (view === 'editor') {
    return (
      <QuizEditor
        onSave={handleSaveQuiz}
        onCancel={() => { setView('home'); setEditingQuiz(undefined); }}
        initialQuiz={editingQuiz}
      />
    );
  }

  if (view === 'game' && activeQuiz) {
    return (
      <GameBoard
        quiz={activeQuiz}
        teams={teams}
        onUpdateTeams={setTeams}
        onExit={() => setView('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 font-sans text-sky-950">
      {/* Navigation */}
      <nav className="bg-white border-b-4 border-sky-200 px-8 py-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-200 border-2 border-sky-400">
            <Fish size={28} />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tight leading-none italic uppercase">MACHLI QUIZ</h1>
            <p className="text-[10px] font-black text-sky-400 uppercase tracking-[0.3em] mt-1">Dive into Knowledge</p>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 gap-16">
          {/* Main Quiz Display */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-sky-950">Active Quiz Board</h2>
                <p className="text-sm text-sky-600 font-medium mt-1">The primary board for today's event</p>
              </div>
            </div>

            {quizzes.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-sky-200 rounded-[3rem] p-24 text-center">
                <div className="w-24 h-24 bg-sky-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-sky-300">
                  <Fish size={48} />
                </div>
                <h3 className="text-2xl font-black mb-3 italic">No quiz boards found</h3>
                <p className="text-sky-600 mb-10 max-w-sm mx-auto text-lg">Create a professional quiz board to start your show.</p>
                <button
                  onClick={() => setView('editor')}
                  className="px-10 py-4 bg-sky-600 text-white font-black rounded-2xl hover:bg-sky-700 transition-all shadow-xl shadow-sky-200 active:scale-95"
                >
                  Create Your First Quiz
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {quizzes.slice(0, 1).map((quiz) => (
                  <motion.div
                    layout
                    key={quiz.id}
                    className="bg-white border border-sky-200 rounded-[3rem] overflow-hidden shadow-2xl shadow-sky-200/50 group flex flex-col md:flex-row min-h-[400px]"
                  >
                    <div className="md:w-1/3 bg-sky-600 p-12 flex flex-col justify-end relative overflow-hidden shrink-0">
                      <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform text-white">
                        <Fish size={300} />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-sky-900/90 via-sky-900/40 to-transparent" />
                      <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                          Main Event
                        </div>
                        <h3 className="text-white text-5xl font-black leading-tight tracking-tight">{quiz.title}</h3>
                      </div>
                    </div>
                    <div className="p-12 flex-1 flex flex-col justify-center bg-white">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                        <div className="bg-sky-50 p-6 rounded-3xl border border-sky-100">
                          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block mb-2">Total Rounds</span>
                          <span className="text-3xl font-black text-sky-800">{quiz.rounds.length}</span>
                        </div>
                        <div className="bg-sky-50 p-6 rounded-3xl border border-sky-100">
                          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block mb-2">Total Questions</span>
                          <span className="text-3xl font-black text-sky-800">{quiz.rounds.reduce((acc, r) => acc + r.categories.reduce((cAcc, c) => cAcc + c.questions.length, 0), 0)}</span>
                        </div>
                        <div className="bg-sky-50 p-6 rounded-3xl border border-sky-100">
                          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block mb-2">Participants</span>
                          <span className="text-3xl font-black text-sky-800">{teams.length} Teams</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                          onClick={() => startQuiz(quiz)}
                          className="w-full sm:flex-1 flex items-center justify-center gap-4 py-6 bg-sky-600 text-white text-2xl font-black rounded-[2rem] hover:bg-sky-700 transition-all shadow-2xl shadow-sky-200 active:scale-95 group/btn"
                        >
                          <Play size={32} fill="currentColor" className="group-hover/btn:scale-110 transition-transform" />
                          START SHOW
                        </button>
                        <div className="flex gap-4 w-full sm:w-auto">
                          <button
                            onClick={() => { setEditingQuiz(quiz); setView('editor'); }}
                            className="flex-1 sm:flex-none p-6 bg-sky-100 text-sky-600 hover:bg-sky-200 rounded-[2rem] transition-colors w-full sm:w-auto flex items-center justify-center gap-3"
                            title="Edit Quiz"
                          >
                            <Edit2 size={28} />
                            <span className="sm:hidden font-bold">EDIT BOARD</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Teams Ready Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-sky-950">Game Lobby</h2>
                <p className="text-sm text-sky-600 font-medium mt-1">Participants and teams ready to play</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsTeamsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-600 font-bold rounded-xl hover:bg-sky-200 transition-all text-xs uppercase tracking-widest border border-sky-200"
                >
                  <Users size={14} />
                  Manage Participants
                </button>
                {teams.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest">System Ready</span>
                  </div>
                )}
              </div>
            </div>

            {teams.length === 0 ? (
              <div className="bg-sky-50 border-2 border-dashed border-sky-200 rounded-[2.5rem] p-12 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-sky-300">
                  <Users size={32} />
                </div>
                <h3 className="text-lg font-bold text-sky-950">Lobby is Empty</h3>
                <p className="text-sm text-sky-600 mt-1 mb-6">Add participants to generate teams or add teams manually.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => setIsTeamGeneratorOpen(true)}
                    className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
                  >
                    <Shuffle size={18} />
                    ADD PEOPLE & GENERATE TEAMS
                  </button>
                  <button
                    onClick={() => setIsTeamsModalOpen(true)}
                    className="px-8 py-3 bg-white border border-sky-200 text-sky-900 font-bold rounded-xl hover:bg-sky-100 transition-all shadow-sm"
                  >
                    ADD TEAMS MANUALLY
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {teams.map((team) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-sky-200 p-6 rounded-[2rem] shadow-sm flex flex-col items-center text-center group hover:border-sky-300 transition-all"
                  >
                    <div 
                      className="w-20 h-20 rounded-3xl mb-4 flex items-center justify-center text-white border-4 border-sky-100 shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-3"
                      style={{ backgroundColor: team.color }}
                    >
                      <IconComponent name={team.icon} size={40} />
                    </div>
                    <h3 className="font-black text-sky-900 text-xl truncate w-full px-2 italic">{team.name}</h3>
                    {team.members && team.members.length > 0 && (
                      <p className="text-[10px] text-sky-400 font-bold truncate w-full px-4 mb-2">
                        {team.members.join(', ')}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-sky-50 rounded-full border border-sky-100">
                      <Trophy size={12} className="text-amber-500" />
                      <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Score: {team.score}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Teams Modal */}
      <AnimatePresence>
        {isTeamsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-sky-950/60 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-sky-100 flex items-center justify-between bg-sky-50">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-sky-900">Participants & Teams</h2>
                  <p className="text-sm text-sky-500 font-medium mt-1">Manage who's playing in your game</p>
                </div>
                <button
                  onClick={() => setIsTeamsModalOpen(false)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-sky-200 rounded-2xl transition-colors text-sky-400"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="flex flex-col gap-3">
                  {teams.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-sky-50 rounded-[2rem] border-2 border-dashed border-sky-100">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-sky-300">
                        <Users size={32} />
                      </div>
                      <p className="text-sm font-bold text-sky-400 uppercase tracking-widest">No teams yet</p>
                    </div>
                  ) : (
                    teams.map((team) => (
                      <motion.div 
                        layout
                        key={team.id} 
                        className="flex items-center gap-4 p-4 bg-sky-50 rounded-2xl border border-sky-100 group hover:border-sky-200 hover:bg-white transition-all"
                      >
                        <div 
                          className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-white border-2 border-sky-100 shadow-md" 
                          style={{ backgroundColor: team.color }}
                        >
                          <IconComponent name={team.icon} size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            className="w-full bg-transparent font-black text-lg outline-none focus:text-sky-600 truncate"
                            value={team.name}
                            onChange={(e) => updateTeamName(team.id, e.target.value)}
                          />
                          <div className="flex items-center gap-2">
                            <Trophy size={10} className="text-amber-500" />
                            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Score: {team.score}</span>
                            {team.members && team.members.length > 0 && (
                              <>
                                <span className="text-sky-300">•</span>
                                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest truncate">
                                  {team.members.join(', ')}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeTeam(team.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-sky-400 hover:text-rose-500 transition-all hover:bg-rose-50 rounded-xl"
                        >
                          <Trash2 size={18} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-8 bg-sky-50 border-t border-sky-100 flex gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <button
                    onClick={() => setIsTeamGeneratorOpen(true)}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                  >
                    <Shuffle size={24} />
                    GENERATE FROM PEOPLE
                  </button>
                  <button
                    onClick={addTeam}
                    className="w-full flex items-center justify-center gap-3 py-3 bg-sky-200 text-sky-700 font-black rounded-2xl hover:bg-sky-300 transition-all active:scale-95 text-sm"
                  >
                    <Plus size={18} />
                    ADD TEAM MANUALLY
                  </button>
                </div>
                <button
                  onClick={() => setIsTeamsModalOpen(false)}
                  className="px-8 py-4 bg-sky-100 text-sky-500 font-black rounded-2xl hover:bg-sky-200 transition-all active:scale-95 h-fit border border-sky-200"
                >
                  DONE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Generator Modal */}
      <AnimatePresence>
        {isTeamGeneratorOpen && (
          <TeamGenerator
            colors={TEAM_COLORS}
            onConfirm={handleGenerateTeams}
            onCancel={() => setIsTeamGeneratorOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Team Error Toast */}
      <AnimatePresence>
        {showTeamError && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] px-6 py-4 bg-rose-600 text-white font-black rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Users size={20} />
            </div>
            <span>Please add at least one team to start!</span>
            <button 
              onClick={() => { setShowTeamError(false); setIsTeamsModalOpen(true); }}
              className="ml-4 px-4 py-2 bg-white text-rose-600 rounded-xl text-sm hover:bg-rose-50 transition-colors"
            >
              Add Teams
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto p-8 text-center text-sky-400 text-xs font-bold uppercase tracking-[0.3em]">
        Machli Quiz &copy; 2026 &bull; Dive into Knowledge
      </footer>
    </div>
  );
}
