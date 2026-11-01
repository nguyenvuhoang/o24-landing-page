import Link from "next/link";
export default function Forbidden() {
  return (
    <main className="p-12">
      <h1 className="text-3xl font-semibold">403 — Admin access required</h1>
      <p className="my-4">
        Your account is not authorized to use this workspace.
      </p>
      <Link href="/dashboard/login" className="underline">
        Switch account
      </Link>
    </main>
  );
}
