import { createClient, createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign } from "lucide-react";
import { redirect } from "next/navigation";

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
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const sb = createServiceClient();

  const { data: orders } = await sb
    .from("orders")
    .select("*, campaigns(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const totalPaid = (orders ?? [])
    .filter((o) => o.status === "paid")
    .reduce((s, o) => s + Number(o.amount), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Billing</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmt(totalPaid)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Payment Method
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Payments are processed via Stripe at checkout.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {!orders?.length ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              No payments yet. Payments will appear here after you complete a campaign order.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-600">Date</th>
                    <th className="text-left p-3 font-medium text-gray-600">Campaign</th>
                    <th className="text-right p-3 font-medium text-gray-600">Amount</th>
                    <th className="text-left p-3 font-medium text-gray-600">Status</th>
                    <th className="text-left p-3 font-medium text-gray-600">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o: any) => (
                    <tr key={o.id} className="border-b border-gray-100">
                      <td className="p-3 text-gray-600">
                        {fmtDate(o.paid_at || o.created_at)}
                      </td>
                      <td className="p-3 text-gray-700">
                        {o.campaigns?.name || "Untitled"}
                      </td>
                      <td className="p-3 text-right font-medium">{fmt(o.amount)}</td>
                      <td className="p-3">
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
                      <td className="p-3">
                        {o.receipt_url ? (
                          <a
                            href={o.receipt_url}
                            target="_blank"
                            className="text-blue-600 hover:underline text-xs"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
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
