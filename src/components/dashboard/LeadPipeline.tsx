import { Check, CircleX } from "lucide-react";
import { type LeadStatus } from "@/lib/leads/domain";
import { label } from "./presentation";
const stages = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "DEMO_SCHEDULED",
  "WON",
] as const;
export function LeadPipeline({ status }: { status: LeadStatus }) {
  const current = stages.findIndex((s) => s === status);
  const lost = status === "LOST";
  return (
    <section
      className="crm-panel crm-pipeline"
      aria-label="Current lead pipeline"
    >
      <div className="crm-pipeline-heading">
        <h2>Lead pipeline</h2>
        {lost ? (
          <span className="crm-pipeline-lost">
            <CircleX size={15} aria-hidden="true" />
            Closed as lost
          </span>
        ) : (
          <span className="crm-small crm-muted">
            Stage {current + 1} of {stages.length}
          </span>
        )}
      </div>
      <ol aria-label="Pipeline stages" className="crm-pipeline-stages">
        {stages.map((stage, i) => {
          const done = !lost && i < current;
          const active = stage === status;
          return (
            <li
              key={stage}
              aria-current={active ? "step" : undefined}
              className={`${done ? "is-complete" : ""} ${active ? "is-current" : ""}`}
            >
              <span className="crm-stage-marker" aria-hidden="true">
                {done ? <Check size={14} /> : i + 1}
              </span>
              <span>{label(stage)}</span>
            </li>
          );
        })}
      </ol>
      {lost && (
        <p className="crm-small crm-muted mt-4">
          This lead is closed. Its notes and previous activity remain in the
          timeline.
        </p>
      )}
    </section>
  );
}
