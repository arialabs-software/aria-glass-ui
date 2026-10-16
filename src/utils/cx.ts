/** Joins truthy class names: `cx("a", isOn && "b", className)`. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
