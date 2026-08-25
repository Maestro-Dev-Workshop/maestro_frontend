/**
 * Models for extension configuration settings.
 * Used in the subject creation wizard for configuring lesson extensions.
 */

export interface CellExtensionConfig {
  name: string;
  displayName: string;
  icon: string;
  colour: string;
  desaturatedColour: string;
  description: string
  shortDescription: string;
  enabled: boolean;
  types: string[];
  typesOpen: boolean;
  options: Option[];
}

export interface ExerciseExtensionConfig {
  name: string;
  displayName: string;
  icon: string;
  colour: string;
  desaturatedColour: string;
  description: string
  shortDescription: string;
  enabled: boolean;
  types: string[];
  amount: number;
  perTopic: boolean;
  typesOpen: boolean;
  options: Option[];
  upperLimit: number;
}

export interface ExamExtensionConfig {
  name: string;
  displayName: string;
  icon: string;
  colour: string;
  desaturatedColour: string;
  description: string
  shortDescription: string;
  enabled: boolean;
  types: string[];
  amount: number;
  timeLimit: boolean | null;
  perTopic: boolean;
  typesOpen: boolean;
  options: Option[];
  upperLimit: number;
}

export interface FlashcardsExtensionConfig {
  name: string;
  displayName: string;
  icon: string;
  colour: string;
  desaturatedColour: string;
  description: string
  shortDescription: string;
  enabled: boolean;
  types: string[];
  amount: number;
  perTopic: boolean;
  typesOpen: boolean;
  options: Option[];
  upperLimit: number;
}

export interface GlossaryExtensionConfig {
  name: string;
  displayName: string;
  icon: string;
  colour: string;
  desaturatedColour: string;
  description: string
  shortDescription: string;
  enabled: boolean;
}

/**
 * Complete extension settings for a subject.
 */
export interface ExtensionSettings {
  cells: CellExtensionConfig;
  exercise: ExerciseExtensionConfig;
  exam: ExamExtensionConfig;
  flashcards: FlashcardsExtensionConfig;
  glossary: GlossaryExtensionConfig;
}

export interface Option {
  value: string;
  label: string;
}

/**
 * Union type for any extension config.
 */
export interface ExtensionConfig {
  name: string;
  displayName: string;
  icon: string;
  colour: string;
  desaturatedColour: string;
  description: string
  shortDescription?: string;
  enabled: boolean;
  types?: string[];
  amount?: number;
  perTopic?: boolean;
  timeLimit?: boolean | null;
  typesOpen?: boolean;
  options?: Option[];
  upperLimit?: number;
}

export const DEFAULT_EXTENSION_CONFIG: ExtensionSettings = {
  cells: {
    name: 'cells',
    displayName: 'Content Cells',
    icon: 'coloured-cells-icon',
    colour: '#7FC7F5',
    desaturatedColour: '#BADEF5',
    description: 'Enables a collection of unique addons in order to enhance the content variety of the lesson beyond plain text.',
    shortDescription: 'Additional content variety beyond plain text.',
    enabled: false,
    types: [],
    typesOpen: false,
    options: [
      { value: 'graph', label: 'Charts' },
      { value: 'audio_snippet', label: 'Audio Snippets' },
      { value: 'executable_code', label: 'Code Blocks' },
      { value: 'diagram', label: 'Diagrams' },
      { value: 'music_sheet', label: 'Sheet Music' },
      { value: 'image', label: 'Images' },
      { value: 'flashcard', label: 'Flashcards' },
      { value: 'quote', label: 'Quotes' },
      { value: 'maps', label: 'Maps' },
    ],
  },
  exercise: {
    name: 'exercise',
    displayName: 'Exercises',
    icon: 'coloured-exercise-icon',
    colour: '#F6BF36',
    desaturatedColour: '#F6DA95',
    description: 'Adds a set of practice questions at the end of each topic.',
    shortDescription: 'Practice questions at the end of each topic.',
    enabled: false,
    types: [],
    amount: 5,
    perTopic: true,
    upperLimit: 10,
    typesOpen: false,
    options: [
      { value: 'multiple choice', label: 'Single Choice' },
      { value: 'multiple selection', label: 'Multiple Choice' },
      { value: 'essay', label: 'Essay/Theory' },
    ],
  },
  exam: {
    name: 'exam',
    displayName: 'Exam',
    icon: 'coloured-exam-icon',
    colour: '#82E8C7',
    desaturatedColour: '#B5E9D8',
    description: 'Adds a collection of questions at the end of the entire lesson to simulate an exam.',
    shortDescription: 'Simulated exam at the end of the lesson.',
    enabled: false,
    types: [],
    amount: 20,
    timeLimit: false,
    perTopic: false,
    upperLimit: 60,
    typesOpen: false,
    options: [
      { value: 'multiple choice', label: 'Single Choice' },
      { value: 'multiple selection', label: 'Multiple Choice' },
      { value: 'essay', label: 'Essay/Theory' },
    ],
  },
  flashcards: {
    name: 'flashcards',
    displayName: 'Flashcards',
    icon: 'coloured-flashcard-icon',
    colour: '#CCB8EC',
    desaturatedColour: '#DCD2EC',
    description: 'Adds a set of flashcards for each topic in order to engage memory.',
    shortDescription: 'Active recall training.',
    enabled: false,
    amount: 10,
    types: [],
    perTopic: true,
    upperLimit: 20,
    typesOpen: false,
    options: [
      { value: 'basic', label: 'Basic' },
      { value: 'basic reversed', label: 'Basic (Reversed)' },
    ],
  },
  glossary: {
    name: 'glossary',
    displayName: 'Glossary',
    icon: 'coloured-glossary-icon',
    colour: '#F9283E',
    desaturatedColour: '#F9919C',
    description: 'Adds a dictionary of terms encountered within the materials, alongside their definitions.',
    shortDescription: 'Key terms and definitions.',
    enabled: false,
  }
};

/**
 * Constraints for extension settings based on subscription plan.
 */
export interface ExtensionConstraints {
  exercise: {
    maxAmount: number;
  };
  exam: {
    maxAmount: number;
  };
  flashcards: {
    maxAmount: number;
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
