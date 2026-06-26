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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Noto+Serif+SC:wght@300;400;500;600;700;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#08080c] text-noir-200 min-h-screen antialiased font-body">
        <div className="aurora-bg" />
        <ModeProvider>{children}</ModeProvider>
      </body>
    </html>
  );
}
