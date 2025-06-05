"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";
import { Stethoscope, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DoctorDashboard() {
  const router = useRouter();

  const doctors = [];
  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard Médico</h1>
        <Button>Sair</Button>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Agenda de Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aqui você verá suas consultas marcadas.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perfis dos Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Veja informações dos seus pacientes e adicione observações.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
