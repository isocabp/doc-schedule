// src/app/dashboard/doctor/patients/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { notFound } from "next/navigation";
import Sidebar from "../../availability/_components/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import PatientNotes from "./PatientNotes"; // importa o bloco de notas

interface PatientDetailsPageProps {
  params: {
    id: string;
  };
}

interface Appointment {
  id: string;
  date: string;
  isFirstAppointment: boolean;
  notes: string | null;
  createdAt: string;
}

export default async function PatientDetailsPage({
  params,
}: PatientDetailsPageProps) {
  const user = await getUserFromToken();

  if (!user || user.role !== "DOCTOR") {
    return notFound();
  }

  const patient = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
    },
  });

  if (!patient) {
    return notFound();
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId: user.id,
      patientId: params.id,
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

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-muted/40 p-8 space-y-6">
        <div className="mb-2">
          <a
            href="/dashboard/doctor/patients"
            className="inline-flex items-center text-sm text-indigo-600 hover:underline"
          >
            ← Voltar para pacientes
          </a>
        </div>
        <h1 className="text-2xl font-semibold">Detalhes do Paciente</h1>

        <Card className="p-4 flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={patient.image || ""} />
            <AvatarFallback>
              {patient.name?.[0]?.toUpperCase() ?? "P"}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="text-xl font-medium">{patient.name}</p>
            <p className="text-sm text-muted-foreground">{patient.email}</p>
            {patient.phone && (
              <p className="text-sm text-muted-foreground">{patient.phone}</p>
            )}
          </div>
        </Card>

        <section className="space-y-2">
          <h2 className="text-xl font-medium">Histórico de Consultas</h2>

          {appointments.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma consulta ainda.</p>
          ) : (
            <ul className="space-y-2">
              {appointments.map((appt: Appointment) => (
                <li key={appt.id} className="border rounded p-3">
                  <p className="font-medium">
                    {new Date(appt.date).toLocaleDateString("pt-BR")} -{" "}
                    {appt.isFirstAppointment
                      ? "Primeira consulta"
                      : "Consulta de retorno"}
                  </p>
                  {appt.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Notas: {appt.notes}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* aqui o bloco de notas */}
        <PatientNotes patientId={params.id} />
      </main>
    </div>
  );
}
