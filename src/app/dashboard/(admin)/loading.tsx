export default function Loading() {
  return (
    <div
      role="status"
      className="space-y-6 animate-pulse motion-reduce:animate-none"
    >
      <p>Loading enterprise workspace…</p>
      <div className="h-36 rounded-lg bg-muted" />
      <div className="h-72 rounded-lg bg-muted" />
    </div>
  );
}
