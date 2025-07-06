import React from 'react';
import { cookies } from 'next/headers';
import StatsCard from '@/components/admin/StatsCard';
import { Users, BriefcaseMedical, CalendarClock, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface DashboardStats {
  totalPsicologos: number;
  totalPacientes: number;
  consultasHoje: number;
  receitaMes: number;
  crescimentoMensalPercent: number;
  previsaoProximoMes: number;
}

async function getDashboardData(): Promise<DashboardStats> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const mockData: DashboardStats = {
    totalPsicologos: 12,
    totalPacientes: 157,
    consultasHoje: 8,
    receitaMes: 2560000,
    crescimentoMensalPercent: 15,
    previsaoProximoMes: 2800000,
  };

  return mockData;
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardData();

  const formatCurrency = (valueInCents: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valueInCents / 100);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">Visão geral e métricas da sua clínica.</p>
      </div>

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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos (Últimos 7 Dias)</CardTitle>
            <CardDescription>Visualização do volume de agendamentos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-muted rounded flex items-center justify-center">
              <p className="text-muted-foreground">Gráfico de Agendamentos - Em breve</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações importantes no sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-muted rounded flex items-center justify-center">
              <p className="text-muted-foreground">Tabela de Atividades - Em breve</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <StatsCard
          title="Previsão Próximo Mês"
          value={formatCurrency(stats.previsaoProximoMes)}
          icon={DollarSign}
          footerText="Baseado em tendências atuais"
          colorVariant="default"
        />
      </div>
    </div>
  );
}
