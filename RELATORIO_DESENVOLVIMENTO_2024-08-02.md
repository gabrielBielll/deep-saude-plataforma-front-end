# Relatório de Desenvolvimento do Projeto AgendaWise

**Data:** 2024-08-02 (Nota: A data será atualizada para a data da última interação relevante, se diferente)

**Desenvolvedores Envolvidos:** Usuário, App Prototyper (IA)

## 1. Visão Geral do Projeto

O projeto "AgendaWise" é uma aplicação web destinada a psicólogos, com o objetivo de auxiliar no gerenciamento de suas agendas, perfis de pacientes, notas de sessão e integração com o Google Calendar. A aplicação utiliza Next.js, React, ShadCN UI, Tailwind CSS e Genkit para funcionalidades de IA, com deploy na plataforma Render.

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
*   **Genkit:** Toolkit para funcionalidades de IA.
*   **TypeScript:** Superset do JavaScript para tipagem estática.
*   **NextAuth.js:** Para autenticação, especificamente com o Google Provider.
*   **Render:** Plataforma de deploy.

## 4. Desenvolvimento e Desafios

### 4.1. Estrutura de Arquivos e Componentes Iniciais
(Conteúdo anterior mantido)

### 4.2. Implementação da Autenticação com NextAuth.js e Google Provider (Desenvolvimento Local)
(Conteúdo anterior sobre configuração inicial, variáveis de ambiente locais, desafios de sintaxe e erro "Failed to fetch" local mantido)

### 4.3. Fluxo de Autenticação na Página de Login (`src/app/page.tsx`)
(Conteúdo anterior mantido)

### 4.4. Diagnóstico e Solução de Problemas de Autenticação (Render & Google Cloud)

Após o deploy inicial no Render, a autenticação com Google não funcionou, levando a uma investigação detalhada:

1.  **Adição de Logs para Depuração:**
    *   Para verificar se as rotas de API do NextAuth estavam sendo alcançadas no ambiente do Render, foram adicionados `console.log` statements no arquivo `src/app/api/auth/[...nextauth]/route.ts`. Inicialmente, logs foram adicionados no nível do módulo para verificar as variáveis de ambiente e, posteriormente, dentro dos próprios manipuladores `GET` e `POST` para confirmar sua execução.

2.  **Análise da Aba "Network" do Navegador:**
    *   A análise das ferramentas de desenvolvedor do navegador foi crucial. Durante a tentativa de login, foi identificado que o Google retornava um erro antes mesmo da requisição chegar significativamente ao backend da aplicação no Render.

3.  **Erro `redirect_uri_mismatch`:**
    *   **Identificação:** A aba "Network" mostrou que o Google estava bloqueando o fluxo de OAuth 2.0 devido a uma URI de redirecionamento não autorizada. A URI que a aplicação estava tentando usar era `https://deep-ngrv.onrender.com/api/auth/callback/google`.
    *   **Solução:** No Google Cloud Console, nas configurações do Cliente OAuth 2.0, foi necessário adicionar `https://deep-ngrv.onrender.com/api/auth/callback/google` à lista de "URIs de redirecionamento autorizadas".

4.  **Erro `access_denied`:**
    *   **Identificação:** Após corrigir o `redirect_uri_mismatch`, um novo erro surgiu: `access_denied`. A mensagem indicava que o aplicativo estava em teste e o usuário não tinha permissão.
    *   **Solução:** No Google Cloud Console, na "Tela de consentimento OAuth", como o aplicativo estava configurado com "Status da publicação: Em teste", foi necessário adicionar o e-mail do usuário (que estava tentando logar) à lista de "Usuários de teste".

5.  **Confirmação do Funcionamento:**
    *   Após essas configurações no Google Cloud Console, o fluxo de autenticação com Google começou a funcionar corretamente no ambiente do Render. Os logs adicionados anteriormente no `route.ts` puderam ser observados (ou teriam sido, se o erro não ocorresse antes no fluxo do Google), confirmando que a aplicação recebia o callback do Google.

## 5. Estado Atual (Data da última atualização do relatório)

*   **Autenticação Funcional:** O login com Google via NextAuth.js está funcionando corretamente no ambiente de deploy do Render (`https://deep-ngrv.onrender.com`). As configurações no Google Cloud Console para URIs de redirecionamento e usuários de teste foram aplicadas com sucesso.
*   As variáveis de ambiente no Render para `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_URL` (apontando para a URL de produção no Render) e `NEXTAUTH_SECRET` estão configuradas.
*   Os logs de depuração adicionados em `src/app/api/auth/[...nextauth]/route.ts` foram úteis para o processo de diagnóstico.

## 6. Próximos Passos Sugeridos

Com a autenticação funcional, os próximos passos podem se concentrar nas funcionalidades principais do AgendaWise:

1.  **Integração com Google Calendar:**
    *   Implementar a lógica para buscar eventos do calendário do usuário autenticado.
    *   Desenvolver a funcionalidade para criar/editar/excluir eventos no Google Calendar através da aplicação.
    *   Garantir que os tokens de acesso e refresh do OAuth sejam gerenciados corretamente para manter a sincronização.
2.  **Desenvolvimento do CRUD de Pacientes:**
    *   Definir o modelo de dados para os pacientes.
    *   Implementar a interface e a lógica para criar, visualizar, editar e excluir perfis de pacientes.
    *   Decidir e implementar a solução de banco de dados (ex: Firestore, Supabase, NeonDB via Prisma, etc.).
3.  **Funcionalidades de Notas de Sessão e Upload de Documentos:**
    *   Desenvolver a interface para criação e gerenciamento de notas de sessão.
    *   Integrar com o Google Cloud Storage para upload seguro de documentos e armazenamento de notas.
4.  **Refinamento da Interface e Experiência do Usuário:**
    *   Continuar aprimorando a UI com base nas diretrizes de estilo.
    *   Revisar a questão da fonte 'Safira March' vs 'Montserrat'.
5.  **Considerar Processo de Verificação do Google App:**
    *   Se o aplicativo for destinado ao público geral, iniciar o processo de preparação para a verificação do Google App para movê-lo do status "Em teste" para "Em produção" na tela de consentimento OAuth.

Este relatório visa fornecer um contexto abrangente do desenvolvimento do projeto AgendaWise até a data presente, com foco nos desafios encontrados e nas soluções tentadas, especialmente em relação à autenticação.
