export interface Question {
  id: string;
  points: number;
  questionText: string;
  answerText: string;
  questionImage?: string;
  answerImage?: string;
  isRevealed: boolean;
}

export interface Category {
  id: string;
  name: string;
  questions: Question[];
}

export interface Round {
  id: string;
  name: string;
  categories: Category[];
}

export interface Quiz {
  id: string;
  title: string;
  rounds: Round[];
}

export interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
  icon: string;
  members: string[];
}

export interface GameState {
  currentQuizId: string;
  currentRoundIndex: number;
  teams: Team[];
  revealedQuestionIds: string[];
}
