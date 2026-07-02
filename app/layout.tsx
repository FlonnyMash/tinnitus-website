import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppwritePing } from "@/components/appwrite-ping";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tinnitus – Rock Band",
    template: "%s | Tinnitus",
  },
  description:
    "Offizielle Website der Rockband Tinnitus. Termine, Setlists und News.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <AppwritePing />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
