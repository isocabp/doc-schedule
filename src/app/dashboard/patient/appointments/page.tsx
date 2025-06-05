import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { notFound } from "next/navigation";

export default async function AppointmentsPage() {
  const user = await getUserFromToken();

  if (!user || user.role !== "PATIENT") {
    return notFound();
  }

  const appointments = await prisma.appointment.findMany({
    where: { patientId: user.id },
    include: {
      doctor: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">Suas Consultas</h1>

      {appointments.length === 0 ? (
        <p>Você não possui consultas agendadas.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <CardTitle>Dr. {appointment.doctor.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>Especialidade:</strong>{" "}
                  {appointment.doctor.specialty || "Não informado"}
                </p>
                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(appointment.date).toLocaleString("pt-BR")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
