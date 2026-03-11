import { SubjectStatus } from './subject-status.model';
import { ExtensionModel } from './api-response.model';

/**
 * Represents a learning subject/session in the application.
 * This is the core data model for subjects displayed on the dashboard.
 */
export interface SubjectModel {
  /** Unique identifier for the subject */
  id: string;
  /** Display name of the subject */
  name: string;
  /** When the subject was created */
  created_at: Date;
  /** Whether the subject is pinned to the top of the list */
  pinned: boolean;
  /** Number of topics in this subject */
  topicCount: number;
  /** User-defined tags for categorization */
  tags: string[];
  /** List of enabled extension types */
  enabledExtensions: string[];
  /** Current status of the subject */
  status: SubjectStatus;
  /** Completion percentage (0-100) */
  completion: number;
  /** Extensions configured for this subject */
  extensions: ExtensionModel[];
}
