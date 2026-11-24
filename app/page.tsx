import { Hero } from "@/features/home/hero";
import { LocationsBand } from "@/features/home/locations-band";
import { PrivateDiningBanner } from "@/features/home/private-dining-banner";
import { SignatureDishes } from "@/features/home/signature-dishes";

/** Homepage: composes the marketing sections in design order. */
export default function Home() {
  return (
    <main id="main-content" className="flex-1">
      <Hero />
      <SignatureDishes />
      <LocationsBand />
      <PrivateDiningBanner />
    </main>
  );
}
