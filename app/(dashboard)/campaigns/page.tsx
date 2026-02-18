import { createClient, createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import Link from "next/link";
import { PlusCircle, Megaphone } from "lucide-react";

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

export default async function CampaignsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const sb = createServiceClient();

  const { data: campaigns } = await sb
    .from("campaigns")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Campaigns</h1>
        <Link href="/campaigns/new">
          <Button className="bg-[hsl(var(--brass-gold))] text-[hsl(var(--deep-navy))] hover:opacity-90">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      {!campaigns?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-700 mb-2">No campaigns yet</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Create your first direct mail campaign to reach waterfront homeowners in
              Palm Beach and Broward counties.
            </p>
            <Link href="/campaigns/new">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Campaign
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-600">Campaign</th>
                    <th className="text-left p-3 font-medium text-gray-600">Type</th>
                    <th className="text-left p-3 font-medium text-gray-600">Status</th>
                    <th className="text-right p-3 font-medium text-gray-600">Quantity</th>
                    <th className="text-right p-3 font-medium text-gray-600">Cost</th>
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
                          href={`/campaigns/${c.id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {c.name || "Untitled"}
                        </Link>
                      </td>
                      <td className="p-3 text-gray-600 capitalize">
                        {c.mail_piece_type?.replace(/_/g, " ") ?? "-"}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="p-3 text-right text-gray-700">
                        {c.quantity?.toLocaleString() ?? "-"}
                      </td>
                      <td className="p-3 text-right text-gray-700">{fmt(c.estimated_cost)}</td>
                      <td className="p-3 text-gray-600">{fmtDate(c.mail_date)}</td>
                      <td className="p-3 text-gray-600">{fmtDate(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
