"use client";

import { useState, type CSSProperties } from "react";

/**
 * Photo with the prototype's Unsplash → picsum.photos fallback on error.
 * Note (per handoff): Unsplash hotlinks are not licensed for production —
 * replace with licensed or real venue photography before shipping.
 */
export function Img({
  src,
  seed,
  alt = "",
  style,
  className,
}: {
  src: string;
  seed: string;
  alt?: string;
  style?: CSSProperties;
  className?: string;
}) {
  const [fb, setFb] = useState(false);
  const finalSrc = fb ? `https://picsum.photos/seed/${seed}/800/600` : src;
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
