import { UserModel } from "./user.model";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserModel;
  accessToken: string;
  refreshToken: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}