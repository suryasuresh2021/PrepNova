import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/Auth/SignOutButton";
import AdminTestsManager from "@/components/Admin/AdminTestsManager";

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/admin/login");

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-slate-900">Super Admin</h1>
        <SignOutButton />
      </div>
      <p className="font-body mt-2 text-slate-600">
        Create topic-wise practice tests and set a price for each one.
      </p>

      <AdminTestsManager />
    </main>
  );
}
