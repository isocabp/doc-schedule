"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [userType, setUserType] = useState<"patient" | "doctor">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Falha no login, cheque suas credenciais.");
        return;
      }

      toast.success("Login realizado com sucesso!");

      if (data.user.role === "DOCTOR") {
        router.push("/dashboard/doctor");
      } else if (data.user.role === "PATIENT") {
        router.push("/dashboard/patient");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Erro ao tentar logar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <Card className="w-full max-w-md rounded-lg shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-semibold text-neutral-900">
            Login
          </CardTitle>
          <Tabs
            value={userType}
            onValueChange={(value) =>
              setUserType(value as "patient" | "doctor")
            }
            className="mt-4"
          >
            <TabsList>
              <TabsTrigger value="patient">Paciente</TabsTrigger>
              <TabsTrigger value="doctor">Médico</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                `Entrar como ${userType === "patient" ? "Paciente" : "Médico"}`
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-neutral-600">
            Não tem uma conta?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-primary-600 hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
