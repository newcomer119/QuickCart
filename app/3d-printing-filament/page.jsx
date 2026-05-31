"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCategoryPagePath } from "@/lib/productCategories";

/** Redirect legacy URL to the filament shop category page */
export default function FilamentProductsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getCategoryPagePath("3d-printing-filament"));
  }, [router]);

  return null;
}
