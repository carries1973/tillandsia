import type { Metadata, Viewport } from "next";
import Wander from "@/components/wander-sf/Wander";

export const metadata: Metadata = {
  title: "Wander — San Francisco",
  description:
    "A calm, hyper-personalized trip itinerary for San Francisco & Wine Country, Jul 31 – Aug 4 2026.",
};

export const viewport: Viewport = {
  themeColor: "#181B33",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function SfTripPage() {
  return (
    <>
      {/* Fonts for the trip app (Newsreader display + DM Sans body). */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap"
        rel="stylesheet"
      />
      <Wander />
    </>
  );
}
