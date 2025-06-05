import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, image, role, specialty, healthPlans } = body;

    // Verifica se já existe um usuário com esse email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado." },
        { status: 400 }
      );
    }

    // Faz hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image,
        role, // "PATIENT" ou "DOCTOR"
        specialty: role === "DOCTOR" ? specialty : null,
        healthPlans: role === "DOCTOR" ? healthPlans : [],
      },
    });

    return NextResponse.json(
      { message: "Cadastro realizado com sucesso", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return NextResponse.json(
      { error: "Erro ao cadastrar usuário" },
      { status: 500 }
    );
  }
}
