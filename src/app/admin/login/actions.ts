"use server";

import { z } from "zod";
import { cookies } from "next/headers";

// O schema não é mais estritamente necessário para o mock, mas mantemos por consistência.
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
    _form?: string[]; 
  };
  success: boolean;
};

// --- FUNÇÃO DE LOGIN MODIFICADA PARA MOCK ---
export async function handleLogin(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {

  console.log("Executando mock de login bem-sucedido...");

  // Define um token falso para a sessão
  const mockApiToken = "mock-admin-jwt-token-para-teste-de-ui";

  // Configura o cookie de sessão para simular um usuário logado
  cookies().set("adminSessionToken", mockApiToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60, // Cookie válido por 1 hora
  });

  // Retorna um estado de sucesso para redirecionar para o dashboard
  return { message: "Login simulado com sucesso!", success: true };
}
