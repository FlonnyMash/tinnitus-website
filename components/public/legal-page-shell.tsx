import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";

type LegalPageShellProps = {
  title: string;
  children: React.ReactNode;
};

export function LegalPageShell({ title, children }: LegalPageShellProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-28 md:pt-32">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-red-400"
        >
          <ArrowLeft className="size-4" />
          Zurück zur Startseite
        </Link>
        <h1 className="section-title">{title}</h1>
        <div className="prose-legal mt-10 space-y-8 text-zinc-300">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
