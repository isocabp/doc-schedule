// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/auth";

// Rotas que requerem autenticação
const protectedRoutes = ["/dashboard", "/api/appointments", "/api/profile"];

// Rotas acessíveis apenas por médicos
const doctorOnlyRoutes = ["/dashboard/doctor", "/api/doctor"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Verifica se a rota é protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  const isDoctorRoute = doctorOnlyRoutes.some((route) =>
    path.startsWith(route)
  );

  if (!isProtectedRoute) return NextResponse.next();

  // 2. Pega o token dos cookies
  const token = request.cookies.get("token")?.value;

  // 3. Redireciona se não tiver token
  if (!token) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(path)}`, request.url)
    );
  }

  // 4. Verifica token JWT
  const decoded = verifyJwt(token);
  if (!decoded) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 5. Verifica rotas restritas a médicos
  if (isDoctorRoute && decoded.role !== "DOCTOR") {
    return NextResponse.redirect(new URL("/dashboard/patient", request.url));
  }

  // 6. Adiciona headers com dados do usuário
  const headers = new Headers(request.headers);
  headers.set("x-user-id", decoded.id);
  headers.set("x-user-role", decoded.role);

  return NextResponse.next({
    request: { headers },
  });
}
