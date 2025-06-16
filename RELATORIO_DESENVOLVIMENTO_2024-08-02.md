# Relatório de Desenvolvimento do Projeto AgendaWise

**Data:** 2024-08-02

**Desenvolvedores Envolvidos:** Usuário, App Prototyper (IA)

## 1. Visão Geral do Projeto

O projeto "AgendaWise" é uma aplicação web destinada a psicólogos, com o objetivo de auxiliar no gerenciamento de suas agendas, perfis de pacientes, notas de sessão e integração com o Google Calendar. A aplicação utiliza Next.js, React, ShadCN UI, Tailwind CSS e Genkit para funcionalidades de IA.

## 2. Requisitos Principais (PRD)

### 2.1. Funcionalidades Centrais:

*   **Sincronização com Google Calendar:** Login seguro via OAuth 2.0 para acessar e gerenciar eventos do calendário.
*   **Perfis de Pacientes:** Criação e organização de perfis de pacientes de forma confidencial.
*   **Gerenciamento de Consultas:** Agendamento, gerenciamento e visualização de consultas, sincronizadas com o Google Calendar.
*   **Upload de Documentos:** Anexar documentos aos perfis dos pacientes, com upload para o Google Cloud Storage via URLs assinadas.
*   **Notas de Sessão:** Armazenamento seguro de notas de sessão no Google Cloud Storage.
*   **Analisador de Notas com IA (AI Note Analyzer):** Ferramenta Genkit para sugerir palavras-chave, temas e insights a partir das notas de sessão.
*   **Filtro e Exportação de Notas:** Filtrar e exportar notas em formato .txt ou .pdf.

### 2.2. Diretrizes de Estilo:

*   **Cores:**
    *   Primária: `--sage-green` (#95A084)
    *   Secundária: `--warm-beige` (#C4A584)
    *   Fundo: `--cream` (#F5F0E8)
    *   Borda/Linhas: `--light-gray` (#D3D3D3)
    *   Texto Principal: `--charcoal` (#4A4A4A)
    *   Destaque: `--terracotta` (#D2845A)
    *   Texto Secundário: `--charcoal` (opacidade reduzida)
*   **Fontes:**
    *   Título: 'Playfair Display'
    *   Corpo: 'Safira March' (Nota: Houve uma mudança para 'Montserrat' nos arquivos de layout, o que pode precisar de revisão/confirmação)
*   **Ícones:** Minimalistas, elegantes, com temas de natureza/tranquilidade (lucide-react).
*   **Layout:** Limpo, organizado, com uso de espaços em branco.
*   **Animações:** Sutis e suaves.

## 3. Configuração Inicial e Stack Tecnológica

O projeto foi iniciado com:

*   **Next.js:** Framework React para desenvolvimento full-stack.
*   **React:** Biblioteca para construção de interfaces de usuário.
*   **ShadCN UI:** Coleção de componentes de UI reutilizáveis.
*   **Tailwind CSS:** Framework CSS utility-first.
*   **Genkit:** Toolkit para funcionalidades de IA (inicialmente para o "AI Note Analyzer").
*   **TypeScript:** Superset do JavaScript para tipagem estática.
*   **NextAuth.js:** Para autenticação, especificamente com o Google Provider.

## 4. Desenvolvimento e Desafios

### 4.1. Estrutura de Arquivos e Componentes Iniciais

A estrutura base do Next.js com a App Router foi utilizada. Diversos componentes de UI e páginas foram criados ou já existiam no template inicial, incluindo:

*   Layout da Aplicação (`AppShell`) com navegação lateral.
*   Páginas para Dashboard, Calendário, Pacientes e Configurações.
*   Funcionalidades CRUD (mockadas inicialmente) para pacientes.
*   Integração básica de um fluxo Genkit (`session-note-insights.ts`).

### 4.2. Implementação da Autenticação com NextAuth.js e Google Provider

Este foi o principal foco e desafio das interações recentes.

**Objetivo:** Permitir que os usuários façam login na aplicação usando suas contas Google.

**Passos e Iterações:**

1.  **Configuração Inicial da Rota NextAuth.js:**
    *   Criação do arquivo `src/app/api/auth/[...nextauth]/route.ts`.
    *   Adição do `GoogleProvider` do `next-auth/providers/google`.

2.  **Configuração das Variáveis de Ambiente:**
    *   Criação e modificação do arquivo `.env` para incluir:
        *   `GOOGLE_CLIENT_ID`
        *   `GOOGLE_CLIENT_SECRET`
        *   `NEXTAUTH_URL` (inicialmente `http://localhost:3000`, depois ajustado para `http://localhost:9002` conforme o script `dev` no `package.json`).
        *   `NEXTAUTH_SECRET` (geração de uma chave segura e única).

3.  **Desafios de Sintaxe e Configuração:**
    *   **Erro "Expected ident":** Ocorreu repetidamente devido a uma sintaxe incorreta ao tentar acessar as variáveis de ambiente no arquivo `route.ts`. A forma incorreta `process.env."STRING_LITERAL"` foi utilizada inicialmente em vez da correta `process.env.VARIABLE_NAME`. Foram necessárias várias iterações para corrigir e garantir que a alteração fosse aplicada.
    *   **Sobrescrita de Chaves:** Houve um momento em que a `NEXTAUTH_SECRET` configurada pelo usuário foi acidentalmente sobrescrita pela IA, o que foi corrigido.

4.  **Erro "Runtime Error: Error: Failed to fetch":** Após a correção dos erros de sintaxe, este erro de tempo de execução começou a aparecer. Ele indica que a parte cliente do NextAuth.js não conseguia se comunicar com as rotas de API do NextAuth no backend.
    *   **Causas Investigadas:**
        *   Variáveis de ambiente incorretas ou não carregadas pelo servidor.
        *   `NEXTAUTH_URL` não correspondendo à URL real da aplicação em desenvolvimento.
        *   Problemas de configuração no Google Cloud Console.

5.  **Configuração do Google Cloud Console:**
    *   Foi orientado ao usuário que configurasse corretamente no Google Cloud Console:
        *   **Origens JavaScript autorizadas:** (ex: `http://localhost:9002`).
        *   **URIs de redirecionamento autorizados:** (ex: `http://localhost:9002/api/auth/callback/google`).

6.  **Reinicialização do Servidor e Cache:**
    *   Foi discutida a importância de reiniciar o servidor de desenvolvimento após alterações no `.env` para limpar o cache e carregar as novas variáveis.
    *   Como o desenvolvimento está ocorrendo na interface web do Firebase Studio, foi esclarecido que a reinicialização é geralmente automática, mas que opções como "Rebuild" ou "Redeploy" poderiam ser úteis se disponíveis.

7.  **Confirmação das Credenciais:**
    *   O usuário confirmou ter atualizado as credenciais `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `NEXTAUTH_SECRET` com seus valores corretos.

### 4.3. Fluxo de Autenticação na Página de Login (`src/app/page.tsx`)

*   A página de login foi configurada para usar `useSession`, `signIn` e `signOut` do `next-auth/react`.
*   Um botão "Sign in with Google" foi implementado para disparar a função `signIn('google')`.
*   Lógica para redirecionar usuários autenticados para o `/dashboard`.

## 5. Estado Atual (2024-08-02)

*   Os erros de sintaxe no arquivo de rota do NextAuth.js foram, a princípio, resolvidos.
*   As variáveis de ambiente no arquivo `.env` foram configuradas com os valores fornecidos pelo usuário:
    *   `GOOGLE_CLIENT_ID="segredoaqui"`
    *   `GOOGLE_CLIENT_SECRET="segredoaqui"`
    *   `NEXTAUTH_URL="http://localhost:9002"`
    *   `NEXTAUTH_SECRET="segredoaqui"`
*   As configurações necessárias no Google Cloud Console (URIs de redirecionamento e origens JavaScript) foram, segundo o usuário, realizadas.
*   O principal desafio restante é resolver o erro "Runtime Error: Error: Failed to fetch" durante a tentativa de login, o que sugere que a comunicação entre o cliente NextAuth e o backend NextAuth ainda não está funcionando perfeitamente.

## 6. Próximos Passos Sugeridos

1.  **Verificação Detalhada da URL de Callback e Origem no Google Console:** Confirmar que não há erros de digitação ou caminhos ligeiramente diferentes (ex: `http` vs `https`).
2.  **Logs do Servidor (se acessíveis no Firebase Studio):** Verificar se há mensagens de erro mais detalhadas no lado do servidor quando a tentativa de login ocorre.
3.  **Network Tab do Navegador:** Analisar as requisições de rede durante a tentativa de login para ver qual requisição específica está falhando e qual o status/resposta.
4.  **Simplificação Temporária:** Se o problema persistir, considerar temporariamente simplificar a configuração do NextAuth (ex: remover callbacks customizados se houver) para isolar o problema.
5.  **Versão do NextAuth e Next.js:** Garantir que as versões são compatíveis e não há issues conhecidas para a combinação utilizada.

Este relatório visa fornecer um contexto abrangente do desenvolvimento do projeto AgendaWise até a data presente, com foco nos desafios encontrados e nas soluções tentadas, especialmente em relação à autenticação.
