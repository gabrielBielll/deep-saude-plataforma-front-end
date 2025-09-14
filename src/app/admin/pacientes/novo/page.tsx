"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Usaremos para o endereço
import { useToast } from "@/hooks/use-toast";
import { createPaciente, type FormState } from "./actions"; // Importaremos a action que vamos criar
import { ArrowLeft, UserPlus } from "lucide-react";

const initialState: FormState = {
  message: "",
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvando..." : "Salvar Paciente"}
    </Button>
  );
}

export default function AdminNovoPacientePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction] = useFormState(createPaciente, initialState);

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Sucesso!",
        description: state.message,
      });
      router.push("/admin/pacientes"); // Redireciona para a lista após o sucesso
    } else if (state.message && !state.success) {
      toast({
        title: "Erro ao Salvar",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, router, toast]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/pacientes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              Adicionar Novo Paciente
            </CardTitle>
            <CardDescription>
              Preencha os detalhes abaixo para cadastrar um novo paciente.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" name="nome" placeholder="Ex: Ana Silva" />
              {state.errors?.nome && <p className="text-sm font-medium text-destructive">{state.errors.nome[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_nascimento">Data de Nascimento</Label>
              <Input id="data_nascimento" name="data_nascimento" type="date" />
              {state.errors?.data_nascimento && <p className="text-sm font-medium text-destructive">{state.errors.data_nascimento[0]}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email (Opcional)</Label>
              <Input id="email" name="email" type="email" placeholder="paciente@email.com" />
              {state.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone (Opcional)</Label>
              <Input id="telefone" name="telefone" placeholder="(21) 99999-8888" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço (Opcional)</Label>
            <Textarea id="endereco" name="endereco" placeholder="Ex: Rua das Flores, 123..." />
          </div>

          <div className="flex justify-end pt-4">
            <SubmitButton />
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
