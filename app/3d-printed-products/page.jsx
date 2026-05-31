"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ALL_3D_PRINTED_SLUG, getCategoryPagePath } from "@/lib/productCategories";

/** Redirect legacy URL to the all-3D-printed shop category page */
export default function ThreeDPrintedProductsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getCategoryPagePath(ALL_3D_PRINTED_SLUG));
  }, [router]);

  return null;
}
