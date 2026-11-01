import Link from "next/link";
import { requireAdmin } from "@/lib/leads/auth";
import { signOut } from "../login/actions";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background px-5 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link href="/dashboard" className="font-bold text-xl tracking-tight">
          vKnight <span className="text-primary">/</span>{" "}
          <span className="font-normal text-sm">Enterprise</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="max-w-48 truncate text-muted-foreground">
            {user?.email}
          </span>
          <form action={signOut}>
            <button className="hover:text-primary underline underline-offset-4">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1600px] flex-col md:flex-row">
        <aside className="border-b md:border-b-0 md:border-r md:w-56 shrink-0 p-5">
          <p className="text-xs text-muted-foreground tracking-widest uppercase mb-5">
            Sales workspace
          </p>
          <nav aria-label="Dashboard" className="flex md:flex-col gap-2">
            <Link
              className="rounded-md px-3 py-2 hover:bg-accent font-medium"
              href="/dashboard"
            >
              Overview
            </Link>
            <Link
              className="rounded-md px-3 py-2 hover:bg-accent font-medium"
              href="/dashboard/leads"
            >
              Enterprise leads
            </Link>
          </nav>
          <p className="hidden md:block text-xs text-muted-foreground mt-12 leading-relaxed">
            O24 Enterprise
            <br />
            Private admin workspace
            <br />
            All dates shown in UTC
          </p>
        </aside>
        <main id="main-content" className="min-w-0 flex-1 p-5 lg:p-9">
          {children}
        </main>
      </div>
    </div>
  );
}
