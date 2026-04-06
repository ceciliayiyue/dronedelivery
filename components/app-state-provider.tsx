"use client";

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { products, scenarios } from "@/lib/data";
import { checkDroneEligibility } from "@/lib/eligibility";
import {
  CartItem,
  DeliveryMode,
  Order,
  Product,
  Scenario,
} from "@/lib/types";
import { buildOrderItems, getCartSummary, getEta } from "@/lib/utils";

type CustomerStep = "catalog" | "cart" | "checkout" | "tracking";
type AppRole = "home" | "customer" | "shopper";

type AppStateValue = {
  products: Product[];
  scenarios: Scenario[];
  cart: CartItem[];
  orders: Order[];
  currentOrderId: string | null;
  selectedOrderId: string | null;
  customerStep: CustomerStep;
  droneAvailable: boolean;
  activeRole: AppRole;
  setActiveRole: (role: AppRole) => void;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  setCustomerStep: (step: CustomerStep) => void;
  placeOrder: (mode: DeliveryMode) => void;
  loadScenario: (scenario: Scenario) => void;
  setSelectedOrderId: (orderId: string) => void;
  setDroneAvailable: (value: boolean) => void;
  startPicking: (orderId: string) => void;
  markPicked: (orderId: string) => void;
  readyForDispatch: (orderId: string) => void;
  dispatchOrder: (orderId: string) => void;
  markDelivered: (orderId: string) => void;
};

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [customerStep, setCustomerStep] = useState<CustomerStep>("catalog");
  const [droneAvailable, setDroneAvailable] = useState(true);
  const [activeRole, setActiveRole] = useState<AppRole>("home");
  const nextOrderId = useRef(1001);

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(productId: string, delta: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function clearCart() {
    setCart([]);
    setCustomerStep("catalog");
  }

  function placeOrder(mode: DeliveryMode) {
    const summary = getCartSummary(cart);
    const items = buildOrderItems(cart);
    const eligibility = checkDroneEligibility({
      items,
      totalWeight: summary.totalWeight,
      itemCount: summary.itemCount,
    });
    const resolvedMode = eligibility.eligible && mode === "drone" ? "drone" : "standard";
    const orderId = `ORD-${nextOrderId.current++}`;

    const newOrder: Order = {
      id: orderId,
      items,
      totalWeight: summary.totalWeight,
      itemCount: summary.itemCount,
      isEligibleForDrone: eligibility.eligible,
      deliveryMode: resolvedMode,
      status: "created",
      eta: getEta(resolvedMode),
      eligibilityReason: eligibility.reason,
      createdAt: new Date().toISOString(),
      pickedAt: null,
    };

    setOrders((current) => [newOrder, ...current]);
    setCurrentOrderId(orderId);
    setSelectedOrderId(orderId);
    setCart([]);
    setCustomerStep("tracking");
  }

  function loadScenario(scenario: Scenario) {
    const nextCart = scenario.itemIds
      .map((id) => products.find((product) => product.id === id))
      .filter(Boolean)
      .map((product) => ({ ...product, quantity: 1 })) as CartItem[];

    setCart(nextCart);
    setCustomerStep("cart");
  }

  function patchOrder(orderId: string, updater: (order: Order) => Order) {
    setOrders((current) =>
      current.map((order) => (order.id === orderId ? updater(order) : order)),
    );
  }

  function startPicking(orderId: string) {
    patchOrder(orderId, (order) => ({ ...order, status: "picking" }));
  }

  function markPicked(orderId: string) {
    patchOrder(orderId, (order) => ({
      ...order,
      status: "picking",
      pickedAt: new Date().toISOString(),
    }));
  }

  function readyForDispatch(orderId: string) {
    patchOrder(orderId, (order) => ({ ...order, status: "packed" }));
  }

  function dispatchOrder(orderId: string) {
    patchOrder(orderId, (order) => {
      if (order.deliveryMode === "drone" && !droneAvailable) {
        return {
          ...order,
          status: "fallback",
          deliveryMode: "standard",
          eta: getEta("standard"),
          fallbackReason: "Drone unavailable. Courier reassigned automatically.",
        };
      }

      return {
        ...order,
        status: "out_for_delivery",
      };
    });
  }

  function markDelivered(orderId: string) {
    patchOrder(orderId, (order) => ({ ...order, status: "delivered" }));
  }

  const value = useMemo<AppStateValue>(
    () => ({
      products,
      scenarios,
      cart,
      orders,
      currentOrderId,
      selectedOrderId,
      customerStep,
      droneAvailable,
      activeRole,
      setActiveRole,
      addToCart,
      updateQuantity,
      clearCart,
      setCustomerStep,
      placeOrder,
      loadScenario,
      setSelectedOrderId,
      setDroneAvailable,
      startPicking,
      markPicked,
      readyForDispatch,
      dispatchOrder,
      markDelivered,
    }),
    [activeRole, cart, currentOrderId, customerStep, droneAvailable, orders, selectedOrderId],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);

  if (!value) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return value;
}
