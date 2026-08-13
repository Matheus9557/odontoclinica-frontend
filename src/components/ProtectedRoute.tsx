import type { ReactNode } from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: Props) {
  const {
    token,
    isLoading,
  } = useAuth();

  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <>{children}</>;
}