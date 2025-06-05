"use client";

import { Availability } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { deleteAvailability } from "../actions";

const weekdays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export default function AvailabilityItem({ item }: { item: Availability }) {
  const handleDelete = async () => {
    await deleteAvailability(item.id);
  };

  return (
    <div className="flex items-center justify-between rounded-md border p-4">
      <div>
        <p className="font-medium">{weekdays[item.weekday]}</p>
        <p className="text-sm text-muted-foreground">
          {item.startTime} - {item.endTime}
        </p>
      </div>
      <Button variant="outline" size="icon" onClick={handleDelete}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
