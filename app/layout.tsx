import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gerenciamento de Pedidos",
  description: "SaaS para gerenciamento de pedidos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={cn(inter.className, "bg-slate-50")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import "./globals.css";
import Providers from "./providers";
import { cn } from "@/lib/utils";
