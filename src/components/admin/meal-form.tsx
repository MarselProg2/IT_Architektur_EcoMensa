"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { Meal } from "@/lib/types";
import { addMealAction, updateMealAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().min(0, "Price must be positive."),
  initialStock: z.coerce.number().int().min(0, "Stock must be a non-negative integer."),
  pickupTimeStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)."),
  pickupTimeEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)."),
});

interface MealFormProps {
  meal?: Meal | null;
  onFinished: () => void;
}

export function MealForm({ meal, onFinished }: MealFormProps) {
  const { toast } = useToast();
  const isEditMode = !!meal;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: meal?.name || "",
      description: meal?.description || "",
      price: meal?.price || 0,
      initialStock: meal?.initialStock || 0,
      pickupTimeStart: meal?.pickupTimeStart || "14:00",
      pickupTimeEnd: meal?.pickupTimeEnd || "15:00",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const mealData = {
      ...values,
      currentStock: values.initialStock,
      imageId: meal?.imageId || `meal-${Math.floor(Math.random() * 4) + 1}`,
    };

    const result = isEditMode
      ? await updateMealAction(meal.id, {
          name: values.name,
          description: values.description,
          price: values.price,
          initialStock: values.initialStock,
          currentStock: values.initialStock, // Reset stock on edit
          pickupTimeStart: values.pickupTimeStart,
          pickupTimeEnd: values.pickupTimeEnd,
        })
      : await addMealAction(mealData);

    if (result.success) {
      toast({ title: "Success", description: result.message });
      onFinished();
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Vegetarian Surprise Box" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A delightful mix of our vegetarian dishes..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="initialStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Stock</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pickupTimeStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pickup Start</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pickupTimeEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pickup End</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? "Save Changes" : "Add Meal"}
        </Button>
      </form>
    </Form>
  );
}
