import { createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Megaphone, Users, Clock } from "lucide-react";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(n);
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending_review: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  in_production: "bg-purple-100 text-purple-800",
  mailed: "bg-green-100 text-green-800",
  complete: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

export default async function AdminDashboardPage() {
  const sb = createServiceClient();

  const [
    { data: paidOrders },
    { count: activeCampaigns },
    { count: totalUsers },
    { count: pendingReview },
    { data: recentCampaigns },
  ] = await Promise.all([
    sb.from("orders").select("amount").eq("status", "paid"),
    sb
      .from("campaigns")
      .select("*", { count: "exact", head: true })
      .not("status", "in", '("draft","complete","cancelled")'),
    sb.from("profiles").select("*", { count: "exact", head: true }),
    sb
      .from("campaigns")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_review"),
    sb
      .from("campaigns")
      .select("id, name, status, updated_at, profiles(full_name, company_name)")
      .order("updated_at", { ascending: false })
      .limit(10),
  ]);

  const totalRevenue = (paidOrders ?? []).reduce(
    (sum, o) => sum + Number(o.amount),
    0
  );

  const stats = [
    {
      label: "Total Revenue",
      value: fmt(totalRevenue),
      icon: DollarSign,
      color: "text-emerald-600",
    },
    {
      label: "Active Campaigns",
      value: activeCampaigns ?? 0,
      icon: Megaphone,
      color: "text-blue-600",
    },
    {
      label: "Total Users",
      value: totalUsers ?? 0,
      icon: Users,
      color: "text-purple-600",
    },
    {
      label: "Pending Review",
      value: pendingReview ?? 0,
      icon: Clock,
      color: "text-yellow-600",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {s.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {!recentCampaigns?.length ? (
            <p className="text-sm text-gray-500">No campaigns yet.</p>
          ) : (
            <div className="space-y-3">
              {recentCampaigns.map((c: any) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {c.name || "Untitled Campaign"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {c.profiles?.company_name || c.profiles?.name || "Unknown"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={statusColors[c.status] ?? "bg-gray-100"}
                      variant="secondary"
                    >
                      {c.status?.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {c.updated_at ? fmtDate(c.updated_at) : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
