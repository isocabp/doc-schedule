import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Sidebar from "../../_components/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";

interface DoctorPageProps {
  params: {
    id: string;
  };
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const doctor = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      specialty: true,
      healthPlans: true,
      role: true,
    },
  });

  if (!doctor || doctor.role !== "DOCTOR") {
    return notFound();
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 bg-neutral-50">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Botão Voltar */}
          <Link href="/dashboard/patient/doctors">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para a lista
            </Button>
          </Link>

          {/* Card do Médico */}
          <Card className="shadow-md">
            <CardHeader className="flex items-center gap-6">
              <img
                src={doctor.image || "/default-avatar.png"}
                alt={doctor.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <CardTitle className="text-xl text-center">
                  {doctor.name}
                </CardTitle>
                <p className="text-sm text-neutral-600 text-center">
                  {doctor.specialty || "Especialidade não informada"}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p>
                <strong>Planos aceitos:</strong>{" "}
                {doctor.healthPlans?.length > 0
                  ? doctor.healthPlans.join(", ")
                  : "Nenhum plano informado"}
              </p>

              <Link href={`/dashboard/patient/doctors/${doctor.id}/schedule`}>
                <Button className="w-[60%] mt-6">Agendar Consulta</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
