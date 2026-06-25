import type { Metadata } from "next";
import "./globals.css";
import { ModeProvider } from "@/context/ModeContext";

export const metadata: Metadata = {
  title: "元气制片",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="bg-[#08080c] text-noir-200 min-h-screen antialiased font-body">
        <ModeProvider>{children}</ModeProvider>
      </body>
    </html>
  );
}
