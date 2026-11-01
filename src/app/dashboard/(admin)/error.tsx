"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div role="alert" className="rounded-lg border p-8">
      <h1 className="text-2xl font-semibold">Unable to load this workspace</h1>
      <p className="my-4 text-muted-foreground">
        Check your connection and try again. If this continues, ask an
        administrator to verify the dashboard migration.
      </p>
      <button onClick={reset} className="rounded-md border px-4 py-2">
        Try again
      </button>
    </div>
  );
}
