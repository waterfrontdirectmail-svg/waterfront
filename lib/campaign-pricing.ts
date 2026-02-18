export type DesignOption = "own" | "template" | "custom";

export interface CampaignCost {
  subtotal: number;
  designFee: number;
  total: number;
  perPiece: number;
  freeDesign: boolean;
}

const BASE_RATE = 1.5;
const MINIMUM_PIECES = 2000;
const FREE_DESIGN_THRESHOLD = 5000;

const DESIGN_FEES: Record<DesignOption, number> = {
  own: 0,
  template: 250,
  custom: 750,
};

export function calculateCampaignCost(
  quantity: number,
  designOption: DesignOption
): CampaignCost {
  const effectiveQty = Math.max(quantity, 0);
  const subtotal = effectiveQty * BASE_RATE;
  const freeDesign = effectiveQty >= FREE_DESIGN_THRESHOLD;
  const designFee = freeDesign ? 0 : DESIGN_FEES[designOption];
  const total = subtotal + designFee;
  const perPiece = effectiveQty > 0 ? total / effectiveQty : 0;

  return { subtotal, designFee, total, perPiece, freeDesign };
}

export { BASE_RATE, MINIMUM_PIECES, FREE_DESIGN_THRESHOLD, DESIGN_FEES };
