export type ExamAnswer = {
  subject: string;
  title: string;
  answer_1: string;
  answer_2: string;
  answer_3: string;
  answer_4: string;
  correct_answer: string;
};

export interface Answer {
  id?: number;
  created_at?: string;
  title: string;
  answer_1: string;
  answer_2: string;
  answer_3: string;
  answer_4: string;
  correct_answer: string;
  subject: string;
}

export interface AnswerResult {
  question: Answer;
  selectedAnswer: string | null;
  isCorrect: boolean;
}

interface SubjectStats {
  attempts: number;
  highestScore: number;
}

export type GroupedAnswers = Record<string, Answer[]>;
export type StatsRecord = Record<string, SubjectStats>;
