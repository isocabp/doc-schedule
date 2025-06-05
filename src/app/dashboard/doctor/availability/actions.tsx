"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAvailability({
  doctorId,
  weekday,
  startTime,
  endTime,
}: {
  doctorId: string;
  weekday: number;
  startTime: string;
  endTime: string;
}) {
  await prisma.availability.create({
    data: { doctorId, weekday, startTime, endTime },
  });

  revalidatePath("/dashboard/doctor/availability");
}

export async function deleteAvailability(id: string) {
  await prisma.availability.delete({
    where: { id },
  });

  revalidatePath("/dashboard/doctor/availability");
}

export async function updateAvailability({
  id,
  weekday,
  startTime,
  endTime,
}: {
  id: string;
  weekday: number;
  startTime: string;
  endTime: string;
}) {
  await prisma.availability.update({
    where: { id },
    data: { weekday, startTime, endTime },
  });

  revalidatePath("/dashboard/doctor/availability");
}
