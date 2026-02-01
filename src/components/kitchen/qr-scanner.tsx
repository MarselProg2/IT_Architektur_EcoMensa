"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, QrCode, CheckCircle2 } from "lucide-react"; // CheckCircle icon dazu
import { useToast } from "@/hooks/use-toast";
import { confirmPickupAction } from "@/lib/actions";

const formSchema = z.object({
  qrCode: z.string().min(1, "Bitte einen Code eingeben."),
});

export function QrScanner() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  // Removed useOrders

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      qrCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    // Artificial delay for checking
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = await confirmPickupAction(values.qrCode);

    if (result.success) {
      toast({
        title: "Abholung bestätigt!",
        description: result.message,
        variant: "default",
        className: "bg-green-600 text-white border-none",
      });
      form.reset();
    } else {
      toast({
        title: "Fehler",
        description: result.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-start space-x-2"
      >
        <FormField
          control={form.control}
          name="qrCode"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative">
                  <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="ORD-123456..."
                    {...field}
                    className="pl-10 h-14 text-lg border-2 focus-visible:ring-primary bg-card"
                    autoComplete="off"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="h-14 px-8 text-lg">
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Check"}
        </Button>
      </form>
    </Form>
  );
}
