import { CartItem, DeliveryMode, OrderItem, OrderStatus } from "@/lib/types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function buildOrderItems(cart: CartItem[]): OrderItem[] {
  return cart.map((item) => ({
    id: item.id,
    name: item.name,
    weight: item.weight,
    price: item.price,
    droneEligible: item.droneEligible,
    quantity: item.quantity,
  }));
}

export function getCartSummary(cart: CartItem[]) {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalWeight = Number(
    cart.reduce((sum, item) => sum + item.weight * item.quantity, 0).toFixed(1),
  );
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    itemCount,
    totalWeight,
    totalPrice,
  };
}

export function getEta(mode: DeliveryMode) {
  return mode === "drone" ? "15 min" : "45–60 min";
}

export function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case "created":
      return "Order placed";
    case "picking":
      return "Shopper picking";
    case "packed":
      return "Packing";
    case "out_for_delivery":
      return "Out for delivery";
    case "delivered":
      return "Delivered";
    case "fallback":
      return "Drone unavailable → switched to standard delivery";
    default:
      return status;
  }
}
