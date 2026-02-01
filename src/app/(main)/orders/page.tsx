

import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Calendar, Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function OrdersPage() {
  const supabase = createClient();
  const { data: { user } } = await (await supabase).auth.getUser();

  if (!user) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Bitte einloggen</h1>
        <Link href="/login"><Button>Login</Button></Link>
      </div>
    )
  }

  const { data: orders } = await (await supabase)
    .from('orders')
    .select('*')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold font-headline">Meine Bestellungen (Historie)</h1>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <QrCode className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-lg font-medium">Keine aktiven Tickets</h3>
          <p className="text-muted-foreground mb-6">
            Du hast noch kein Essen gerettet.
          </p>
          <Link href="/">
            <Button>Jetzt Essen finden</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {orders.map((order) => {
            const isCompleted = order.status === "PICKED_UP";

            return (
              <Card
                key={order.id}
                className={cn(
                  "overflow-hidden border-l-4 shadow-sm transition-all",
                  isCompleted
                    ? "border-l-gray-400 opacity-70"
                    : "border-l-primary hover:shadow-md"
                )}
              >
                <CardHeader
                  className={cn(
                    "pb-4",
                    isCompleted ? "bg-gray-100" : "bg-secondary/10"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base">
                        Order #{order.id.slice(0, 8)}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" /> {new Date(order.created_at).toLocaleDateString()}
                        <Clock className="h-3 w-3" /> {new Date(order.created_at).toLocaleTimeString()}
                      </CardDescription>
                    </div>
                    {isCompleted ? (
                      <Badge className="bg-gray-500 hover:bg-gray-600 flex gap-1 items-center">
                        <CheckCircle2 className="h-3 w-3" /> Abgeholt
                      </Badge>
                    ) : (
                      <Badge className="bg-green-600 hover:bg-green-700 animate-pulse">
                        {order.status}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-6 grid grid-cols-3 gap-4">
                  {/* Linker Teil: Infos */}
                  <div className="col-span-2 space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Code
                      </p>
                      <p className="font-mono text-lg font-bold">{order.qr_code_data}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Meal ID: {order.meal_id}
                    </div>
                  </div>

                  {/* Rechter Teil: QR Code Simulation */}
                  <div className="col-span-1 flex flex-col items-center justify-center border-l pl-4">
                    {isCompleted ? (
                      <div className="bg-gray-100 p-2 rounded-lg border mb-2 grayscale opacity-50">
                        <QrCode className="h-16 w-16 text-gray-400" />
                      </div>
                    ) : (
                      <div className="bg-white p-2 rounded-lg border shadow-sm mb-2">
                        <QrCode className="h-16 w-16 text-slate-800" />
                      </div>
                    )}
                    <span className="text-[10px] text-muted-foreground text-center">
                      {isCompleted
                        ? "Bereits eingelöst"
                        : "Am Counter zeigen"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
