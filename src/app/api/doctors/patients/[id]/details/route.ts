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

  // busca dados do paciente
  const patient = await prisma.user.findUnique({
    where: { id: patientId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
    },
  });

  if (!patient) {
    return new NextResponse("Paciente não encontrado", { status: 404 });
  }

  // histórico de consultas desse paciente com esse médico
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
      patientId,
    },
    orderBy: {
      date: "desc",
    },
    select: {
      id: true,
      date: true,
      isFirstAppointment: true,
      notes: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    patient,
    appointments,
    // futuramente: notes (tipo anotações extras do médico)
  });
}
