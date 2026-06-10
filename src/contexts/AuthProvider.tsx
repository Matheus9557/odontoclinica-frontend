import React, { useState, useEffect, ReactNode } from "react";
import { api } from "@/services/api";
import { AuthContext, User } from "./authContext";
import { socket } from "@/services/socket";

interface LoginResponse {
  token: string;
  role: "dentist" | "patient";
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;   // 🔥 CORRETO
  };
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser) as User;

      setToken(savedToken);
      setUser(parsedUser);

      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;

      // 🔌 Conecta socket ao recarregar sessão
      socket.connect();
      socket.emit("join", {
        userId: parsedUser.id,
        role: parsedUser.role,
      });
    }
  }, []);

  async function login(
    email: string,
    password: string,
    role: "dentist" | "patient"
  ) {
    const res = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
      role,
    });

    const loggedUser: User = {
      id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      role: res.data.role,
      avatarUrl: res.data.user.avatar ?? null,
    };

    setToken(res.data.token);
    setUser(loggedUser);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(loggedUser));

    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

    // 🔌 SOCKET LOGIN
    socket.connect();
    socket.emit("join", {
      userId: loggedUser.id,
      role: loggedUser.role,
    });
  }

  function logout() {
    socket.disconnect();

    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  }

  function updateUser(updated: User) {
  setUser(updated);
  localStorage.setItem("user", JSON.stringify(updated));
}


  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
