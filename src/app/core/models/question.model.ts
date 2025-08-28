export interface QuestionOption {
  id: string;
  text: string;
  correct: boolean;
  selected: boolean;
  explanation: string;
}

export type QuestionType = 'multiple choice' | 'multi selection' | 'essay';

export interface QuestionModel {
  id: string;
  text: string;
  question_type: QuestionType;
  options?: QuestionOption[]; // only for choice types
  essay_answer?: string;
  essay_feedback?: string;
}

export interface SaveQuestionData {
  id: string;
  type: QuestionType;
  options?: { id: string; selected: boolean }[]; // only for choice types
  essay_answer?: string;
  essay_feedback?: string;
}