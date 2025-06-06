import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { scheduleAppointment } from "@/app/actions/schedule-appointment";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Label,
  Input,
} from "@/components/ui";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Sidebar from "../../../_components/sidebar";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SelectDateTime from "@/components/SelectDateTime";

interface SchedulePageProps {
  params: {
    id: string;
  };
}

export default async function SchedulePage({ params }: SchedulePageProps) {
  const doctor = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      image: true,
      role: true,
    },
  });

  if (!doctor || doctor.role !== "DOCTOR") {
    return notFound();
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
            <form action={scheduleAppointment} className="space-y-4">
              <div className="space-y-2">
                <SelectDateTime />
              </div>

              <div className="space-y-2">
                <Label>É sua primeira consulta com esse médico?</Label>
                <select
                  name="isFirst"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">Selecione</option>
                  <option value="yes">Sim</option>
                  <option value="no">Não</option>
                </select>
              </div>

              {/* campo oculto com id do médico */}
              <input type="hidden" name="doctorId" value={params.id} />

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
