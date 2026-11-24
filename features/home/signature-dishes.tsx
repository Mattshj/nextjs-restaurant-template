import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { featuredDishes } from "@/lib/data/dishes";
import type { Dish } from "@/lib/types";

/**
 * "From the hearth": featured dishes. The section id is the target of the
 * "Menu" and "View the menu" links until a full menu page exists.
 */
export function SignatureDishes() {
  return (
    <section
      id="menu"
      aria-labelledby="menu-title"
      className="page-container flex scroll-mt-6 flex-col gap-7 pb-22"
    >
      <SectionHeader
        id="menu-title"
        title="From the hearth"
        action={{ label: "Full menu & allergens", href: "/menu" }}
      />
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {featuredDishes.map((dish) => (
          <li key={dish.name}>
            <DishCard dish={dish} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function DishCard({ dish }: { dish: Dish }) {
  return (
    <Card className="h-full">
      {/* Photo placeholder until real photography is provided. */}
      <div
        aria-hidden="true"
        className="flex h-60 items-center justify-center rounded-inset bg-accent text-sm text-muted-foreground"
      >
        Photo
      </div>
      <CardHeader>
        <div className="flex justify-between gap-3">
          <CardTitle>{dish.name}</CardTitle>
          <p className="font-semibold">{dish.price}</p>
        </div>
        <CardDescription>{dish.description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <ul aria-label="Labels" className="flex flex-wrap gap-1.5">
          {dish.labels.map((label) => (
            <li key={label}>
              <Badge variant="subtle" size="sm">
                {label}
              </Badge>
            </li>
          ))}
        </ul>
      </CardFooter>
    </Card>
  );
}
