export const FILAMENT_CATEGORY = "3D Printing Filament";
export const LEGACY_FILAMENT_CATEGORY = "Organics by Filament Freaks";

export function isFilamentCategory(category) {
  return (
    category === FILAMENT_CATEGORY || category === LEGACY_FILAMENT_CATEGORY
  );
}

export function normalizeFilamentCategory(category) {
  return isFilamentCategory(category) ? FILAMENT_CATEGORY : category;
}
