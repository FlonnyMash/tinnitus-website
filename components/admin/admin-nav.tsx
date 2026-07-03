"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGO } from "@/lib/brand";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/gigs", label: "Gigs" },
  { href: "/admin/setlists", label: "Setlists" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/seo", label: "SEO" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-red-500">
            Admin Panel
          </p>
          <div className="mt-1 flex items-center gap-2">
            <BrandLogo src={DEFAULT_LOGO} variant="admin" />
            <span className="text-sm font-medium text-zinc-400">CMS</span>
          </div>
        </div>
        <nav className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                pathname === link.href
                  ? "bg-red-600 text-white"
                  : "text-zinc-300 hover:bg-zinc-900 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
