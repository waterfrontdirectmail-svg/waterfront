import { createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { FulfillmentFilters } from "@/components/admin/FulfillmentFilters";
import Link from "next/link";

function fmtDate(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const FULFILLMENT_STATUSES = ["approved", "in_production", "mailed", "complete"];

export default async function AdminFulfillmentPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>;
}) {
  const params = await searchParams;
  const sb = createServiceClient();

  const stage = params.stage || "all";

  let query = sb
    .from("campaigns")
    .select("*, profiles(full_name, company_name)")
    .in("status", FULFILLMENT_STATUSES)
    .order("updated_at", { ascending: false });

  if (stage !== "all" && FULFILLMENT_STATUSES.includes(stage)) {
    query = sb
      .from("campaigns")
      .select("*, profiles(full_name, company_name)")
      .eq("status", stage)
      .order("updated_at", { ascending: false });
  }

  const { data: campaigns } = await query;

  // Group by status for summary counts
  const counts: Record<string, number> = {};
  (campaigns ?? []).forEach((c: any) => {
    counts[c.status] = (counts[c.status] || 0) + 1;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Fulfillment Pipeline</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {FULFILLMENT_STATUSES.map((s) => (
          <Card key={s}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{counts[s] || 0}</p>
              <p className="text-xs text-gray-500 capitalize mt-1">{s.replace(/_/g, " ")}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <FulfillmentFilters current={stage} />

      <Card className="mt-4">
        <CardContent className="p-0">
          {!campaigns?.length ? (
            <p className="text-sm text-gray-500 p-6">No campaigns in fulfillment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-600">Campaign</th>
                    <th className="text-left p-3 font-medium text-gray-600">Customer</th>
                    <th className="text-left p-3 font-medium text-gray-600">Status</th>
                    <th className="text-left p-3 font-medium text-gray-600">Type</th>
                    <th className="text-right p-3 font-medium text-gray-600">Qty</th>
                    <th className="text-left p-3 font-medium text-gray-600">Mail Date</th>
                    <th className="text-left p-3 font-medium text-gray-600">Design</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c: any) => (
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">
                        <Link
                          href={`/admin/campaigns/${c.id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {c.name || "Untitled"}
                        </Link>
                      </td>
                      <td className="p-3 text-gray-600">
                        {c.profiles?.company_name || c.profiles?.name || "-"}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="p-3 text-gray-600 capitalize">
                        {c.mail_piece_type?.replace(/_/g, " ") ?? "-"}
                      </td>
                      <td className="p-3 text-right text-gray-700">
                        {c.quantity?.toLocaleString() ?? "-"}
                      </td>
                      <td className="p-3 text-gray-600">{fmtDate(c.mail_date)}</td>
                      <td className="p-3">
                        {c.design_front_url ? (
                          <span className="text-green-600 text-xs">✓ Uploaded</span>
                        ) : (
                          <span className="text-gray-400 text-xs">Missing</span>
                        )}
                      </td>
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
