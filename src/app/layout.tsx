import type { Metadata } from "next";
import { Poppins, PT_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/context/cart-context";
import { RoleProvider } from "@/context/role-context";
import { OrderProvider } from "@/context/order-context"; // <--- NEU

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
        <RoleProvider>
          <OrderProvider>
            {" "}
            {/* <--- NEU: Umschließt den CartProvider */}
            <CartProvider>{children}</CartProvider>
          </OrderProvider>
        </RoleProvider>
        <Toaster />
      </body>
    </html>
  );
}
