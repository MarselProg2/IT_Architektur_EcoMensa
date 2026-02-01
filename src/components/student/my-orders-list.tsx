"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode } from "lucide-react";

interface MyOrdersListProps {
    orders: any[]; // define type
}

export function MyOrdersList({ orders }: MyOrdersListProps) {
    if (orders.length === 0) {
        return (
            <div className="text-center p-8 bg-muted/20 rounded-lg mt-8">
                <p className="text-muted-foreground">You haven't reserved any meals yet.</p>
            </div>
        );
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 font-headline">My Reservations</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {orders.map((order) => (
                    <Card key={order.id} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                                <Badge variant={order.status === 'PICKED_UP' ? 'secondary' : 'default'}>
                                    {order.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 py-4">
                                <div className="bg-white p-2 rounded shadow-sm border">
                                    <QrCode className="h-12 w-12" />
                                </div>
                                <div>
                                    <p className="font-mono text-sm">{order.qr_code_data}</p>
                                    <p className="text-xs text-muted-foreground">Show this code at counter</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
