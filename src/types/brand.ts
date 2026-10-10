declare const brand: unique symbol;

/**
 * Nominal type: a `Brand<string, "X">` is still a string at runtime, but plain
 * strings can't be assigned to it without going through a validating constructor.
 */
export type Brand<T, Name extends string> = T & { readonly [brand]: Name };
