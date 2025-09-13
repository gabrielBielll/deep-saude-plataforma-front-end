"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { Loader2, ServerCrash } from "lucide-react"; // Ícones para o estado de loading e erro

// Componente para a tela de carregamento e erro
const BackendWakeUpScreen = ({ status }: { status: 'checking' | 'error' }) => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-muted/40 p-4 text-center">
    {status === 'checking' && (
      <>
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold text-foreground">Conectando ao servidor...</h2>
        <p className="text-muted-foreground">Isso pode levar alguns segundos se o serviço estiver inativo.</p>
      </>
    )}
    {status === 'error' && (
      <>
        <ServerCrash className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold text-destructive">Falha ao conectar com o servidor</h2>
        <p className="text-muted-foreground">Não foi possível estabelecer comunicação com a API. Por favor, tente novamente mais tarde.</p>
      </>
    )}
  </div>
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Estado para controlar o status da conexão com o backend
  const [backendStatus, setBackendStatus] = useState<'checking' | 'awake' | 'error'>('checking');
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  // Efeito para "acordar" o backend quando o layout é montado
  useEffect(() => {
    const wakeUpBackend = async () => {
      // Linha de debug para verificar a variável de ambiente no console do navegador
      console.log("API URL A SER USADA:", process.env.NEXT_PUBLIC_API_URL);
      
      try {
        // Verifica se a URL da API está definida
        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error("A variável de ambiente NEXT_PUBLIC_API_URL não está configurada.");
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/health`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`O servidor respondeu com status: ${response.status}`);
        }
        
        // Se a resposta for OK, o backend está acordado
        setBackendStatus('awake');

      } catch (error) {
        console.error("Falha ao 'acordar' o backend:", error);
        setBackendStatus('error');
      }
    };
    
    // Chama a função de "acordar"
    wakeUpBackend();
  }, []); // O array vazio [] garante que isso execute apenas uma vez quando o componente montar

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Renderiza a tela de carregamento/erro enquanto o backend não está 'awake'
  if (backendStatus !== 'awake') {
    return <BackendWakeUpScreen status={backendStatus} />;
  }

  // Se o backend estiver acordado, renderiza o layout normal da aplicação
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex"
      />
      <div
        className={cn(
          "flex flex-col sm:gap-4 sm:py-4 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "md:ml-14" : "md:ml-64"
        )}
      >
        <AdminHeader />
        <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-14 md:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
