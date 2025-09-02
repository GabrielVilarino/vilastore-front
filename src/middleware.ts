// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  // Pegando cookies
  const usuario = req.cookies.get("usuario")?.value
  const senha = req.cookies.get("senha")?.value

  // Caminho atual
  const { pathname } = req.nextUrl

  // Se não estiver logado e tentar acessar algo diferente de /login → redireciona
  if (pathname !== "/") {
    if (usuario !== "admin" || senha !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Se já estiver logado e tentar acessar /login → manda para dashboard
  if (pathname === "/" && usuario === "admin" && senha === "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

// Define onde o middleware roda
export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/estoque",
    "/estoque/:path*",
    "/controle",
    "/controle/:path*",
    "/" // também intercepta login
  ],
}