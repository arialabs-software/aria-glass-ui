/** Recursively optional, keeping `null` as an explicit "turn this off" value. */
export type DeepPartial<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Returns a new object with `override` merged into `base`. Plain objects merge
 * recursively; `undefined` keeps the base value; anything else (including
 * `null` and arrays) replaces it. Neither input is mutated.
 */
export function mergeDeep<T>(base: T, override: DeepPartial<T> | undefined): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override === undefined ? base : (override as T);
  }
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    result[key] = isPlainObject(value) && isPlainObject(result[key])
      ? mergeDeep(result[key], value)
      : value;
  }
  return result as T;
}
