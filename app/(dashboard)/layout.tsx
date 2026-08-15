import { requireUser } from "@/lib/supabase/dal";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireUser();

  return (
    <div className="flex min-h-full flex-1">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
