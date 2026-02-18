"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  UserCheck,
  Truck,
  Shield,
  BarChart3,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/customers", label: "Customers", icon: UserCheck },
  { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/admin/fulfillment", label: "Fulfillment", icon: Truck },
  { href: "/admin/exclusivity", label: "Exclusivity", icon: Shield },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/users", label: "Team", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobile() {
    setMobileOpen(false);
  }

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-[hsl(var(--brass-gold))]">WFDM</span> Admin
          </h1>
          <p className="text-xs text-white/50 mt-1">Waterfront Direct Mail</p>
        </div>
        <button
          onClick={closeMobile}
          className="lg:hidden p-1 text-white/50 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-[hsl(var(--brass-gold))]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to site */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          onClick={closeMobile}
          className="flex items-center gap-2 text-xs text-white/50 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to site
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 bg-[hsl(var(--deep-navy))] px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-tight text-white">
          <span className="text-[hsl(var(--brass-gold))]">WFDM</span> Admin
        </h1>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-white/70 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40"
          onClick={closeMobile}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[hsl(var(--deep-navy))] text-white flex flex-col transform transition-transform duration-200 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-64 bg-[hsl(var(--deep-navy))] text-white flex-col shrink-0 sticky top-0 h-screen">
          {sidebarContent}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto min-w-0">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
