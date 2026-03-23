/**
 * Models for extension configuration settings.
 * Used in the subject creation wizard for configuring lesson extensions.
 */

/**
 * Cell type configuration for lesson content.
 */
export interface CellsExtensionConfig {
  enabled: boolean;
  types: string[];
  name: 'cells';
  displayName: string;
}

/**
 * Exercise extension configuration.
 */
export interface ExerciseExtensionConfig {
  enabled: boolean;
  types: string[];
  numQuestions: number;
  name: 'exercise';
  displayName: string;
}

/**
 * Exam extension configuration.
 */
export interface ExamExtensionConfig {
  enabled: boolean;
  types: string[];
  numQuestions: number;
  timeLimit: boolean | null;
  name: 'exam';
  displayName: string;
}

/**
 * Flashcards extension configuration.
 */
export interface FlashcardsExtensionConfig {
  enabled: boolean;
  numCards: number;
  types: string[];
  name: 'flashcards';
  displayName: string;
}

/**
 * Glossary extension configuration.
 */
export interface GlossaryExtensionConfig {
  enabled: boolean;
  name: 'glossary';
  displayName: string;
}

/**
 * Complete extension settings for a subject.
 */
export interface ExtensionSettings {
  cells: CellsExtensionConfig;
  exercise: ExerciseExtensionConfig;
  exam: ExamExtensionConfig;
  flashcards: FlashcardsExtensionConfig;
  glossary: GlossaryExtensionConfig;
}

/**
 * Union type for any extension config.
 */
export type ExtensionConfig =
  | CellsExtensionConfig
  | ExerciseExtensionConfig
  | ExamExtensionConfig
  | FlashcardsExtensionConfig
  | GlossaryExtensionConfig;

export const DEFAULT_EXTENSION_CONFIG: ExtensionSettings = {
  cells: {
    enabled: false,
    types: [],
    name: 'cells',
    displayName: 'Lesson Supplements',
  },
  exercise: {
    enabled: false,
    types: [],
    numQuestions: 3,
    name: 'exercise',
    displayName: 'Exercise',
  },
  exam: {
    enabled: false,
    types: [],
    numQuestions: 10,
    timeLimit: false,
    name: 'exam',
    displayName: 'Exam',
  },
  flashcards: {
    enabled: false,
    numCards: 5,
    types: [],
    name: 'flashcards',
    displayName: 'Flashcards',
  },
  glossary: {
    enabled: false,
    name: 'glossary',
    displayName: 'Glossary',
  }
};

/**
 * Constraints for extension settings based on subscription plan.
 */
export interface ExtensionConstraints {
  exercise: {
    maxQuestions: number;
  };
  exam: {
    maxQuestions: number;
  };
  flashcards: {
    maxCards: number;
  };
}

/**
 * Validation result for extension settings.
 */
export interface ValidationResult {
  status: boolean;
  message: string;
}

/**
 * Topic data structure used during lesson generation.
 */
export interface GenerationTopic {
  id: string;
  title: string;
  brief_description?: string;
  selected: boolean;
}
