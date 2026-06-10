"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

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
  lastPain?: number | null;
}

interface PainChartEntry {
  id: string;
  date: string;
  scale: number;
  comments?: string | null;
  imageUrl?: string | null;
}

export default function DentistDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [dailyChart, setDailyChart] = useState<PainChartEntry[]>([]);
  const [loadingChart, setLoadingChart] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "dentist") return;

    async function loadPatients() {
      try {
        const res = await api.get<Patient[]>("/patients");
        setPatients(res.data);
      } catch {
        alert("Erro ao carregar pacientes.");
      } finally {
        setLoadingPatients(false);
      }
    }

    loadPatients();
  }, [user]);

  async function loadPatientData(patient: Patient) {
    try {
      setLoadingChart(true);
      setSelectedPatient(patient);

      const res = await api.get<PainChartEntry[]>(
        `/pain-scale/patient/${patient.id}`
      );

      setDailyChart(res.data);
    } catch {
      alert("Erro ao carregar dados do paciente.");
      setDailyChart([]);
    } finally {
      setLoadingChart(false);
    }
  }

  if (!user || user.role !== "dentist") {
    return <p className="p-6 text-lg">Acesso negado.</p>;
  }

  return (
    <main className="min-h-[calc(100vh-70px)] bg-[#5067AA] px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-10">

        <h1 className="text-3xl font-semibold text-white">
          Dashboard do Dentista
        </h1>

        {/* ================= PACIENTES ================= */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Pacientes
          </h2>

          {loadingPatients ? (
            <p className="text-white text-base">Carregando pacientes...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {patients.map((patient) => (
                <Card key={patient.id} className="p-5 bg-white shadow space-y-4">

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {patient.name}
                    </h3>
                    <p className="text-base text-gray-600">
                      {patient.email}
                    </p>
                  </div>

               

                  <Button
                    className="w-full bg-[#86A6DE] hover:bg-[#6f8fd0] text-white text-lg py-2"
                    onClick={() => loadPatientData(patient)}
                  >
                    Acompanhar evolução clínica
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full bg-[#86A6DE] hover:bg-[#6f8fd0] text-white text-lg py-2"
                    onClick={() =>
                      navigate(`/messages?patientId=${patient.id}`)
                    }
                  >
                    Enviar mensagem
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* ================= EVOLUÇÃO ================= */}
        {selectedPatient && (
          <section className="space-y-6">

            <h2 className="text-2xl font-semibold text-white">
              Gráfico Referente a Escala de Dor — {selectedPatient.name}
            </h2>

            {loadingChart ? (
              <p className="text-white text-base">Carregando dados...</p>
            ) : dailyChart.length > 0 ? (
              <>
                {/* Gráfico */}
                <Card className="p-4 bg-white shadow h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[1, 10]} />
                      <RechartsTooltip />
                      <Line
                        type="monotone"
                        dataKey="scale"
                        stroke="#dc2626"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Relatos */}
                <div className="space-y-4">
                  {dailyChart.map((entry) => {
                    const imageSrc = entry.imageUrl
                      ? `${import.meta.env.VITE_API_URL}${entry.imageUrl}`
                      : null;

                    return (
                      <Card key={entry.id} className="p-4 bg-white shadow space-y-3">

                        <p className="font-semibold text-lg text-gray-800 text-center">
                          📅 {entry.date} — Dor: {entry.scale}/10
                        </p>

                        {entry.comments && (
                          <p className="text-base text-gray-700 text-center">
                            {entry.comments}
                          </p>
                        )}

                        {imageSrc && (
                          <div className="flex justify-center">
                            <img
                            src={imageSrc}
                            alt="Imagem clínica"
                            className="mt-2 w-40 h-40 object-cover rounded-lg cursor-pointer border shadow-sm"
                            onClick={() => setSelectedImage(imageSrc)}
                            />
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-white text-base">
                Nenhum relato enviado ainda.
              </p>
            )}
          </section>
        )}
      </div>

      {/* ================= MODAL DE IMAGEM ================= */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl bg-white border shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Imagem enviada pelo paciente
            </DialogTitle>
            <DialogDescription className="text-base text-gray-700">
              Registro fotográfico enviado para avaliação clínica.
            </DialogDescription>
          </DialogHeader>

          {selectedImage && (
            <img
              src={selectedImage}
              alt="Imagem clínica"
              className="w-full h-auto rounded"
            />
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
