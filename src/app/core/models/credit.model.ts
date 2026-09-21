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
  chatbot: any;
  overcharge: any;
}

export interface CreditPack {
  id: string;
  name: string;
  description: string;
  credits: number;
  price: number;
  display_price: number;
  active: boolean;
  country_code: string;
  currency: string;
  discount: number | null;
  bonus_credits: number | null;
}