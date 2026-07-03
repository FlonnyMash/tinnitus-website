import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import { AppwritePing } from "@/components/appwrite-ping";
import { Toaster } from "@/components/ui/sonner";
import { DEFAULT_LOGO } from "@/lib/brand";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tinnitus – Energiegeladene Rock-Coverband",
    template: "%s | Tinnitus",
  },
  description:
    "Wir sind eine junge energiegeladene Rock- und Punk-Rock-Coverband. Termine, Setlists und Live-Shows.",
  openGraph: {
    images: [{ url: DEFAULT_LOGO, alt: "Tinnitus" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_LOGO],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${bebasNeue.variable} ${dmSans.variable} h-full scroll-smooth bg-zinc-950 antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans">
        <AppwritePing />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
