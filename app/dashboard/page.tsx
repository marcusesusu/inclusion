"use client";

import * as React from "react";
import { UserSession } from "@/types/auth";
import { SetTransactionPinModal } from "@/components/modals/SetTransactionPinModal";

export default function DashboardPage() {
  const [user, setUser] = React.useState<UserSession | null>(null);
  const [showPinModal, setShowPinModal] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsedUser: UserSession = JSON.parse(stored);
      setUser(parsedUser);

      // Trigger modal if transaction PIN is not set
      if (parsedUser && parsedUser.has_transaction_pin === false) {
        setShowPinModal(true);
      }
    }
  }, []);

  const handlePinSuccess = () => {
    setShowPinModal(false);
    if (user) {
      const updatedUser = { ...user, has_transaction_pin: true };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <div className="space-y-4">
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

      <SetTransactionPinModal
        isOpen={showPinModal}
        onSuccess={handlePinSuccess}
      />
    </div>
  );
}
