import type { DesignOption } from "@/lib/campaign-pricing";

export interface CampaignDraft {
  // Step 1
  name: string;
  mailPieceType: string;
  campaignGoal: string;

  // Step 2
  county: string;
  cities: string[];
  zips: string[];
  waterwayType: string;
  audienceCount: number;

  // Step 3
  designOption: DesignOption;
  uploadFront: File | null;
  uploadBack: File | null;
  templateId: string;
  creativeBrief: {
    businessType: string;
    offer: string;
    brandingGuidelines: string;
    logo: File | null;
  };

  // Step 4
  mailDate: string;
  asap: boolean;

  // Step 5
  termsAccepted: boolean;
}

export const defaultDraft: CampaignDraft = {
  name: "",
  mailPieceType: "",
  campaignGoal: "",
  county: "",
  cities: [],
  zips: [],
  waterwayType: "all",
  audienceCount: 0,
  designOption: "own",
  uploadFront: null,
  uploadBack: null,
  templateId: "",
  creativeBrief: {
    businessType: "",
    offer: "",
    brandingGuidelines: "",
    logo: null,
  },
  mailDate: "",
  asap: false,
  termsAccepted: false,
};
