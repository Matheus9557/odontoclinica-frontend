"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
export default function EditDentist() {
    const { user, logout } = useAuth();
    const [dentist, setDentist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        cro: "",
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
    });
    // -------------------------------------------------------------------
    // 🛡️ Proteção de rota — somente dentistas autenticados
    // -------------------------------------------------------------------
    useEffect(() => {
        if (!user) {
            window.location.href = "/login";
            return;
        }
        if (user.role !== "dentist") {
            window.location.href = "/";
            return;
        }
    }, [user]);
    // -------------------------------------------------------------------
    // 🟦 Buscar perfil do dentista
    // -------------------------------------------------------------------
    useEffect(() => {
        async function loadDentist() {
            try {
                const res = await api.get("/dentists/me");
                setDentist(res.data);
                setForm({
                    name: res.data.name,
                    email: res.data.email,
                    cro: res.data.cro,
                });
            }
            catch (err) {
                console.error("Erro ao buscar perfil do dentista:", err);
            }
            finally {
                setLoading(false);
            }
        }
        if (user?.id)
            loadDentist();
    }, [user]);
    // -------------------------------------------------------------------
    // 🟦 Atualizar perfil
    // -------------------------------------------------------------------
    async function handleUpdateProfile(e) {
        e.preventDefault();
        if (!dentist)
            return;
        try {
            setUpdating(true);
            await api.put(`/dentists/${dentist.id}`, form);
            alert("✅ Perfil atualizado com sucesso!");
        }
        catch (err) {
            console.error(err);
            alert("❌ Erro ao atualizar perfil.");
        }
        finally {
            setUpdating(false);
        }
    }
    // -------------------------------------------------------------------
    // 🟦 Atualizar senha
    // -------------------------------------------------------------------
    async function handleUpdatePassword(e) {
        e.preventDefault();
        if (!dentist)
            return;
        try {
            setUpdating(true);
            await api.put(`/dentists/${dentist.id}`, {
                password: passwordForm.newPassword,
            });
            alert("✅ Senha atualizada com sucesso!");
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
            });
        }
        catch (err) {
            console.error(err);
            alert("❌ Erro ao atualizar senha.");
        }
        finally {
            setUpdating(false);
        }
    }
    // -------------------------------------------------------------------
    // 🟦 Excluir conta
    // -------------------------------------------------------------------
    async function handleDeleteAccount() {
        if (!dentist)
            return;
        const confirmDelete = confirm("Tem certeza que deseja excluir sua conta?");
        if (!confirmDelete)
            return;
        try {
            await api.delete(`/dentists/${dentist.id}`);
            alert("🗑️ Conta excluída com sucesso!");
            logout();
        }
        catch (err) {
            console.error(err);
            alert("❌ Erro ao excluir conta.");
        }
    }
    if (loading)
        return _jsx("p", { className: "p-6", children: "Carregando perfil..." });
    return (_jsx("main", { className: "flex justify-center items-center px-4 bg-blue-200 min-h-[calc(100vh-70px)]", children: _jsx("div", { className: "bg-white text-card-foreground flex flex-col gap-6 rounded-xl border py-6 w-full max-w-2xl shadow-lg", children: _jsxs(Tabs, { defaultValue: "perfil", className: "px-6", children: [_jsxs(TabsList, { className: "grid grid-cols-3 w-full mb-6", children: [_jsx(TabsTrigger, { value: "perfil", children: "Perfil" }), _jsx(TabsTrigger, { value: "senha", children: "Senha" }), _jsx(TabsTrigger, { value: "conta", children: "Conta" })] }), _jsx(TabsContent, { value: "perfil", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Informa\u00E7\u00F5es do Perfil" }), _jsx(CardDescription, { children: "Atualize seus dados b\u00E1sicos" })] }), _jsxs("form", { onSubmit: handleUpdateProfile, children: [_jsxs(CardContent, { className: "grid gap-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "name", children: "Nome" }), _jsx(Input, { id: "name", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "email", children: "E-mail" }), _jsx(Input, { id: "email", type: "email", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "cro", children: "CRO" }), _jsx(Input, { id: "cro", value: form.cro, onChange: (e) => setForm({ ...form, cro: e.target.value }) })] })] }), _jsx(CardFooter, { children: _jsx(Button, { type: "submit", disabled: updating, className: "w-full bg-blue-600 hover:bg-blue-700 text-white", children: updating ? "Salvando..." : "Salvar alterações" }) })] })] }) }), _jsx(TabsContent, { value: "senha", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Alterar Senha" }), _jsx(CardDescription, { children: "Defina uma nova senha de acesso" })] }), _jsxs("form", { onSubmit: handleUpdatePassword, children: [_jsxs(CardContent, { className: "grid gap-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "currentPassword", children: "Senha atual" }), _jsx(Input, { id: "currentPassword", type: "password", value: passwordForm.currentPassword, onChange: (e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value }) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "newPassword", children: "Nova senha" }), _jsx(Input, { id: "newPassword", type: "password", value: passwordForm.newPassword, onChange: (e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value }) })] })] }), _jsx(CardFooter, { children: _jsx(Button, { type: "submit", disabled: updating, className: "w-full bg-blue-600 hover:bg-blue-700 text-white", children: updating ? "Atualizando..." : "Salvar nova senha" }) })] })] }) }), _jsx(TabsContent, { value: "conta", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Excluir Conta" }), _jsxs(CardDescription, { children: ["Esta a\u00E7\u00E3o \u00E9 ", _jsx("strong", { children: "irrevers\u00EDvel" }), ". Todos os seus dados ser\u00E3o apagados."] })] }), _jsx(CardContent, { children: _jsx(Button, { variant: "destructive", onClick: handleDeleteAccount, className: "w-full bg-red-600 hover:bg-red-700 text-white", children: "Excluir minha conta" }) })] }) })] }) }) }));
}
