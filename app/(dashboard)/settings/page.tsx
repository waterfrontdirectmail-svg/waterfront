"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [formInit, setFormInit] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    phone: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [pwMsg, setPwMsg] = useState("");

  // Populate form once profile loads
  if (profile && !formInit) {
    setFormInit(true);
    setForm({
      fullName: profile.full_name || "",
      companyName: profile.company_name || "",
      phone: profile.phone || "",
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.fullName,
        company_name: form.companyName,
        phone: form.phone,
      })
      .eq("id", user?.id);

    setLoading(false);
    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Saved");
      router.refresh();
    }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPwMsg("Passwords don't match");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPwMsg("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: passwordForm.newPassword,
    });

    setLoading(false);
    if (error) {
      setPwMsg(error.message);
    } else {
      setPwMsg("Password updated");
      setPasswordForm({ newPassword: "", confirmPassword: "" });
    }
  }

  if (authLoading) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input value={user?.email || ""} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-400 mt-1">
                  Contact support to change your email.
                </p>
              </div>

              <div>
                <Label>Full Name</Label>
                <Input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>

              <div>
                <Label>Company Name</Label>
                <Input
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(561) 555-0123"
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>

              {msg && (
                <p
                  className={`text-sm ${
                    msg === "Saved" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {msg}
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePassword} className="space-y-4">
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  placeholder="Min 8 characters"
                />
              </div>

              <div>
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>

              <Button type="submit" disabled={loading} variant="outline">
                Update Password
              </Button>

              {pwMsg && (
                <p
                  className={`text-sm ${
                    pwMsg === "Password updated" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {pwMsg}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
