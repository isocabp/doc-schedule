"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function scheduleAppointment(formData: FormData) {
  const session = await getUserFromToken();
  if (!session) return;

  const date = formData.get("date") as string;
  const doctorId = formData.get("doctorId") as string;
  const isFirstAppointment = formData.get("isFirst") === "yes";

  await prisma.appointment.create({
    data: {
      date: new Date(date),
      doctorId,
      patientId: session.id,
      isFirstAppointment,
    },
  });

  revalidatePath("/dashboard/patient/appointments");
  redirect("/dashboard/patient/appointments");
}
