"use client"; // Necessário para useState e useEffect

import * as React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils"; // Precisamos importar o 'cn'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex"
      />

      {/* ===== LINHA CORRIGIDA ABAIXO ===== */}
      <div
        className={cn(
          "flex flex-col sm:gap-4 sm:py-4 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "md:ml-14" : "md:ml-64" // Esta é a forma correta
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
