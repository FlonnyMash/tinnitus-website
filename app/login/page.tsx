import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/brand-logo";
import { LoginForm } from "@/components/admin/login-form";
import { DEFAULT_LOGO } from "@/lib/brand";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    redirectTo?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};

  return (
    <div className="dark flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <BrandLogo src={DEFAULT_LOGO} variant="admin" className="mb-8 h-10" />
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 text-zinc-100">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription className="text-zinc-400">
            Melden Sie sich mit Ihrem Appwrite-Administratorkonto an.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm
            error={params.error}
            redirectTo={params.redirectTo ?? "/admin"}
          />
        </CardContent>
      </Card>
      <Link href="/" className="mt-6">
        <Button variant="ghost" size="sm">
          Zurück zur Website
        </Button>
      </Link>
      <nav
        aria-label="Rechtliches"
        className="mt-8 flex items-center justify-center gap-x-6 text-sm"
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
    </div>
  );
}
