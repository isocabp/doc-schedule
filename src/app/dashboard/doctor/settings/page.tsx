"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Label,
} from "@/components/ui";
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "sonner";
import { getUser } from "@/actions/get-user";
import { updateUser } from "@/actions/update-user";
import Sidebar from "../availability/_components/sidebar";

export default function DoctorSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
    specialty: "",
    healthPlans: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUser();
      if (!data) return;

      setUser(data);
      setFormData({
        name: data.name,
        email: data.email,
        password: "",
        image: data.image || "",
        specialty: data.specialty || "",
        healthPlans: data.healthPlans?.join(", ") || "",
      });
    };

    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateUser({
        ...formData,
        healthPlans: formData.healthPlans.split(",").map((p) => p.trim()),
      });
      toast.success("Perfil atualizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-neutral-50">
        <div className="max-w-xl mx-auto space-y-6">
          <h1 className="text-2xl font-semibold">Configurações do Médico</h1>

          <Card>
            <CardHeader>
              <CardTitle>Editar Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Foto */}
              <div className="space-y-2 flex flex-col items-center justify-center">
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Foto do médico"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) {
                      setFormData((prev) => ({ ...prev, image: res[0].url }));
                      toast.success("Foto enviada com sucesso.");
                    }
                  }}
                />
              </div>

              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Especialidade */}
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                />
              </div>

              {/* Planos de Saúde */}
              <div className="space-y-2">
                <Label htmlFor="healthPlans">
                  Planos de Saúde (separados por vírgula)
                </Label>
                <Input
                  type="text"
                  name="healthPlans"
                  value={formData.healthPlans}
                  onChange={handleChange}
                />
              </div>

              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
