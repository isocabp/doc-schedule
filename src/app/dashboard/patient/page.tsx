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
import Sidebar from "./_components/sidebar";

export default function PatientDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie("token");
    deleteCookie("role");

    toast.success("Logout realizado com sucesso.");

    router.push("/auth/login");
  };
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-neutral-800 mb-6">
          Bem-vindo(a) à sua Dashboard
        </h1>

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

          {/* Minhas Consultas */}
          <Card
            onClick={() => router.push("/dashboard/patient/appointments")}
            className="cursor-pointer hover:shadow-lg transition"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <CalendarCheck className="w-6 h-6 text-primary" />
              <CardTitle>Minhas Consultas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Acompanhe suas consultas já agendadas, veja detalhes e status.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
