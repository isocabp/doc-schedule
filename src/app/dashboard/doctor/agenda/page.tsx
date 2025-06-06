import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CalendarView from "../availability/_components/calendar-view";
import AvailabilityForm from "../availability/_components/availability-form";
import AvailabilityList from "../availability/_components/availability-list";
import Sidebar from "../availability/_components/sidebar";

export default async function DoctorAgendaPage() {
  const user = await getUserFromToken();

  if (!user || user.role !== "DOCTOR") return notFound();

  const appointments = await prisma.appointment.findMany({
    where: { doctorId: user.id },
    include: {
      patient: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  const availabilities = await prisma.availability.findMany({
    where: { doctorId: user.id },
    orderBy: { weekday: "asc" },
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 bg-muted/40 p-8 space-y-6">
        <h1 className="text-2xl font-semibold">
          Olá, Dr. {user.name?.split(" ")[0] || "Médico"}
        </h1>

        <div className="space-y-4">
          <h2 className="text-xl font-medium">Agenda</h2>
          <CalendarView appointments={appointments} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium">Minhas Disponibilidades</h2>
          <AvailabilityForm doctorId={user.id} />
          <AvailabilityList items={availabilities} />
        </div>
      </div>
    </div>
  );
}
