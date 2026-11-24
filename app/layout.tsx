import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

// Both are variable fonts, so every weight the design uses (Inter 400–600,
// Inter Tight 700–800) loads from a single file per family.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hearthwick — Fire-cooked restaurants",
  description:
    "A wood-fired kitchen with seasonal plates and long tables, across three neighbourhoods. Book a table or order ahead for pickup.",
};

/**
 * Root layout: loads the brand fonts and global styles for every route.
 *
 * @param children - the active route's content.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
