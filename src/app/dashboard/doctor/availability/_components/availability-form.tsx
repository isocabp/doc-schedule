"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createAvailability } from "../actions";

const weekdays = [
  { label: "Domingo", value: "0" },
  { label: "Segunda-feira", value: "1" },
  { label: "Terça-feira", value: "2" },
  { label: "Quarta-feira", value: "3" },
  { label: "Quinta-feira", value: "4" },
  { label: "Sexta-feira", value: "5" },
  { label: "Sábado", value: "6" },
];

export default function AvailabilityForm({ doctorId }: { doctorId: string }) {
  const [weekday, setWeekday] = useState("1");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [interval, setInterval] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createAvailability({
      doctorId,
      weekday: parseInt(weekday),
      startTime,
      endTime,
      interval: interval ? parseInt(interval) : null,
    });

    setStartTime("");
    setEndTime("");
    setInterval("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <Select value={weekday} onValueChange={setWeekday}>
          <SelectTrigger>
            <SelectValue placeholder="Dia da semana" />
          </SelectTrigger>
          <SelectContent>
            {weekdays.map((day) => (
              <SelectItem key={day.value} value={day.value}>
                {day.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <Input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Intervalo (min)"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          min="1"
        />
      </div>

      <Button type="submit">Adicionar</Button>
    </form>
  );
}
