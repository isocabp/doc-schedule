"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadImage } from "@/components/UploadImage";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"patient" | "doctor">("patient");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const specialty = formData.get("specialty");
    const healthPlans = formData.getAll("healthPlans");

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        image: uploadedImage,
        role: userType === "doctor" ? "DOCTOR" : "PATIENT",
        specialty: userType === "doctor" ? specialty : null,
        healthPlans: userType === "doctor" ? healthPlans : [],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast.success("Cadastro realizado com sucesso!");
      router.push("/auth/login");
    } else {
      const data = await response.json();
      toast.error(data.error || "Erro ao cadastrar.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#dbeafe] via-white to-[#e0f2fe] px-4">
      <Card className="w-full max-w-lg rounded-lg shadow-md ">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-semibold text-neutral-900 text-center">
            Cadastro
          </CardTitle>

          <Tabs
            value={userType}
            onValueChange={(value) =>
              setUserType(value as "patient" | "doctor")
            }
            className="mt-4"
          >
            <TabsList className="w-full">
              <TabsTrigger value="patient" className="w-1/2">
                Paciente
              </TabsTrigger>
              <TabsTrigger value="doctor" className="w-1/2">
                Médico
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* upload centralizado */}
            <div className="flex justify-center">
              <UploadImage
                label="Foto de Perfil"
                onUploadComplete={(url) => setUploadedImage(url)}
              />
            </div>

            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="********"
                required
              />
            </div>

            {userType === "doctor" && (
              <>
                <div>
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    placeholder="Ex.: Cardiologia, Pediatria..."
                    required
                  />
                </div>

                <div>
                  <Label>Planos de Saúde Aceitos</Label>
                  <div className="flex flex-col gap-2 mt-2">
                    {["Amil", "Bradesco Saúde", "SulAmérica", "Unimed"].map(
                      (plan) => (
                        <label key={plan} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="healthPlans"
                            value={plan}
                            className="rounded-sm"
                          />
                          {plan}
                        </label>
                      )
                    )}
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                `Cadastrar como ${
                  userType === "patient" ? "Paciente" : "Médico"
                }`
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <span className="mr-1">Já possui conta?</span>
            <Link
              href={`/auth/login?type=${userType.toLowerCase()}`}
              className="font-medium text-primary hover:underline"
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
