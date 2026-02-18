"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLES = [
  { value: "customer", label: "Customer" },
  { value: "admin", label: "Admin" },
];

export function RoleSelect({
  userId,
  currentRole,
  isSelf,
}: {
  userId: string;
  currentRole: string;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleChange(newRole: string) {
    if (newRole === currentRole) return;
    setLoading(true);
    const res = await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to update role");
    }
  }

  return (
    <Select
      value={currentRole}
      onValueChange={handleChange}
      disabled={loading || isSelf}
    >
      <SelectTrigger className="w-28 h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((r) => (
          <SelectItem key={r.value} value={r.value}>
            {r.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
