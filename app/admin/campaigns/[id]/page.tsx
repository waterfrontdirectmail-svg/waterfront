import { createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CampaignActions } from "@/components/admin/CampaignActions";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

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

export default async function AdminCampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = createServiceClient();

  const { data: campaign } = await sb
    .from("campaigns")
    .select("*, profiles(full_name, email, company_name, phone)")
    .eq("id", id)
    .single();

  if (!campaign) notFound();

  const { data: order } = await sb
    .from("orders")
    .select("*")
    .eq("campaign_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { count: addressCount } = await sb
    .from("addresses")
    .select("*", { count: "exact", head: true })
    .eq("campaign_id", id);

  const { data: tracking } = await sb
    .from("campaign_tracking")
    .select("*")
    .eq("campaign_id", id)
    .maybeSingle();

  const targetArea = campaign.target_area as any;

  return (
    <div>
      <Link
        href="/admin/campaigns"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4"
      >
        <ArrowLeft className="h-3 w-3" /> Back to Campaigns
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {campaign.name || "Untitled Campaign"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">ID: {campaign.id}</p>
        </div>
        <StatusBadge status={campaign.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Mail Piece Type</span>
                <p className="font-medium">{campaign.mail_piece_type?.replace(/_/g, " ") ?? "-"}</p>
              </div>
              <div>
                <span className="text-gray-500">Quantity</span>
                <p className="font-medium">{campaign.quantity?.toLocaleString() ?? "-"}</p>
              </div>
              <div>
                <span className="text-gray-500">Estimated Cost</span>
                <p className="font-medium">{fmt(campaign.estimated_cost)}</p>
              </div>
              <div>
                <span className="text-gray-500">Actual Cost</span>
                <p className="font-medium">{fmt(campaign.actual_cost)}</p>
              </div>
              <div>
                <span className="text-gray-500">Mail Date</span>
                <p className="font-medium">{fmtDate(campaign.mail_date)}</p>
              </div>
              <div>
                <span className="text-gray-500">Est. Delivery</span>
                <p className="font-medium">{fmtDate(campaign.estimated_delivery_date)}</p>
              </div>
              <div>
                <span className="text-gray-500">Addresses Loaded</span>
                <p className="font-medium">{addressCount?.toLocaleString() ?? 0}</p>
              </div>
              <div>
                <span className="text-gray-500">Created</span>
                <p className="font-medium">{fmtDate(campaign.created_at)}</p>
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
                  <div>
                    <span className="text-gray-500">County: </span>
                    <span className="font-medium">{targetArea.county}</span>
                  </div>
                )}
                {targetArea.zip_codes?.length > 0 && (
                  <div>
                    <span className="text-gray-500">Zip Codes: </span>
                    <span className="font-medium">{targetArea.zip_codes.join(", ")}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Design */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Design Files</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>
                <span className="text-gray-500">Front: </span>
                {campaign.design_front_url ? (
                  <a href={campaign.design_front_url} target="_blank" className="text-blue-600 hover:underline">
                    View Front
                  </a>
                ) : (
                  <span className="text-gray-400">Not uploaded</span>
                )}
              </div>
              <div>
                <span className="text-gray-500">Back: </span>
                {campaign.design_back_url ? (
                  <a href={campaign.design_back_url} target="_blank" className="text-blue-600 hover:underline">
                    View Back
                  </a>
                ) : (
                  <span className="text-gray-400">Not uploaded</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {campaign.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{campaign.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-medium">{campaign.profiles?.full_name ?? "-"}</p>
              <p className="text-gray-500">{campaign.profiles?.company_name}</p>
              <p className="text-gray-500">{campaign.profiles?.email}</p>
              <p className="text-gray-500">{campaign.profiles?.phone}</p>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              {order ? (
                <>
                  <p>
                    <span className="text-gray-500">Amount:</span>{" "}
                    <span className="font-medium">{fmt(order.amount)}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Status:</span>{" "}
                    <span className="font-medium capitalize">{order.status}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Paid:</span>{" "}
                    <span className="font-medium">{fmtDate(order.paid_at)}</span>
                  </p>
                </>
              ) : (
                <p className="text-gray-400">No payment recorded</p>
              )}
            </CardContent>
          </Card>

          {/* Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tracking</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              {tracking ? (
                <>
                  {tracking.callrail_number && (
                    <p>
                      <span className="text-gray-500">Phone:</span>{" "}
                      <span className="font-medium">{tracking.callrail_number}</span>
                    </p>
                  )}
                  {tracking.qr_short_url && (
                    <p>
                      <span className="text-gray-500">QR URL:</span>{" "}
                      <span className="font-medium">{tracking.qr_short_url}</span>
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-400">Not configured</p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <CampaignActions campaignId={campaign.id} currentStatus={campaign.status} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
