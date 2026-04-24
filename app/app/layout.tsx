import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "SmartVenue AI | Narendra Modi Stadium",
  description: "Next-generation AI-powered venue intelligence platform for the Narendra Modi Stadium. Real-time crowd management, smart routing, and personalized attendee experiences.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full antialiased dark ${inter.variable}`}>
      <body className="min-h-full flex flex-col font-sans bg-zinc-950 text-white">{children}</body>
    </html>
  );
}
