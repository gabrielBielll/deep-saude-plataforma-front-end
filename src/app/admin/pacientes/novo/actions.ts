"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const pacienteSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }).optional().or(z.literal('')),
  telefone: z.string().optional(),
  data_nascimento: z.string().optional(),
  endereco: z.string().optional(),
  psicologo_id: z.string().optional(), // Adicionar psicologo_id
});

// ... (FormState permanece o mesmo)
export type FormState = {
  message: string;
  errors?: { nome?: string[]; email?: string[]; };
  success: boolean;
};

export async function createPaciente(prevState: FormState, formData: FormData): Promise<FormState> {
  const rawFormData = Object.fromEntries(formData.entries());

  // Tratar campo vazio do select
  if (rawFormData.psicologo_id === "") {
    rawFormData.psicologo_id = null;
  }
  
  const validatedFields = pacienteSchema.safeParse(rawFormData);

  // ... (resto da função permanece o mesmo até o body do fetch)

  // Dentro do `try`, modifique o `body` do `fetch`
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(validatedFields.data), // Agora envia o psicologo_id
  });

  // ... (resto da função permanece o mesmo)
}
