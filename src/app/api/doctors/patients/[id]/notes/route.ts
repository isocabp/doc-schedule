import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const doctor = await getUserFromToken();

  if (!doctor || doctor.role !== "DOCTOR") {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  const patientId = params.id;

  const patientNote = await prisma.patientNote.findFirst({
    where: {
      doctorId: doctor.id,
      patientId,
    },
  });

  return NextResponse.json({ content: patientNote?.content || "" });
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const doctor = await getUserFromToken();

  if (!doctor || doctor.role !== "DOCTOR") {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  const patientId = params.id;
  const { content } = await req.json();

  if (typeof content !== "string") {
    return new NextResponse("Conteúdo inválido", { status: 400 });
  }

  const existingNote = await prisma.patientNote.findFirst({
    where: {
      doctorId: doctor.id,
      patientId,
    },
  });

  if (existingNote) {
    // atualiza
    await prisma.patientNote.update({
      where: { id: existingNote.id },
      data: { content },
    });
  } else {
    // cria nova
    await prisma.patientNote.create({
      data: {
        doctorId: doctor.id,
        patientId,
        content,
      },
    });
  }

  return NextResponse.json({ message: "Notas salvas com sucesso!" });
}
