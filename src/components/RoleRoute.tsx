import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: React.ReactNode;
  allowed: "dentist" | "patient";
}

export default function RoleRoute({ children, allowed }: Props) {
  const { user } = useAuth();

  if (!user || user.role !== allowed) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
