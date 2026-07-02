import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    redirectTo?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
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
