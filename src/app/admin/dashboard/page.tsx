import React from 'react';
import { cookies } from 'next/headers'; // Para acessar cookies em Server Components
import StatsCard from '@/components/admin/StatsCard';
import { Users, BriefcaseMedical, CalendarClock, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter // Importando CardFooter e outros componentes Card
} from "@/components/ui/card";

// Estrutura de dados conforme especificado
interface DashboardStats {
  totalPsicologos: number;
  totalPacientes: number;
  consultasHoje: number;
  receitaMes: number; // Em centavos ou como a API retornar
  crescimentoMensalPercent: number; // Percentual de crescimento
  previsaoProximoMes: number; // Em centavos ou como a API retornar
}

// Função para buscar os dados do dashboard (Server-side)
// No futuro, esta função fará a chamada à API real
async function getDashboardData(): Promise<DashboardStats> {
  const cookieStore = cookies();
  const token = cookieStore.get('adminSessionToken')?.value;

  // Simulação de chamada à API com o token
  console.log("Server Component: Tentando buscar dados do dashboard com token:", token ? "Token Presente" : "Token Ausente");

  // if (!token) {
  //   // Idealmente, o middleware já teria redirecionado, mas é uma boa prática verificar.
  //   // Ou, se a API puder retornar dados parciais/públicos, trate aqui.
  //   // Por agora, vamos lançar um erro ou retornar dados vazios/padrão se o token for crucial.
  //   console.warn("Token de sessão não encontrado para buscar dados do dashboard.");
  //   // throw new Error("Não autorizado"); // Ou retornar um estado de erro/vazio
  // }

  // Aqui você faria a chamada fetch para, por exemplo, `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/stats`
  // Headers: { 'Authorization': `Bearer ${token}` }

  // Mock dos dados por enquanto
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay da API

  const mockData: DashboardStats = {
    totalPsicologos: 12,
    totalPacientes: 157,
    consultasHoje: 8,
    receitaMes: 2560000, // Ex: R$ 25.600,00 (em centavos)
    crescimentoMensalPercent: 15, // 15%
    previsaoProximoMes: 2800000, // Ex: R$ 28.000,00
  };

  return mockData;
}

export default async function AdminDashboardPage() {
  // Chamada direta da função de busca de dados no Server Component
  // Erros aqui podem ser capturados por error.tsx mais próximo na árvore
  const stats = await getDashboardData();

  const formatCurrency = (valueInCents: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valueInCents / 100);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">Visão geral e métricas da sua clínica.</p>
      </div>

      {/* Grid para os StatsCards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Psicólogos"
          value={stats.totalPsicologos}
          icon={Users}
          description="Psicólogos ativos na plataforma."
          colorVariant="primary"
        />
        <StatsCard
          title="Total de Pacientes"
          value={stats.totalPacientes}
          icon={BriefcaseMedical}
          description="Pacientes cadastrados."
          colorVariant="primary"
        />
        <StatsCard
          title="Consultas Hoje"
          value={stats.consultasHoje}
          icon={CalendarClock}
          description="Agendamentos confirmados para hoje."
          colorVariant="warning"
        />
        <StatsCard
          title="Receita do Mês"
          value={formatCurrency(stats.receitaMes)}
          icon={DollarSign}
          description={`${stats.crescimentoMensalPercent >= 0 ? '+' : ''}${stats.crescimentoMensalPercent}% em relação ao mês anterior`}
          footerIcon={stats.crescimentoMensalPercent >= 0 ? TrendingUp : TrendingDown}
          colorVariant={stats.crescimentoMensalPercent >= 0 ? 'success' : 'danger'}
        />
      </div>

      {/* Placeholders para Gráficos e Tabelas */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos (Últimos 7 Dias)</CardTitle>
            <CardDescription>Visualização do volume de agendamentos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Gráfico de Agendamentos (Recharts) - Em breve</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações importantes no sistema.</CardDescription>
          </CardHeader>
          <CardContent>
          <div className="h-[300px] w-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Tabela de Atividades - Em breve</p>
            </div>
          </CardContent>
        </Card>
      </div>
       <StatsCard // Exemplo de como usar o footerText
          title="Previsão Próximo Mês"
          value={formatCurrency(stats.previsaoProximoMes)}
          icon={DollarSign}
          footerText="Baseado em tendências atuais"
          colorVariant="default"
        />
    </div>
  );
}
