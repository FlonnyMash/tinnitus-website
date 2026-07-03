import type { Metadata } from "next";
import { LegalPageShell } from "@/components/public/legal-page-shell";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten auf der Tinnitus Band Website.",
};

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl tracking-wide text-white">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-zinc-400">{children}</div>
    </section>
  );
}

export default function DatenschutzPage() {
  return (
    <LegalPageShell title="Datenschutzerklärung">
      <p className="text-sm text-zinc-500">Stand: Juli 2026</p>

      <LegalSection title="1. Verantwortlicher">
        <p>
          Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
        </p>
        <p>
          Christian Bakan
          <br />
          Bajuwarenstr. 65
          <br />
          81825 München
          <br />
          Deutschland
        </p>
        <p>
          Telefon:{" "}
          <a
            href="tel:+4917645534760"
            className="text-red-400 transition-colors hover:text-red-300"
          >
            +49 176 45534760
          </a>
          <br />
          E-Mail:{" "}
          <a
            href="mailto:webmaster@tinnitus-band.de"
            className="text-red-400 transition-colors hover:text-red-300"
          >
            webmaster@tinnitus-band.de
          </a>
        </p>
      </LegalSection>

      <LegalSection title="2. Allgemeine Hinweise">
        <p>
          Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Wir
          verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung
          einer funktionsfähigen Website sowie unserer Inhalte und Leistungen
          erforderlich ist oder Sie uns Daten freiwillig mitteilen.
        </p>
        <p>
          Diese Datenschutzerklärung informiert Sie darüber, welche Daten wir
          erheben, zu welchem Zweck wir sie verarbeiten und welche Rechte Ihnen
          zustehen.
        </p>
      </LegalSection>

      <LegalSection title="3. Hosting und Server-Logfiles (Cloudflare Pages)">
        <p>
          Die öffentliche Website wird über{" "}
          <strong className="text-zinc-300">Cloudflare Pages</strong> bereitgestellt.
          Anbieter ist <strong className="text-zinc-300">Cloudflare, Inc.</strong>{" "}
          (101 Townsend St, San Francisco, CA 94107, USA). Beim Aufruf unserer
          Website werden dabei automatisch Informationen in sogenannten
          Server-Logfiles erfasst. Dies kann insbesondere folgende Daten umfassen:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>IP-Adresse</li>
          <li>Datum und Uhrzeit der Anfrage</li>
          <li>aufgerufene Seite bzw. Datei</li>
          <li>Referrer-URL</li>
          <li>Browsertyp und Browserversion</li>
          <li>verwendetes Betriebssystem</li>
        </ul>
        <p>
          Zur Auslieferung der Website kann Cloudflare zudem als Content Delivery
          Network (CDN) eingesetzt werden. Dabei können Anfragedaten an
          weltweit verteilte Edge-Server übermittelt werden, um die Website
          performant und verfügbar bereitzustellen.
        </p>
        <p>
          Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO
          zur Sicherstellung eines stabilen, sicheren und effizienten Betriebs
          der Website. Die Logdaten werden nur so lange gespeichert, wie dies
          für den Betrieb, die Sicherheit und die Fehleranalyse erforderlich ist,
          und anschließend gelöscht, sofern keine weitergehende Aufbewahrung zu
          Sicherheits- oder Nachweiszwecken erforderlich ist.
        </p>
        <p>
          Cloudflare fungiert als Auftragsverarbeiter im Sinne von Art. 28 DSGVO.
          Weitere Informationen finden Sie in der Datenschutzerklärung von
          Cloudflare unter{" "}
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-400 transition-colors hover:text-red-300"
          >
            cloudflare.com/privacypolicy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="4. Backend, Datenbank und Inhalte (Appwrite)">
        <p>
          Für Backend, Datenbank, Dateispeicher und Administrator-Authentifizierung
          nutzen wir <strong className="text-zinc-300">Appwrite Cloud</strong> mit
          Rechenzentrum in Frankfurt (Deutschland). Appwrite stellt insbesondere
          folgende Leistungen bereit:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Datenbank und Content-API (Termine, Setlists, SEO-Texte, Medien-Metadaten)</li>
          <li>Dateispeicher (Logos, Hero-Bilder, Bandfotos)</li>
          <li>Authentifizierung für den administrativen Bereich (<code className="text-zinc-300">/login</code>, <code className="text-zinc-300">/admin</code>)</li>
        </ul>
        <p>
          Beim Laden der Website kann Ihr Browser Verbindungen zu Appwrite
          herstellen, um Inhalte und Medien abzurufen. Dabei können technische
          Zugriffsdaten wie IP-Adresse, Zeitpunkt des Zugriffs, angeforderte
          Ressourcen und Browserinformationen verarbeitet werden. Rechtsgrundlage
          ist Art. 6 Abs. 1 lit. f DSGVO, da die Verarbeitung für die technische
          Bereitstellung der Website erforderlich ist. Eine gesonderte
          Verbindungsprüfung beim Seitenaufruf ist in Abschnitt 5 beschrieben.
        </p>
        <p>
          Appwrite fungiert als Auftragsverarbeiter im Sinne von Art. 28 DSGVO.
          Weitere Informationen finden Sie in der Datenschutzerklärung von
          Appwrite unter{" "}
          <a
            href="https://appwrite.io/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-400 transition-colors hover:text-red-300"
          >
            appwrite.io/privacy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="5. Verbindungsprüfung beim Seitenaufruf">
        <p>
          Beim Laden jeder Seite führt unsere Website eine technische
          Verbindungsprüfung (<code className="text-zinc-300">client.ping()</code>
          ) zum Appwrite-Dienst aus. Dabei wird eine Anfrage an den Appwrite-Endpunkt
          gesendet. Dabei können insbesondere IP-Adresse und Zeitpunkt der Anfrage
          verarbeitet werden.
        </p>
        <p>
          Zweck ist die Überprüfung der Erreichbarkeit des Backends. Rechtsgrundlage
          ist Art. 6 Abs. 1 lit. f DSGVO.
        </p>
      </LegalSection>

      <LegalSection title="6. Kontakt per E-Mail">
        <p>
          Wenn Sie uns per E-Mail kontaktieren, verarbeiten wir die von Ihnen
          mitgeteilten Daten (z. B. Name, E-Mail-Adresse, Inhalt der Nachricht)
          ausschließlich zur Bearbeitung Ihrer Anfrage.
        </p>
        <p>
          Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO,
          sofern Ihre Anfrage mit der Erfüllung eines Vertrags oder
          vorvertraglicher Maßnahmen zusammenhängt, andernfalls auf Grundlage von
          Art. 6 Abs. 1 lit. f DSGVO.
        </p>
        <p>
          Die Daten werden gelöscht, sobald die Anfrage abschließend bearbeitet
          wurde und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
          Bitte beachten Sie, dass die Übermittlung per E-Mail über Ihren
          jeweiligen E-Mail-Anbieter erfolgt.
        </p>
      </LegalSection>

      <LegalSection title="7. Administrator-Anmeldung">
        <p>
          Für den Zugriff auf den administrativen Bereich stellen wir unter{" "}
          <code className="text-zinc-300">/login</code> ein Anmeldeformular bereit.
          Dabei werden die von Ihnen eingegebenen Daten (E-Mail-Adresse und
          Passwort) über unsere Server an Appwrite Auth übermittelt, um Ihre
          Identität zu prüfen und eine Sitzung zu erstellen.
        </p>
        <p>
          Die Verarbeitung dient ausschließlich der Zugriffskontrolle auf den
          Administrationsbereich. Es werden keine öffentlichen Benutzerkonten
          angeboten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die
          Anmeldung zur Erfüllung administrativer Aufgaben erforderlich ist,
          andernfalls Art. 6 Abs. 1 lit. f DSGVO.
        </p>
        <p>
          Appwrite verarbeitet die Anmeldedaten als Auftragsverarbeiter im Sinne
          von Art. 28 DSGVO. Wir speichern Ihre Zugangsdaten nicht dauerhaft auf
          unseren eigenen Servern; nach erfolgreicher Anmeldung wird lediglich
          ein technisch notwendiges Session-Cookie gesetzt (siehe Abschnitt 8).
        </p>
      </LegalSection>

      <LegalSection title="8. Cookies und lokale Speicherung">
        <p>
          Unsere öffentliche Website setzt keine Tracking-Cookies und verwendet
          kein Analyse- oder Marketing-Tracking. Es findet keine Speicherung
          personenbezogener Daten in <code className="text-zinc-300">localStorage</code>{" "}
          oder <code className="text-zinc-300">sessionStorage</code> statt.
        </p>
        <p>
          Für den administrativen Bereich (<code className="text-zinc-300">/login</code>,{" "}
          <code className="text-zinc-300">/admin</code>) wird nach erfolgreicher
          Anmeldung ein technisch notwendiges Session-Cookie gesetzt
          (<code className="text-zinc-300">a_session_&lt;Projekt-ID&gt;</code>).
          Dieses Cookie ist HTTP-only, wird mit SameSite=Strict gesetzt und dient
          ausschließlich der Authentifizierung von Administratoren.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO bzw. Art. 6 Abs. 1 lit.
          b DSGVO, soweit die Anmeldung zur Vertragserfüllung im
          Administrationsbereich erforderlich ist.
        </p>
      </LegalSection>

      <LegalSection title="9. Schriftarten">
        <p>
          Für die Darstellung der Website verwenden wir Schriftarten über{" "}
          <code className="text-zinc-300">next/font/google</code> (Bebas Neue, DM
          Sans). Next.js bindet diese Schriftarten in der Regel lokal in die
          Website ein, sodass beim Seitenaufruf in der Regel keine direkten
          Verbindungen zu Google-Servern durch den Browser hergestellt werden.
        </p>
        <p>
          Soweit dennoch eine Verarbeitung personenbezogener Daten erfolgt,
          geschieht dies auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO zur
          einheitlichen und lesbaren Darstellung unserer Website.
        </p>
      </LegalSection>

      <LegalSection title="10. Links zu Social-Media-Plattformen">
        <p>
          Auf unserer Website befinden sich einfache Verlinkungen zu unseren
          Profilen auf Instagram und TikTok. Es werden keine Social-Media-Plugins,
          eingebettete Inhalte (Embeds), Tracking-Pixel oder vergleichbare
          Technologien dieser Plattformen auf unserer Website eingesetzt.
        </p>
        <p>
          Erst wenn Sie aktiv auf einen dieser Links klicken und die jeweilige
          Plattform besuchen, verarbeiten die Betreiber (Meta Platforms, Inc.
          bzw. ByteDance Ltd.) personenbezogene Daten nach deren eigenen
          Datenschutzbestimmungen und außerhalb unserer Verantwortlichkeit.
        </p>
        <p>
          Weitere Informationen finden Sie in den Datenschutzerklärungen der
          jeweiligen Anbieter:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Instagram:{" "}
            <a
              href="https://privacycenter.instagram.com/policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 transition-colors hover:text-red-300"
            >
              privacycenter.instagram.com/policy
            </a>
          </li>
          <li>
            TikTok:{" "}
            <a
              href="https://www.tiktok.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 transition-colors hover:text-red-300"
            >
              tiktok.com/legal/privacy-policy
            </a>
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="11. Keine Analyse-Tools">
        <p>
          Wir setzen derzeit keine Webanalyse-Tools, Social-Media-Plugins oder
          eingebettete Social-Media-Inhalte ein. Externe Social-Media-Links sind
          in Abschnitt 10 beschrieben. Es werden keine Newsletter-Formulare oder
          öffentlichen Kontaktformulare eingesetzt, die personenbezogene Daten auf
          unseren Servern speichern würden.
        </p>
      </LegalSection>

      <LegalSection title="12. Ihre Rechte">
        <p>Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
          <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
          <li>Recht auf Löschung (Art. 17 DSGVO)</li>
          <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
        </ul>
        <p>
          Zur Ausübung Ihrer Rechte genügt eine formlose Mitteilung an{" "}
          <a
            href="mailto:webmaster@tinnitus-band.de"
            className="text-red-400 transition-colors hover:text-red-300"
          >
            webmaster@tinnitus-band.de
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="13. Beschwerderecht">
        <p>
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über
          die Verarbeitung Ihrer personenbezogenen Daten zu beschweren. Für uns
          zuständig ist insbesondere:
        </p>
        <p>
          Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)
          <br />
          Promenade 18
          <br />
          91522 Ansbach
          <br />
          Deutschland
        </p>
      </LegalSection>

      <LegalSection title="14. Änderungen dieser Datenschutzerklärung">
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie
          stets den aktuellen rechtlichen Anforderungen entspricht oder
          Änderungen unserer Leistungen berücksichtigt. Für Ihren erneuten Besuch
          gilt dann die jeweils aktuelle Fassung.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
