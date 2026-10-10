import type { Category } from "@/types";

/** Our category -> the provider's native values (sections, desks, ...). */
export type CategoryMap = Readonly<Partial<Record<Category, readonly string[]>>>;

export const mappedCategories = (map: CategoryMap) => Object.keys(map) as Category[];

/** Native values for the given categories, flattened. */
export const toNativeValues = (map: CategoryMap, categories: readonly Category[]) =>
  categories.flatMap((category) => map[category] ?? []);

/** Reverse lookup: native value -> our category. */
export function toCategory(
  map: CategoryMap,
  nativeValue: string | undefined,
): Category | undefined {
  if (!nativeValue) return undefined;
  const match = Object.entries(map).find(([, values]) => values?.includes(nativeValue));
  return match?.[0] as Category | undefined;
}
