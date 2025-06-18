"use client";

import { useState } from "react";

interface TimePickerProps {
  doctorId: string;
  selectedDate: Date;
  onTimeSelect: (time: string) => void;
  availableTimes: string[];
  selectedTime: string | null;
}

export function TimePicker({
  doctorId,
  selectedDate,
  onTimeSelect,
  availableTimes,
  selectedTime,
}: TimePickerProps) {
  const [hoveredTime, setHoveredTime] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-4 gap-2 max-w-xs">
      {availableTimes.map((time) => (
        <button
          key={time}
          type="button"
          className={`px-3 py-1 rounded border ${
            selectedTime === time
              ? "bg-blue-600 text-white"
              : hoveredTime === time
              ? "bg-blue-100"
              : "bg-white"
          }`}
          onClick={() => onTimeSelect(time)}
          onMouseEnter={() => setHoveredTime(time)}
          onMouseLeave={() => setHoveredTime(null)}
        >
          {time}
        </button>
      ))}
    </div>
  );
}
