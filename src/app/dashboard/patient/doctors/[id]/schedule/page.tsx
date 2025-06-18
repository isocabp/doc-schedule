import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Sidebar from "@/app/dashboard/patient/_components/sidebar"; // ajusta o path se precisar
import { ClientScheduleForm } from "./ClientScheduleForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
      role: true,
    },
  });

  if (!doctor || doctor.role !== "DOCTOR") {
    return notFound();
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-muted/40 p-8 flex justify-center">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8 space-y-6">
          <Link href="/dashboard/patient/doctors">
            <Button variant="outline" className="mb-4 flex items-center">
              <ArrowLeft className="mr-2 w-4 h-4" /> Voltar para Médicos
            </Button>
          </Link>

          <ClientScheduleForm doctorId={doctor.id} doctorName={doctor.name} />
        </div>
      </main>
    </div>
  );
}
