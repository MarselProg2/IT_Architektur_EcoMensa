import { getKitchenStats } from "@/lib/data";
import { QrScanner } from "./qr-scanner";
import { Package } from "lucide-react";

export async function KitchenTerminal() {
  const { pickupCount } = await getKitchenStats();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 gap-16">
      <div>
        <h2 className="text-4xl font-light uppercase tracking-widest text-muted-foreground">
          Packages to Pick Up
        </h2>
        <div className="flex items-center justify-center gap-8 mt-4">
          <Package className="h-24 w-24 text-primary" />
          <p className="text-9xl font-bold font-mono text-foreground">
            {pickupCount}
          </p>
        </div>
      </div>

      <div className="w-full max-w-lg">
         <h2 className="text-3xl font-light uppercase tracking-widest text-muted-foreground mb-6">
          Scan QR Code
        </h2>
        <QrScanner />
      </div>
    </div>
  );
}
