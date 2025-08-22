export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export type QuestionType = 'multiple-choice' | 'multi-select' | 'essay';

export interface QuestionModel {
  id: string;
  prompt: string;
  type: QuestionType;
  options?: QuestionOption[]; // only for choice types
  subtopicId: string;
}