import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending_review: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  in_production: "bg-purple-100 text-purple-800",
  mailed: "bg-green-100 text-green-800",
  complete: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      className={cn(statusColors[status] ?? "bg-gray-100", "capitalize")}
      variant="secondary"
    >
      {status?.replace(/_/g, " ")}
    </Badge>
  );
}
