import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface DoctorPageProps {
  params: {
    id: string;
  };
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const doctor = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!doctor || doctor.role !== "DOCTOR") {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Botão de Voltar */}
        <Link href="/dashboard/patient/doctors">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para lista de médicos
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>{doctor.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {doctor.image && (
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-32 h-32 rounded-full object-cover"
              />
            )}
            <p>
              <strong>Especialidade:</strong> {doctor.specialty}
            </p>
            <p>
              <strong>Planos aceitos:</strong>{" "}
              {doctor.healthPlans.length > 0
                ? doctor.healthPlans.join(", ")
                : "Nenhum plano informado"}
            </p>

            <Link href={`/dashboard/patient/doctors/${params.id}/schedule`}>
              <Button className="w-full">Agendar Consulta</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
