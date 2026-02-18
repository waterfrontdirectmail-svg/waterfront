"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Truck, DollarSign, Info } from "lucide-react";
import { calculateCampaignCost, FREE_DESIGN_THRESHOLD } from "@/lib/campaign-pricing";
import type { CampaignDraft } from "./types";

interface Props {
  draft: CampaignDraft;
  onUpdate: (data: Partial<CampaignDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0 && result.getDay() !== 6) added++;
  }
  return result;
}

const DESIGN_LABELS = { own: "Upload Your Own", template: "Template Design", custom: "Custom Design" };

export default function Step4Review({ draft, onUpdate, onNext, onBack }: Props) {
  const [mailDate, setMailDate] = useState(draft.mailDate);
  const [asap, setAsap] = useState(draft.asap);

  const cost = calculateCampaignCost(draft.audienceCount, draft.designOption);

  const baseDate = asap ? new Date() : mailDate ? new Date(mailDate) : null;
  const estStart = baseDate ? addBusinessDays(baseDate, 3) : null;
  const estEnd = baseDate ? addBusinessDays(baseDate, 7) : null;
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handleContinue = () => {
    onUpdate({ mailDate, asap });
    onNext();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[#1B2A4A]">Schedule & Review</h2>

      {/* Mail date */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-[#1B2A4A]">
          <Calendar className="w-5 h-5" />
          <h3 className="font-semibold">Preferred Mail Date</h3>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={asap}
              onChange={(e) => { setAsap(e.target.checked); if (e.target.checked) setMailDate(""); }}
              className="accent-[#1B2A4A]"
            />
            <span className="text-sm font-medium">ASAP</span>
          </label>
          {!asap && (
            <Input
              type="date"
              value={mailDate}
              onChange={(e) => setMailDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="max-w-[200px]"
            />
          )}
        </div>
        {(asap || mailDate) && estStart && estEnd && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Truck className="w-4 h-4" />
            Estimated delivery: {fmt(estStart)} – {fmt(estEnd)}
          </div>
        )}
      </Card>

      {/* Summary */}
      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-[#1B2A4A]">Campaign Summary</h3>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <span className="text-gray-500">Campaign Name</span>
          <span className="font-medium text-right">{draft.name}</span>

          <span className="text-gray-500">Mail Piece</span>
          <span className="font-medium text-right">{draft.mailPieceType}</span>

          <span className="text-gray-500">Goal</span>
          <span className="font-medium text-right">{draft.campaignGoal}</span>

          <span className="text-gray-500">Audience</span>
          <span className="font-medium text-right">
            {draft.audienceCount.toLocaleString()} homeowners
          </span>

          <span className="text-gray-500">Location</span>
          <span className="font-medium text-right">
            {draft.cities.join(", ")} ({draft.county} Co.)
          </span>

          <span className="text-gray-500">Design</span>
          <span className="font-medium text-right">
            {DESIGN_LABELS[draft.designOption]}
          </span>
        </div>
      </Card>

      {/* Cost breakdown */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-[#1B2A4A]">
          <DollarSign className="w-5 h-5" />
          <h3 className="font-semibold">Cost Breakdown</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">
              Printing & Mailing ({draft.audienceCount.toLocaleString()} × $1.50)
            </span>
            <span className="font-medium">${cost.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">
              Design Fee{cost.freeDesign ? " (waived — 5,000+ pieces)" : ""}
            </span>
            <span className="font-medium">
              {cost.freeDesign && draft.designOption !== "own" ? (
                <span><s className="text-gray-400">${calculateCampaignCost(0, draft.designOption).designFee || 0}</s> $0</span>
              ) : (
                `$${cost.designFee.toLocaleString()}`
              )}
            </span>
          </div>
          <hr />
          <div className="flex justify-between text-base font-bold text-[#1B2A4A]">
            <span>Total</span>
            <span>${cost.total.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-400">
            ${cost.perPiece.toFixed(2)}/piece all-in
          </p>
        </div>

        {draft.audienceCount < FREE_DESIGN_THRESHOLD && draft.designOption !== "own" && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            Orders over 5,000 pieces include free design service.
          </div>
        )}
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button
          onClick={handleContinue}
          disabled={!asap && !mailDate}
          className="flex-1 bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white disabled:opacity-50"
        >
          Continue to Checkout
        </Button>
      </div>
    </div>
  );
}
