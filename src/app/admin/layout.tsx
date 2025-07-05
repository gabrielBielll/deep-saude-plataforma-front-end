"use client"; // Necessário para useState e useEffect (para o ThemeProvider e interatividade)

import * as React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
// ThemeProvider foi movido para o layout raiz (src/app/layout.tsx)

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Estado para controlar se a sidebar desktop está colapsada.
  // Poderia ser persistido no localStorage ou em um estado global se necessário.
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  // Função para alternar o estado da sidebar desktop.
  // Esta função pode ser passada para um botão no AdminHeader ou AdminSidebar se necessário.
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // O ThemeProvider precisa envolver o conteúdo que usará o tema.
  // Se você já tem um ThemeProvider no layout root (src/app/layout.tsx),
  // verifique se ele está configurado corretamente para aninhamento ou se precisa ser movido/duplicado.
  // Para este exemplo, estou adicionando um aqui, assumindo que este é o principal local para o tema do admin.
  // Se já existir um no layout root, este pode não ser necessário ou pode precisar de configuração diferente.

  return (
    // ThemeProvider foi movido para o layout raiz (src/app/layout.tsx)
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Sidebar para Desktop - renderizada condicionalmente ou sempre presente e estilizada */}
      {/* Sidebar para Desktop */}
        {/* A sidebar em si é renderizada, e seu estilo interno muda se isCollapsed=true */}
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex" // Garante que ela fique fixa e visível no desktop
        />

        {/* Conteúdo principal à direita da sidebar */}
        <div
          className={`flex flex-col sm:gap-4 sm:py-4 transition-all duration-300 ease-in-out md:ml-${isSidebarCollapsed ? '14' : '64'}`}
        >
          {/* Passando a função de toggle e o estado para o Header, para que ele possa ter o botão de colapso */}
          <AdminHeader
            // onToggleDesktopSidebar={toggleSidebar}
            // isDesktopSidebarCollapsed={isSidebarCollapsed}
          />

          <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-14 md:mt-0"> {/* mt-14 para compensar header fixo em mobile, md:mt-0 desktop */}
            {children}
          </main>
        </div>
    </div>
  );
}
