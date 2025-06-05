"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface Doctor {
  id: string;
  name: string;
  email: string;
  image: string | null;
  specialty: string | null;
}

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        setDoctors(data);
      } catch (error) {
        console.error("Erro ao buscar médicos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/patient")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Médicos Disponíveis</h1>
        </div>
      </header>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <Link href={`/dashboard/patient/doctors/${doctor.id}`}>
              <Card
                key={doctor.id}
                className="hover:shadow-lg cursor-pointer transition"
                onClick={() =>
                  router.push(`/dashboard/patient/doctors/${doctor.id}`)
                }
              >
                <CardHeader className="flex items-center gap-4">
                  <img
                    src={doctor.image || "/default-avatar.png"}
                    alt={doctor.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-center">{doctor.name}</CardTitle>
                    <p className="text-sm text-center text-neutral-500">
                      {doctor.specialty || "Especialidade não informada"}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 text-center">
                    Clique para ver mais detalhes e agendar uma consulta.
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
