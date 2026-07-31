import { Users, Crown, FolderOpen, BookOpen, HelpCircle, ClipboardList, IndianRupee, CheckCircle2 } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import StatCard from "@/components/admin/StatCard";
import RecentUsersTable, { type RecentUser } from "@/components/admin/RecentUsersTable";
import RecentTestsTable, { type RecentTest } from "@/components/admin/RecentTestsTable";
import QuickActions from "@/components/admin/QuickActions";
import ActivityTimeline, { type ActivityEvent } from "@/components/admin/ActivityTimeline";

async function getDashboardData() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    { count: totalUsers },
    { count: totalCategories },
    { count: totalTopics },
    { count: totalQuestions },
    { count: totalTests },
    { count: testsToday },
    { data: activeSubs },
    { data: payments },
    { data: recentProfiles },
    { data: recentTestsRaw },
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("categories").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("topics").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("questions").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("tests").select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("test_attempts")
      .select("*", { count: "exact", head: true })
      .gte("attempted_at", startOfToday.toISOString()),
    supabaseAdmin.from("subscriptions").select("email").eq("status", "active").eq("plan", "premium"),
    supabaseAdmin.from("payments").select("amount_inr"),
    supabaseAdmin.from("profiles").select("id, email, created_at").order("created_at", { ascending: false }).limit(5),
    supabaseAdmin
      .from("tests")
      .select("id, title, topic, price_inr, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const premiumEmails = new Set((activeSubs ?? []).map((s) => s.email));
  const totalRevenue = (payments ?? []).reduce((sum, p) => sum + (p.amount_inr || 0), 0);

  const recentUsers: RecentUser[] = (recentProfiles ?? []).map((p) => ({
    id: p.id,
    email: p.email,
    plan: premiumEmails.has(p.email) ? "premium" : "free",
    created_at: p.created_at,
  }));

  const recentTests: RecentTest[] = recentTestsRaw ?? [];

  // Merge recent signups + recent tests + recent payments into one activity feed
  const { data: recentPaymentsRaw } = await supabaseAdmin
    .from("payments")
    .select("id, email, amount_inr, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const events: ActivityEvent[] = [
    ...recentUsers.map((u) => ({
      id: `signup-${u.id}`,
      type: "signup" as const,
      description: `${u.email} signed up`,
      created_at: u.created_at,
    })),
    ...recentTests.map((t) => ({
      id: `test-${t.id}`,
      type: "test_created" as const,
      description: `Test "${t.title}" was created`,
      created_at: t.created_at,
    })),
    ...(recentPaymentsRaw ?? []).map((p) => ({
      id: `payment-${p.id}`,
      type: "payment" as const,
      description: `${p.email} paid ₹${p.amount_inr} for Premium`,
      created_at: p.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  return {
    totalUsers: totalUsers ?? 0,
    premiumUsers: premiumEmails.size,
    totalCategories: totalCategories ?? 0,
    totalTopics: totalTopics ?? 0,
    totalQuestions: totalQuestions ?? 0,
    totalTests: totalTests ?? 0,
    testsToday: testsToday ?? 0,
    totalRevenue,
    recentUsers,
    recentTests,
    events,
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const stats = [
    { label: "Total Users", value: data.totalUsers.toLocaleString(), icon: Users },
    { label: "Premium Users", value: data.premiumUsers.toLocaleString(), icon: Crown },
    { label: "Total Categories", value: data.totalCategories.toLocaleString(), icon: FolderOpen },
    { label: "Total Topics", value: data.totalTopics.toLocaleString(), icon: BookOpen },
    { label: "Total Questions", value: data.totalQuestions.toLocaleString(), icon: HelpCircle },
    { label: "Total Tests", value: data.totalTests.toLocaleString(), icon: ClipboardList },
    { label: "Total Revenue", value: `₹${data.totalRevenue.toLocaleString()}`, icon: IndianRupee },
    { label: "Tests Attempted Today", value: data.testsToday.toLocaleString(), icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RecentUsersTable users={data.recentUsers} />
          <RecentTestsTable tests={data.recentTests} />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <ActivityTimeline events={data.events} />
        </div>
      </div>
    </div>
  );
}
