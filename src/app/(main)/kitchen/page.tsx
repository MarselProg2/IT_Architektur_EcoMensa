"use client";

import { useRole } from "@/context/role-context";
import { ROLES } from "@/lib/constants";
import { KitchenTerminal } from "@/components/kitchen/kitchen-terminal";
import { AccessDenied } from "@/components/admin/access-denied";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { KitchenTerminalLoader } from "@/components/kitchen/kitchen-terminal-loader";

export default function KitchenPage() {
  const { currentUser } = useRole();

  const isKitchenStaff = currentUser.role === ROLES.KITCHEN;

  if (!isKitchenStaff) {
    return (
        <div className="container py-8 h-[calc(100vh-4rem)] flex flex-col justify-center">
             <AccessDenied />
        </div>
    )
  }

  // Wir geben null zurück, da das eigentliche Terminal jetzt
  // über das Layout gerendert wird. Diese Komponente behandelt nur die Zugriffsprüfung.
  return null;
}
