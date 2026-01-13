"use client";

import { useRole } from "@/context/role-context";
import { ROLES } from "@/lib/constants";
import { KitchenTerminal } from "@/components/kitchen/kitchen-terminal";
import { AccessDenied } from "@/components/admin/access-denied";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function KitchenTerminalSkeleton() {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 gap-16">
            <div>
                <Skeleton className="h-10 w-96 mb-4" />
                <div className="flex items-center justify-center gap-8 mt-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-28 w-40" />
                </div>
            </div>
            <div className="w-full max-w-lg space-y-6">
                <Skeleton className="h-8 w-64 mx-auto" />
                <div className="flex items-start space-x-2">
                    <Skeleton className="h-14 flex-1" />
                    <Skeleton className="h-14 w-32" />
                </div>
            </div>
        </div>
    )
}

export default function KitchenPage() {
  const { currentUser } = useRole();

  const isKitchenStaff = currentUser.role === ROLES.KITCHEN;

  return (
    <div className={isKitchenStaff ? "kitchen-theme bg-background text-foreground h-full" : "h-full"}>
        <div className="container py-8 h-[calc(100vh-4rem)] flex flex-col justify-center">
        {isKitchenStaff ? (
            <Suspense fallback={<KitchenTerminalSkeleton />}>
                <KitchenTerminal />
            </Suspense>
        ) : (
            <AccessDenied />
        )}
        </div>
    </div>
  );
}
