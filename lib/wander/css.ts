import type { CSSProperties } from "react";

/**
 * Convert a CSS declaration string (as used inline in the prototype) into a
 * React style object. This lets us carry the handoff's pixel-perfect inline
 * styles across verbatim instead of hand-translating every value.
 *
 * Values never contain a bare ";" and property names never contain ":",
 * so splitting on ";" then the first ":" is safe for our declarations.
 */
export function css(decl: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const part of decl.split(";")) {
    const d = part.trim();
    if (!d) continue;
    const i = d.indexOf(":");
    if (i < 0) continue;
    const key = d.slice(0, i).trim();
    const val = d.slice(i + 1).trim();
    const camel = key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    out[camel] = val;
  }
  return out as CSSProperties;
}
