import { requireUser } from "@/lib/supabase/dal";
import { NavHeader } from "@/components/dashboard/nav-header";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <NavHeader />
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
