import { Product, Scenario } from "@/lib/types";

export const products: Product[] = [
  { id: "granola", name: "Granola Bars", weight: 0.8, price: 3.99, droneEligible: true, category: "Snacks" },
  { id: "chips", name: "Sea Salt Chips", weight: 0.7, price: 4.49, droneEligible: true, category: "Snacks" },
  { id: "cough-meds", name: "Cold Relief Medicine", weight: 0.4, price: 8.99, droneEligible: true, category: "Medicine" },
  { id: "bandages", name: "First Aid Bandages", weight: 0.2, price: 4.99, droneEligible: true, category: "Medicine" },
  { id: "bananas", name: "Bananas Bundle", weight: 1.3, price: 2.79, droneEligible: true, category: "Produce" },
  { id: "bread", name: "Sourdough Bread", weight: 1.2, price: 5.99, droneEligible: true, category: "Bakery" },
  { id: "yogurt", name: "Greek Yogurt", weight: 0.9, price: 4.19, droneEligible: true, category: "Dairy" },
  { id: "coffee", name: "Ground Coffee", weight: 1.0, price: 10.99, droneEligible: true, category: "Pantry" },
  { id: "water-pack", name: "24-Pack Water", weight: 18, price: 9.99, droneEligible: false, category: "Bulk" },
  { id: "detergent", name: "Laundry Detergent", weight: 8.5, price: 14.99, droneEligible: false, category: "Household" },
  { id: "bulk-rice", name: "10 lb Jasmine Rice", weight: 10, price: 12.49, droneEligible: false, category: "Bulk" },
  { id: "cat-litter", name: "Cat Litter", weight: 12, price: 16.99, droneEligible: false, category: "Pet" },
];

export const scenarios: Scenario[] = [
  {
    id: "drone-success",
    title: "Scenario 1",
    description: "Eligible urgent order that works with drone delivery.",
    itemIds: ["bandages", "cough-meds", "coffee"],
    recommendedMode: "drone",
  },
  {
    id: "standard-only",
    title: "Scenario 2",
    description: "Heavy basket that only qualifies for standard delivery.",
    itemIds: ["water-pack", "bulk-rice"],
    recommendedMode: "standard",
  },
];
