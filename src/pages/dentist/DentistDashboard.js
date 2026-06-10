"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from "@/components/ui/dialog";
export default function DentistDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [dailyChart, setDailyChart] = useState([]);
    const [loadingChart, setLoadingChart] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    useEffect(() => {
        if (!user || user.role !== "dentist")
            return;
        async function loadPatients() {
            try {
                const res = await api.get("/patients");
                setPatients(res.data);
            }
            catch {
                alert("Erro ao carregar pacientes.");
            }
            finally {
                setLoadingPatients(false);
            }
        }
        loadPatients();
    }, [user]);
    async function loadPatientData(patient) {
        try {
            setLoadingChart(true);
            setSelectedPatient(patient);
            const res = await api.get(`/pain-scale/patient/${patient.id}`);
            setDailyChart(res.data);
        }
        catch {
            alert("Erro ao carregar dados do paciente.");
            setDailyChart([]);
        }
        finally {
            setLoadingChart(false);
        }
    }
    if (!user || user.role !== "dentist") {
        return _jsx("p", { className: "p-6 text-lg", children: "Acesso negado." });
    }
    return (_jsxs("main", { className: "min-h-[calc(100vh-70px)] bg-[#5067AA] px-6 py-8", children: [_jsxs("div", { className: "max-w-6xl mx-auto space-y-10", children: [_jsx("h1", { className: "text-3xl font-semibold text-white", children: "Dashboard do Dentista" }), _jsxs("section", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-4 text-white", children: "Pacientes" }), loadingPatients ? (_jsx("p", { className: "text-white text-base", children: "Carregando pacientes..." })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: patients.map((patient) => (_jsxs(Card, { className: "p-5 bg-white shadow space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-800", children: patient.name }), _jsx("p", { className: "text-base text-gray-600", children: patient.email })] }), _jsx(Button, { className: "w-full bg-[#86A6DE] hover:bg-[#6f8fd0] text-white text-lg py-2", onClick: () => loadPatientData(patient), children: "Acompanhar evolu\u00E7\u00E3o cl\u00EDnica" }), _jsx(Button, { variant: "outline", className: "w-full bg-[#86A6DE] hover:bg-[#6f8fd0] text-white text-lg py-2", onClick: () => navigate(`/messages?patientId=${patient.id}`), children: "Enviar mensagem" })] }, patient.id))) }))] }), selectedPatient && (_jsxs("section", { className: "space-y-6", children: [_jsxs("h2", { className: "text-2xl font-semibold text-white", children: ["Gr\u00E1fico Referente a Escala de Dor \u2014 ", selectedPatient.name] }), loadingChart ? (_jsx("p", { className: "text-white text-base", children: "Carregando dados..." })) : dailyChart.length > 0 ? (_jsxs(_Fragment, { children: [_jsx(Card, { className: "p-4 bg-white shadow h-80", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: dailyChart, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, { domain: [1, 10] }), _jsx(RechartsTooltip, {}), _jsx(Line, { type: "monotone", dataKey: "scale", stroke: "#dc2626", strokeWidth: 3, dot: { r: 4 } })] }) }) }), _jsx("div", { className: "space-y-4", children: dailyChart.map((entry) => {
                                            const imageSrc = entry.imageUrl
                                                ? `${import.meta.env.VITE_API_URL}${entry.imageUrl}`
                                                : null;
                                            return (_jsxs(Card, { className: "p-4 bg-white shadow space-y-3", children: [_jsxs("p", { className: "font-semibold text-lg text-gray-800 text-center", children: ["\uD83D\uDCC5 ", entry.date, " \u2014 Dor: ", entry.scale, "/10"] }), entry.comments && (_jsx("p", { className: "text-base text-gray-700 text-center", children: entry.comments })), imageSrc && (_jsx("div", { className: "flex justify-center", children: _jsx("img", { src: imageSrc, alt: "Imagem cl\u00EDnica", className: "mt-2 w-40 h-40 object-cover rounded-lg cursor-pointer border shadow-sm", onClick: () => setSelectedImage(imageSrc) }) }))] }, entry.id));
                                        }) })] })) : (_jsx("p", { className: "text-white text-base", children: "Nenhum relato enviado ainda." }))] }))] }), _jsx(Dialog, { open: !!selectedImage, onOpenChange: () => setSelectedImage(null), children: _jsxs(DialogContent, { className: "max-w-3xl bg-white border shadow-lg", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "text-xl", children: "Imagem enviada pelo paciente" }), _jsx(DialogDescription, { className: "text-base text-gray-700", children: "Registro fotogr\u00E1fico enviado para avalia\u00E7\u00E3o cl\u00EDnica." })] }), selectedImage && (_jsx("img", { src: selectedImage, alt: "Imagem cl\u00EDnica", className: "w-full h-auto rounded" }))] }) })] }));
}
