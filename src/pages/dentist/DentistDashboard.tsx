"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Patient {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

interface Evaluation {
  id: string;
  patientId: string;
  startDate: string;
  endDate: string;
}

interface PainChartEntry {
  id: string;
  date: string;
  scale: number;
  comments?: string | null;
  imageUrl?: string | null;
  evaluationId?: string | null;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const chartConfig = {
  scale: {
    label: "Dor",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const apiError = error as ApiError;

    return (
      apiError.response?.data?.message ??
      fallback
    );
  }

  return fallback;
}

function formatDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data inválida";
  }

  return parsedDate.toLocaleDateString("pt-BR");
}

export default function DentistDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [loadingPatients, setLoadingPatients] =
    useState(true);

  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);

  const [dailyChart, setDailyChart] =
    useState<PainChartEntry[]>([]);

  const [loadingChart, setLoadingChart] =
    useState(false);

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  const [
    activatingPatientId,
    setActivatingPatientId,
  ] = useState<string | null>(null);

  const [
    activeEvaluations,
    setActiveEvaluations,
  ] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user || user.role !== "dentist") {
      return;
    }

    async function loadPatients() {
      try {
        setLoadingPatients(true);

        const response =
          await api.get<Patient[]>("/patients");

        setPatients(response.data);

        const evaluationStatus: Record<
          string,
          boolean
        > = {};

        await Promise.all(
          response.data.map(
            async (patient) => {
              try {
                const evaluationResponse =
                  await api.get<Evaluation[]>(
                    `/evaluations/patient/${patient.id}`
                  );

                const now = new Date();

                const hasActiveEvaluation =
                  evaluationResponse.data.some(
                    (evaluation) => {
                      const startDate =
                        new Date(
                          evaluation.startDate
                        );

                      const endDate =
                        new Date(
                          evaluation.endDate
                        );

                      return (
                        now >= startDate &&
                        now <= endDate
                      );
                    }
                  );

                evaluationStatus[
                  patient.id
                ] = hasActiveEvaluation;

              } catch (error: unknown) {
                console.error(
                  `Erro ao verificar acompanhamento do paciente ${patient.id}:`,
                  error
                );

                evaluationStatus[
                  patient.id
                ] = false;
              }
            }
          )
        );

        setActiveEvaluations(
          evaluationStatus
        );

      } catch (error: unknown) {
        console.error(
          "Erro ao carregar pacientes:",
          error
        );

        alert(
          getErrorMessage(
            error,
            "Erro ao carregar pacientes."
          )
        );

      } finally {
        setLoadingPatients(false);
      }
    }

    loadPatients();
  }, [user]);

  async function activateEvaluation(
    patient: Patient
  ) {
    try {
      setActivatingPatientId(
        patient.id
      );

      await api.post(
        `/evaluations/${patient.id}`
      );

      setActiveEvaluations(
        (current) => ({
          ...current,
          [patient.id]: true,
        })
      );

      alert(
        `Acompanhamento de ${patient.name} ativado com sucesso.`
      );

    } catch (error: unknown) {
      console.error(
        "Erro ao ativar acompanhamento:",
        error
      );

      alert(
        getErrorMessage(
          error,
          "Erro ao ativar acompanhamento."
        )
      );

    } finally {
      setActivatingPatientId(null);
    }
  }

  async function loadPatientData(
    patient: Patient
  ) {
    try {
      setLoadingChart(true);
      setSelectedPatient(patient);

      const response =
        await api.get<PainChartEntry[]>(
          `/pain-scale/patient/${patient.id}`
        );

      setDailyChart(response.data);

    } catch (error: unknown) {
      console.error(
        "Erro ao carregar dados do paciente:",
        error
      );

      setDailyChart([]);

      alert(
        getErrorMessage(
          error,
          "Erro ao carregar dados do paciente."
        )
      );

    } finally {
      setLoadingChart(false);
    }
  }

  if (!user || user.role !== "dentist") {
    return (
      <p className="p-6 text-lg text-foreground">
        Acesso negado.
      </p>
    );
  }

  return (
    <main className="min-h-[calc(100vh-70px)] bg-background px-6 py-8">

      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            Dashboard do Dentista
          </h1>

          <p className="mt-1 text-muted-foreground">
            Acompanhamento clínico dos seus pacientes.
          </p>
        </div>

        {/* PACIENTES */}

        <section>

          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Pacientes
          </h2>

          {loadingPatients ? (
            <p className="text-muted-foreground text-base">
              Carregando pacientes...
            </p>

          ) : patients.length === 0 ? (

            <Card className="p-6 bg-card text-card-foreground shadow-sm border-border">

              <p className="text-muted-foreground">
                Nenhum paciente cadastrado.
              </p>

            </Card>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {patients.map((patient) => {

                const hasActiveEvaluation =
                  activeEvaluations[
                    patient.id
                  ] ?? false;

                const isActivating =
                  activatingPatientId ===
                  patient.id;

                return (
                  <Card
                    key={patient.id}
                    className="p-5 bg-card text-card-foreground border-border shadow-sm space-y-4"
                  >

                    <div>
                      <h3 className="text-xl font-semibold text-card-foreground">
                        {patient.name}
                      </h3>

                      <p className="text-base text-muted-foreground">
                        {patient.email}
                      </p>
                    </div>

                    <div className="rounded-md bg-muted border border-border p-3">

                      {hasActiveEvaluation ? (
                        <p className="text-sm font-medium text-green-400">
                          ✓ Acompanhamento clínico ativo
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-muted-foreground">
                          Nenhum acompanhamento ativo
                        </p>
                      )}

                    </div>

                    {!hasActiveEvaluation && (
                      <Button
                        disabled={isActivating}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-2"
                        onClick={() =>
                          activateEvaluation(
                            patient
                          )
                        }
                      >
                        {isActivating
                          ? "Ativando..."
                          : "Ativar acompanhamento"}
                      </Button>
                    )}

                    <Button
                      className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground text-lg py-2"
                      onClick={() =>
                        loadPatientData(
                          patient
                        )
                      }
                    >
                      Acompanhar evolução clínica
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground border-border text-lg py-2"
                      onClick={() =>
                        navigate(
                          `/messages?patientId=${patient.id}`
                        )
                      }
                    >
                      Enviar mensagem
                    </Button>

                  </Card>
                );
              })}

            </div>
          )}

        </section>

        {/* EVOLUÇÃO */}

        {selectedPatient && (
          <section className="space-y-6">

            <div>

              <h2 className="text-2xl font-semibold text-foreground">
                Evolução da Escala de Dor
              </h2>

              <p className="mt-1 text-muted-foreground">
                Paciente: {selectedPatient.name}
              </p>

            </div>

            {loadingChart ? (

              <p className="text-muted-foreground text-base">
                Carregando dados...
              </p>

            ) : dailyChart.length > 0 ? (

              <>

                {/* GRÁFICO */}

                <Card className="bg-card text-card-foreground border-border shadow-sm overflow-hidden">

                  <div className="border-b border-border px-6 py-5">

                    <h3 className="text-lg font-semibold">
                      Escala de dor
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                      Evolução dos relatos diários do paciente.
                    </p>

                  </div>

                  <div className="px-2 sm:px-6 pb-6 pt-4">

                    <ChartContainer
                      config={chartConfig}
                      className="h-[320px] w-full"
                    >

                      <LineChart
                        accessibilityLayer
                        data={dailyChart}
                        margin={{
                          left: 12,
                          right: 12,
                          top: 10,
                          bottom: 10,
                        }}
                      >

                        <CartesianGrid
                          vertical={false}
                          className="stroke-border"
                        />

                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          minTickGap={24}
                          className="fill-muted-foreground"
                          tickFormatter={(value) => {
                            const date = new Date(
                              String(value)
                            );

                            if (
                              Number.isNaN(
                                date.getTime()
                              )
                            ) {
                              return "--/--";
                            }

                            return date.toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                              }
                            );
                          }}
                        />

                        <YAxis
                          domain={[1, 10]}
                          allowDecimals={false}
                          tickLine={false}
                          axisLine={false}
                          width={30}
                          className="fill-muted-foreground"
                        />

                        <ChartTooltip
                          cursor={{
                            stroke:
                              "var(--border)",
                            strokeWidth: 1,
                          }}
                          content={
                            <ChartTooltipContent
                              labelFormatter={(
                                value
                              ) =>
                                `Data: ${formatDate(
                                  String(value)
                                )}`
                              }
                              formatter={(
                                value
                              ) => [
                                `${value}/10`,
                              ]}
                            />
                          }
                        />

                        <Line
                          dataKey="scale"
                          type="monotone"
                          stroke="var(--color-scale)"
                          strokeWidth={3}
                          dot={{
                            r: 5,
                            fill:
                              "var(--color-scale)",
                            strokeWidth: 2,
                            stroke:
                              "var(--card)",
                          }}
                          activeDot={{
                            r: 7,
                            fill:
                              "var(--color-scale)",
                            stroke:
                              "var(--card)",
                            strokeWidth: 2,
                          }}
                        />

                      </LineChart>

                    </ChartContainer>

                  </div>

                </Card>

                {/* RELATOS */}

                <div className="space-y-4">

                  {dailyChart.map((entry) => {

                    const imageSrc =
                      entry.imageUrl ?? null;

                    return (
                      <Card
                        key={entry.id}
                        className="p-4 bg-card text-card-foreground border-border shadow-sm space-y-4"
                      >

                        <p className="font-semibold text-lg text-card-foreground text-center">
                          📅{" "}
                          {formatDate(
                            entry.date
                          )}{" "}
                          — Dor:{" "}
                          {entry.scale}/10
                        </p>

                        {entry.comments && (
                          <p className="text-base text-muted-foreground text-center">
                            {entry.comments}
                          </p>
                        )}

                        {imageSrc && (
                          <div className="flex justify-center pt-2">

                            <Button
                              type="button"
                              variant="outline"
                              className="bg-muted hover:bg-accent text-foreground border-border"
                              onClick={() =>
                                setSelectedImage(
                                  imageSrc
                                )
                              }
                            >
                              🔒 Visualizar imagem clínica
                            </Button>

                          </div>
                        )}

                      </Card>
                    );
                  })}

                </div>

              </>

            ) : (

              <p className="text-muted-foreground text-base">
                Nenhum relato enviado ainda.
              </p>

            )}

          </section>
        )}

      </div>

      {/* MODAL */}

      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedImage(null);
          }
        }}
      >

        <DialogContent className="max-w-3xl bg-card text-card-foreground border-border shadow-xl">

          <DialogHeader>

            <DialogTitle className="text-xl">
              Imagem clínica
            </DialogTitle>

            <DialogDescription className="text-muted-foreground">
              Imagem enviada pelo paciente
              para acompanhamento clínico.
            </DialogDescription>

          </DialogHeader>

          {selectedImage && (
            <div className="flex justify-center">

              <img
                src={selectedImage}
                alt="Imagem clínica enviada pelo paciente"
                className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain"
              />

            </div>
          )}

        </DialogContent>

      </Dialog>

    </main>
  );
}