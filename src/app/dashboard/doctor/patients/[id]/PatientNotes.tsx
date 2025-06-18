"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface PatientNotesProps {
  patientId: string;
}

export default function PatientNotes({ patientId }: PatientNotesProps) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // carregar nota ao montar o componente
  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/doctor/patients/${patientId}/notes`);
        if (!res.ok) throw new Error("Erro ao carregar as notas");
        const data = await res.json();
        setNotes(data.content || "");
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, [patientId]);

  async function saveNotes() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/doctor/patients/${patientId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: notes }),
      });
      if (!res.ok) throw new Error("Erro ao salvar as notas");
      // pode dar um feedback visual se quiser
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-4 space-y-2">
      <h2 className="text-xl font-medium">Bloco de Notas do Médico</h2>
      {loading ? (
        <p>Carregando notas...</p>
      ) : (
        <>
          <textarea
            className="w-full bg-white min-h-[150px] p-2 border rounded resize-none focus:outline-none focus:ring focus:ring-indigo-500"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Escreva as anotações sobre o paciente aqui..."
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            onClick={saveNotes}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition"
          >
            {saving ? "Salvando..." : "Salvar Notas"}
          </button>
        </>
      )}
    </Card>
  );
}
