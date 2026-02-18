import UtilityBar from "@/components/marketing/UtilityBar";
import SiteHeader from "@/components/marketing/SiteHeader";
import SiteFooter from "@/components/marketing/SiteFooter";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <UtilityBar />
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
