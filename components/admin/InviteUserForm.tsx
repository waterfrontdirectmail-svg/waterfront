"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";

export function InviteUserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    companyName: "",
    password: "",
    role: "customer",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    if (res.ok) {
      setMsg("User created successfully");
      setForm({ email: "", fullName: "", companyName: "", password: "", role: "customer" });
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "Failed to create user");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Invite User
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="ryan@example.com"
              required
            />
          </div>

          <div>
            <Label>Full Name</Label>
            <Input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Ryan Smith"
            />
          </div>

          <div>
            <Label>Company</Label>
            <Input
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              placeholder="Connxtion Ads"
            />
          </div>

          <div>
            <Label>Temporary Password *</Label>
            <Input
              type="text"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min 8 characters"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Share this with the user. They can change it after login.
            </p>
          </div>

          <div>
            <Label>Role</Label>
            <Select
              value={form.role}
              onValueChange={(v) => setForm({ ...form, role: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create User"}
          </Button>

          {msg && (
            <p
              className={`text-sm ${
                msg.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {msg}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
