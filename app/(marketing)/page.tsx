import HeroSection from "@/components/marketing/HeroSection";
import ProblemSolution from "@/components/marketing/ProblemSolution";
import WhatWeDo from "@/components/marketing/WhatWeDo";
import HowItWorks from "@/components/marketing/HowItWorks";
import IndustriesSection from "@/components/marketing/IndustriesSection";
import CoverageSection from "@/components/marketing/CoverageSection";
import PricingSection from "@/components/marketing/PricingSection";
import ResultsSection from "@/components/marketing/ResultsSection";
import TrustStrip from "@/components/marketing/TrustStrip";
import FAQSection from "@/components/marketing/FAQSection";
import LeadCapture from "@/components/marketing/LeadCapture";
import FinalCTA from "@/components/marketing/FinalCTA";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustStrip />
      <ProblemSolution />
      <WhatWeDo />
      <HowItWorks />
      <IndustriesSection />
      <CoverageSection />
      <PricingSection />
      <ResultsSection />
      <FAQSection />
      <LeadCapture />
      <FinalCTA />
    </main>
  );
}
