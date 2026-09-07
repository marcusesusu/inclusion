"use client";

import * as React from "react";
import { UserSession } from "@/types/auth";

export default function DashboardPage() {
  const [user, setUser] = React.useState<UserSession | null>(null);

  React.useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          Welcome back, {user?.first_name || "User"}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Role Access Level:{" "}
          <span className="font-semibold uppercase text-primary">
            {user?.role || "Staff"}
          </span>
        </p>
      </div>
    </div>
  );
}
