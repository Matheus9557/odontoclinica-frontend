import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

import type {
  UserRole,
} from "@/contexts/authContext";

interface Props {
  children: ReactNode;
  allowed: UserRole;
}

export default function RoleRoute({
  children,
  allowed,
}: Props) {
  const {
    user,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.role !== allowed) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <>{children}</>;
}