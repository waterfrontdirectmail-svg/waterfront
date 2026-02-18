"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "all", label: "All" },
  { value: "approved", label: "Approved" },
  { value: "in_production", label: "In Production" },
  { value: "mailed", label: "Mailed" },
  { value: "complete", label: "Complete" },
];

export function FulfillmentFilters({ current }: { current: string }) {
  const router = useRouter();

  return (
    <div className="flex gap-1 flex-wrap">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() =>
            router.push(
              tab.value === "all"
                ? "/admin/fulfillment"
                : `/admin/fulfillment?stage=${tab.value}`
            )
          }
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            current === tab.value
              ? "bg-[hsl(var(--deep-navy))] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
