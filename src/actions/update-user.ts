"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

interface UpdateUserProps {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  image?: string;
}

export async function updateUser(data: UpdateUserProps) {
  const session = await getUserFromToken();
  if (!session) throw new Error("Usuário não autenticado.");

  const updatePayload: any = {
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    image: data.image,
  };

  if (data.password && data.password.trim() !== "") {
    updatePayload.password = await bcrypt.hash(data.password, 10);
  }

  await prisma.user.update({
    where: { id: session.id },
    data: updatePayload,
  });
}
