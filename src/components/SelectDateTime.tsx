"use client";

import { useState } from "react";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar"; // se estiver usando shadcn
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { cn } from "@/lib/utils";

const horariosDisponiveis = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export default function SelectDateTime() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedHour, setSelectedHour] = useState<string | null>(null);

  const formattedDateTime =
    selectedDate && selectedHour
      ? new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedHour}:00`)
      : null;

  return (
    <div className="space-y-4">
      <Label>Selecione uma data</Label>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        locale={ptBR}
        fromDate={new Date()}
      />

      {selectedDate && (
        <div className="space-y-2">
          <Label>Selecione um horário</Label>
          <div className="grid grid-cols-3 gap-2">
            {horariosDisponiveis.map((hora) => (
              <button
                key={hora}
                type="button"
                onClick={() => setSelectedHour(hora)}
                className={cn(
                  "px-3 py-2 border text-sm rounded",
                  selectedHour === hora
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-gray-100"
                )}
              >
                {hora}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Campo oculto com valor final de datetime */}
      {formattedDateTime && (
        <input
          type="hidden"
          name="date"
          value={formattedDateTime.toISOString()}
        />
      )}
    </div>
  );
}
