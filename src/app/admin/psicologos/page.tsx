import React from 'react';
import { cookies } from 'next/headers';
import PsicologosClientPage from './PsicologosClientPage'; // Vamos criar este componente logo abaixo

// Definindo o tipo de dados para um psicólogo
interface Psicologo {
  id: string;
  nome: string;
  email: string;
  clinica_id: string;
  papel_id: string;
}

// Função para buscar os dados da API no servidor
async function getPsicologos(token: string): Promise<Psicologo[] | { error: string }> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/psicologos`;
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store', // Garante que os dados sejam sempre buscados do servidor
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || 'Falha ao buscar os dados dos psicólogos.');
    }
    return response.json();
  } catch (error: any) {
    console.error("Erro ao buscar psicólogos:", error);
    return { error: error.message };
  }
}

// ===================================================================
// PARTE 1: SERVER COMPONENT (A PÁGINA)
// Responsável por buscar os dados de forma segura no servidor.
// ===================================================================
export default async function AdminPsicologosPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('adminSessionToken')?.value;

  if (!token) {
    // Idealmente, o middleware já redirecionou, mas é uma salvaguarda.
    return <PsicologosClientPage initialData={[]} error="Token de autenticação não encontrado." />;
  }

  const psicologosData = await getPsicologos(token);

  if ('error' in psicologosData) {
    return <PsicologosClientPage initialData={[]} error={psicologosData.error} />;
  }
  
  // Passa os dados buscados para o Client Component
  return <PsicologosClientPage initialData={psicologosData} />;
}
