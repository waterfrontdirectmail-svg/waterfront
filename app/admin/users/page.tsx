import { createClient, createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { UserSearch } from "@/components/admin/UserSearch";
import { RoleSelect } from "@/components/admin/RoleSelect";
import { InviteUserForm } from "@/components/admin/InviteUserForm";

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

  // Get current user to mark "you" badge
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  let query = sb
    .from("profiles")
    .select("*, campaigns(id)")
    .order("created_at", { ascending: false });

  if (params.q) {
    query = query.or(
      `full_name.ilike.%${params.q}%,email.ilike.%${params.q}%,company_name.ilike.%${params.q}%`
    );
  }

  const { data: users } = await query;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
                      {users.map((u: any) => {
                        const isSelf = u.id === currentUser?.id;
                        return (
                          <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-900">
                              {u.full_name || "-"}
                              {isSelf && (
                                <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                  you
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-gray-600">{u.email}</td>
                            <td className="p-3 text-gray-600">{u.company_name || "-"}</td>
                            <td className="p-3">
                              <RoleSelect
                                userId={u.id}
                                currentRole={u.role}
                                isSelf={isSelf}
                              />
                            </td>
                            <td className="p-3 text-right text-gray-700">
                              {u.campaigns?.length ?? 0}
                            </td>
                            <td className="p-3 text-gray-600">{fmtDate(u.created_at)}</td>
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

        {/* Invite form */}
        <div>
          <InviteUserForm />
        </div>
      </div>
    </div>
  );
}
