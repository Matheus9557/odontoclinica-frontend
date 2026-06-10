"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPatient() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user || user.role !== "dentist") {
      alert("Apenas dentistas podem cadastrar pacientes.");
      return;
    }

    try {
      await api.post("/patients", {
        name,
        email,
        password,
        dentistId: user.id,
      });

      alert("Paciente cadastrado com sucesso!");

      setName("");
      setEmail("");
      setPassword("");
    } catch (error: unknown) {
      console.error("Erro ao cadastrar paciente:", error);

      let msg = "Falha ao cadastrar paciente";

      if (typeof error === "object" && error !== null) {
        const axiosErr = error as { response?: { data?: { error?: string } } };
        msg = axiosErr?.response?.data?.error || msg;
      }

      alert(msg);
    }
  }

  return (
    <main className="flex justify-center items-center min-h-[calc(100vh-70px)] px-4 bg-[#5067AA]">
      <Card className="w-full max-w-lg bg-white shadow-lg border rounded-xl py-8">

        <div className="px-8 mb-4">
          <h1 className="text-2xl font-semibold text-center text-gray-800">
            Cadastro de Paciente
          </h1>
          <p className="text-base text-center text-gray-500">
            Preencha os dados abaixo para registrar um novo paciente
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-8 text-base">

          <Input
            className="text-base"
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            className="text-base"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            className="text-base"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full mt-2 bg-[#86A6DE] hover:bg-[#6f8fd0] text-white text-lg py-2"
          >
            Cadastrar Paciente
          </Button>
        </form>
      </Card>
    </main>
  );
}
