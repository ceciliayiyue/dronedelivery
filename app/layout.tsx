import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppStateProvider } from "@/components/app-state-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Instacart Drone MVP",
  description: "Autonomous grocery delivery MVP with customer and shopper flows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
