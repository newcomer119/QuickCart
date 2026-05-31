export const FILAMENT_CATEGORY = "3D Printing Filament";
export const LEGACY_FILAMENT_CATEGORY = "Organics by Filament Freaks";

/** Shop categories — single source of truth for nav, seller form, and category pages */
export const SHOP_CATEGORIES = [
  {
    name: "3D Printed Wordart",
    slug: "3d-printed-wordart",
    navLabel: "3D Printed Wordart",
    description:
      "Custom 3D printed Hindi and English word art — meaningful decor pieces for home, office, and gifting.",
    matchCategories: ["3D Printed Wordart"],
  },
  {
    name: "3D Printed Desk Essentials",
    slug: "3d-printed-desk-essentials",
    navLabel: "3D Printed Desk Essentials",
    description:
      "Functional and stylish desk organizers, holders, and accessories to keep your workspace tidy.",
    matchCategories: ["3D Printed Desk Essentials"],
  },
  {
    name: "3D Printed Keychain",
    slug: "3d-printed-keychain",
    navLabel: "3D Printed Keychains",
    description:
      "Personalized 3D printed keychains — great for gifts, branding, and everyday carry.",
    matchCategories: ["3D Printed Keychain", "3D Printed Keychains"],
  },
  {
    name: "3D Printed Lamps",
    slug: "3d-printed-lamps",
    navLabel: "3D Printed Lamps",
    description:
      "Ambient 3D printed lamps and light decor to add warmth and character to any room.",
    matchCategories: ["3D Printed Lamps"],
  },
  {
    name: "3D Printed Decor Essentials",
    slug: "3d-printed-decor-essentials",
    navLabel: "3D Printed Decor Essentials",
    description:
      "Decorative 3D printed pieces to elevate shelves, tables, and living spaces.",
    matchCategories: ["3D Printed Decor Essentials"],
  },
  {
    name: "3D Printed Laptop Accessories",
    slug: "3d-printed-laptop-accessories",
    navLabel: "3D Printed Laptop Accessories",
    description:
      "Laptop stands, cable organizers, and desk accessories designed for everyday use.",
    matchCategories: ["3D Printed Laptop Accessories"],
  },
  {
    name: "3D Printed Gaming Accessories",
    slug: "3d-printed-gaming-accessories",
    navLabel: "3D Printed Gaming Accessories",
    description:
      "Controller stands, headset hooks, and gaming desk accessories for your setup.",
    matchCategories: ["3D Printed Gaming Accessories", "Accessories"],
  },
  {
    name: FILAMENT_CATEGORY,
    slug: "3d-printing-filament",
    navLabel: "3D Printing Filament",
    description:
      "PLA+ filaments designed for smooth printing, strong layer adhesion, and reliable results.",
    isFilament: true,
  },
];

/** All non-filament products (legacy /3d-printed-products URL) */
export const ALL_3D_PRINTED_SLUG = "all-3d-printed";

export function isFilamentCategory(category) {
  return (
    category === FILAMENT_CATEGORY || category === LEGACY_FILAMENT_CATEGORY
  );
}

export function normalizeFilamentCategory(category) {
  return isFilamentCategory(category) ? FILAMENT_CATEGORY : category;
}

export function getShopCategoryBySlug(slug) {
  if (slug === ALL_3D_PRINTED_SLUG) {
    return {
      slug: ALL_3D_PRINTED_SLUG,
      navLabel: "3D Printed Products",
      description:
        "Browse our full range of custom 3D printed products — word art, desk essentials, decor, and more.",
      isAggregate: true,
    };
  }
  return SHOP_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function getCategoryPagePath(slug) {
  return `/shop/${slug}`;
}

export function getCategoryHref(category) {
  if (!category) return getCategoryPagePath(ALL_3D_PRINTED_SLUG);
  if (isFilamentCategory(category)) {
    return getCategoryPagePath("3d-printing-filament");
  }
  const match = SHOP_CATEGORIES.find(
    (c) =>
      !c.isFilament &&
      (c.name === category ||
        c.matchCategories?.includes(category))
  );
  return match
    ? getCategoryPagePath(match.slug)
    : getCategoryPagePath(ALL_3D_PRINTED_SLUG);
}

export function productBelongsToShopCategory(product, shopCategory) {
  if (!product?.category || !shopCategory) return false;
  if (shopCategory.isAggregate) {
    return !isFilamentCategory(product.category);
  }
  if (shopCategory.isFilament) {
    return isFilamentCategory(product.category);
  }
  const aliases = shopCategory.matchCategories ?? [shopCategory.name];
  return aliases.includes(product.category);
}

export function filterProductsByShopCategory(products, shopCategory) {
  return products.filter((p) => productBelongsToShopCategory(p, shopCategory));
}
