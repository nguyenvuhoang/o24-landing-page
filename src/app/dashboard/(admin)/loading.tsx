export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="crm-page crm-loading">
      <span className="sr-only">Loading enterprise workspace…</span>
      <div aria-hidden="true" className="crm-loading-header">
        <div className="crm-skeleton h-8 w-64 max-w-full" />
        <div className="crm-skeleton h-4 w-96 max-w-full mt-3" />
      </div>
      <div className="crm-kpis" aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => (
          <div className="crm-kpi" key={i}>
            <div className="crm-skeleton h-4 w-24" />
            <div className="crm-skeleton h-9 w-16 mt-5" />
          </div>
        ))}
      </div>
      <div className="crm-panel p-6 space-y-6" aria-hidden="true">
        <div className="crm-skeleton h-10 w-full" />
        {Array.from({ length: 5 }, (_, i) => (
          <div className="crm-skeleton h-14 w-full" key={i} />
        ))}
      </div>
    </div>
  );
}
