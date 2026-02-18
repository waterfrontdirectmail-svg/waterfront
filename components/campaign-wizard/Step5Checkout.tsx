"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { calculateCampaignCost } from "@/lib/campaign-pricing";
import { CreditCard, CheckCircle2, ShieldCheck } from "lucide-react";
import type { CampaignDraft } from "./types";

interface Props {
  draft: CampaignDraft;
  onUpdate: (data: Partial<CampaignDraft>) => void;
  onBack: () => void;
}

export default function Step5Checkout({ draft, onUpdate, onBack }: Props) {
  const [termsAccepted, setTermsAccepted] = useState(draft.termsAccepted);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const cost = calculateCampaignCost(draft.audienceCount, draft.designOption);

  const handlePlaceOrder = async () => {
    setLoading(true);
    onUpdate({ termsAccepted });
    // TODO: Create campaign in Supabase, then redirect to Stripe Checkout
    await new Promise((r) => setTimeout(r, 1500)); // simulate
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="text-center py-16 max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#1B2A4A]">Campaign Submitted!</h2>
        <p className="text-gray-500">
          We&apos;ll review your campaign and get back to you within 24 hours.
          You&apos;ll receive a confirmation email shortly.
        </p>
        <Button
          className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white"
          onClick={() => window.location.href = "/dashboard"}
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-[#1B2A4A]">Checkout</h2>

      {/* Order summary */}
      <Card className="p-5 space-y-3">
        <h3 className="font-semibold text-[#1B2A4A]">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">{draft.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{draft.mailPieceType}</span>
            <span>{draft.audienceCount.toLocaleString()} pieces</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Printing & Mailing</span>
            <span>${cost.subtotal.toLocaleString()}</span>
          </div>
          {cost.designFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Design Fee</span>
              <span>${cost.designFee.toLocaleString()}</span>
            </div>
          )}
          <hr />
          <div className="flex justify-between text-lg font-bold text-[#1B2A4A]">
            <span>Total</span>
            <span>${cost.total.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* Stripe placeholder */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-[#1B2A4A]">
          <CreditCard className="w-5 h-5" />
          <h3 className="font-semibold">Payment</h3>
        </div>
        <div className="p-8 rounded-lg bg-gray-50 border border-dashed border-gray-300 text-center text-sm text-gray-400">
          Stripe Checkout will be integrated here
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4" />
          Secure payment powered by Stripe. Your card details are never stored on our servers.
        </div>
      </Card>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="accent-[#1B2A4A] mt-1"
        />
        <span className="text-sm text-gray-600">
          I agree to the{" "}
          <a href="/terms" className="text-[#C9A84C] underline">Terms of Service</a>{" "}
          and{" "}
          <a href="/privacy" className="text-[#C9A84C] underline">Privacy Policy</a>.
          I understand my campaign will be reviewed before printing.
        </span>
      </label>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button
          onClick={handlePlaceOrder}
          disabled={!termsAccepted || loading}
          className="flex-1 bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
}
