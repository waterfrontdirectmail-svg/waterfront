"use client";

import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { CampaignDraft } from "./types";

const schema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  mailPieceType: z.string().min(1, "Select a mail piece type"),
  campaignGoal: z.string().min(1, "Select a campaign goal"),
});

type FormData = z.infer<typeof schema>;

const MAIL_TYPES = [
  "4x6 Postcard",
  "6x9 Postcard",
  "8.5x11 Letter",
  "Tri-fold Brochure",
];

const GOALS = [
  "New Customer Acquisition",
  "Seasonal Promo",
  "Grand Opening",
  "Event",
  "Other",
];

interface Props {
  draft: CampaignDraft;
  onUpdate: (data: Partial<CampaignDraft>) => void;
  onNext: () => void;
}

export default function Step1Basics({ draft, onUpdate, onNext }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: draft.name,
      mailPieceType: draft.mailPieceType,
      campaignGoal: draft.campaignGoal,
    },
  });

  const onSubmit = (data: FormData) => {
    onUpdate(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-[#1B2A4A]">Campaign Basics</h2>
      <p className="text-gray-500">Tell us about your direct mail campaign.</p>

      <div className="space-y-2">
        <Label htmlFor="name">Campaign Name</Label>
        <Input
          id="name"
          placeholder="e.g. Spring Boat Show Mailer"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mailPieceType">Mail Piece Type</Label>
        <select
          id="mailPieceType"
          {...register("mailPieceType")}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
        >
          <option value="">Select a type...</option>
          {MAIL_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.mailPieceType && (
          <p className="text-sm text-red-500">{errors.mailPieceType.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="campaignGoal">Campaign Goal</Label>
        <select
          id="campaignGoal"
          {...register("campaignGoal")}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
        >
          <option value="">Select a goal...</option>
          {GOALS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        {errors.campaignGoal && (
          <p className="text-sm text-red-500">{errors.campaignGoal.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white"
      >
        Continue to Audience
      </Button>
    </form>
  );
}
