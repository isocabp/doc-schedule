import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getUserFromToken();

  if (!user) {
    return new NextResponse("Usuário não autenticado", { status: 401 });
  }

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      specialty: true,
      healthPlans: true,
      role: true,
    },
  });

  if (!fullUser) {
    return new NextResponse("Usuário não encontrado", { status: 404 });
  }

  return NextResponse.json(fullUser);
}
