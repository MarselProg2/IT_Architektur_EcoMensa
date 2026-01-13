import { Header } from "@/components/header";
import { RoleProvider } from "@/context/role-context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProvider>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </RoleProvider>
  );
}
