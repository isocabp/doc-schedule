"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function scheduleAppointment(formData: FormData) {
  const session = await getUserFromToken();
  if (!session) return { error: "Usuário não autenticado" };

  const dateStr = formData.get("date") as string;
  const timeStr = formData.get("time") as string; // "09:00"
  const doctorId = formData.get("doctorId") as string;
  const isFirstAppointment = formData.get("isFirst") === "yes";

  if (!dateStr || !timeStr || !doctorId) {
    return { error: "Dados incompletos para agendamento" };
  }

  const [year, month, day] = dateStr.split("-");
  const [hour, minute] = timeStr.split(":");
  const appointmentDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  );

  // Verificar se já existe agendamento para o médico naquela data e hora
  const existing = await prisma.appointment.findFirst({
    where: {
      doctorId,
      date: appointmentDate,
    },
  });

  if (existing) {
    return { error: "Horário já está ocupado. Escolha outro horário." };
  }

  await prisma.appointment.create({
    data: {
      date: appointmentDate,
      doctorId,
      patientId: session.id,
      isFirstAppointment,
    },
  });

  revalidatePath("/dashboard/patient/appointments");

  return { success: true };
}
