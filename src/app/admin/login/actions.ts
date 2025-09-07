"use server";

import { z } from "zod";
import { cookies } from "next/headers";

// Mantemos o schema para consistência e futuras validações no servidor se necessário.
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

// --- FUNÇÃO DE LOGIN ATUALIZADA PARA CONECTAR COM A API REAL ---
export async function handleLogin(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  // 1. Extrair os dados do formulário
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  // O código da clínica não é usado no endpoint de login atual, mas pode ser adicionado no futuro.
  // const clinicCode = formData.get("clinicCode") as string;

  // 2. Definir a URL da API a partir das variáveis de ambiente
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`;

  // 3. Tentar fazer a chamada à API
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // O backend em Clojure espera a chave "senha"
      body: JSON.stringify({ email, senha: password }),
    });

    const data = await response.json();

    // 4. Lidar com a resposta da API
    if (!response.ok) {
      // Se a resposta não for 2xx, consideramos um erro de autenticação.
      // A nossa API Clojure retorna a mensagem de erro no campo "erro".
      return {
        message: data.erro || "Credenciais inválidas. Verifique seu e-mail e senha.",
        errors: { _form: [data.erro || "Credenciais inválidas."] },
        success: false,
      };
    }

    // 5. Se o login for bem-sucedido, extrair o token e definir o cookie
    const apiToken = data.token;
    if (!apiToken) {
      // Caso a API retorne 200 OK mas não envie um token
      return { message: "Token de autenticação não recebido do servidor.", success: false };
    }

    cookies().set("adminSessionToken", apiToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hora de validade
    });

    // 6. Retornar o estado de sucesso
    return { message: "Login realizado com sucesso!", success: true };

  } catch (error) {
    // 7. Lidar com erros de rede ou falhas na conexão
    console.error("Erro de rede ou conexão ao tentar fazer login:", error);
    return {
      message: "Erro de conexão com o servidor. Tente novamente mais tarde.",
      errors: { _form: ["Não foi possível conectar ao servidor de autenticação."] },
      success: false,
    };
  }
}
