/**
 * Subject status enum matching backend SessionStatus constants.
 * Used for type-safe status comparisons across the frontend.
 */
export enum SubjectStatus {
  PENDING_NAMING = 'pending_naming',
  PENDING_DOCUMENT_UPLOAD = 'pending_document_upload',
  PENDING_TOPIC_LABELLING = 'pending_topic_labelling',
  PENDING_TOPIC_SELECTION = 'pending_topic_selection',
  PENDING_EXTENSION_CONFIG = 'pending_extension_configuration',
  PENDING_LESSON_GENERATION = 'pending_lesson_generation',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

/**
 * Array of all valid status values for validation
 */
export const VALID_STATUSES = Object.values(SubjectStatus);

/**
 * Check if a status value is valid
 */
export const isValidStatus = (status: string): status is SubjectStatus =>
  VALID_STATUSES.includes(status as SubjectStatus);

/**
 * Statuses that indicate the subject setup is incomplete
 */
export const PENDING_STATUSES = [
  SubjectStatus.PENDING_NAMING,
  SubjectStatus.PENDING_DOCUMENT_UPLOAD,
  SubjectStatus.PENDING_TOPIC_LABELLING,
  SubjectStatus.PENDING_TOPIC_SELECTION,
  SubjectStatus.PENDING_EXTENSION_CONFIG,
  SubjectStatus.PENDING_LESSON_GENERATION,
] as const;

/**
 * Check if a status indicates the subject is still being set up
 */
export const isPendingStatus = (status: SubjectStatus): boolean =>
  PENDING_STATUSES.includes(status as (typeof PENDING_STATUSES)[number]);
