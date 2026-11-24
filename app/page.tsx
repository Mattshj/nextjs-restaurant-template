import { Hero } from "@/features/home/hero";

/** Homepage: composes the marketing sections in design order. */
export default function Home() {
  return (
    <main id="main-content" className="flex-1">
      <Hero />
    </main>
  );
}
