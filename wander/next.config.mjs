/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a fully static site (out/) so it can be hosted anywhere — Netlify Drop,
  // GitHub Pages, Vercel, or any static host — with no server required.
  output: "export",
  images: { unoptimized: true },
  // This app is a self-contained project living in a subfolder; pin the trace
  // root so Next doesn't pick up the sibling lockfile at the repo root.
  outputFileTracingRoot: import.meta.dirname,
  // The prototype's inline styles are ported verbatim; skip stylistic lint in
  // the build (types are still checked by tsc / next build).
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
