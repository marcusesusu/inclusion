"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";

type Role = "superadmin" | "admin" | "staff";

interface UserSession {
  id: number;
  first_name: string;
  last_name: string;
  role: Role;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  allowedRoles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    allowedRoles: ["superadmin", "admin", "staff"],
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-4 w-4" />,
    allowedRoles: ["superadmin", "admin"],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<UserSession | null>(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const filteredNavItems = NAV_ITEMS.filter(
    (item) => user?.role && item.allowedRoles.includes(user.role)
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r border-border bg-card flex flex-col justify-between p-4">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              E
            </div>
            <span className="font-semibold text-lg">Esusu Admin</span>
          </div>

          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {user && (
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center gap-3 px-2">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-semibold">
                {user.first_name[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold truncate">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-[10px] text-muted-foreground capitalize">
                  {user.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        )}
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
