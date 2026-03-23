/**
 * Models for lesson content data structures used throughout the lesson page.
 * These interfaces provide type safety for the complex nested data used in
 * topic/subtopic navigation, exercises, exams, and flashcards.
 */

import { ExamModel } from './exam.model';
import { ExerciseModel } from './exercise.model';
import { Flashcard, GlossaryTerm } from './api-response.model';

/**
 * Represents a subtopic within a topic.
 * Contains the lesson content cells and read status.
 */
export interface LessonSubtopic {
  id: string;
  title: string;
  brief_description?: string;
  cells: LessonCell[];
  read: boolean;
}

/**
 * Union type for different cell content types in a subtopic.
 */
export type LessonCellType = 'markdown' | 'chart' | 'diagram' | 'code' | 'audio';

/**
 * Represents a content cell in a subtopic.
 */
export interface LessonCell {
  id: string;
  type: LessonCellType;
  content: string;
  properties?: Record<string, unknown>;
}

/**
 * Represents a topic with its subtopics, exercise, and flashcards.
 * Used in the lesson page for navigation and content display.
 */
export interface LessonTopic {
  id: string;
  title: string;
  brief_description?: string;
  expanded: boolean;
  completed: boolean;
  selected: boolean;
  subtopics: LessonSubtopic[];
  exercise: ExerciseModel | null;
  flashcards: Flashcard[];
}

/**
 * The complete subject content structure used on the lesson page.
 * Contains all topics, exam, and glossary for the subject.
 */
export interface SubjectContent {
  subject_name: string;
  topics: LessonTopic[];
  exam: ExamModel | null;
  glossary: GlossaryTerm[];
}

/**
 * Represents the current view state in the lesson page.
 * The content type varies based on the view type.
 */
export type LessonViewType = 'subtopic' | 'exercise' | 'exam' | 'glossary' | 'flashcards';

export interface LessonViewState {
  type: LessonViewType;
  id: string;
  content: LessonSubtopic | ExerciseModel | ExamModel | GlossaryTerm[] | Flashcard[] | null;
}

/**
 * Event emitted when navigating between views.
 */
export interface ViewChangeEvent {
  id: string;
  type: LessonViewType;
}

/**
 * Event emitted when changing subtopics within a topic.
 */
export interface SubtopicChangeEvent {
  id: string;
  direction: 'next' | 'prev';
}

/**
 * Event emitted when a question changes in practice mode.
 */
export interface QuestionChangeEvent {
  id: string;
}
