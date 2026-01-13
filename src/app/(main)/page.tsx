import { MealList } from "@/components/student/meal-list";
import { getMeals } from "@/lib/data";

export default async function StudentPage() {
  const meals = await getMeals();

  return (
    <div className="container py-8">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold font-headline tracking-tight">Today&apos;s Saved Meals</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Help us reduce waste! Reserve a delicious meal at a great price.
            </p>
        </div>
        <MealList meals={meals} />
    </div>
  );
}
