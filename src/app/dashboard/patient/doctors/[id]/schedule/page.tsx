import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Label,
  Input,
} from "@/components/ui";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SchedulePageProps {
  params: {
    id: string;
  };
}

export default async function SchedulePage({ params }: SchedulePageProps) {
  const doctor = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!doctor || doctor.role !== "DOCTOR") {
    return notFound();
  }

  async function handleSubmit(formData: FormData) {
    "use server";

    const date = formData.get("date") as string;
    const patientId = ""; // aqui você deve capturar o paciente logado (vou te ensinar a fazer)

    await prisma.appointment.create({
      data: {
        date: new Date(date),
        patientId: patientId,
        doctorId: params.id,
      },
    });

    redirect("/dashboard/patient/appointments");
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Botão Voltar */}
        <Link href={`/dashboard/patient/doctors/${params.id}`}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Agendar Consulta com {doctor.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Selecione uma data e horário</Label>
                <Input type="datetime-local" name="date" required />
              </div>

              <Button type="submit" className="w-full">
                Confirmar Agendamento
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
