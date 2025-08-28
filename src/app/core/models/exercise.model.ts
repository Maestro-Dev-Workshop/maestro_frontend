import { QuestionModel } from "./question.model";

export interface ExerciseModel {
  id: string;
  score?: number;
  questions: QuestionModel[];
}