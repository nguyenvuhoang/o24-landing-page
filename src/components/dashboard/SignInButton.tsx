"use client";
import { useFormStatus } from "react-dom";
export function SignInButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="w-full rounded-md bg-primary text-primary-foreground p-3 font-semibold disabled:opacity-60"
      aria-disabled={pending}
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}
