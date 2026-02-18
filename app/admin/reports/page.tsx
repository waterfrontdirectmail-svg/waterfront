import { createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(n);
}

export default async function AdminReportsPage() {
  const sb = createServiceClient();

  const [
    { data: paidOrders },
    { data: campaigns },
    { data: coverage },
  ] = await Promise.all([
    sb.from("orders").select("amount, paid_at, user_id, profiles(full_name, company_name)").eq("status", "paid").order("paid_at", { ascending: false }),
    sb.from("campaigns").select("status"),
    sb.from("coverage_counts").select("county, city, homeowner_count"),
  ]);

  // Revenue by month
  const revenueByMonth: Record<string, number> = {};
  (paidOrders ?? []).forEach((o: any) => {
    if (!o.paid_at) return;
    const key = new Date(o.paid_at).toLocaleDateString("en-US", { year: "numeric", month: "short" });
    revenueByMonth[key] = (revenueByMonth[key] || 0) + Number(o.amount);
  });

  // Campaigns by status
  const campaignsByStatus: Record<string, number> = {};
  (campaigns ?? []).forEach((c: any) => {
    campaignsByStatus[c.status] = (campaignsByStatus[c.status] || 0) + 1;
  });

  // Top customers
  const customerRevenue: Record<string, { name: string; total: number }> = {};
  (paidOrders ?? []).forEach((o: any) => {
    const name = o.profiles?.company_name || o.profiles?.full_name || "Unknown";
    if (!customerRevenue[o.user_id]) {
      customerRevenue[o.user_id] = { name, total: 0 };
    }
    customerRevenue[o.user_id].total += Number(o.amount);
  });
  const topCustomers = Object.values(customerRevenue)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Coverage by county
  const coverageByCounty: Record<string, { cities: number; homeowners: number }> = {};
  (coverage ?? []).forEach((c: any) => {
    if (!coverageByCounty[c.county]) {
      coverageByCounty[c.county] = { cities: 0, homeowners: 0 };
    }
    coverageByCounty[c.county].homeowners += c.homeowner_count;
  });
  // Count unique cities per county
  const citySet: Record<string, Set<string>> = {};
  (coverage ?? []).forEach((c: any) => {
    if (!citySet[c.county]) citySet[c.county] = new Set();
    citySet[c.county].add(c.city);
  });
  Object.keys(citySet).forEach((county) => {
    if (coverageByCounty[county]) {
      coverageByCounty[county].cities = citySet[county].size;
    }
  });

  const totalHomeowners = Object.values(coverageByCounty).reduce((s, c) => s + c.homeowners, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Month */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue by Month</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(revenueByMonth).length === 0 ? (
              <p className="text-sm text-gray-500">No revenue recorded yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-gray-600">Month</th>
                    <th className="text-right py-2 font-medium text-gray-600">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(revenueByMonth).map(([month, amount]) => (
                    <tr key={month} className="border-b border-gray-100">
                      <td className="py-2">{month}</td>
                      <td className="py-2 text-right font-medium">{fmt(amount)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td className="py-2">Total</td>
                    <td className="py-2 text-right">
                      {fmt(Object.values(revenueByMonth).reduce((s, v) => s + v, 0))}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Campaigns by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Campaigns by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(campaignsByStatus).length === 0 ? (
              <p className="text-sm text-gray-500">No campaigns yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-gray-600">Status</th>
                    <th className="text-right py-2 font-medium text-gray-600">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(campaignsByStatus).map(([status, count]) => (
                    <tr key={status} className="border-b border-gray-100">
                      <td className="py-2 capitalize">{status.replace(/_/g, " ")}</td>
                      <td className="py-2 text-right font-medium">{count}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td className="py-2">Total</td>
                    <td className="py-2 text-right">
                      {Object.values(campaignsByStatus).reduce((s, v) => s + v, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Customers by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {topCustomers.length === 0 ? (
              <p className="text-sm text-gray-500">No paying customers yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-gray-600">Customer</th>
                    <th className="text-right py-2 font-medium text-gray-600">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((c, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2">{c.name}</td>
                      <td className="py-2 text-right font-medium">{fmt(c.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Coverage Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Coverage Data Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-4">
              {totalHomeowners.toLocaleString()}{" "}
              <span className="text-sm font-normal text-gray-500">total homeowners</span>
            </p>
            {Object.keys(coverageByCounty).length === 0 ? (
              <p className="text-sm text-gray-500">No coverage data loaded.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-gray-600">County</th>
                    <th className="text-right py-2 font-medium text-gray-600">Cities</th>
                    <th className="text-right py-2 font-medium text-gray-600">Homeowners</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(coverageByCounty)
                    .sort((a, b) => b[1].homeowners - a[1].homeowners)
                    .map(([county, data]) => (
                      <tr key={county} className="border-b border-gray-100">
                        <td className="py-2">{county}</td>
                        <td className="py-2 text-right">{data.cities}</td>
                        <td className="py-2 text-right font-medium">
                          {data.homeowners.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
