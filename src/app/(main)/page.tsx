import { MealList } from "@/components/student/meal-list";
import { createClient } from "@/lib/supabase/server";
import { Meal } from "@/lib/types";

export default async function StudentPage() {
  const supabase = createClient();
  const { data: { user } } = await (await supabase).auth.getUser();

  const [mealsResponse, ordersResponse] = await Promise.all([
    (await supabase).from('meals').select('*').gt('current_stock', 0).order('created_at', { ascending: false }),
    user ? (await supabase).from('orders').select('*').eq('student_id', user.id).order('created_at', { ascending: false }) : { data: [] }
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

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Today&apos;s Saved Meals</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Help us reduce waste! Reserve a delicious meal at a great price.
        </p>
      </div>
      <div className="space-y-12">
        <MealList meals={meals} />
      </div>
    </div>
  );
}
