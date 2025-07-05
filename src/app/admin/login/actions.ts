"use server";

import { z } from "zod";
import { cookies } from "next/headers";
// import adminApi from "@/lib/admin-api"; // O adminApi pode precisar de ajustes para ser usado em Server Actions, especialmente o interceptor.
                                        // Por enquanto, faremos um fetch direto.

const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  clinicCode: z.string().min(3, { message: "Código da clínica inválido." }),
});

export type LoginFormState = {
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
    clinicCode?: string[];
    _form?: string[]; // Para erros gerais do formulário
  };
  success: boolean;
  token?: string; // Apenas para fins de exemplo, não envie o token de volta ao cliente assim.
};

export async function handleLogin(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    clinicCode: formData.get("clinicCode"),
  });

  if (!validatedFields.success) {
    return {
      message: "Campos inválidos.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { email, password, clinicCode } = validatedFields.data;

  try {
    // Simulação da chamada à API
    // Em um cenário real, você usaria fetch ou um cliente API configurado para Server Actions
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin-login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password, clinic_code: clinicCode }), // Ajuste o payload conforme sua API
    // });

    // const data = await response.json();

    // if (!response.ok) {
    //   return {
    //     message: data.message || "Falha no login. Verifique suas credenciais.",
    //     errors: { _form: [data.message || "Erro desconhecido"] },
    //     success: false,
    //   };
    // }

    // Mock de sucesso para desenvolvimento:
    if (email === "admin@example.com" && password === "password123" && clinicCode === "DEEP") {
      const mockApiToken = "mock-admin-jwt-token-from-server-action"; // Token que viria da API

      // Configurar cookie HttpOnly
      cookies().set("adminSessionToken", mockApiToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Em produção, use true
        path: "/", // Disponível em todo o site
        sameSite: "lax", // Ou 'strict'
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });

      return { message: "Login bem-sucedido!", success: true };
    } else {
      return {
        message: "Credenciais inválidas.",
        errors: { _form: ["E-mail, senha ou código da clínica incorretos."] },
        success: false,
      };
    }

  } catch (error) {
    console.error("Erro no servidor durante o login:", error);
    return {
      message: "Erro interno do servidor. Tente novamente mais tarde.",
      errors: { _form: ["Ocorreu um erro inesperado."] },
      success: false,
    };
  }
}
