import { createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExclusivityForm } from "@/components/admin/ExclusivityForm";

function fmtDate(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmt(n: number | null) {
  if (n == null) return "-";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

export default async function AdminExclusivityPage() {
  const sb = createServiceClient();

  const { data: records } = await sb
    .from("exclusivity")
    .select("*, profiles(name, email, company_name)")
    .order("created_at", { ascending: false });

  const { data: users } = await sb
    .from("profiles")
    .select("id, name, email, company_name")
    .order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Exclusivity Territories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {!records?.length ? (
                <p className="text-sm text-gray-500 p-6">No exclusivity records.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 font-medium text-gray-600">Customer</th>
                        <th className="text-left p-3 font-medium text-gray-600">Industry</th>
                        <th className="text-left p-3 font-medium text-gray-600">Territory</th>
                        <th className="text-left p-3 font-medium text-gray-600">Agreement</th>
                        <th className="text-left p-3 font-medium text-gray-600">Status</th>
                        <th className="text-left p-3 font-medium text-gray-600">Dates</th>
                        <th className="text-right p-3 font-medium text-gray-600">Premium</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((r: any) => {
                        const territory =
                          r.territory_type === "zip_codes"
                            ? (r.territory_value as string[])?.join(", ")
                            : JSON.stringify(r.territory_value);
                        return (
                          <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-medium">
                              {r.profiles?.company_name || r.profiles?.name || r.profiles?.email || "-"}
                            </td>
                            <td className="p-3 text-gray-600 capitalize">
                              {r.industry_category?.replace(/_/g, " ")}
                            </td>
                            <td className="p-3 text-gray-600">
                              <span className="text-xs text-gray-400">{r.territory_type}: </span>
                              {territory}
                            </td>
                            <td className="p-3 text-gray-600 capitalize">
                              {r.agreement_type?.replace(/_/g, " ")}
                            </td>
                            <td className="p-3">
                              <Badge
                                variant="secondary"
                                className={
                                  r.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : r.status === "expired"
                                    ? "bg-gray-100 text-gray-700"
                                    : "bg-red-100 text-red-700"
                                }
                              >
                                {r.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-gray-600 text-xs">
                              {fmtDate(r.start_date)} - {fmtDate(r.end_date)}
                            </td>
                            <td className="p-3 text-right text-gray-700">{fmt(r.premium_paid)}</td>
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

        {/* Create Form */}
        <div>
          <ExclusivityForm users={users ?? []} />
        </div>
      </div>
    </div>
  );
}
