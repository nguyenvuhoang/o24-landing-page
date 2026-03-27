import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background print:bg-slate-950">
            <div className="print:hidden">
                <Header />
            </div>
            <div className="flex pt-16 print:pt-0">
                <div className="print:hidden">
                    <Sidebar />
                </div>
                <main className="flex-1 pl-64 transition-all print:pl-0">
                    <div className="p-8 max-w-7xl mx-auto print:p-0 print:max-w-none">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
