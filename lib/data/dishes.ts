import type { Dish } from "@/lib/types";

/**
 * Dishes featured in the "From the hearth" section.
 * Prices are placeholders until real content is provided.
 */
export const featuredDishes = [
  {
    name: "Ember-roasted carrots",
    price: "[PRICE]",
    description: "Whipped feta, dukkah, honey",
    labels: ["Vegetarian", "Gluten-free"],
  },
  {
    name: "Half chicken, fire-roasted",
    price: "[PRICE]",
    description: "Charred lemon, salsa verde",
    labels: ["Gluten-free"],
  },
  {
    name: "Hanger steak",
    price: "[PRICE]",
    description: "Bone marrow jus, crispy potatoes",
    labels: ["Chef’s pick"],
  },
] as const satisfies readonly Dish[];
