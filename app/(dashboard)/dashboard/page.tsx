import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import Link from "next/link";
import {
  Megaphone,
  Mail,
  MousePointerClick,
  PlusCircle,
  ArrowRight,
} from "lucide-react";

function fmt(n: number | null) {
  if (n == null) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(n);
}

function fmtDate(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const sb = createServiceClient();

  const [
    { data: profile },
    { data: campaigns },
    { data: orders },
  ] = await Promise.all([
    sb.from("profiles").select("*").eq("id", user.id).single(),
    sb
      .from("campaigns")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    sb
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "paid")
      .order("paid_at", { ascending: false }),
  ]);

  const totalCampaigns = campaigns?.length ?? 0;
  const activeCampaigns = (campaigns ?? []).filter(
    (c) => !["draft", "complete", "cancelled"].includes(c.status)
  );
  const totalPiecesMailed = (campaigns ?? [])
    .filter((c) => ["mailed", "complete"].includes(c.status))
    .reduce((s, c) => s + (c.quantity || 0), 0);
  const totalSpent = (orders ?? []).reduce((s, o) => s + Number(o.amount), 0);

  const recentCampaigns = (campaigns ?? []).slice(0, 5);

  return (
    <div>
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here&apos;s what&apos;s happening with your campaigns.
          </p>
        </div>
        <Link href="/campaigns/new" className="shrink-0">
          <Button className="w-full sm:w-auto bg-[hsl(var(--brass-gold))] text-[hsl(var(--deep-navy))] hover:opacity-90">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Campaigns
            </CardTitle>
            <Megaphone className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCampaigns}</div>
            {activeCampaigns.length > 0 && (
              <p className="text-xs text-green-600 mt-1">
                {activeCampaigns.length} active
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pieces Mailed
            </CardTitle>
            <Mail className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPiecesMailed.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Responses
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-400">-</div>
            <p className="text-xs text-gray-400 mt-1">Coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmt(totalSpent)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Campaigns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Campaigns</CardTitle>
              {totalCampaigns > 5 && (
                <Link
                  href="/campaigns"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </CardHeader>
            <CardContent>
              {recentCampaigns.length === 0 ? (
                <div className="text-center py-8">
                  <Megaphone className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-4">
                    No campaigns yet. Start your first direct mail campaign!
                  </p>
                  <Link href="/campaigns/new">
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Campaign
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentCampaigns.map((c: any) => (
                    <Link
                      key={c.id}
                      href={`/campaigns/${c.id}`}
                      className="flex items-center justify-between py-3 px-3 -mx-3 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {c.name || "Untitled Campaign"}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          {c.mail_piece_type && (
                            <span className="capitalize">
                              {c.mail_piece_type.replace(/_/g, " ")}
                            </span>
                          )}
                          {c.quantity && (
                            <span>{c.quantity.toLocaleString()} pieces</span>
                          )}
                          {c.estimated_cost && <span>{fmt(c.estimated_cost)}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={c.status} />
                        <span className="text-xs text-gray-400">
                          {fmtDate(c.created_at)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/campaigns/new" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Start New Campaign
                </Button>
              </Link>
              <Link href="/explore" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <MousePointerClick className="h-4 w-4 mr-2" />
                  Explore Coverage
                </Button>
              </Link>
              <Link href="/billing" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  View Invoices
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {!orders?.length ? (
                <p className="text-sm text-gray-500">No payments yet.</p>
              ) : (
                <div className="space-y-2">
                  {orders.slice(0, 5).map((o: any) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between text-sm py-1"
                    >
                      <span className="text-gray-600">
                        {fmtDate(o.paid_at || o.created_at)}
                      </span>
                      <span className="font-medium">{fmt(o.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
