export interface Plan {
  code: string;
  name: string;
  description: string | null;
  price: number;
  duration_months: number | null;
  visible: boolean;

  monthly_subject_creations: number;
  subject_capacity: number | null;
  single_file_size: number | null;
  subject_total_files_size: number | null;
  subject_file_count: number | null;
  exercise_question_count: number | null;
  exam_question_count: number | null;
  chatbot_token_count: number | null;
}

export interface SubscriptionStatus {
  user_id: string;
  user_email: string;

  customer_code: string | null;
  customer_id: string | null;

  plan_code: string | null;
  subscription_code: string | null;

  status: string | null;

  start_date: Date | null;   // or Date if you prefer: Date | null
  end_date: Date | null;     // or Date if you prefer: Date | null

  subjects_created_this_month: number;
  total_subjects_created: number;

  plan: Plan | null;
}
