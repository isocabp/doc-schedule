// src/app/dashboard/doctor/page.tsx
import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CalendarDays, Users, Settings, LayoutDashboard } from "lucide-react";
import { formatWithOptions } from "date-fns/fp";
import { ptBR } from "date-fns/locale/pt-BR";
import Link from "next/link";
import Sidebar from "./availability/_components/sidebar";

interface Appointment {
  id: string;
  date: string;
  patient: {
    name: string;
  };
}

export default async function DoctorDashboard() {
  const user = await getUserFromToken();

  if (!user) {
    return <div>Não autorizado</div>;
  }

  const today = new Date();

  const appointmentsToday = await prisma.appointment.findMany({
    where: {
      doctorId: user.id,
      date: {
        gte: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0
        ),
        lt: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 1,
          0,
          0,
          0
        ),
      },
    },
  });

  const newPatients = await prisma.appointment.count({
    where: {
      doctorId: user.id,
      isFirstAppointment: true,
    },
  });

  const recentAppointments: Appointment[] = await prisma.appointment.findMany({
    where: { doctorId: user.id },
    include: {
      patient: true,
    },
    orderBy: { date: "desc" },
    take: 5,
  });

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 bg-neutral-50 p-8">
        <h2 className="text-2xl font-semibold mb-6">
          Olá, Dr. {user.name?.split(" ")[0]}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-2">Consultas do dia</h3>
            <p className="text-3xl font-bold">{appointmentsToday.length}</p>
            <Link
              href="/dashboard/doctor/agenda"
              className="text-blue-600 text-sm mt-2 inline-block"
            >
              Ver agenda
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-2">Pacientes novos</h3>
            <p className="text-3xl font-bold">{newPatients}</p>
            <Link
              href="/dashboard/doctor/patients"
              className="text-blue-600 text-sm mt-2 inline-block"
            >
              Ver pacientes
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">Próximas Consultas</h3>
          {recentAppointments.length === 0 && (
            <p className="text-neutral-500">Nenhuma consulta recente.</p>
          )}
          <ul className="space-y-2">
            {recentAppointments.map((appointment) => (
              <li
                key={appointment.id}
                className="flex justify-between border-b pb-2"
              >
                <span>{appointment.patient.name}</span>
                <span>
                  {formatWithOptions({ locale: ptBR })(
                    "dd/MM/yyyy 'às' HH:mm",
                    new Date(appointment.date)
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
