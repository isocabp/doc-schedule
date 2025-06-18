import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { doctorId: string } }
) {
  const { doctorId } = params;
  const url = new URL(request.url);
  const dateStr = url.searchParams.get("date"); // yyyy-mm-dd

  if (!dateStr) {
    return NextResponse.json({ error: "Data obrigatória" }, { status: 400 });
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return NextResponse.json({ error: "Data inválida" }, { status: 400 });
  }

  // Busca as disponibilidades do médico para o dia da semana (0=Domingo ... 6=Sabado)
  const weekday = date.getDay();

  const availabilities = await prisma.availability.findMany({
    where: {
      doctorId,
      weekday,
    },
  });

  if (availabilities.length === 0) {
    return NextResponse.json({ availableTimes: [] });
  }

  // Busca os agendamentos já marcados para esse médico e data
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      date: {
        gte: new Date(dateStr + "T00:00:00.000Z"),
        lt: new Date(dateStr + "T23:59:59.999Z"),
      },
    },
  });

  // Montar lista de horários disponíveis considerando intervalos e ocupados
  let availableTimes: string[] = [];

  availabilities.forEach(({ startTime, endTime, interval }) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const step = interval || 30;

    let current = new Date(date);
    current.setHours(startHour, startMin, 0, 0);

    const end = new Date(date);
    end.setHours(endHour, endMin, 0, 0);

    while (current < end) {
      const timeStr = current.toTimeString().slice(0, 5);

      // Verifica se já tem agendamento nesse horário
      const isTaken = appointments.some((appt) => {
        const apptDate = new Date(appt.date);
        const apptTimeStr = apptDate.toTimeString().slice(0, 5);
        return apptTimeStr === timeStr;
      });

      if (!isTaken) {
        availableTimes.push(timeStr);
      }

      current = new Date(current.getTime() + step * 60000);
    }
  });

  return NextResponse.json({ availableTimes });
}
