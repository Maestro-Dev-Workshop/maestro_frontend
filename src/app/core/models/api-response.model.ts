import { SubjectModel } from './subject.model';
import { TopicModel } from './topic.model';
import { SubtopicModel } from './subtopic.model';
import { ExerciseModel } from './exercise.model';
import { ExamModel } from './exam.model';
import { UserModel } from './user.model';
import { Plan, SubscriptionStatus } from './subscription.model';
import { ChatMessage } from './chat-message.model';

// Base API response structure
// Note: Not all backend responses include 'message', so it's optional
export interface ApiResponse<T = void> {
  success: boolean;
  message?: string;
  data?: T;
}

// Auth responses
export interface LoginResponseData {
  user: UserModel;
  accessToken: string;
  refreshToken: string;
}

export interface SignupResponseData {
  user: UserModel;
}

export interface RefreshTokenResponseData {
  accessToken: string;
}

// Subject responses
// GET /subjects - returns { success, sessions }
export interface SubjectListResponse extends ApiResponse {
  sessions: SubjectModel[];
}

// GET /subjects/:id, POST /subjects, PUT /subjects/:id - returns { success, session, message? }
export interface SubjectResponse extends ApiResponse {
  session: SubjectModel;
}

// GET /subjects/:id/full - returns { success, session, documents, topics, extensions }
export interface SubjectDetailsResponse extends ApiResponse {
  session: SubjectModel;
  documents: DocumentModel[];
  topics: TopicModel[];
  extensions: ExtensionModel[];
}

// POST /subjects/:id/documents/ingest - returns { success, message, documents, warning }
export interface DocumentIngestResponse extends ApiResponse {
  documents: IngestedDocument[];
  warning: boolean;
}

export interface IngestedDocument {
  document: DocumentModel;
  totalPages: number;
  belowThreshold: boolean;
  avgPageWordCount: number;
}

// POST /subjects/:id/documents/label - returns { success, message, result }
// result is array of { document, topics_found }
export interface DocumentLabelResponse extends ApiResponse {
  result: DocumentLabelResult[];
}

export interface DocumentLabelResult {
  document: string;
  topics_found: string[];
}

// PUT /subjects/:id/progress - returns { success, message, result: { completion } }
export interface UpdateProgressResponse extends ApiResponse {
  result: {
    completion: number;
  };
}

// Topic responses
// GET /subjects/:id/topics - returns { success, message, topics }
export interface TopicListResponse extends ApiResponse {
  topics: TopicModel[];
}

// GET /topics/:id - returns { success, message, subtopics }
export interface TopicContentResponse extends ApiResponse {
  subtopics: SubtopicModel[];
}

// PUT /topics/:id/read - returns { success, message, subtopic }
export interface MarkAsReadResponse extends ApiResponse {
  subtopic: {
    id: string;
    title: string;
    read: boolean;
  };
}

// Exercise responses
// GET /topics/:id/exercise - returns { success, exercise }
export interface ExerciseResponse extends ApiResponse {
  exercise: ExerciseModel | null;
}

// PUT /topics/:id/exercise/score - returns { success, message, exercise }
export interface SaveExerciseScoreResponse extends ApiResponse {
  exercise: {
    id: string;
    topic_id: string;
    score: number;
  };
}

// Exam responses
// GET /subjects/:id/exam - returns { success, exam }
// exam includes id, score, questions, time_limit
export interface ExamResponse extends ApiResponse {
  exam: ExamWithTimeLimit | null;
}

export interface ExamWithTimeLimit extends ExamModel {
  time_limit: number;
}

// PUT /subjects/:id/exam/score - returns { success, message, result }
export interface SaveExamScoreResponse extends ApiResponse {
  result: {
    exam_id: string;
    score: number;
    updated_at: string;
  };
}

// Glossary & Flashcard responses
export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  session_id?: string;
}

// GET /subjects/:id/glossary - returns { success, glossary }
export interface GlossaryResponse extends ApiResponse {
  glossary: GlossaryTerm[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  properties?: Record<string, unknown>;
  tags?: string[];
  topic_id?: string;
}

// GET /topics/:id/flashcards - returns { success, flashcards }
export interface FlashcardResponse extends ApiResponse {
  flashcards: Flashcard[];
}

// POST /topics/code/execute - returns { success, message, result }
export interface CodeExecutionResponse extends ApiResponse {
  result: unknown; // Structure depends on code execution service
}

// Chatbot responses
// GET /chatbot/:id/history - returns { success, history }
export interface ChatHistoryResponse extends ApiResponse {
  history: ChatMessage[];
}

// POST /chatbot/:id/messages - returns { success, response }
export interface ChatMessageResponse extends ApiResponse {
  response: string;
}

// POST /chatbot/questions/evaluate - returns { success, ...result }
// Result structure depends on AI service
export interface EssayEvaluationResponse extends ApiResponse {
  score?: number;
  feedback?: string;
  [key: string]: unknown;
}

// Subscription responses
// GET /subscriptions/plans - returns { success, message, plans, ... }
export interface PlansResponse extends ApiResponse {
  plans?: Plan[];
  [key: string]: unknown; // May include additional fields from service
}

// GET /subscriptions/plans/:planCode - returns { success, message, plan }
export interface SinglePlanResponse extends ApiResponse {
  plan: Plan;
}

// GET /subscriptions - returns { success, message, subscription }
export interface SubscriptionResponse extends ApiResponse {
  subscription: SubscriptionStatus;
}

// POST /subscriptions - returns { success, message, transaction }
export interface TransactionInitResponse extends ApiResponse {
  transaction: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

// POST /subscriptions/verify - returns { success, message, transactionStatus }
export interface TransactionVerifyResponse extends ApiResponse {
  transactionStatus: {
    status: string;
    reference: string;
    [key: string]: unknown;
  };
}

// GET /subscriptions/manage-link - returns { success, message, manageLink }
export interface ManageLinkResponse extends ApiResponse {
  manageLink: string;
}

// Feedback responses
// POST /subjects/:id/feedback - returns { success, message, data }
// GET /subjects/:id/feedback - returns { success, message, data }
export interface FeedbackResponse extends ApiResponse {
  data: FeedbackData;
}

export interface FeedbackData {
  id: string;
  user_id: string;
  session_id: string;
  rating: number;
  comment?: string | null;
  created_at?: string;
  updated_at?: string;
}

// GET /feedback/rating-scale - returns { success, message, data: { scale } }
export interface RatingScaleResponse extends ApiResponse {
  data: {
    scale: RatingScaleItem[];
  };
}

export interface RatingScaleItem {
  value: number;
  label: string;
  description: string;
}

// Supporting types
export interface DocumentModel {
  id: string;
  session_id: string;
  name: string;
  extension: string;
  size: number;
  total_pages: number;
  word_count?: number | null;
  primary_topic?: string | null;
  scanned: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ExtensionModel {
  id: string;
  session_id: string;
  type: 'lesson' | 'exercise' | 'exam' | 'flashcards' | 'glossary';
  generated: boolean;
  configuration?: ExtensionConfiguration;
  created_at?: string;
  updated_at?: string;
}

export interface ExtensionConfiguration {
  preference?: string;
  cell_types?: string[];
  question_types?: string[];
  no_of_questions?: number;
  use_time_limit?: boolean;
  no_of_cards?: number;
  card_types?: string[];
}

// Extension settings payload for generation request
export interface ExtensionSettingsPayload {
  cells?: {
    types: string[];
  };
  exercise: {
    enabled: boolean;
    types: string[];
    numQuestions: number;
    name: string;
  };
  exam: {
    enabled: boolean;
    types: string[];
    numQuestions: number;
    time_limit: boolean;
    name: string;
  };
  flashcards: {
    enabled: boolean;
    numCards: number;
    types: string[];
    name: string;
  };
  glossary: {
    enabled: boolean;
    name: string;
  };
}
