import type { Metadata } from "next";
import { Poppins, PT_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

// 1. IMPORT HINZUFÜGEN
import { CartProvider } from "@/context/cart-context";
import { RoleProvider } from "@/context/role-context";

const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const fontPtSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

export const metadata: Metadata = {
  title: "EcoMensa",
  description: "Reducing food waste in university canteens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "font-body antialiased",
          fontPoppins.variable,
          fontPtSans.variable
        )}
      >
        {/* 2. PROVIDER UMSCHLIEßEN ALLES */}
        <RoleProvider>
          <CartProvider>{children}</CartProvider>
        </RoleProvider>

        <Toaster />
      </body>
    </html>
  );
}
