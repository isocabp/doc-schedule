import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export default async function AppointmentsPage() {
  const user = await getUserFromToken();

  if (!user) return notFound();

  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: user.id,
    },
    include: {
      doctor: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Botão Voltar */}
        <Link href="/dashboard/patient">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <h1 className="text-2xl font-semibold">Minhas Consultas</h1>

        {appointments.length === 0 ? (
          <p className="text-neutral-600">Você não tem consultas agendadas.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <CardTitle>{appointment.doctor.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Data:</strong>{" "}
                    {dayjs(appointment.date).format("DD/MM/YYYY")}
                  </p>
                  <p>
                    <strong>Horário:</strong>{" "}
                    {dayjs(appointment.date).format("HH:mm")}
                  </p>
                  <p>
                    <strong>Especialidade:</strong>{" "}
                    {appointment.doctor.specialty ||
                      "Especialidade não informada"}
                  </p>
                  <p>
                    <strong>Plano:</strong>{" "}
                    {appointment.doctor.healthPlans.join(", ")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
