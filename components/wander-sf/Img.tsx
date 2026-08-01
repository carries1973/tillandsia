"use client";

import { useState, type CSSProperties } from "react";

/**
 * Photo for the SF trip app.
 *
 * Every `src` is a real, correctly-licensed photograph of the actual place —
 * the exact venue where free-licensed photography exists (landmarks, museums,
 * parks, views), and a real photo of the venue's own San Francisco
 * neighbourhood otherwise — all from Wikimedia Commons. On the rare load error
 * we fall back to a real San Francisco skyline, never a random/global stock
 * image, so a card is always San Francisco. (`seed` is retained for callers.)
 */
const SF_FALLBACK =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/SanFrancisco_from_TwinPeaks_dusk_MC.jpg/1200px-SanFrancisco_from_TwinPeaks_dusk_MC.jpg";

export function Img({
  src,
  alt = "",
  style,
  className,
}: {
  src: string;
  seed?: string;
  alt?: string;
  style?: CSSProperties;
  className?: string;
}) {
  const [fb, setFb] = useState(false);
  const finalSrc = fb ? SF_FALLBACK : src;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={finalSrc}
      alt={alt}
      onError={() => setFb(true)}
      style={style}
      className={className}
    />
  );
}
