"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"dentist" | "patient">("dentist");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await login(email, password, role);

      if (role === "dentist") {
        navigate("/dashboard-dentist");
      } else {
        navigate("/daily-form");
      }
    } catch (err) {
      console.error(err);
      alert("Falha no login. Verifique suas credenciais.");
    }
  }

  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-70px)] bg-[#5067AA] px-4">
      <Card className="w-full max-w-lg bg-white shadow-lg border rounded-xl py-8">

        <div className="px-8 mb-4">
          <h1 className="text-3xl font-bold text-center text-[#5067AA]">
            Login
          </h1>
          <p className="text-base text-center text-gray-500 mt-1">
            Acesse sua conta para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-8">
          <Input
            type="email"
            placeholder="E-mail"
            className="text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Senha"
            className="text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="border rounded-md px-3 py-2 text-base"
            value={role}
            onChange={(e) => setRole(e.target.value as "dentist" | "patient")}
          >
            <option value="dentist">Dentista</option>
            <option value="patient">Paciente</option>
          </select>

          <Button
            type="submit"
            className="w-full mt-2 bg-[#86A6DE] hover:bg-[#6f90cc] text-white text-base py-2.5"
          >
            Entrar
          </Button>
        </form>

      </Card>
    </main>
  );
}
