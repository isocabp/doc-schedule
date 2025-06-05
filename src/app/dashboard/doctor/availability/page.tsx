import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Availability } from "@prisma/client";

import AvailabilityForm from "./_components/availability-form";
import AvailabilityList from "./_components/availability-list";
import Sidebar from "./_components/sidebar";

export default async function AvailabilityPage() {
  const user = await getUserFromToken();

  if (!user || user.role !== "DOCTOR") return notFound();

  const availabilities: Availability[] = await prisma.availability.findMany({
    where: { doctorId: user.id },
    orderBy: { weekday: "asc" },
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-neutral-50 p-6">
        <h1 className="text-2xl font-semibold mb-6">Minha Disponibilidade</h1>

        <div className="max-w-3xl space-y-6">
          <AvailabilityForm doctorId={user.id} />
          <AvailabilityList items={availabilities} />
        </div>
      </main>
    </div>
  );
}
