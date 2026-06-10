import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { api } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function Profile() {
    const { user: authUser, logout, updateUser } = useAuth(); // 🔥 updateUser AQUI
    const [user, setUser] = useState(authUser);
    const [newPassword, setNewPassword] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loadingAvatar, setLoadingAvatar] = useState(false);
    const fileInputRef = useRef(null);
    useEffect(() => {
        if (authUser) {
            setUser(authUser);
        }
    }, [authUser]);
    /* =======================
       ALTERAR SENHA
    ======================= */
    async function handleChangePassword() {
        if (!newPassword.trim()) {
            alert("Digite uma nova senha");
            return;
        }
        try {
            await api.put("/auth/change-password", { password: newPassword });
            alert("Senha alterada com sucesso!");
            setNewPassword("");
        }
        catch (err) {
            console.error(err);
            alert("Erro ao alterar senha");
        }
    }
    /* =======================
       UPLOAD AVATAR
    ======================= */
    function handleSelectFile(file) {
        setFile(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
        else {
            setPreview(null);
        }
    }
    async function handleUploadAvatar() {
        if (!file || !user)
            return alert("Selecione uma imagem");
        const form = new FormData();
        form.append("avatar", file);
        try {
            setLoadingAvatar(true);
            const res = await api.post("/upload/avatar", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const newAvatarUrl = res.data.avatarUrl;
            // 🔥 USUÁRIO ATUALIZADO COMPLETO
            const updatedUser = {
                ...user,
                avatarUrl: newAvatarUrl,
            };
            // estado local do Profile
            setUser(updatedUser);
            // 🔥 CONTEXTO GLOBAL + LOCALSTORAGE (ESSENCIAL)
            updateUser(updatedUser);
            setFile(null);
            setPreview(null);
            alert("Foto atualizada com sucesso!");
        }
        catch (err) {
            console.error("Erro no upload:", err);
            alert("Erro ao enviar foto");
        }
        finally {
            setLoadingAvatar(false);
        }
    }
    if (!user)
        return _jsx("p", { className: "text-center mt-8", children: "Carregando..." });
    return (_jsx("main", { className: "flex justify-center items-center min-h-[calc(100vh-70px)] bg-[#5067AA] p-4", children: _jsxs(Card, { className: "w-full max-w-lg p-8 shadow-lg bg-white", children: [_jsx("h1", { className: "text-2xl font-semibold mb-6 text-center", children: "Meu Perfil" }), _jsxs("div", { className: "flex flex-col items-center mb-6 gap-3", children: [_jsxs(Avatar, { className: "h-24 w-24 cursor-pointer", children: [_jsx(AvatarImage, { src: preview || user.avatarUrl || "/avatars/avatar.png", alt: user.name }), _jsx(AvatarFallback, { children: user.name[0].toUpperCase() })] }), _jsx("button", { onClick: () => fileInputRef.current?.click(), className: "text-sm text-blue-600 hover:underline", children: "Alterar foto de perfil" })] }), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", className: "hidden", onChange: (e) => handleSelectFile(e.target.files?.[0] || null) }), file && (_jsxs("div", { className: "mb-6 flex justify-center gap-3", children: [_jsx(Button, { onClick: handleUploadAvatar, disabled: loadingAvatar, className: "bg-[#86A6DE] hover:bg-[#6f8fd0] text-white", children: loadingAvatar ? "Enviando..." : "Salvar foto" }), _jsx(Button, { variant: "ghost", onClick: () => {
                                setFile(null);
                                setPreview(null);
                            }, children: "Cancelar" })] })), _jsxs("div", { className: "space-y-3 mb-6 text-base", children: [_jsxs("p", { children: [_jsx("strong", { children: "Nome:" }), " ", user.name] }), _jsxs("p", { children: [_jsx("strong", { children: "Email:" }), " ", user.email] }), _jsxs("p", { children: [_jsx("strong", { children: "Fun\u00E7\u00E3o:" }), " ", user.role === "dentist" ? "Dentista" : "Paciente"] })] }), _jsx("h2", { className: "text-xl font-medium mb-2", children: "Alterar Senha" }), _jsxs("div", { className: "flex gap-3 mb-6", children: [_jsx(Input, { type: "password", placeholder: "Nova senha", value: newPassword, onChange: (e) => setNewPassword(e.target.value) }), _jsx(Button, { onClick: handleChangePassword, className: "bg-[#86A6DE] hover:bg-[#6f8fd0] text-white", children: "Salvar" })] }), _jsx("div", { className: "mt-4 flex justify-center", children: _jsx(Button, { className: "bg-red-600 hover:bg-red-700 text-white w-full", onClick: () => {
                            if (confirm("Deseja realmente sair?"))
                                logout();
                        }, children: "Logout" }) })] }) }));
}
