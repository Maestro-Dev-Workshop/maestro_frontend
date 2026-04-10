import { LessonCell } from "./lesson-content.model";

export interface SubtopicModel {
  id: string;
  title: string;
  brief_description?: string;
  cells: LessonCell[];
  read: boolean;
}