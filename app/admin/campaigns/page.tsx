import { createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CampaignFilters } from "@/components/admin/CampaignFilters";
import Link from "next/link";

function fmt(n: number | null) {
  if (n == null) return "-";
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

export default async function AdminCampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const sb = createServiceClient();

  let query = sb
    .from("campaigns")
    .select("*, profiles(name, email, company_name)")
    .order("created_at", { ascending: false });

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  const { data: campaigns } = await query;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Campaigns</h1>

      <CampaignFilters current={params.status || "all"} />

      <Card className="mt-4">
        <CardContent className="p-0">
          {!campaigns?.length ? (
            <p className="text-sm text-gray-500 p-6">No campaigns found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-600">Campaign</th>
                    <th className="text-left p-3 font-medium text-gray-600">Customer</th>
                    <th className="text-left p-3 font-medium text-gray-600">Status</th>
                    <th className="text-right p-3 font-medium text-gray-600">Qty</th>
                    <th className="text-right p-3 font-medium text-gray-600">Est. Cost</th>
                    <th className="text-left p-3 font-medium text-gray-600">Mail Date</th>
                    <th className="text-left p-3 font-medium text-gray-600">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c: any) => (
                    <tr
                      key={c.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3">
                        <Link
                          href={`/admin/campaigns/${c.id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {c.name || "Untitled"}
                        </Link>
                      </td>
                      <td className="p-3 text-gray-600">
                        {c.profiles?.company_name || c.profiles?.name || c.profiles?.email || "-"}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="p-3 text-right text-gray-700">
                        {c.quantity?.toLocaleString() ?? "-"}
                      </td>
                      <td className="p-3 text-right text-gray-700">
                        {fmt(c.estimated_cost)}
                      </td>
                      <td className="p-3 text-gray-600">{fmtDate(c.mail_date)}</td>
                      <td className="p-3 text-gray-600">{fmtDate(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
