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

const INDUSTRIES = [
  "dock_builder",
  "boat_dealer",
  "marine_insurance",
  "yacht_broker",
  "marine_contractor",
  "boat_lift",
  "seawall",
  "marine_electronics",
  "yacht_management",
  "waterfront_landscaping",
  "pool_company",
  "other",
];

export function ExclusivityForm({
  users,
}: {
  users: { id: string; full_name: string | null; email: string; company_name: string | null }[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    userId: "",
    industry: "",
    territoryType: "zip_codes",
    territoryValue: "",
    agreementType: "annual_commitment",
    startDate: "",
    endDate: "",
    premiumPaid: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const territoryValue =
      form.territoryType === "zip_codes"
        ? form.territoryValue.split(",").map((s) => s.trim())
        : form.territoryValue;

    const res = await fetch("/api/admin/exclusivity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: form.userId,
        industryCategory: form.industry,
        territoryType: form.territoryType,
        territoryValue,
        agreementType: form.agreementType,
        startDate: form.startDate,
        endDate: form.endDate || null,
        premiumPaid: form.premiumPaid ? Number(form.premiumPaid) : null,
      }),
    });

    setLoading(false);
    if (res.ok) {
      setMsg("Created");
      setForm({
        userId: "",
        industry: "",
        territoryType: "zip_codes",
        territoryValue: "",
        agreementType: "annual_commitment",
        startDate: "",
        endDate: "",
        premiumPaid: "",
      });
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "Failed");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">New Exclusivity</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Customer</Label>
            <Select value={form.userId} onValueChange={(v) => setForm({ ...form, userId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.company_name || u.full_name || u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Industry</Label>
            <Select value={form.industry} onValueChange={(v) => setForm({ ...form, industry: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Territory Type</Label>
            <Select
              value={form.territoryType}
              onValueChange={(v) => setForm({ ...form, territoryType: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zip_codes">Zip Codes</SelectItem>
                <SelectItem value="city">City</SelectItem>
                <SelectItem value="county">County</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>
              {form.territoryType === "zip_codes"
                ? "Zip Codes (comma separated)"
                : "Territory Value"}
            </Label>
            <Input
              value={form.territoryValue}
              onChange={(e) => setForm({ ...form, territoryValue: e.target.value })}
              placeholder={form.territoryType === "zip_codes" ? "33458, 33410" : "Jupiter"}
            />
          </div>

          <div>
            <Label>Agreement Type</Label>
            <Select
              value={form.agreementType}
              onValueChange={(v) => setForm({ ...form, agreementType: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annual_commitment">Annual Commitment</SelectItem>
                <SelectItem value="one_time_premium">One-Time Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Premium Paid ($)</Label>
            <Input
              type="number"
              value={form.premiumPaid}
              onChange={(e) => setForm({ ...form, premiumPaid: e.target.value })}
              placeholder="0"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Exclusivity"}
          </Button>

          {msg && (
            <p
              className={`text-sm ${msg === "Created" ? "text-green-600" : "text-red-600"}`}
            >
              {msg}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
