/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  // This app is a self-contained project living in a subfolder; pin the trace
  // root so Next doesn't pick up the sibling lockfile at the repo root.
  outputFileTracingRoot: import.meta.dirname,
  // The prototype's inline styles are ported verbatim; skip stylistic lint in
  // the build (types are still checked by tsc / next build).
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
