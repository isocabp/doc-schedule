"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const doctors = [
  {
    id: "1",
    name: "Dra. Ana Beatriz",
    specialty: "Cardiologia",
    city: "São Paulo",
    photo: "/doctors/ana.jpg",
    rating: 4.9,
    plans: ["Unimed", "Bradesco", "Amil"],
  },
  {
    id: "2",
    name: "Dr. Lucas Silva",
    specialty: "Dermatologia",
    city: "Rio de Janeiro",
    photo: "/doctors/carlos.jpg",
    rating: 4.7,
    plans: ["Amil", "SulAmérica"],
  },
  {
    id: "3",
    name: "Dra. Fernanda Costa",
    specialty: "Pediatria",
    city: "São Paulo",
    photo: "/doctors/fernanda.jpg",
    rating: 4.8,
    plans: ["Unimed", "Amil"],
  },
];

const specialties = ["Cardiologia", "Dermatologia", "Pediatria"];
const cities = ["São Paulo", "Rio de Janeiro"];
const healthPlans = ["Unimed", "Bradesco", "Amil", "SulAmérica"];

export default function DoctorsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("rating");

  const filteredDoctors = doctors.filter((doc) => {
    return (
      (selectedSpecialty ? doc.specialty === selectedSpecialty : true) &&
      (selectedCity ? doc.city === selectedCity : true) &&
      (selectedPlans.length > 0
        ? selectedPlans.every((plan) => doc.plans.includes(plan))
        : true)
    );
  });
  // .sort((a, b) => {
  //   if (sortBy === "rating") {
  //     return b.rating - a.rating;
  //   }
  //   return 0;
  // });

  const handlePlanToggle = (plan: string) => {
    setSelectedPlans((prev) =>
      prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan]
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Buscar Médicos</h1>

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Especialidade */}
          <div>
            <Label>Especialidade</Label>
            <Select
              onValueChange={setSelectedSpecialty}
              value={selectedSpecialty}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cidade */}
          {cities.length > 1 && (
            <div>
              <Label>Cidade</Label>
              <Select onValueChange={setSelectedCity} value={selectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Plano de Saúde */}
          <div>
            <Label>Planos de Saúde</Label>
            <div className="flex flex-col gap-2 border rounded-md p-2">
              {healthPlans.map((plan) => (
                <div key={plan} className="flex items-center space-x-2">
                  <Checkbox
                    id={plan}
                    checked={selectedPlans.includes(plan)}
                    onCheckedChange={() => handlePlanToggle(plan)}
                  />
                  <Label htmlFor={plan} className="cursor-pointer">
                    {plan}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de Médicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <CardTitle className="mt-4">{doctor.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {doctor.specialty} • {doctor.city}
                </p>
                <p className="text-sm text-yellow-500 font-medium">
                  ⭐ {doctor.rating.toFixed(1)}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  <span className="font-medium">Planos:</span>{" "}
                  {doctor.plans.join(", ")}
                </p>
                <Button className="w-full">Agendar Consulta</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            Nenhum médico encontrado com esses filtros.
          </p>
        )}
      </div>
    </div>
  );
}
