"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Schema de validação para os dados do formulário
const pacienteSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }).optional().or(z.literal('')),
  telefone: z.string().optional(),
  data_nascimento: z.string().optional(), // A API espera uma string no formato "YYYY-MM-DD"
  endereco: z.string().optional(),
});

// Tipo para o estado do nosso formulário
export type FormState = {
  message: string;
  errors?: {
    nome?: string[];
    email?: string[];
    data_nascimento?: string[];
    _form?: string[]; 
  };
  success: boolean;
};

export async function createPaciente(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = pacienteSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    telefone: formData.get("telefone"),
    data_nascimento: formData.get("data_nascimento"),
    endereco: formData.get("endereco"),
  });

  if (!validatedFields.success) {
    return {
      message: "Erro de validação.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const token = cookies().get("adminSessionToken")?.value;
  if (!token) {
    return { message: "Erro de autenticação.", success: false };
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/pacientes`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(validatedFields.data),
    });

    const data = await response.json();

    if (!response.ok) {
      return { message: data.erro || "Falha ao criar paciente.", success: false };
    }

    // Sucesso!
    revalidatePath("/admin/pacientes"); // Invalida o cache da página de listagem
    return { message: "Paciente criado com sucesso!", success: true };

  } catch (error) {
    console.error("Erro de rede ao criar paciente:", error);
    return { message: "Erro de conexão com o servidor.", success: false };
  }
}
