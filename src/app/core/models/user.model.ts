export interface UserModel {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roles: string[];
  token?: string;
}