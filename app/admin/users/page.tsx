import { createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserSearch } from "@/components/admin/UserSearch";

function fmtDate(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const sb = createServiceClient();

  let query = sb
    .from("profiles")
    .select("*, campaigns(id)")
    .order("created_at", { ascending: false });

  if (params.q) {
    query = query.or(
      `name.ilike.%${params.q}%,email.ilike.%${params.q}%,company_name.ilike.%${params.q}%`
    );
  }

  const { data: users } = await query;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>

      <UserSearch current={params.q || ""} />

      <Card className="mt-4">
        <CardContent className="p-0">
          {!users?.length ? (
            <p className="text-sm text-gray-500 p-6">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-600">Name</th>
                    <th className="text-left p-3 font-medium text-gray-600">Email</th>
                    <th className="text-left p-3 font-medium text-gray-600">Company</th>
                    <th className="text-left p-3 font-medium text-gray-600">Role</th>
                    <th className="text-right p-3 font-medium text-gray-600">Campaigns</th>
                    <th className="text-left p-3 font-medium text-gray-600">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-900">{u.name || "-"}</td>
                      <td className="p-3 text-gray-600">{u.email}</td>
                      <td className="p-3 text-gray-600">{u.company_name || "-"}</td>
                      <td className="p-3">
                        <Badge
                          variant="secondary"
                          className={
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {u.role}
                        </Badge>
                      </td>
                      <td className="p-3 text-right text-gray-700">
                        {u.campaigns?.length ?? 0}
                      </td>
                      <td className="p-3 text-gray-600">{fmtDate(u.created_at)}</td>
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
