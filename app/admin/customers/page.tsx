import { createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomerSearch } from "@/components/admin/CustomerSearch";
import { StatusBadge } from "@/components/admin/StatusBadge";
import Link from "next/link";
import { Users, DollarSign, Megaphone, TrendingUp } from "lucide-react";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(n);
}

function fmtDate(d: string | null) {
  if (!d) return "Never";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const sb = createServiceClient();

  // Get all customers
  let query = sb
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  if (params.q) {
    query = query.or(
      `full_name.ilike.%${params.q}%,email.ilike.%${params.q}%,company_name.ilike.%${params.q}%`
    );
  }

  const { data: customers } = await query;

  // Get all campaigns and orders for stats
  const { data: allCampaigns } = await sb
    .from("campaigns")
    .select("id, user_id, status, estimated_cost, created_at, updated_at");

  const { data: allOrders } = await sb
    .from("orders")
    .select("user_id, amount, status, paid_at")
    .eq("status", "paid");

  // Build per-customer stats
  const customerStats: Record<
    string,
    {
      campaignCount: number;
      activeCampaigns: number;
      totalSpend: number;
      lastActivity: string | null;
      latestStatus: string | null;
    }
  > = {};

  (allCampaigns ?? []).forEach((c) => {
    if (!customerStats[c.user_id]) {
      customerStats[c.user_id] = {
        campaignCount: 0,
        activeCampaigns: 0,
        totalSpend: 0,
        lastActivity: null,
        latestStatus: null,
      };
    }
    const s = customerStats[c.user_id];
    s.campaignCount++;
    if (!["draft", "complete", "cancelled"].includes(c.status)) {
      s.activeCampaigns++;
    }
    const ts = c.updated_at || c.created_at;
    if (!s.lastActivity || ts > s.lastActivity) {
      s.lastActivity = ts;
      s.latestStatus = c.status;
    }
  });

  (allOrders ?? []).forEach((o) => {
    if (!customerStats[o.user_id]) {
      customerStats[o.user_id] = {
        campaignCount: 0,
        activeCampaigns: 0,
        totalSpend: 0,
        lastActivity: null,
        latestStatus: null,
      };
    }
    customerStats[o.user_id].totalSpend += Number(o.amount);
  });

  // Summary stats
  const totalCustomers = customers?.length ?? 0;
  const totalSpend = Object.values(customerStats).reduce((s, c) => s + c.totalSpend, 0);
  const totalActiveCampaigns = Object.values(customerStats).reduce(
    (s, c) => s + c.activeCampaigns,
    0
  );
  const customersWithCampaigns = Object.values(customerStats).filter(
    (c) => c.campaignCount > 0
  ).length;

  const summaryCards = [
    { label: "Total Customers", value: totalCustomers, icon: Users, color: "text-blue-600" },
    { label: "Total Revenue", value: fmt(totalSpend), icon: DollarSign, color: "text-emerald-600" },
    {
      label: "Active Campaigns",
      value: totalActiveCampaigns,
      icon: Megaphone,
      color: "text-purple-600",
    },
    {
      label: "Conversion Rate",
      value: totalCustomers > 0 ? `${Math.round((customersWithCampaigns / totalCustomers) * 100)}%` : "0%",
      icon: TrendingUp,
      color: "text-amber-600",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customers</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{s.label}</CardTitle>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <CustomerSearch current={params.q || ""} />

      <Card className="mt-4">
        <CardContent className="p-0">
          {!customers?.length ? (
            <p className="text-sm text-gray-500 p-6">No customers yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-600">Customer</th>
                    <th className="text-left p-3 font-medium text-gray-600">Email</th>
                    <th className="text-left p-3 font-medium text-gray-600">Company</th>
                    <th className="text-right p-3 font-medium text-gray-600">Campaigns</th>
                    <th className="text-right p-3 font-medium text-gray-600">Active</th>
                    <th className="text-right p-3 font-medium text-gray-600">Total Spend</th>
                    <th className="text-left p-3 font-medium text-gray-600">Last Activity</th>
                    <th className="text-left p-3 font-medium text-gray-600">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c: any) => {
                    const stats = customerStats[c.id] || {
                      campaignCount: 0,
                      activeCampaigns: 0,
                      totalSpend: 0,
                      lastActivity: null,
                    };
                    return (
                      <tr
                        key={c.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-3">
                          <Link
                            href={`/admin/customers/${c.id}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {c.full_name || "Unnamed"}
                          </Link>
                        </td>
                        <td className="p-3 text-gray-600">{c.email}</td>
                        <td className="p-3 text-gray-600">{c.company_name || "-"}</td>
                        <td className="p-3 text-right text-gray-700">{stats.campaignCount}</td>
                        <td className="p-3 text-right">
                          {stats.activeCampaigns > 0 ? (
                            <Badge className="bg-green-100 text-green-800" variant="secondary">
                              {stats.activeCampaigns}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>
                        <td className="p-3 text-right font-medium text-gray-700">
                          {stats.totalSpend > 0 ? fmt(stats.totalSpend) : "-"}
                        </td>
                        <td className="p-3 text-gray-600 text-xs">
                          {fmtDate(stats.lastActivity)}
                        </td>
                        <td className="p-3 text-gray-600 text-xs">{fmtDate(c.created_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
