export type Product = {
  id: string;
  name: string;
  weight: number;
  price: number;
  droneEligible: boolean;
  category: string;
};

export type CartItem = Product & {
  quantity: number;
};

export type DeliveryMode = "drone" | "standard";

export type OrderStatus =
  | "created"
  | "picking"
  | "packed"
  | "out_for_delivery"
  | "delivered"
  | "fallback";

export type OrderItem = {
  id: string;
  name: string;
  weight: number;
  price: number;
  droneEligible: boolean;
  quantity: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  totalWeight: number;
  itemCount: number;
  isEligibleForDrone: boolean;
  deliveryMode: DeliveryMode;
  status: OrderStatus;
  eta: string;
  eligibilityReason: string;
  fallbackReason?: string;
  pickedAt?: string | null;
  createdAt: string;
};

export type EligibilityResult = {
  eligible: boolean;
  reason: string;
};

export type Scenario = {
  id: string;
  title: string;
  description: string;
  itemIds: string[];
  recommendedMode: DeliveryMode;
};
