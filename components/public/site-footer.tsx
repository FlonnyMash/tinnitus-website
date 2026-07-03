import Link from "next/link";
import { Mail } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

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
          aria-label="Social Media"
          className="mt-8 flex items-center justify-center gap-4"
        >
          <a
            href="https://www.instagram.com/tinnitus_bandofficial/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Tinnitus auf Instagram"
            className="inline-flex size-10 items-center justify-center rounded-full border border-zinc-800 text-zinc-500 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <InstagramIcon className="size-5" />
          </a>
          <a
            href="https://www.tiktok.com/@tinnitusbandofficial"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Tinnitus auf TikTok"
            className="inline-flex size-10 items-center justify-center rounded-full border border-zinc-800 text-zinc-500 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <TikTokIcon className="size-5" />
          </a>
        </nav>
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
