import Link from "next/link";
import { LogOut, ShieldCheck, Layers3, Clock3 } from "lucide-react";
import { DashboardNav, DashboardBreadcrumb } from "./DashboardNav";
export function DashboardShell({
  children,
  userEmail,
  signOutAction,
}: {
  children: React.ReactNode;
  userEmail?: string;
  signOutAction: () => Promise<void>;
}) {
  return (
    <div className="crm">
      <a href="#main-content" className="crm-skip">
        Skip to content
      </a>
      <div className="crm-shell">
        <aside className="crm-sidebar">
          <Link
            href="/dashboard"
            className="crm-brand"
            aria-label="vKnight enterprise workspace"
          >
            <span className="crm-brand-icon">
              <Layers3 size={23} aria-hidden="true" />
            </span>
            <span>
              vKnight
              <span className="crm-brand-subtitle">Enterprise workspace</span>
            </span>
          </Link>
          <div className="crm-sidebar-body">
            <p className="crm-nav-caption">Workspace</p>
            <DashboardNav />
          </div>
          <div className="crm-sidebar-footer">
            <ShieldCheck size={17} aria-hidden="true" />
            <div>
              <p>Admin access</p>
              <span>Private sales workspace</span>
            </div>
          </div>
        </aside>
        <div className="crm-workspace">
          <header className="crm-topbar">
            <DashboardBreadcrumb />
            <div className="crm-account">
              <span className="crm-timezone">
                <Clock3 size={14} aria-hidden="true" />
                UTC
              </span>
              <span className="crm-account-avatar" aria-hidden="true">
                {userEmail?.slice(0, 1).toUpperCase()}
              </span>
              <span className="crm-account-email" title={userEmail}>
                {userEmail}
              </span>
              <form action={signOutAction}>
                <button className="crm-signout" aria-label="Sign out">
                  <LogOut size={16} aria-hidden="true" />
                  <span>Sign out</span>
                </button>
              </form>
            </div>
          </header>
          <main id="main-content" tabIndex={-1} className="crm-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
