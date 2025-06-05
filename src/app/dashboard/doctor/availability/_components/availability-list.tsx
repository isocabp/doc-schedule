"use client";

import { Availability } from "@prisma/client";
import AvailabilityItem from "./availability-item";

export default function AvailabilityList({ items }: { items: Availability[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma disponibilidade cadastrada.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <AvailabilityItem key={item.id} item={item} />
      ))}
    </div>
  );
}
