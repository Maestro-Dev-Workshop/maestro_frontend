export interface CreditBalance {
  user_id: string;
  membership_credits: number;
  topup_credits: number;
  updated_at: Date;
}

export interface CreditHistory {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  reference: string;
  tran_type: string;
  status: string;
  metadata: any;
}

export interface CreditCostSettings {
  id: string;
  active: boolean;
  lesson: any;
  exercise: any;
  exam: any;
  flashcards: any;
  glossary: any;
  overcharge: any;
}