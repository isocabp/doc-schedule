"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Calendar,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteCookie } from "cookies-next";

const links = [
  {
    label: "Dashboard",
    href: "/dashboard/doctor",
    icon: LayoutDashboard,
  },
  {
    label: "Agenda",
    href: "/dashboard/doctor/agenda",
    icon: Calendar,
  },
  {
    label: "Pacientes",
    href: "/dashboard/doctor/patients",
    icon: Users,
  },
  {
    label: "Configurações",
    href: "/dashboard/doctor/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie("token");
    router.push("/auth/login");
  };

  return (
    <aside className="w-64 bg-neutral-900 text-neutral-100 flex flex-col">
      <div className="px-6 py-6 border-b border-neutral-700">
        <h2 className="text-2xl font-bold">DocSchedule</h2>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-800",
                isActive && "bg-neutral-800"
              )}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <Button
          variant="outline"
          className="w-full bg-green"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/auth/login";
          }}
        >
          Sair
        </Button>
      </div>
    </aside>
  );
}
