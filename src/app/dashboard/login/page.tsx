import { SignInButton } from "@/components/dashboard/SignInButton";
import { login, signOut } from "./actions";
import { adminSession } from "@/lib/leads/auth";
import { redirect } from "next/navigation";
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const s = await adminSession();
  if (s.status === 200) redirect("/dashboard");
  const p = await searchParams;
  return (
    <main className="min-h-[85vh] grid place-items-center p-6">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 space-y-6">
        <p className="text-primary font-bold tracking-wide">vKnight / O24</p>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Enterprise workspace
          </h1>
          <p className="mt-3 text-muted-foreground">
            Sign in with your provisioned admin account.
          </p>
        </div>
        {s.status === 403 ? (
          <>
            <p role="alert">
              403 — This account does not have admin access. Contact your
              administrator.
            </p>
            <form action={signOut}>
              <button className="underline">Sign out and switch account</button>
            </form>
          </>
        ) : (
          <form action={login} className="space-y-5">
            {p.error && (
              <p role="alert" className="text-destructive">
                Sign-in failed. Check your credentials and try again.
              </p>
            )}
            <label className="block text-sm">
              Work email
              <input
                name="email"
                type="email"
                required
                autoComplete="username"
                maxLength={254}
                className="mt-2 w-full rounded-md border bg-background p-3"
              />
            </label>
            <label className="block text-sm">
              Password
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                maxLength={1024}
                className="mt-2 w-full rounded-md border bg-background p-3"
              />
            </label>
            <SignInButton />
          </form>
        )}
        <p className="text-xs text-muted-foreground">
          Access is restricted to approved administrators.
        </p>
      </div>
    </main>
  );
}
