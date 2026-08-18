"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export interface Dentist {
  id: string;
  name: string;
  email: string;
  cro: string;
}

export default function EditDentist() {
  const { user, logout } = useAuth();

  const [dentist, setDentist] =
    useState<Dentist | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    cro: "",
  });

  const [passwordForm, setPasswordForm] =
    useState({
      currentPassword: "",
      newPassword: "",
    });

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

  useEffect(() => {
    async function loadDentist() {
      try {
        const res =
          await api.get<Dentist>(
            "/dentists/me"
          );

        setDentist(res.data);

        setForm({
          name: res.data.name,
          email: res.data.email,
          cro: res.data.cro,
        });

      } catch (err) {
        console.error(
          "Erro ao buscar perfil do dentista:",
          err
        );

      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      loadDentist();
    }
  }, [user]);

  async function handleUpdateProfile(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!dentist) return;

    try {
      setUpdating(true);

      await api.put(
        `/dentists/${dentist.id}`,
        form
      );

      alert(
        "✅ Perfil atualizado com sucesso!"
      );

    } catch (err) {
      console.error(err);

      alert(
        "❌ Erro ao atualizar perfil."
      );

    } finally {
      setUpdating(false);
    }
  }

  async function handleUpdatePassword(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!dentist) return;

    try {
      setUpdating(true);

      await api.put(
        `/dentists/${dentist.id}`,
        {
          password:
            passwordForm.newPassword,
        }
      );

      alert(
        "✅ Senha atualizada com sucesso!"
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
      });

    } catch (err) {
      console.error(err);

      alert(
        "❌ Erro ao atualizar senha."
      );

    } finally {
      setUpdating(false);
    }
  }

  async function handleDeleteAccount() {
    if (!dentist) return;

    const confirmDelete =
      confirm(
        "Tem certeza que deseja excluir sua conta?"
      );

    if (!confirmDelete) return;

    try {
      await api.delete(
        `/dentists/${dentist.id}`
      );

      alert(
        "🗑️ Conta excluída com sucesso!"
      );

      logout();

    } catch (err) {
      console.error(err);

      alert(
        "❌ Erro ao excluir conta."
      );
    }
  }

  if (loading) {
    return (
      <p className="p-6 text-muted-foreground">
        Carregando perfil...
      </p>
    );
  }

  return (
    <main className="flex justify-center items-center px-4 bg-background min-h-[calc(100vh-70px)]">

      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-border py-6 w-full max-w-2xl shadow-lg">

        <Tabs
          defaultValue="perfil"
          className="px-6"
        >

          <TabsList className="grid grid-cols-3 w-full mb-6 bg-muted">

            <TabsTrigger value="perfil">
              Perfil
            </TabsTrigger>

            <TabsTrigger value="senha">
              Senha
            </TabsTrigger>

            <TabsTrigger value="conta">
              Conta
            </TabsTrigger>

          </TabsList>


          {/* PERFIL */}

          <TabsContent value="perfil">

            <Card className="bg-card border-border">

              <CardHeader>

                <CardTitle>
                  Informações do Perfil
                </CardTitle>

                <CardDescription className="text-muted-foreground">
                  Atualize seus dados básicos
                </CardDescription>

              </CardHeader>

              <form
                onSubmit={handleUpdateProfile}
              >

                <CardContent className="grid gap-4">

                  <div className="grid gap-2">

                    <Label htmlFor="name">
                      Nome
                    </Label>

                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="grid gap-2">

                    <Label htmlFor="email">
                      E-mail
                    </Label>

                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          email:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="grid gap-2">

                    <Label htmlFor="cro">
                      CRO
                    </Label>

                    <Input
                      id="cro"
                      value={form.cro}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          cro: e.target.value,
                        })
                      }
                    />

                  </div>

                </CardContent>

                <CardFooter>

                  <Button
                    type="submit"
                    disabled={updating}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {updating
                      ? "Salvando..."
                      : "Salvar alterações"}
                  </Button>

                </CardFooter>

              </form>

            </Card>

          </TabsContent>


          {/* SENHA */}

          <TabsContent value="senha">

            <Card className="bg-card border-border">

              <CardHeader>

                <CardTitle>
                  Alterar Senha
                </CardTitle>

                <CardDescription className="text-muted-foreground">
                  Defina uma nova senha de acesso
                </CardDescription>

              </CardHeader>

              <form
                onSubmit={
                  handleUpdatePassword
                }
              >

                <CardContent className="grid gap-4">

                  <div className="grid gap-2">

                    <Label htmlFor="currentPassword">
                      Senha atual
                    </Label>

                    <Input
                      id="currentPassword"
                      type="password"
                      value={
                        passwordForm.currentPassword
                      }
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="grid gap-2">

                    <Label htmlFor="newPassword">
                      Nova senha
                    </Label>

                    <Input
                      id="newPassword"
                      type="password"
                      value={
                        passwordForm.newPassword
                      }
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                </CardContent>

                <CardFooter>

                  <Button
                    type="submit"
                    disabled={updating}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {updating
                      ? "Atualizando..."
                      : "Salvar nova senha"}
                  </Button>

                </CardFooter>

              </form>

            </Card>

          </TabsContent>


          {/* CONTA */}

          <TabsContent value="conta">

            <Card className="bg-card border-border">

              <CardHeader>

                <CardTitle>
                  Excluir Conta
                </CardTitle>

                <CardDescription className="text-muted-foreground">

                  Esta ação é{" "}
                  <strong>
                    irreversível
                  </strong>
                  . Todos os seus dados
                  serão apagados.

                </CardDescription>

              </CardHeader>

              <CardContent>

                <Button
                  variant="destructive"
                  onClick={
                    handleDeleteAccount
                  }
                  className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Excluir minha conta
                </Button>

              </CardContent>

            </Card>

          </TabsContent>

        </Tabs>

      </div>

    </main>
  );
}