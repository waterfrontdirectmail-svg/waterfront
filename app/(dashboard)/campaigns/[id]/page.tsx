import { createClient, createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Phone, QrCode, Link2 } from "lucide-react";
import { notFound, redirect } from "next/navigation";

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
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const sb = createServiceClient();

  const { data: campaign } = await sb
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!campaign) notFound();

  const { data: tracking } = await sb
    .from("campaign_tracking")
    .select("*")
    .eq("campaign_id", id)
    .maybeSingle();

  const { data: order } = await sb
    .from("orders")
    .select("*")
    .eq("campaign_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const targetArea = campaign.target_area as any;

  // Status timeline
  const statusSteps = [
    { key: "draft", label: "Draft" },
    { key: "pending_review", label: "Under Review" },
    { key: "approved", label: "Approved" },
    { key: "in_production", label: "In Production" },
    { key: "mailed", label: "Mailed" },
    { key: "complete", label: "Complete" },
  ];
  const currentIdx = statusSteps.findIndex((s) => s.key === campaign.status);

  return (
    <div>
      <Link
        href="/campaigns"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4"
      >
        <ArrowLeft className="h-3 w-3" /> Back to Campaigns
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {campaign.name || "Untitled Campaign"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Created {fmtDate(campaign.created_at)}
          </p>
        </div>
        <StatusBadge status={campaign.status} />
      </div>

      {/* Status Timeline */}
      {campaign.status !== "cancelled" && (
        <Card className="mb-6">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, i) => {
                const done = i <= currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <div key={step.key} className="flex-1 flex flex-col items-center relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        done
                          ? "bg-[hsl(var(--deep-navy))] border-[hsl(var(--deep-navy))] text-white"
                          : "bg-white border-gray-200 text-gray-400"
                      } ${isCurrent ? "ring-2 ring-[hsl(var(--brass-gold))] ring-offset-2" : ""}`}
                    >
                      {i + 1}
                    </div>
                    <p
                      className={`text-xs mt-2 text-center ${
                        done ? "text-gray-900 font-medium" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    {/* Connector line */}
                    {i < statusSteps.length - 1 && (
                      <div
                        className={`absolute top-4 left-[calc(50%+16px)] right-[calc(-50%+16px)] h-0.5 ${
                          i < currentIdx ? "bg-[hsl(var(--deep-navy))]" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Mail Piece</span>
                <p className="font-medium capitalize">
                  {campaign.mail_piece_type?.replace(/_/g, " ") ?? "-"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Quantity</span>
                <p className="font-medium">{campaign.quantity?.toLocaleString() ?? "-"}</p>
              </div>
              <div>
                <span className="text-gray-500">Mail Date</span>
                <p className="font-medium">{fmtDate(campaign.mail_date)}</p>
              </div>
              <div>
                <span className="text-gray-500">Est. Delivery</span>
                <p className="font-medium">{fmtDate(campaign.estimated_delivery_date)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Target Area */}
          {targetArea && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Target Area</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                {targetArea.county && (
                  <p>
                    <span className="text-gray-500">County: </span>
                    <span className="font-medium">{targetArea.county}</span>
                  </p>
                )}
                {targetArea.zip_codes?.length > 0 && (
                  <p>
                    <span className="text-gray-500">Zip Codes: </span>
                    <span className="font-medium">{targetArea.zip_codes.join(", ")}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Design */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Design</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>
                <span className="text-gray-500">Front: </span>
                {campaign.design_front_url ? (
                  <a
                    href={campaign.design_front_url}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    View Design
                  </a>
                ) : (
                  <span className="text-gray-400">Not uploaded</span>
                )}
              </div>
              <div>
                <span className="text-gray-500">Back: </span>
                {campaign.design_back_url ? (
                  <a
                    href={campaign.design_back_url}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    View Design
                  </a>
                ) : (
                  <span className="text-gray-400">Not uploaded</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tracking / Response Data */}
          {tracking && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campaign Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tracking.callrail_number && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Tracking Phone Number</p>
                      <p className="font-medium">{tracking.callrail_number}</p>
                    </div>
                  </div>
                )}
                {tracking.qr_short_url && (
                  <div className="flex items-center gap-3 text-sm">
                    <QrCode className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">QR Code URL</p>
                      <p className="font-medium">{tracking.qr_short_url}</p>
                    </div>
                  </div>
                )}
                {tracking.tracking_url && (
                  <div className="flex items-center gap-3 text-sm">
                    <Link2 className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Tracking URL</p>
                      <p className="font-medium">{tracking.tracking_url}</p>
                    </div>
                  </div>
                )}
                <Separator />
                <p className="text-xs text-gray-400">
                  Response analytics will appear here once your campaign is mailed.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cost */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cost Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Cost</span>
                <span className="font-medium">{fmt(campaign.estimated_cost)}</span>
              </div>
              {campaign.actual_cost && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Actual Cost</span>
                  <span className="font-medium">{fmt(campaign.actual_cost)}</span>
                </div>
              )}
              <Separator />
              {order ? (
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment</span>
                  <span
                    className={`font-medium ${
                      order.status === "paid" ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {order.status === "paid" ? "Paid" : order.status}
                  </span>
                </div>
              ) : (
                <p className="text-gray-400 text-xs">No payment recorded</p>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {campaign.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {campaign.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Reorder */}
          {campaign.status === "complete" && (
            <Link href="/campaigns/new">
              <Button className="w-full bg-[hsl(var(--brass-gold))] text-[hsl(var(--deep-navy))]">
                Reorder This Campaign
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
