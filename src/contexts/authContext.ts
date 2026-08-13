import { createContext } from "react";

export type UserRole = "dentist" | "patient";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
}

export interface AuthContextProps {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  login: (
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;

  logout: () => void;

  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);