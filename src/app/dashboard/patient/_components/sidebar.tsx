"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  LogOut,
  Settings,
  Stethoscope,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const links = [
  {
    label: "Dashboard",
    href: "/dashboard/patient",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/patient/doctors",
    label: "Consultar Médicos",
    icon: Stethoscope,
  },
  {
    href: "/dashboard/patient/appointments",
    label: "Minhas Consultas",
    icon: CalendarCheck,
  },
  {
    href: "/dashboard/patient/settings",
    label: "Configurações",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie("token");
    deleteCookie("role");
    toast.success("Logout realizado com sucesso.");
    router.push("/auth/login");
  };

  return (
    <aside className="w-full md:w-64 bg-neutral-900 text-neutral-100 p-4 border-r min-h-screen">
      <div className="px-6 py-6 border-b border-neutral-700">
        <h2 className="text-2xl font-bold">DocSchedule</h2>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition",
              pathname === link.href
                ? "bg-primary text-white"
                : "hover:text-neutral-700 hover:bg-neutral-100"
            )}
          >
            <link.icon className="w-4 h-4" />
            {link.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 transition w-full"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </nav>
    </aside>
  );
}
