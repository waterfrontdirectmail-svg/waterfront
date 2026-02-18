"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import {
  LayoutDashboard,
  Megaphone,
  CreditCard,
  Settings,
  PlusCircle,
  LogOut,
  Shield,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/campaigns", label: "My Campaigns", icon: Megaphone },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, isAdmin } = useUser();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/">
            <h1 className="text-lg font-bold tracking-tight text-[hsl(var(--deep-navy))]">
              Waterfront<span className="text-[hsl(var(--brass-gold))]"> DM</span>
            </h1>
          </Link>
          {profile && (
            <p className="text-xs text-gray-400 mt-1 truncate">
              {profile.company_name || profile.full_name || "My Account"}
            </p>
          )}
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
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[hsl(var(--deep-navy))]/5 text-[hsl(var(--deep-navy))]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}

          {/* New Campaign CTA */}
          <div className="pt-4">
            <Link
              href="/campaigns/new"
              className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium bg-[hsl(var(--brass-gold))] text-[hsl(var(--deep-navy))] hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="h-4 w-4" />
              New Campaign
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 space-y-1">
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-2"
            >
              <Shield className="h-3 w-3" />
              Admin Panel
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-2 w-full"
          >
            <LogOut className="h-3 w-3" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
