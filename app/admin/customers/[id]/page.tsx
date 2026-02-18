import { createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Building, Calendar, DollarSign } from "lucide-react";
import { notFound } from "next/navigation";

function fmt(n: number | null) {
  if (n == null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

function fmtDate(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function fmtShort(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = createServiceClient();

  const { data: customer } = await sb
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!customer) notFound();

  const { data: campaigns } = await sb
    .from("campaigns")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  const { data: orders } = await sb
    .from("orders")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  const { data: exclusivity } = await sb
    .from("exclusivity")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  const totalSpend = (orders ?? [])
    .filter((o) => o.status === "paid")
    .reduce((s, o) => s + Number(o.amount), 0);

  const activeCampaigns = (campaigns ?? []).filter(
    (c) => !["draft", "complete", "cancelled"].includes(c.status)
  ).length;

  return (
    <div>
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4"
      >
        <ArrowLeft className="h-3 w-3" /> Back to Customers
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {customer.full_name || "Unnamed Customer"}
        </h1>
        {customer.company_name && (
          <p className="text-gray-500 mt-1">{customer.company_name}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{campaigns?.length ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">Total Campaigns</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{fmt(totalSpend)}</p>
                <p className="text-xs text-gray-500 mt-1">Total Spend</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{activeCampaigns}</p>
                <p className="text-xs text-gray-500 mt-1">Active Campaigns</p>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              {!campaigns?.length ? (
                <p className="text-sm text-gray-500">No campaigns yet.</p>
              ) : (
                <div className="space-y-3">
                  {campaigns.map((c: any) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <Link
                          href={`/admin/campaigns/${c.id}`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {c.name || "Untitled"}
                        </Link>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>{c.mail_piece_type?.replace(/_/g, " ") ?? "-"}</span>
                          <span>{c.quantity?.toLocaleString() ?? 0} pieces</span>
                          <span>{fmt(c.estimated_cost)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={c.status} />
                        <span className="text-xs text-gray-400">{fmtShort(c.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {!orders?.length ? (
                <p className="text-sm text-gray-500">No payments recorded.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-gray-600">Date</th>
                      <th className="text-right py-2 font-medium text-gray-600">Amount</th>
                      <th className="text-left py-2 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o: any) => (
                      <tr key={o.id} className="border-b border-gray-100">
                        <td className="py-2">{fmtShort(o.paid_at || o.created_at)}</td>
                        <td className="py-2 text-right font-medium">{fmt(o.amount)}</td>
                        <td className="py-2">
                          <Badge
                            variant="secondary"
                            className={
                              o.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : o.status === "refunded"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }
                          >
                            {o.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>

          {/* Exclusivity */}
          {exclusivity && exclusivity.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exclusivity Territories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exclusivity.map((e: any) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="text-sm">
                        <p className="font-medium capitalize">
                          {e.industry_category?.replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {e.territory_type}: {JSON.stringify(e.territory_value)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className={
                            e.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {e.status}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {fmtShort(e.start_date)} - {fmtShort(e.end_date)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Contact info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
                  {customer.email}
                </a>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer.company_name && (
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span>{customer.company_name}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Joined {fmtDate(customer.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Lifetime: {fmt(totalSpend)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
