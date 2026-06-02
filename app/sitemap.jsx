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
    { url: `${base}/3d-printed-wordart`, lastModified: new Date() },
    { url: `${base}/3d-printing-filament`, lastModified: new Date() },
    { url: `${base}/3d-printed-desk-essentials`, lastModified: new Date() },
    { url: `${base}/3d-printed-keychain`, lastModified: new Date() },
    { url: `${base}/3d-printed-lamps`, lastModified: new Date() },
    { url: `${base}/3d-printed-decor-essentials`, lastModified: new Date() },
    { url: `${base}/3d-printed-laptop-accessories`, lastModified: new Date() },
    { url: `${base}/3d-printed-gaming-accessories`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
    { url: `${base}/track-order`, lastModified: new Date() },
    { url: `${base}/policies/cancellation`, lastModified: new Date() },
    { url: `${base}/favicon.ico`, lastModified: new Date() },    
    { url: `${base}/faq`, lastModified: new Date() },
  ];
}
