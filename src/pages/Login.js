"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const [role, setRole] = useState("dentist");
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await login(email, password, role);
            if (role === "dentist") {
                navigate("/dashboard-dentist");
            }
            else {
                navigate("/daily-form");
            }
        }
        catch (err) {
            console.error(err);
            alert("Falha no login. Verifique suas credenciais.");
        }
    }
    return (_jsx("main", { className: "flex items-center justify-center min-h-[calc(100vh-70px)] bg-[#5067AA] px-4", children: _jsxs(Card, { className: "w-full max-w-lg bg-white shadow-lg border rounded-xl py-8", children: [_jsxs("div", { className: "px-8 mb-4", children: [_jsx("h1", { className: "text-3xl font-bold text-center text-[#5067AA]", children: "Login" }), _jsx("p", { className: "text-base text-center text-gray-500 mt-1", children: "Acesse sua conta para continuar" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-5 px-8", children: [_jsx(Input, { type: "email", placeholder: "E-mail", className: "text-base", value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx(Input, { type: "password", placeholder: "Senha", className: "text-base", value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsxs("select", { className: "border rounded-md px-3 py-2 text-base", value: role, onChange: (e) => setRole(e.target.value), children: [_jsx("option", { value: "dentist", children: "Dentista" }), _jsx("option", { value: "patient", children: "Paciente" })] }), _jsx(Button, { type: "submit", className: "w-full mt-2 bg-[#86A6DE] hover:bg-[#6f90cc] text-white text-base py-2.5", children: "Entrar" })] })] }) }));
}
