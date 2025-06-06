"use client";

import { useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment } from "@prisma/client";

interface CalendarViewProps {
  appointments: Appointment[];
}

export default function CalendarView({ appointments }: CalendarViewProps) {
  const groupedAppointments = useMemo(() => {
    const grouped: { [date: string]: Appointment[] } = {};
    for (const appointment of appointments) {
      const dayKey = format(appointment.date, "yyyy-MM-dd");
      if (!grouped[dayKey]) grouped[dayKey] = [];
      grouped[dayKey].push(appointment);
    }
    return grouped;
  }, [appointments]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendário</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={undefined}
            disabled={(date) =>
              !Object.keys(groupedAppointments).includes(
                format(date, "yyyy-MM-dd")
              )
            }
            modifiers={{
              booked: (date) =>
                Object.keys(groupedAppointments).includes(
                  format(date, "yyyy-MM-dd")
                ),
            }}
            locale={ptBR}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consultas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {appointments.map((appt) => (
              <li key={appt.id} className="border rounded p-3">
                <p className="text-sm font-medium">
                  {new Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(appt.date))}
                </p>
                <p className="text-sm text-muted-foreground">
                  Paciente: {appt.patientId}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
