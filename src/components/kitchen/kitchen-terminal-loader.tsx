import { createClient } from "@/lib/supabase/server";
import { KitchenTerminal } from "./kitchen-terminal";
import { Meal } from "@/lib/types";

export async function KitchenTerminalLoader() {
  const supabase = createClient();

  const [mealsResponse, ordersResponse] = await Promise.all([
    (await supabase).from('meals').select('*').order('created_at', { ascending: false }),
    (await supabase).from('orders').select('*').eq('status', 'RESERVED').order('created_at', { ascending: true })
  ]);

  const meals: Meal[] = (mealsResponse.data || []).map(m => ({
    id: m.id,
    name: m.title,
    description: m.description || '',
    price: Number(m.price),
    initialStock: m.initial_stock || 0,
    currentStock: m.current_stock,
    pickupTimeStart: m.pickup_time_start || '12:00',
    pickupTimeEnd: m.pickup_time_end || '14:00',
    imageId: m.image_id || 'meal-1'
  }));

  const orders = ordersResponse.data || [];

  return <KitchenTerminal meals={meals} orders={orders} />;
}
