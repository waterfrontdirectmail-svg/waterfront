export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* TODO: SiteHeader, UtilityBar */}
      {children}
      {/* TODO: SiteFooter */}
    </div>
  );
}
