import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const doctors = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        specialty: true,
      },
    });

    return NextResponse.json(doctors);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar médicos" },
      { status: 500 }
    );
  }
}
