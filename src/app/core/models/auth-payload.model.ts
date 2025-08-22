import { UserModel } from "./user.model";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserModel;
  token: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}