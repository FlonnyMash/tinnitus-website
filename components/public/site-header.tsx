"use client";

import { useLayoutEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { getLogoUrl } from "@/lib/brand";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  logoUrl?: string;
};

const navLinks = [
  { href: "#ueber-uns", label: "Über uns" },
  { href: "#auftritte", label: "Auftritte" },
  { href: "#kontakt", label: "Kontakt" },
];

export function SiteHeader({ logoUrl }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useLayoutEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-zinc-800/80 bg-zinc-950"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20">
        <Link
          href="/"
          className="flex items-center transition-opacity hover:opacity-80"
        >
          <BrandLogo src={getLogoUrl(logoUrl)} variant="header" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium uppercase tracking-widest text-zinc-400 transition-colors hover:text-red-400"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <nav className="border-t border-zinc-800 bg-zinc-950/95 px-4 py-4 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-sm font-medium uppercase tracking-widest text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-red-400"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
