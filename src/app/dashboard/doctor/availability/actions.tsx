"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// criar disponibilidade
export async function createAvailability({
  doctorId,
  weekday,
  startTime,
  endTime,
  interval,
}: {
  doctorId: string;
  weekday: number;
  startTime: string;
  endTime: string;
  interval?: number | null;
}) {
  await prisma.availability.create({
    data: { doctorId, weekday, startTime, endTime, interval },
  });

  revalidatePath("/dashboard/doctor/availability");
}

// deletar disponibilidade
export async function deleteAvailability(id: string) {
  await prisma.availability.delete({
    where: { id },
  });

  revalidatePath("/dashboard/doctor/availability");
}

// atualizar disponibilidade
export async function updateAvailability({
  id,
  weekday,
  startTime,
  endTime,
  interval,
}: {
  id: string;
  weekday: number;
  startTime: string;
  endTime: string;
  interval?: number | null;
}) {
  await prisma.availability.update({
    where: { id },
    data: { weekday, startTime, endTime, interval },
  });

  revalidatePath("/dashboard/doctor/availability");
}
