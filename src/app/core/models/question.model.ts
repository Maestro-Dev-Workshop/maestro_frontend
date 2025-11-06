export interface QuestionOption {
  id: string;
  text: string;
  correct: boolean;
  selected: boolean;
  explanation: string;
}

export type QuestionType = 'multiple choice' | 'multiple selection' | 'essay';

export interface QuestionModel {
  id: string;
  text: string;
  type: QuestionType;
  scored: boolean | null;
  options?: QuestionOption[] | null; // only for choice types
  essay_answer?: string | null;
  essay_feedback?: string | null;
}

export interface SaveQuestionData {
  id: string;
  type: QuestionType;
  scored: boolean;
  options?: { id: string; selected: boolean }[] | null; // only for choice types
  essay_answer?: string | null;
  essay_feedback?: string | null;
}