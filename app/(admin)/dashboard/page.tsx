"use client";

import * as React from "react";

export default function DashboardPage() {
  const [user, setUser] = React.useState<{
    first_name: string;
    role: string;
  } | null>(null);

  React.useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.first_name || "User"}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Role Access Level:{" "}
          <span className="font-semibold uppercase text-primary">
            {user?.role}
          </span>
        </p>
      </div>
    </div>
  );
}
