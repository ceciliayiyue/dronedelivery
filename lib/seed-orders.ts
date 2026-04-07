import type { Order, OrderItem } from "@/lib/types";
import { getEta } from "@/lib/utils";

function summarize(items: OrderItem[]): { totalWeight: number; itemCount: number } {
  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);
  const totalWeight = Number(
    items.reduce((sum, line) => sum + line.weight * line.quantity, 0).toFixed(1),
  );
  return { itemCount, totalWeight };
}

/** Two example drone queue orders with explicit SLA times (MM:SS). */
export const seedExampleDroneOrders: Order[] = (() => {
  const itemsA: OrderItem[] = [
    {
      id: "bandages",
      name: "First Aid Bandages",
      weight: 0.2,
      price: 4.99,
      droneEligible: true,
      quantity: 1,
    },
    {
      id: "cough-meds",
      name: "Cold Relief Medicine",
      weight: 0.4,
      price: 8.99,
      droneEligible: true,
      quantity: 1,
    },
    {
      id: "chips",
      name: "Sea Salt Chips",
      weight: 0.7,
      price: 4.49,
      droneEligible: true,
      quantity: 2,
    },
  ];
  const sumA = summarize(itemsA);

  const itemsB: OrderItem[] = [
    {
      id: "granola",
      name: "Granola Bars",
      weight: 0.8,
      price: 3.99,
      droneEligible: true,
      quantity: 1,
    },
    {
      id: "yogurt",
      name: "Greek Yogurt",
      weight: 0.9,
      price: 4.19,
      droneEligible: true,
      quantity: 2,
    },
    {
      id: "coffee",
      name: "Ground Coffee",
      weight: 1.0,
      price: 10.99,
      droneEligible: true,
      quantity: 1,
    },
  ];
  const sumB = summarize(itemsB);

  const createdAt = new Date().toISOString();

  return [
    {
      id: "ORD-4321",
      items: itemsA,
      totalWeight: sumA.totalWeight,
      itemCount: sumA.itemCount,
      isEligibleForDrone: true,
      deliveryMode: "drone",
      status: "created",
      eta: getEta("drone"),
      eligibilityReason: "Eligible for drone delivery.",
      slaDisplay: "3:45",
      createdAt,
      pickedAt: null,
    },
    {
      id: "ORD-4322",
      items: itemsB,
      totalWeight: sumB.totalWeight,
      itemCount: sumB.itemCount,
      isEligibleForDrone: true,
      deliveryMode: "drone",
      status: "created",
      eta: getEta("drone"),
      eligibilityReason: "Eligible for drone delivery.",
      slaDisplay: "8:12",
      createdAt,
      pickedAt: null,
    },
  ];
})();
