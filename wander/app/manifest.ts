import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wander — Montréal",
    short_name: "Wander",
    description: "A calm, hyper-personalized trip itinerary.",
    start_url: "/",
    display: "standalone",
    background_color: "#181B33",
    theme_color: "#181B33",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
