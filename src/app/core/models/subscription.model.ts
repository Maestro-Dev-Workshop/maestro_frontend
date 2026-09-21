export interface Plan {
  code: string;
  name: string;
  description: string | null;
  price: number;
  duration_months: number | null;
  visible: boolean;
  display_price: number;
  country_code: string | null;
  currency: string | null;

  lesson_capacity: number | null;
  lesson_cummulative_file_size: number | null;
  lesson_file_count: number | null;
  word_soft_limit: number | null;
  chatbot_messages: number | null;
  membership_credits: number | null;
  cells_allowed: any;
  topup_discount: number | null;
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

  plan: Plan;
}
