"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { NAV_ITEMS } from "@/settings";
import { UserSession } from "@/types/auth";

// Helper function to read a specific cookie value in the browser
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = React.useState<UserSession | null>(null);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);

    // 1. Log raw document.cookie string for debugging
    console.log("[Dashboard Layout] Raw Document Cookies:", document.cookie);

    // 2. Read role and refresh token cookies
    const cookieRole = getCookie("user_role");
    const cookieRefreshToken = getCookie("refresh_token");

    console.log("[Dashboard Layout] Parsed Cookies:", {
      user_role: cookieRole,
      refresh_token: cookieRefreshToken ? "EXISTS" : "MISSING",
    });

    // 3. Extract user session from localStorage or fall back to cookie data
    const storedUser = localStorage.getItem("user");
    console.log("[Dashboard Layout] Raw localStorage user:", storedUser);

    let parsedUser: Partial<UserSession> | null = null;

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        parsedUser = parsed?.user ? parsed.user : parsed;
      } catch (e) {
        console.error("[Dashboard Layout] Error parsing user localStorage:", e);
      }
    }

    // Resolve user state with fallback to the cookie role
    const resolvedRole = (parsedUser?.role || cookieRole || "staff").toLowerCase();
    const resolvedFirstName = parsedUser?.first_name || "User";
    const resolvedLastName = parsedUser?.last_name || "";
    const resolvedId = parsedUser?.id || 0;
    const resolvedPin = parsedUser?.has_transaction_pin || false;

    setUser({
      id: resolvedId,
      first_name: resolvedFirstName,
      last_name: resolvedLastName,
      role: resolvedRole as UserSession["role"],
      has_transaction_pin:resolvedPin,
    });
  }, []);

  React.useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    document.cookie =
      "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  // Safe case-insensitive role filtering
  const userRoleLower = user?.role ? String(user.role).toLowerCase() : "";

  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (!userRoleLower) return false;
    return item.allowedRoles.some(
      (r) => String(r).toLowerCase() === userRoleLower
    );
  });

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between border-r border-border bg-card p-3 transition-all duration-300 ease-in-out md:static ${
          isMobileOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "md:w-16" : "md:w-64"}`}
      >
        <div className="space-y-4">
          <div
            className={`flex items-center justify-between ${
              isCollapsed ? "md:justify-center" : "px-2"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
                ID
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <span className="font-semibold text-base truncate">
                  Inclusion ID Admin
                </span>
              )}
            </div>

            <button
              onClick={() => setIsMobileOpen(false)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-accent md:hidden"
              aria-label="Close Sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {!isMounted ? (
              <div className="space-y-2 p-2">
                <div className="h-8 rounded-lg bg-muted animate-pulse" />
                <div className="h-8 rounded-lg bg-muted animate-pulse" />
              </div>
            ) : filteredNavItems.length > 0 ? (
              filteredNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <div key={item.href} className="relative group">
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      } ${isCollapsed ? "md:justify-center md:px-0" : ""}`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {(!isCollapsed || isMobileOpen) && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Link>

                    {isCollapsed && (
                      <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 rounded-md bg-popover px-2.5 py-1 text-xs text-popover-foreground shadow-md opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 whitespace-nowrap border border-border">
                        {item.label}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-2 text-xs text-muted-foreground">
                No menu available for role: {user?.role || "Unknown"}
              </div>
            )}
          </nav>
        </div>

        {/* User Footer */}
        {user && (
          <div className="border-t border-border pt-3 space-y-2">
            <div
              className={`flex items-center gap-3 ${
                isCollapsed ? "md:justify-center px-0" : "px-2"
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold">
                {user.first_name?.[0] || "U"}
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold truncate">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-[10px] text-muted-foreground capitalize truncate">
                    {user.role}
                  </p>
                </div>
              )}
            </div>

            <div className="relative group">
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-2 rounded-lg p-2 text-xs text-destructive hover:bg-destructive/10 transition-colors cursor-pointer ${
                  isCollapsed ? "md:justify-center" : ""
                }`}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span>Sign Out</span>}
              </button>

              {isCollapsed && (
                <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 rounded-md bg-popover px-2.5 py-1 text-xs text-destructive shadow-md opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 whitespace-nowrap border border-border">
                  Sign Out
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-card px-4 md:px-6">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent md:hidden cursor-pointer"
            aria-label="Open Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex rounded-lg p-1.5 text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
            aria-label="Toggle Sidebar Collapse"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>

          <div className="text-xs font-medium text-muted-foreground">
            Inclusion Verification Portal
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
