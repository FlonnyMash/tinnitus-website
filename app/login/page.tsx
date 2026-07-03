import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    </div>
  );
}
