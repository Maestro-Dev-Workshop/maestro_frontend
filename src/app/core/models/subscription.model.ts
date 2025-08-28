export interface Plan {
  id: string;
  name: string;
  price: number;
  maxSubjects: number;
  durationDays: number;
}

export interface SubscriptionStatus {
  plan: Plan;
  startedAt: string;
  expiresAt: string;
  isActive: boolean;
}