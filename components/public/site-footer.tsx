import Link from "next/link";
import { Mail } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="kontakt"
      className="scroll-mt-20 border-t border-zinc-800 bg-zinc-950 py-16"
    >
      <div className="mx-auto max-w-6xl px-4 text-center">
        <p className="section-label">Kontakt aufnehmen</p>
        <h2 className="section-title mt-3">Lust auf einen Auftritt?</h2>
        <p className="mx-auto mt-4 max-w-md text-zinc-400">
          Schreib uns eine E-Mail – wir melden uns schnellstmöglich zurück.
        </p>
        <a
          href="mailto:webmaster@tinnitus-band.de"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-medium text-red-400 transition-all hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-300"
        >
          <Mail className="size-4" />
          webmaster@tinnitus-band.de
        </a>
        <nav
          aria-label="Rechtliches"
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
        >
          <Link
            href="/impressum"
            className="text-zinc-500 transition-colors hover:text-red-400"
          >
            Impressum
          </Link>
          <Link
            href="/datenschutz"
            className="text-zinc-500 transition-colors hover:text-red-400"
          >
            Datenschutzerklärung
          </Link>
        </nav>
        <p className="mt-8 text-sm text-zinc-600">
          © {year} Tinnitus. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
