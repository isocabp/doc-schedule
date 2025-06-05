import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email e senha são obrigatórios." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return NextResponse.json(
      { error: "Email ou senha inválidos." },
      { status: 401 }
    );
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return NextResponse.json(
      { error: "Email ou senha inválidos." },
      { status: 401 }
    );
  }

  // Gera o token JWT
  const token = signJwt({
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  });

  // Salva o token no cookie HttpOnly
  const response = NextResponse.json({
    message: "Login realizado com sucesso!",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    },
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });

  return response;
}
