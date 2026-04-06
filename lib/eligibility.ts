import { EligibilityResult, Order, OrderItem } from "@/lib/types";

type EligibilityInput = Pick<Order, "items" | "totalWeight" | "itemCount">;

function hasNonDroneItem(items: OrderItem[]) {
  return items.some((item) => !item.droneEligible);
}

export function checkDroneEligibility(order: EligibilityInput): EligibilityResult {
  if (order.totalWeight > 5) {
    return {
      eligible: false,
      reason: "Total weight exceeds the 5 lb drone limit.",
    };
  }

  if (order.itemCount > 10) {
    return {
      eligible: false,
      reason: "Basket has more than 10 items.",
    };
  }

  if (hasNonDroneItem(order.items)) {
    return {
      eligible: false,
      reason: "One or more items require ground handling.",
    };
  }

  return {
    eligible: true,
    reason: "Eligible for drone delivery.",
  };
}
