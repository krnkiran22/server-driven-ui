export type UserRole = 'super-admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId: string;
}

export interface Institution {
  id: string;
  name: string;
  subdomain: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: User;
  institution: Institution;
  accessToken: string;
  refreshToken: string;
}
