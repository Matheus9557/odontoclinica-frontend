"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/services/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

const signupSchema = z.object({
  name: z.string().min(2, "Nome precisa ter ao menos 2 caracteres"),
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "Senha precisa ter ao menos 6 caracteres"),
  cro: z.string().min(2, "CRO inválido"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupDentist() {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      cro: "",
    },
  });

  async function onSubmit(values: SignupFormData) {
    try {
      await api.post("/auth/signup/dentist", {
        ...values,
        role: "dentist",
      });

      alert("✅ Dentista cadastrado com sucesso!");
      form.reset();

    } catch (err: unknown) {
      console.error(err);

      if (
        err &&
        typeof err === "object" &&
        "response" in err
      ) {
        const axiosErr =
          err as {
            response?: {
              data?: {
                error?: string;
              };
            };
          };

        alert(
          axiosErr.response?.data?.error ||
          "Erro ao cadastrar"
        );

      } else {
        alert("Erro inesperado ao cadastrar.");
      }
    }
  }

  return (
    <main className="flex justify-center items-center px-4 bg-background min-h-[calc(100vh-70px)]">

      <div className="bg-card text-card-foreground flex flex-col gap-4 rounded-xl border border-border py-6 w-full max-w-lg shadow-lg">

        <div className="grid auto-rows-min gap-2 px-8">

          <h2 className="text-2xl font-semibold text-center text-foreground">
            Cadastro de Dentista
          </h2>

          <p className="text-base text-center text-muted-foreground">
            Preencha os dados abaixo para criar sua conta
          </p>

        </div>

        <div className="px-8">

          <Form {...form}>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5 text-base"
            >

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Nome
                    </FormLabel>

                    <FormControl>
                      <Input
                        className="text-base"
                        placeholder="Digite seu nome"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      E-mail
                    </FormLabel>

                    <FormControl>
                      <Input
                        className="text-base"
                        type="email"
                        placeholder="Digite seu e-mail"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Senha
                    </FormLabel>

                    <FormControl>
                      <Input
                        className="text-base"
                        type="password"
                        placeholder="Digite sua senha"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      CRO
                    </FormLabel>

                    <FormControl>
                      <Input
                        className="text-base"
                        placeholder="Digite seu CRO"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-2"
              >
                Cadastrar
              </Button>

            </form>

          </Form>
        </div>

        <div className="items-center px-8 flex justify-center text-base text-muted-foreground pb-2">

          Já possui conta?

          <a
            className="ml-1 text-primary hover:underline"
            href="/login"
          >
            Entrar
          </a>

        </div>

      </div>
    </main>
  );
}