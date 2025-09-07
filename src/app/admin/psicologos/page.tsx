import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Definindo o tipo de dados para um psicólogo, conforme a API retorna
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
      // Usamos cache 'no-store' para garantir que os dados sejam sempre os mais recentes
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Nossa API Clojure retorna o erro no campo 'erro'
      throw new Error(errorData.erro || 'Falha ao buscar os dados dos psicólogos.');
    }

    return response.json();
  } catch (error: any) {
    console.error("Erro ao buscar psicólogos:", error);
    return { error: error.message };
  }
}

// O componente da página agora é um Server Component assíncrono
export default async function AdminPsicologosPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('adminSessionToken')?.value;

  // Se não houver token, o middleware já deveria ter redirecionado, mas é uma boa prática verificar.
  if (!token) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Acesso Negado</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Você não está autenticado. Por favor, faça o login.</p>
            </CardContent>
        </Card>
    );
  }

  const psicologosData = await getPsicologos(token);

  // Verifica se a busca de dados retornou um erro
  if ('error' in psicologosData) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Erro ao Carregar Dados</CardTitle>
          <CardDescription>Não foi possível buscar os psicólogos da sua clínica.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{psicologosData.error}</p>
          <p className="text-xs text-muted-foreground mt-2">Verifique os logs da API para mais detalhes.</p>
        </CardContent>
      </Card>
    );
  }

  // Se tudo deu certo, renderiza a tabela
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Gestão de Psicólogos</CardTitle>
                <CardDescription>Adicione, edite e gerencie os psicólogos da clínica.</CardDescription>
            </div>
            <Button asChild>
                <Link href="/admin/psicologos/novo">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Psicólogo
                </Link>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {psicologosData.length > 0 ? (
              psicologosData.map((psicologo) => (
                <TableRow key={psicologo.id}>
                  <TableCell className="font-medium">{psicologo.nome}</TableCell>
                  <TableCell>{psicologo.email}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="icon" className="mr-2 h-8 w-8">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="destructive" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  Nenhum psicólogo encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
