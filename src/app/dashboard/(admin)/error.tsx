"use client";
import Link from "next/link";
import { CircleAlert, RotateCw, ArrowLeft } from "lucide-react";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div role="alert" className="crm-panel crm-state">
      <span className="crm-state-icon">
        <CircleAlert size={26} aria-hidden="true" />
      </span>
      <h1 className="crm-state-title">Unable to load this workspace</h1>
      <p>
        Your leads could not be loaded. Check your connection and try again. If
        this continues, contact your administrator.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="crm-button crm-button-primary">
          <RotateCw size={15} aria-hidden="true" />
          Try again
        </button>
        <Link href="/dashboard" className="crm-button crm-button-secondary">
          <ArrowLeft size={15} aria-hidden="true" />
          Overview
        </Link>
      </div>
    </div>
  );
}
