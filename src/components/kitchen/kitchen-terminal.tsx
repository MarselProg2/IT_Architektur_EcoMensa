"use client";

import { QrScanner } from "./qr-scanner";
import { Package } from "lucide-react";
import { useOrders } from "@/context/order-context"; // Context nutzen

// Props sind jetzt optional, da wir den Context nutzen
interface KitchenTerminalProps {
  pickupCount?: number;
}

export function KitchenTerminal({
  pickupCount: initialCount,
}: KitchenTerminalProps) {
  const { orders } = useOrders();

  // Berechne die offenen Bestellungen live aus dem Context
  const activeCount = orders.filter((o) => o.status === "active").length;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 gap-16 min-h-[80vh]">
      <div className="animate-in fade-in slide-in-from-top-4 duration-700">
        <h2 className="text-4xl font-light uppercase tracking-widest text-muted-foreground">
          Offene Abholungen
        </h2>
        <div className="flex items-center justify-center gap-8 mt-6">
          <Package className="h-32 w-32 text-primary animate-pulse" />
          <p className="text-9xl font-bold font-mono text-foreground">
            {activeCount}
          </p>
        </div>
      </div>

      <div className="w-full max-w-lg bg-card p-8 rounded-2xl shadow-xl border border-border/50">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-muted-foreground mb-6">
          Scan Terminal
        </h2>
        <QrScanner />
      </div>
    </div>
  );
}
