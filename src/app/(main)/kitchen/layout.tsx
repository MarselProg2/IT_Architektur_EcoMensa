import { KitchenTerminalLoader } from "@/components/kitchen/kitchen-terminal-loader";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

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

export default function KitchenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // Theming and structure moved here from the page
        <div className="kitchen-theme bg-background text-foreground h-full">
            <div className="container py-8 h-[calc(100vh-4rem)] flex flex-col justify-center">
                {children}
                <Suspense fallback={<KitchenTerminalSkeleton />}>
                    <KitchenTerminalLoader />
                </Suspense>
            </div>
        </div>
    );
}
