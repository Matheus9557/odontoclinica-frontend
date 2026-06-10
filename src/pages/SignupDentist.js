"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl, } from "@/components/ui/form";
const signupSchema = z.object({
    name: z.string().min(2, "Nome precisa ter ao menos 2 caracteres"),
    email: z.string().email("Digite um email válido"),
    password: z.string().min(6, "Senha precisa ter ao menos 6 caracteres"),
    cro: z.string().min(2, "CRO inválido"),
});
export default function SignupDentist() {
    const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            cro: "",
        },
    });
    async function onSubmit(values) {
        try {
            await api.post("/auth/signup/dentist", {
                ...values,
                role: "dentist",
            });
            alert("✅ Dentista cadastrado com sucesso!");
            form.reset();
        }
        catch (err) {
            console.error(err);
            if (err && typeof err === "object" && "response" in err) {
                const axiosErr = err;
                alert(axiosErr.response?.data?.error || "Erro ao cadastrar");
            }
            else {
                alert("Erro inesperado ao cadastrar.");
            }
        }
    }
    return (_jsx("main", { className: "flex justify-center items-center px-4 bg-[#5067AA] min-h-[calc(100vh-70px)]", children: _jsxs("div", { className: "bg-white flex flex-col gap-4 rounded-xl border py-6 w-full max-w-lg shadow-lg", children: [_jsxs("div", { className: "grid auto-rows-min gap-2 px-8", children: [_jsx("h2", { className: "text-2xl font-semibold text-center text-gray-800", children: "Cadastro de Dentista" }), _jsx("p", { className: "text-base text-center text-gray-500", children: "Preencha os dados abaixo para criar sua conta" })] }), _jsx("div", { className: "px-8", children: _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "flex flex-col gap-5 text-base", children: [_jsx(FormField, { control: form.control, name: "name", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "text-base", children: "Nome" }), _jsx(FormControl, { children: _jsx(Input, { className: "text-base", placeholder: "Digite seu nome", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "email", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "text-base", children: "E-mail" }), _jsx(FormControl, { children: _jsx(Input, { className: "text-base", type: "email", placeholder: "Digite seu e-mail", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "password", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "text-base", children: "Senha" }), _jsx(FormControl, { children: _jsx(Input, { className: "text-base", type: "password", placeholder: "Digite sua senha", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "cro", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "text-base", children: "CRO" }), _jsx(FormControl, { children: _jsx(Input, { className: "text-base", placeholder: "Digite seu CRO", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(Button, { type: "submit", className: "w-full mt-2 bg-[#86A6DE] hover:bg-[#6f8fd0] text-white text-lg py-2", children: "Cadastrar" })] }) }) }), _jsxs("div", { className: "items-center px-8 flex justify-center text-base text-gray-500 pb-2", children: ["J\u00E1 possui conta?", _jsx("a", { className: "ml-1 text-[#86A6DE] hover:underline", href: "/login", children: "Entrar" })] })] }) }));
}
