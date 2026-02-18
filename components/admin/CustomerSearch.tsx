"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function CustomerSearch({ current }: { current: string }) {
  const router = useRouter();
  const [q, setQ] = useState(current);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(q ? `/admin/customers?q=${encodeURIComponent(q)}` : "/admin/customers");
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
      <Input
        placeholder="Search customers..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <Button type="submit" size="sm" variant="outline">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
