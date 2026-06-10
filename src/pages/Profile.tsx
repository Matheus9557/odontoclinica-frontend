import { useEffect, useRef, useState } from "react";
import { api } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarResponse {
  avatarUrl: string;
}

export default function Profile() {
  const { user: authUser, logout, updateUser } = useAuth(); // 🔥 updateUser AQUI
  const [user, setUser] = useState(authUser);
  const [newPassword, setNewPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    } catch (err) {
      console.error(err);
      alert("Erro ao alterar senha");
    }
  }

  /* =======================
     UPLOAD AVATAR
  ======================= */

  function handleSelectFile(file: File | null) {
    setFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  async function handleUploadAvatar() {
    if (!file || !user) return alert("Selecione uma imagem");

    const form = new FormData();
    form.append("avatar", file);

    try {
      setLoadingAvatar(true);

      const res = await api.post<AvatarResponse>("/upload/avatar", form, {
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
    } catch (err) {
      console.error("Erro no upload:", err);
      alert("Erro ao enviar foto");
    } finally {
      setLoadingAvatar(false);
    }
  }

  if (!user) return <p className="text-center mt-8">Carregando...</p>;

  return (
    <main className="flex justify-center items-center min-h-[calc(100vh-70px)] bg-[#5067AA] p-4">
      <Card className="w-full max-w-lg p-8 shadow-lg bg-white">

        <h1 className="text-2xl font-semibold mb-6 text-center">
          Meu Perfil
        </h1>

        {/* AVATAR */}
        <div className="flex flex-col items-center mb-6 gap-3">

          <Avatar className="h-24 w-24 cursor-pointer">
            <AvatarImage
              src={preview || user.avatarUrl || "/avatars/avatar.png"}
              alt={user.name}
            />
            <AvatarFallback>
              {user.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-blue-600 hover:underline"
          >
            Alterar foto de perfil
          </button>
        </div>

        {/* INPUT ESCONDIDO */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            handleSelectFile(e.target.files?.[0] || null)
          }
        />

        {/* BOTÕES DE AVATAR */}
        {file && (
          <div className="mb-6 flex justify-center gap-3">

            <Button
              onClick={handleUploadAvatar}
              disabled={loadingAvatar}
              className="bg-[#86A6DE] hover:bg-[#6f8fd0] text-white"
            >
              {loadingAvatar ? "Enviando..." : "Salvar foto"}
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
            >
              Cancelar
            </Button>

          </div>
        )}

        {/* DADOS */}
        <div className="space-y-3 mb-6 text-base">
          <p>
            <strong>Nome:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Função:</strong>{" "}
            {user.role === "dentist" ? "Dentista" : "Paciente"}
          </p>
        </div>

        {/* ALTERAR SENHA */}
        <h2 className="text-xl font-medium mb-2">
          Alterar Senha
        </h2>

        <div className="flex gap-3 mb-6">
          <Input
            type="password"
            placeholder="Nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button
            onClick={handleChangePassword}
            className="bg-[#86A6DE] hover:bg-[#6f8fd0] text-white"
          >
            Salvar
          </Button>
        </div>

        {/* LOGOUT */}
        <div className="mt-4 flex justify-center">
          <Button
            className="bg-red-600 hover:bg-red-700 text-white w-full"
            onClick={() => {
              if (confirm("Deseja realmente sair?")) logout();
            }}
          >
            Logout
          </Button>
        </div>

      </Card>
    </main>
  );
}
