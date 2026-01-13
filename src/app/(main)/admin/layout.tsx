import { AdminDashboardWithSuspense } from "@/components/admin/admin-dashboard-loader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <AdminDashboardWithSuspense />
        </>
    );
}
