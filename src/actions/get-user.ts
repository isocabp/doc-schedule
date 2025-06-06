"use server";

import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getUser() {
  const session = await getUserFromToken();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
    },
  });

  return user;
}
