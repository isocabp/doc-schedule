"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";
import { CalendarCheck, LogOut, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteCookie } from "cookies-next";

export default function PatientDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie("token");
    deleteCookie("role");

    toast.success("Logout realizado com sucesso.");

    router.push("/auth/login");
  };
  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-neutral-800">
          Dashboard do Paciente
        </h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </header>

      {/* Card */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Consultar Médicos */}
        <Card
          onClick={() => router.push("/dashboard/patient/doctors")}
          className="cursor-pointer hover:shadow-lg transition"
        >
          <CardHeader className="flex flex-row items-center gap-4">
            <Stethoscope className="w-6 h-6 text-primary" />
            <CardTitle>Consultar Médicos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-600">
              Encontre médicos disponíveis e agende sua consulta.
            </p>
          </CardContent>
        </Card>

        {/* Suas Consultas */}
        <Card
          onClick={() => router.push("/dashboard/patient/appointments")}
          className="cursor-pointer hover:shadow-lg transition"
        >
          <CardHeader className="flex flex-row items-center gap-4">
            <CalendarCheck className="w-6 h-6 text-primary" />
            <CardTitle>Suas Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-600">
              Acompanhe suas consultas já agendadas, veja detalhes e status.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
