export type UserRole = "STUDENT" | "ADMIN";

/** Mirrors the backend's UserResponse. */
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
}

/** Mirrors the backend's AuthResponse. */
export interface AuthResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: AuthUser;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
