"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";

import type { Evaluation } from "@/types/patient";

export default function DailyForm() {
  const { user } = useAuth();

  const [painScale, setPainScale] =
    useState<number>(1);

  const [comments, setComments] =
    useState("");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [evaluation, setEvaluation] =
    useState<Evaluation | null>(null);

  const [loadingEvaluation, setLoadingEvaluation] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!user) return;

    async function loadActiveEvaluation() {
      try {
        setLoadingEvaluation(true);

        const response =
          await api.get<Evaluation | null>(
            "/evaluations/active"
          );

        setEvaluation(response.data);

      } catch (error: unknown) {
        console.error(
          "Erro ao buscar acompanhamento ativo:",
          error
        );

        setEvaluation(null);

      } finally {
        setLoadingEvaluation(false);
      }
    }

    loadActiveEvaluation();
  }, [user]);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!user) {
      alert("Usuário não autenticado.");
      return;
    }

    if (!evaluation) {
      alert(
        "Você não possui um acompanhamento ativo."
      );

      return;
    }

    if (
      painScale < 1 ||
      painScale > 10
    ) {
      alert(
        "A escala de dor deve estar entre 1 e 10."
      );

      return;
    }

    if (!imageFile) {
      alert("A imagem é obrigatória.");
      return;
    }

    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "scale",
        String(painScale)
      );

      formData.append(
        "comments",
        comments
      );

      formData.append(
        "image",
        imageFile
      );

      formData.append(
        "evaluationId",
        evaluation.id
      );

      await api.post(
        "/pain-scale",
        formData
      );

      alert(
        "✅ Relato diário enviado com sucesso!"
      );

      setPainScale(1);
      setComments("");
      setImageFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error: unknown) {
      console.error(
        "❌ Erro no envio do relato diário:",
        error
      );

      let message =
        "Erro ao enviar o relato diário.";

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const response = (
          error as {
            response?: {
              data?: {
                message?: string;
              };
            };
          }
        ).response;

        message =
          response?.data?.message ||
          message;
      }

      alert(`❌ ${message}`);

    } finally {
      setLoading(false);
    }
  }

  if (loadingEvaluation) {
    return (
      <main className="flex items-center justify-center min-h-[calc(100vh-70px)] bg-background p-4">

        <p className="text-muted-foreground text-lg">
          Carregando acompanhamento...
        </p>

      </main>
    );
  }

  if (!evaluation) {
    return (
      <main className="flex items-center justify-center min-h-[calc(100vh-70px)] bg-background p-4">

        <Card className="w-full max-w-lg p-8 shadow-lg bg-card text-card-foreground border-border rounded-xl text-center space-y-4">

          <h1 className="text-2xl font-semibold text-foreground">
            Nenhum acompanhamento ativo
          </h1>

          <p className="text-muted-foreground text-base">
            No momento, você não possui um
            acompanhamento clínico ativo.
          </p>

          <p className="text-muted-foreground text-sm">
            Aguarde a ativação do acompanhamento
            pelo seu dentista.
          </p>

        </Card>

      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-70px)] bg-background p-4">

      <Card className="w-full max-w-lg p-8 shadow-lg bg-card text-card-foreground border-border rounded-xl">

        <h1 className="text-2xl font-semibold mb-2 text-center text-foreground">
          Relato Diário
        </h1>

        <p className="text-center text-muted-foreground mb-8">
          Registre como você está se sentindo hoje.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 text-base"
        >

          <div>

            <label className="block mb-2 font-medium text-foreground">
              Qual o nível da sua dor hoje?
              (1 a 10)
            </label>

            <Input
              className="text-base"
              type="number"
              min={1}
              max={10}
              required
              value={painScale}
              onChange={(e) =>
                setPainScale(
                  Number(e.target.value)
                )
              }
            />

          </div>

          <div>

            <label className="block mb-2 font-medium text-foreground">
              Como você está se sentindo hoje?
              (opcional)
            </label>

            <textarea
              className="w-full border border-border bg-card text-card-foreground rounded-md p-3 text-base focus:outline-none focus:ring-2 focus:ring-ring"
              rows={4}
              value={comments}
              onChange={(e) =>
                setComments(e.target.value)
              }
            />

          </div>

          <div>

            <label className="block mb-2 font-medium text-foreground">
              Enviar foto da região
            </label>

            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              required
              className="text-base"
              onChange={(e) =>
                setImageFile(
                  e.target.files?.[0] ||
                  null
                )
              }
            />

          </div>

          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-2"
          >
            {loading
              ? "Enviando..."
              : "Enviar relato"}
          </Button>

        </form>

      </Card>

    </main>
  );
}