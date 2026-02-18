"use client";

import { useState } from "react";
import WizardProgress from "./WizardProgress";
import Step1Basics from "./Step1Basics";
import Step2Audience from "./Step2Audience";
import Step3Design from "./Step3Design";
import Step4Review from "./Step4Review";
import Step5Checkout from "./Step5Checkout";
import { defaultDraft, type CampaignDraft } from "./types";

export default function CampaignWizard() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<CampaignDraft>(defaultDraft);

  const updateDraft = (data: Partial<CampaignDraft>) => {
    setDraft((prev) => ({ ...prev, ...data }));
  };

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <WizardProgress currentStep={step} />
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6 sm:p-8">
          {step === 1 && <Step1Basics draft={draft} onUpdate={updateDraft} onNext={next} />}
          {step === 2 && <Step2Audience draft={draft} onUpdate={updateDraft} onNext={next} onBack={back} />}
          {step === 3 && <Step3Design draft={draft} onUpdate={updateDraft} onNext={next} onBack={back} />}
          {step === 4 && <Step4Review draft={draft} onUpdate={updateDraft} onNext={next} onBack={back} />}
          {step === 5 && <Step5Checkout draft={draft} onUpdate={updateDraft} onBack={back} />}
        </div>
      </div>
    </div>
  );
}
