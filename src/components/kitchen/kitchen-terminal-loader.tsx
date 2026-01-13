import { getKitchenStats } from "@/lib/data";
import { KitchenTerminal } from "./kitchen-terminal";

export async function KitchenTerminalLoader() {
  const { pickupCount } = await getKitchenStats();
  return <KitchenTerminal pickupCount={pickupCount} />;
}
