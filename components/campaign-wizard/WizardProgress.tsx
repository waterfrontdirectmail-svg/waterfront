"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { label: "Basics" },
  { label: "Audience" },
  { label: "Design" },
  { label: "Review" },
  { label: "Checkout" },
];

interface WizardProgressProps {
  currentStep: number;
}

export default function WizardProgress({ currentStep }: WizardProgressProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
        {STEPS.map((step, i) => {
          const stepNum = i + 1;
          const isComplete = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors",
                    isComplete && "bg-[#1B2A4A] border-[#1B2A4A] text-white",
                    isCurrent && "bg-[#C9A84C] border-[#C9A84C] text-white",
                    !isComplete && !isCurrent && "border-gray-300 text-gray-400 bg-white"
                  )}
                >
                  {isComplete ? <Check className="w-5 h-5" /> : stepNum}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium hidden sm:block",
                    isCurrent ? "text-[#1B2A4A]" : isComplete ? "text-[#1B2A4A]" : "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    stepNum < currentStep ? "bg-[#1B2A4A]" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
