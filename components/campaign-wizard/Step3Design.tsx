"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Palette, PenTool, Check, ImageIcon, Star } from "lucide-react";
import { DESIGN_FEES, FREE_DESIGN_THRESHOLD } from "@/lib/campaign-pricing";
import type { DesignOption } from "@/lib/campaign-pricing";
import type { CampaignDraft } from "./types";

interface Props {
  draft: CampaignDraft;
  onUpdate: (data: Partial<CampaignDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

const OPTIONS: { key: DesignOption; label: string; desc: string; icon: React.ReactNode; price: string }[] = [
  { key: "own", label: "Upload Your Own", desc: "Upload print-ready files", icon: <Upload className="w-6 h-6" />, price: "Free" },
  { key: "template", label: "Choose a Template", desc: "Pick from our gallery", icon: <Palette className="w-6 h-6" />, price: "$250" },
  { key: "custom", label: "Request Custom Design", desc: "Our team designs for you", icon: <PenTool className="w-6 h-6" />, price: "$750" },
];

const TEMPLATES = Array.from({ length: 6 }, (_, i) => ({ id: `tpl-${i + 1}`, name: `Template ${i + 1}` }));

function DropZone({ label, file, onFile }: { label: string; file: File | null; onFile: (f: File) => void }) {
  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#C9A84C] transition-colors cursor-pointer"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]); }}
      onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pdf,.png,.jpg,.jpeg";
        input.onchange = (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) onFile(f); };
        input.click();
      }}
    >
      {file ? (
        <div className="flex items-center justify-center gap-2 text-[#1B2A4A]">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium">{file.name}</span>
        </div>
      ) : (
        <>
          <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xs text-gray-400 mt-1">PDF, PNG, or JPG</p>
        </>
      )}
    </div>
  );
}

export default function Step3Design({ draft, onUpdate, onNext, onBack }: Props) {
  const [designOption, setDesignOption] = useState<DesignOption>(draft.designOption);
  const [uploadFront, setUploadFront] = useState<File | null>(draft.uploadFront);
  const [uploadBack, setUploadBack] = useState<File | null>(draft.uploadBack);
  const [templateId, setTemplateId] = useState(draft.templateId);
  const [brief, setBrief] = useState(draft.creativeBrief);

  const freeDesign = draft.audienceCount >= FREE_DESIGN_THRESHOLD;

  const handleContinue = () => {
    onUpdate({ designOption, uploadFront, uploadBack, templateId, creativeBrief: brief });
    onNext();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[#1B2A4A]">Design Your Mail Piece</h2>
      <p className="text-gray-500">Choose how you&apos;d like to handle the creative.</p>

      {freeDesign && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#1B2A4A]">
          <Star className="w-5 h-5 text-[#C9A84C]" />
          <p className="text-sm font-medium">Your order of {draft.audienceCount.toLocaleString()}+ pieces qualifies for free design!</p>
        </div>
      )}

      {/* Option cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {OPTIONS.map((opt) => (
          <Card
            key={opt.key}
            className={`p-4 cursor-pointer transition-all ${
              designOption === opt.key
                ? "border-[#C9A84C] ring-2 ring-[#C9A84C]/30"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setDesignOption(opt.key)}
          >
            <div className="text-[#1B2A4A] mb-3">{opt.icon}</div>
            <h3 className="font-semibold text-[#1B2A4A]">{opt.label}</h3>
            <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
            <p className="mt-3 text-sm font-bold text-[#C9A84C]">
              {freeDesign && opt.key !== "own" ? (
                <span><s className="text-gray-400">{opt.price}</s> Free</span>
              ) : opt.price}
            </p>
          </Card>
        ))}
      </div>

      {/* Conditional sections */}
      {designOption === "own" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-[#1B2A4A]">Upload Your Files</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DropZone label="Drop front side here" file={uploadFront} onFile={setUploadFront} />
            <DropZone label="Drop back side here" file={uploadBack} onFile={setUploadBack} />
          </div>
        </div>
      )}

      {designOption === "template" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-[#1B2A4A]">Choose a Template</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setTemplateId(tpl.id)}
                className={`aspect-[4/3] rounded-lg bg-gray-100 border-2 flex items-center justify-center cursor-pointer transition-all ${
                  templateId === tpl.id ? "border-[#C9A84C]" : "border-transparent hover:border-gray-300"
                }`}
              >
                <span className="text-sm text-gray-400">{tpl.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {designOption === "custom" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-[#1B2A4A]">Creative Brief</h3>
          <div className="space-y-3">
            <div>
              <Label>Business Type</Label>
              <Input
                value={brief.businessType}
                onChange={(e) => setBrief({ ...brief, businessType: e.target.value })}
                placeholder="e.g. Marine services, Real estate"
              />
            </div>
            <div>
              <Label>Your Offer</Label>
              <Input
                value={brief.offer}
                onChange={(e) => setBrief({ ...brief, offer: e.target.value })}
                placeholder="e.g. 20% off spring service, Free consultation"
              />
            </div>
            <div>
              <Label>Branding Guidelines</Label>
              <Textarea
                value={brief.brandingGuidelines}
                onChange={(e) => setBrief({ ...brief, brandingGuidelines: e.target.value })}
                placeholder="Colors, fonts, tone, any specifics..."
                rows={3}
              />
            </div>
            <div>
              <Label>Upload Logo</Label>
              <DropZone
                label="Drop your logo here"
                file={brief.logo}
                onFile={(f) => setBrief({ ...brief, logo: f })}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button
          onClick={handleContinue}
          className="flex-1 bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white"
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
}
