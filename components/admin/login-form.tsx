import { signIn } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormProps = {
  error?: string;
  redirectTo?: string;
};

export function LoginForm({ error, redirectTo = "/admin" }: LoginFormProps) {
  return (
    <form action={signIn} className="space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="border-zinc-700 bg-zinc-950"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          className="border-zinc-700 bg-zinc-950"
        />
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button type="submit" className="w-full bg-red-600 hover:bg-red-500">
        Sign in
      </Button>
    </form>
  );
}
