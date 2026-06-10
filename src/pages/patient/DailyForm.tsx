"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";

export default function DailyForm() {
  const { user } = useAuth();

  const [painScale, setPainScale] = useState<number>(1);
  const [comments, setComments] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      alert("Usuário não autenticado.");
      return;
    }

    if (painScale < 1 || painScale > 10) {
      alert("A escala de dor deve estar entre 1 e 10.");
      return;
    }

    if (!imageFile) {
      alert("A imagem é obrigatória.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("scale", String(painScale));
      formData.append("comments", comments);
      formData.append("image", imageFile);

      await api.post("/pain-scale", formData);

      alert("✅ Relato diário enviado com sucesso!");

      // reset form
      setPainScale(1);
      setComments("");
      setImageFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err) {
      console.error("❌ Erro no envio do relato diário:", err);
      alert("❌ Erro ao enviar o relato diário.");
    } finally {
      setLoading(false);
    }
  }

  return (
    // 🔵 BACKGROUND PADRÃO DA APLICAÇÃO
    <main className="flex items-center justify-center min-h-[calc(100vh-70px)] bg-[#5067AA] p-4">
      <Card className="w-full max-w-lg p-8 shadow-lg bg-white rounded-xl">

        <h1 className="text-2xl font-semibold mb-8 text-center text-gray-800">
          Relato Diário do Paciente
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-base">

          {/* Escala de dor */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Qual o nível da sua dor hoje? (1 a 10)
            </label>
            <Input
              className="text-base"
              type="number"
              min={1}
              max={10}
              required
              value={painScale}
              onChange={(e) => setPainScale(Number(e.target.value))}
            />
          </div>

          {/* Comentários */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Como você está se sentindo hoje? (opcional)
            </label>
            <textarea
              className="w-full border rounded-md p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#86A6DE]"
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          {/* Upload */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Enviar foto da região (obrigatório)
            </label>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              required
              className="text-base"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>

          {/* BOTÃO PRINCIPAL */}
          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-[#86A6DE] hover:bg-[#6f8fd0] text-white text-lg py-2"
          >
            {loading ? "Enviando..." : "Enviar Relato"}
          </Button>

        </form>
      </Card>
    </main>
  );
}
