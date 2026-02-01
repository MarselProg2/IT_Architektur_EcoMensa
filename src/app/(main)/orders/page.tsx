"use client";

import { useOrders } from "@/context/order-context";
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

export default function OrdersPage() {
  const { orders } = useOrders();

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold font-headline">Meine Bestellungen</h1>
      </div>

      {orders.length === 0 ? (
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
            const isCompleted = order.status === "completed";

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
                      <CardTitle className="flex items-center gap-2">
                        {order.id}
                        <Badge
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {order.paymentMethod === "paypal"
                            ? "PayPal"
                            : "Karte"}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <Calendar className="h-3 w-3" /> {order.date}
                      </CardDescription>
                    </div>
                    {isCompleted ? (
                      <Badge className="bg-gray-500 hover:bg-gray-600 flex gap-1 items-center">
                        <CheckCircle2 className="h-3 w-3" /> Abgeholt
                      </Badge>
                    ) : (
                      <Badge className="bg-green-600 hover:bg-green-700 animate-pulse">
                        Bezahlt (Offen)
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-6 grid grid-cols-3 gap-4">
                  {/* Linker Teil: Infos */}
                  <div className="col-span-2 space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Gerichte
                      </p>
                      <ul className="text-sm space-y-1">
                        {order.items.map((item, idx) => (
                          <li
                            key={idx}
                            className={
                              isCompleted
                                ? "line-through text-muted-foreground"
                                : ""
                            }
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t flex justify-between items-center font-bold">
                      <span>Summe</span>
                      <span className="text-primary">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Rechter Teil: QR Code Simulation */}
                  <div className="col-span-1 flex flex-col items-center justify-center border-l pl-4">
                    {isCompleted ? (
                      <div className="bg-gray-100 p-2 rounded-lg border mb-2 grayscale opacity-50">
                        <QrCode className="h-20 w-20 text-gray-400" />
                      </div>
                    ) : (
                      <div className="bg-white p-2 rounded-lg border shadow-sm mb-2">
                        <QrCode className="h-20 w-20 text-slate-800" />
                      </div>
                    )}
                    <span className="text-[10px] text-muted-foreground text-center">
                      {isCompleted
                        ? "Bereits eingelöst"
                        : "Am Eco-Counter vorzeigen"}
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
