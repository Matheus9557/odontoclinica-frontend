import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "dentist" | "patient";
  avatarUrl?: string | null;
}

export interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (
    email: string,
    password: string,
    role: "dentist" | "patient"
  ) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void; 
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);
