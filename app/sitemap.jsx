import { SHOP_CATEGORIES, ALL_3D_PRINTED_SLUG } from "@/lib/productCategories";

export default function sitemap() {
  const base = "https://www.filamentfreaks.com";
  const shopUrls = [
    ALL_3D_PRINTED_SLUG,
    ...SHOP_CATEGORIES.map((c) => c.slug),
  ].map((slug) => ({
    url: `${base}/shop/${slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: base, lastModified: new Date() },
    ...shopUrls,
    { url: `${base}/3d-printed-products`, lastModified: new Date() },
    { url: `${base}/3d-printing-filament`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
    { url: `${base}/faq`, lastModified: new Date() },
  ];
}
