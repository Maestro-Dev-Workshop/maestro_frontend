import { QuestionModel } from "./question.model";

export interface ExamModel {
  id: string;
  score?: number;
  questions: QuestionModel[];
}