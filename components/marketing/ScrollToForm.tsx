"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function ScrollToForm() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const scrollTarget = searchParams.get("scroll");
    if (scrollTarget) {
      // Small delay to ensure page is rendered
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [searchParams]);

  return null;
}
