"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { scheduleAppointment } from "@/app/actions/schedule-appointment";
import { TimePicker } from "@/components/TimePicker";
import { Spinner } from "@/components/ui/spinner"; // cria esse spinner ou use seu componente de loading

interface ClientScheduleFormProps {
  doctorId: string;
  doctorName: string;
}

export function ClientScheduleForm({
  doctorId,
  doctorName,
}: ClientScheduleFormProps) {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isFirst, setIsFirst] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([]);
      return;
    }

    async function fetchAvailableTimes() {
      setLoadingTimes(true);
      setSelectedTime(null);

      try {
        const res = await fetch(
          `/api/doctors/${doctorId}/available?date=${
            selectedDate!.toISOString().split("T")[0]
          }`
        );
        if (!res.ok) throw new Error("Erro ao buscar horários");

        const data = await res.json();
        setAvailableTimes(data.availableTimes || []);
      } catch (error) {
        toast.error("Erro ao carregar horários disponíveis");
        setAvailableTimes([]);
      } finally {
        setLoadingTimes(false);
      }
    }

    fetchAvailableTimes();
  }, [selectedDate, doctorId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await scheduleAppointment(formData);

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Consulta marcada com sucesso!");
        router.push("/dashboard/patient/appointments");
      }
    } catch (error) {
      toast.error("Erro ao agendar consulta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Agendar com {doctorName}</h2>

      <div>
        <Label>Escolha a data:</Label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(d) => {
            setSelectedDate(d);
            setSelectedTime(null);
          }}
        />
      </div>

      {selectedDate && (
        <div>
          <Label>Horários disponíveis:</Label>
          {loadingTimes ? (
            <div className="flex items-center space-x-2 py-2">
              <Spinner />
              <span>Carregando horários...</span>
            </div>
          ) : availableTimes.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              Não há horários disponíveis nesse dia.
            </p>
          ) : (
            <TimePicker
              doctorId={doctorId}
              selectedDate={selectedDate}
              onTimeSelect={setSelectedTime}
              availableTimes={availableTimes}
              selectedTime={selectedTime}
            />
          )}
        </div>
      )}

      <div>
        <Label>Primeira consulta?</Label>
        <select
          name="isFirst"
          required
          className="w-full bg-white border rounded px-3 py-2 text-sm"
          value={isFirst}
          onChange={(e) => setIsFirst(e.target.value)}
        >
          <option value="">Selecione</option>
          <option value="yes">Sim</option>
          <option value="no">Não</option>
        </select>
      </div>

      <input type="hidden" name="doctorId" value={doctorId} />
      <input
        type="hidden"
        name="date"
        value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
      />
      <input type="hidden" name="time" value={selectedTime || ""} />

      <Button
        type="submit"
        disabled={!selectedDate || !selectedTime || !isFirst || loading}
      >
        {loading ? "Agendando..." : "Confirmar"}
      </Button>
    </form>
  );
}
