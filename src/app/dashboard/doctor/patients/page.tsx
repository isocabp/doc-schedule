// src/app/dashboard/doctor/patients/page.tsx
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Sidebar from "../availability/_components/sidebar";

interface Patient {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export default async function DoctorPatientsPage() {
  const user = await getUserFromToken();

  if (!user || user.role !== "DOCTOR") {
    return notFound();
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId: user.id,
    },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  const uniquePatientsMap = new Map<string, Patient>();
  for (const appointment of appointments) {
    if (appointment.patient) {
      uniquePatientsMap.set(appointment.patient.id, appointment.patient);
    }
  }

  const uniquePatients = Array.from(uniquePatientsMap.values());

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 bg-muted/40 p-8 space-y-6">
        <h1 className="text-2xl font-semibold">Meus Pacientes</h1>

        {uniquePatients.length === 0 ? (
          <p className="text-muted-foreground">Nenhum paciente ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {uniquePatients.map((patient) => (
              <Link
                key={patient.id}
                href={`/dashboard/doctor/patients/${patient.id}`}
              >
                <Card className="p-4 hover:bg-muted transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={patient.image || ""} />
                      <AvatarFallback>
                        {patient.name?.[0].toUpperCase() ?? "P"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {patient.email}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
