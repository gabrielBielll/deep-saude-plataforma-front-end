import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Este nome de cookie deve ser o mesmo usado na Server Action de login
const ADMIN_SESSION_COOKIE_NAME = 'adminSessionToken';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Tenta obter o cookie de sessão do administrador
  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  // Rotas públicas do admin (não protegidas)
  const isAdminPublicPath = pathname === '/admin/login';

  // Se o usuário está tentando acessar uma rota de admin protegida
  if (pathname.startsWith('/admin/') && !isAdminPublicPath) {
    if (!sessionToken) {
      // Se não há token e a rota é protegida, redireciona para o login
      // Mantém os searchParams (ex: ?redirect=/admin/alguma-coisa) se houver
      const loginUrl = new URL('/admin/login', request.url);
      if (pathname !== '/admin/dashboard') { // Evita redirect para si mesmo se dashboard for o default
        // loginUrl.searchParams.set('redirect', pathname); // Opcional: adicionar para onde redirecionar após login
      }
      return NextResponse.redirect(loginUrl);
    }
    // Se há um token, permite o acesso à rota protegida.
    // Validação mais robusta do token (ex: JWT verify) seria feita
    // nas Server Actions ou Route Handlers que acessam dados sensíveis.
    // O middleware aqui apenas garante que "algo" que se parece com uma sessão existe.
  }

  // Se o usuário está autenticado (tem token) e tenta acessar a página de login
  if (sessionToken && isAdminPublicPath) {
    // Redireciona para o dashboard
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Permite que a requisição continue se nenhuma das condições acima for atendida
  return NextResponse.next();
}

// Configuração do matcher para o middleware
export const config = {
  matcher: [
    /*
     * Corresponde a todas as rotas exceto por:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagem)
     * - favicon.ico (arquivo favicon)
     * - / (página inicial, se você não quiser que o admin middleware afete ela)
     *
     * Este matcher é genérico. Para focar apenas nas rotas /admin e /admin/login:
     */
     '/admin/:path*', // Todas as sub-rotas de /admin
     // '/admin/login', // Incluído no acima, mas a lógica lida com ele
  ],
};
