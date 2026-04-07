"use client";

import { useMemo, useState } from "react";
import { useAppState } from "@/components/app-state-provider";
import { checkDroneEligibility } from "@/lib/eligibility";
import { Order, Product } from "@/lib/types";
import { buildOrderItems, formatCurrency, getCartSummary, getStatusLabel } from "@/lib/utils";

const trackingStages = [
  { key: "created", label: "Order placed" },
  { key: "picking", label: "Shopper picking" },
  { key: "packed", label: "Packing" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
] as const;

export function MvpApp() {
  const {
    activeRole,
    products,
    scenarios,
    cart,
    orders,
    currentOrderId,
    selectedOrderId,
    customerStep,
    droneAvailable,
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
  } = useAppState();

  const cartSummary = useMemo(() => getCartSummary(cart), [cart]);
  const eligibility = useMemo(
    () =>
      checkDroneEligibility({
        items: buildOrderItems(cart),
        totalWeight: cartSummary.totalWeight,
        itemCount: cartSummary.itemCount,
      }),
    [cart, cartSummary.itemCount, cartSummary.totalWeight],
  );
  const currentOrder = orders.find((order) => order.id === currentOrderId) ?? null;
  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) ?? orders[0] ?? null;

  return (
    <main className="min-h-screen bg-[#f4f1eb] px-4 py-8">
      <div className="mx-auto flex max-w-md flex-col items-center gap-6">
        <PhoneShell>
          <StatusBar />
          <TopBar
            title={
              activeRole === "home"
                ? "Choose Role"
                : activeRole === "customer"
                  ? "Customer"
                  : "Shopper"
            }
            onBack={activeRole === "home" ? undefined : () => setActiveRole("home")}
          />

          {activeRole === "home" && (
            <RoleChooser
              scenarios={scenarios}
              onEnterCustomer={() => setActiveRole("customer")}
              onEnterShopper={() => setActiveRole("shopper")}
              onLoadScenario={loadScenario}
            />
          )}

          {activeRole === "customer" && (
            <CustomerFlow
              products={products}
              cartSummary={cartSummary}
              eligibility={eligibility}
              customerStep={customerStep}
              currentOrder={currentOrder}
              cart={cart}
              scenarios={scenarios}
              onAddToCart={addToCart}
              onUpdateQuantity={updateQuantity}
              onGoToStep={setCustomerStep}
              onPlaceOrder={placeOrder}
              onClearCart={clearCart}
              onLoadScenario={loadScenario}
              onSwitchRole={() => setActiveRole("shopper")}
            />
          )}

          {activeRole === "shopper" && (
            <ShopperFlow
              orders={orders}
              selectedOrder={selectedOrder}
              droneAvailable={droneAvailable}
              onSelectOrder={setSelectedOrderId}
              onToggleDrone={setDroneAvailable}
              onStartPicking={startPicking}
              onMarkPicked={markPicked}
              onReadyForDispatch={readyForDispatch}
              onDispatch={dispatchOrder}
              onDelivered={markDelivered}
              onSwitchRole={() => setActiveRole("customer")}
            />
          )}
        </PhoneShell>
      </div>
    </main>
  );
}

function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full overflow-hidden rounded-[2.4rem] border border-[#e6e0d6] bg-[#faf8f2] shadow-[0_28px_70px_rgba(20,40,25,0.16)]">
      <div className="min-h-[820px]">{children}</div>
    </section>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-4 text-[11px] font-semibold text-[#1f3b2a]">
      <span>9:41</span>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#1f3b2a]" />
        <span className="h-2 w-2 rounded-full bg-[#1f3b2a]" />
        <span className="h-2 w-6 rounded-full border border-[#1f3b2a]" />
      </div>
    </div>
  );
}

function TopBar({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <button
        type="button"
        onClick={onBack}
        className={`h-9 w-9 rounded-full border border-[#e8e1d6] bg-white text-[#2b4a36] ${
          onBack ? "" : "opacity-0"
        }`}
      >
        ←
      </button>
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6b8672]">
          Drone delivery
        </p>
        <h2 className="text-[15px] font-semibold text-[#17301f]">{title}</h2>
      </div>
      <div className="h-9 w-9 rounded-full bg-[#f2eee6]" />
    </div>
  );
}

function RoleChooser({
  scenarios,
  onEnterCustomer,
  onEnterShopper,
  onLoadScenario,
}: {
  scenarios: ReturnType<typeof useAppState>["scenarios"];
  onEnterCustomer: () => void;
  onEnterShopper: () => void;
  onLoadScenario: ReturnType<typeof useAppState>["loadScenario"];
}) {
  return (
    <div className="px-6 pb-8">
      <div className="rounded-[1.6rem] bg-white p-5 shadow-[0_18px_40px_rgba(20,40,25,0.08)]">
        <h3 className="text-xl font-semibold text-[#17301f]">Choose your role</h3>
        <p className="mt-2 text-sm text-[#5a7b65]">
          This demo keeps a shared order state for both flows.
        </p>
        <div className="mt-4 grid gap-3">
          <button
            type="button"
            onClick={onEnterCustomer}
            className="rounded-[1.1rem] bg-[#1a5f3b] px-4 py-3 text-sm font-semibold text-white"
          >
            Enter customer experience
          </button>
          <button
            type="button"
            onClick={onEnterShopper}
            className="rounded-[1.1rem] border border-[#e2efe0] bg-white px-4 py-3 text-sm font-semibold text-[#1a5f3b]"
          >
            Enter shopper experience
          </button>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b8672]">
          Quick scenarios
        </p>
        <div className="mt-3 grid gap-3">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => {
                onLoadScenario(scenario);
                onEnterCustomer();
              }}
              className="rounded-[1.1rem] border border-[#e2efe0] bg-white px-4 py-3 text-left"
            >
              <p className="text-sm font-semibold text-[#17301f]">{scenario.title}</p>
              <p className="mt-1 text-xs text-[#5a7b65]">{scenario.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CustomerFlow({
  products,
  cart,
  cartSummary,
  eligibility,
  customerStep,
  currentOrder,
  scenarios,
  onAddToCart,
  onUpdateQuantity,
  onGoToStep,
  onPlaceOrder,
  onClearCart,
  onLoadScenario,
  onSwitchRole,
}: {
  products: Product[];
  cart: ReturnType<typeof useAppState>["cart"];
  cartSummary: ReturnType<typeof getCartSummary>;
  eligibility: ReturnType<typeof checkDroneEligibility>;
  customerStep: "catalog" | "cart" | "checkout" | "tracking";
  currentOrder: Order | null;
  scenarios: ReturnType<typeof useAppState>["scenarios"];
  onAddToCart: ReturnType<typeof useAppState>["addToCart"];
  onUpdateQuantity: ReturnType<typeof useAppState>["updateQuantity"];
  onGoToStep: ReturnType<typeof useAppState>["setCustomerStep"];
  onPlaceOrder: ReturnType<typeof useAppState>["placeOrder"];
  onClearCart: ReturnType<typeof useAppState>["clearCart"];
  onLoadScenario: ReturnType<typeof useAppState>["loadScenario"];
  onSwitchRole: () => void;
}) {
  const [showDroneOnly, setShowDroneOnly] = useState(false);
  const visibleProducts = showDroneOnly
    ? products.filter((product) => product.droneEligible)
    : products;

  return (
    <div className="px-6 pb-8">
      <div className="flex items-center justify-between rounded-[1.2rem] bg-[#f3f0ea] px-4 py-2 text-xs font-semibold text-[#5a7b65]">
        <span>Customer flow</span>
        <button
          type="button"
          onClick={onSwitchRole}
          className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1a5f3b] shadow-sm"
        >
          Switch to shopper
        </button>
      </div>

      <div className="mt-4 flex gap-2 rounded-full border border-[#e3ddd2] bg-[#efe9df] p-1 text-[11px] font-semibold text-[#6a8772]">
        {[
          ["catalog", "Products"],
          ["cart", "Cart"],
          ["checkout", "Delivery"],
          ["tracking", "Tracking"],
        ].map(([step, label]) => (
          <button
            key={step}
            type="button"
            onClick={() => onGoToStep(step as "catalog" | "cart" | "checkout" | "tracking")}
            className={`flex-1 rounded-full px-2 py-2 ${
              customerStep === step
                ? "bg-white text-[#1a5f3b] shadow-[0_6px_14px_rgba(24,60,40,0.12)]"
                : "text-[#6a8772]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {customerStep === "catalog" && (
        <div className="mt-5 space-y-4">
          <div className="rounded-[1.2rem] border border-[#e2efe0] bg-white p-3">
            <button
              type="button"
              onClick={() => setShowDroneOnly((value) => !value)}
              className={`w-full rounded-[1rem] border px-4 py-2 text-sm font-semibold transition ${
                showDroneOnly
                  ? "border-[#1a5f3b] bg-[#edf6e8] text-[#1a5f3b]"
                  : "border-[#e2efe0] bg-[#faf8f2] text-[#4d6d59]"
              }`}
            >
              {showDroneOnly ? "Showing drone-eligible products" : "Filter: drone-eligible only"}
            </button>
          </div>

          <div className="grid gap-2">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => onLoadScenario(scenario)}
                className="rounded-full border border-[#d8ead2] bg-white px-4 py-2 text-left text-xs text-[#365646] shadow-[0_8px_18px_rgba(24,60,40,0.08)]"
              >
                <span className="font-semibold text-[#17301f]">{scenario.title}</span>
                <span className="ml-2 text-[#5a7b65]">{scenario.description}</span>
              </button>
            ))}
          </div>

          {cartSummary.itemCount > 0 && (
            <button
              type="button"
              onClick={() => onGoToStep("cart")}
              className="w-full rounded-[1.1rem] bg-[#1a5f3b] px-4 py-3 text-sm font-semibold text-white"
            >
              View cart ({cartSummary.itemCount})
            </button>
          )}

          <div className="grid gap-3">
            {visibleProducts.map((product) => {
              const cartItem = cart.find((item) => item.id === product.id);

              return (
                <article
                  key={product.id}
                  className="rounded-[1.4rem] border border-[#dbe9d6] bg-white p-4 shadow-[0_10px_24px_rgba(24,60,40,0.08)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b8672]">
                        {product.category}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold text-[#17301f]">
                        {product.name}
                      </h3>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        product.droneEligible
                          ? "bg-[#e6f4d9] text-[#2c6b36]"
                          : "bg-[#fff3e2] text-[#9b6216]"
                      }`}
                    >
                      {product.droneEligible ? "Drone eligible" : "Ground only"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-[#5a7b65]">
                    <span>
                      {formatCurrency(product.price)} · {product.weight} lb
                    </span>
                    {cartItem ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          className="h-8 w-8 rounded-full bg-[#edf6e8] text-sm font-semibold text-[#1a5f3b]"
                        >
                          -
                        </button>
                        <span className="min-w-5 text-center text-sm font-semibold text-[#17301f]">
                          {cartItem.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onAddToCart(product)}
                          className="h-8 w-8 rounded-full bg-[#1a5f3b] text-sm font-semibold text-white"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        className="h-9 rounded-full bg-[#1a5f3b] px-4 text-xs font-semibold text-white"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {customerStep === "cart" && (
        <div className="mt-5 space-y-4">
          {cart.length ? (
            <>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-[1.1rem] border border-[#e2efe0] bg-white px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#17301f]">{item.name}</p>
                      <p className="text-xs text-[#5a7b65]">
                        {item.quantity} x {formatCurrency(item.price)} · {item.weight} lb
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="h-8 w-8 rounded-full bg-[#edf6e8] text-sm font-semibold text-[#1a5f3b]"
                      >
                        -
                      </button>
                      <span className="min-w-5 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="h-8 w-8 rounded-full bg-[#edf6e8] text-sm font-semibold text-[#1a5f3b]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.1rem] bg-[#f5f2ec] px-4 py-3 text-sm text-[#365646]">
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span>{cartSummary.itemCount}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span>Total weight</span>
                  <span>{cartSummary.totalWeight} lb</span>
                </div>
                <div className="mt-2 flex items-center justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartSummary.totalPrice)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onGoToStep("checkout")}
                className="w-full rounded-[1.1rem] bg-[#1a5f3b] px-4 py-3 text-sm font-semibold text-white"
              >
                Continue to delivery options
              </button>

              <button
                type="button"
                onClick={onClearCart}
                className="w-full rounded-[1.1rem] border border-[#dbe9d6] bg-white px-4 py-3 text-sm font-semibold text-[#1a5f3b]"
              >
                Clear cart
              </button>
            </>
          ) : (
            <EmptyState
              title="Cart is empty"
              description="Add items to see delivery eligibility and checkout."
              actionLabel="Browse products"
              onAction={() => onGoToStep("catalog")}
            />
          )}
        </div>
      )}

      {customerStep === "checkout" && (
        <div className="mt-5 space-y-4">
          <div className="rounded-[1.2rem] bg-white p-4 shadow-[0_12px_28px_rgba(20,40,25,0.08)]">
            <h3 className="text-center text-base font-semibold text-[#17301f]">
              Choose Your Delivery Option
            </h3>
          </div>

          <DeliveryOptionCard
            title="Drone Delivery"
            eta="Fastest · 15 min"
            price="$4.99"
            enabled={eligibility.eligible}
            description="Best for small, urgent orders."
            note="Available for orders under 5 lbs and 10 items"
            onSelect={() => onPlaceOrder("drone")}
          />
          <DeliveryOptionCard
            title="Standard Delivery"
            eta="45–60 min"
            price="$2.49"
            enabled
            description="Ground courier delivery."
            onSelect={() => onPlaceOrder("standard")}
          />
          <DeliveryOptionCard
            title="Sidewalk Robot"
            eta="30–40 min"
            price="$3.49"
            enabled={false}
            description="Autonomous sidewalk robot delivery."
            note="Temporarily unavailable in your location"
            onSelect={() => {}}
          />

          <div className="rounded-[1.2rem] border border-[#e2efe0] bg-white px-4 py-3 text-sm text-[#365646]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(cartSummary.totalPrice)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span>Delivery Fee</span>
              <span>$4.99</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span>Estimated Taxes</span>
              <span>$2.49</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-base font-semibold text-[#17301f]">
              <span>Total</span>
              <span>{formatCurrency(cartSummary.totalPrice + 7.48)}</span>
            </div>
            {!eligibility.eligible && (
              <p className="mt-2 text-xs text-[#b36a2d]">
                Some items are too heavy for drone delivery.
              </p>
            )}
          </div>
        </div>
      )}

      {customerStep === "tracking" && (
        <div className="mt-5">
          {currentOrder ? (
            <OrderTracking order={currentOrder} />
          ) : (
            <EmptyState
              title="No live order yet"
              description="Place an order to see customer tracking here."
              actionLabel="Start shopping"
              onAction={() => onGoToStep("catalog")}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ShopperFlow({
  orders,
  selectedOrder,
  droneAvailable,
  onSelectOrder,
  onToggleDrone,
  onStartPicking,
  onMarkPicked,
  onReadyForDispatch,
  onDispatch,
  onDelivered,
  onSwitchRole,
}: {
  orders: ReturnType<typeof useAppState>["orders"];
  selectedOrder: Order | null;
  droneAvailable: boolean;
  onSelectOrder: ReturnType<typeof useAppState>["setSelectedOrderId"];
  onToggleDrone: ReturnType<typeof useAppState>["setDroneAvailable"];
  onStartPicking: ReturnType<typeof useAppState>["startPicking"];
  onMarkPicked: ReturnType<typeof useAppState>["markPicked"];
  onReadyForDispatch: ReturnType<typeof useAppState>["readyForDispatch"];
  onDispatch: ReturnType<typeof useAppState>["dispatchOrder"];
  onDelivered: ReturnType<typeof useAppState>["markDelivered"];
  onSwitchRole: () => void;
}) {
  const [queueTab, setQueueTab] = useState<"drone" | "standard">("drone");
  const droneOrders = orders.filter((order) => order.deliveryMode === "drone");
  const standardOrders = orders.filter((order) => order.deliveryMode === "standard");
  const tabOrders = queueTab === "drone" ? droneOrders : standardOrders;

  return (
    <div className="px-6 pb-8">
      <div className="flex items-center justify-between rounded-[1.1rem] bg-[#f5f2ec] px-4 py-2 text-xs font-semibold text-[#5a7b65]">
        <span>Assigned work queue</span>
        <button
          type="button"
          onClick={onSwitchRole}
          className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1a5f3b]"
        >
          Switch to customer
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-[1.1rem] bg-white px-4 py-3 text-xs text-[#365646]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b8672]">
            Drone availability
          </p>
          <p className="mt-1 text-sm font-semibold text-[#17301f]">
            {droneAvailable ? "Available" : "Unavailable"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggleDrone(!droneAvailable)}
          className={`relative h-8 w-14 rounded-full transition ${
            droneAvailable ? "bg-[#1a5f3b]" : "bg-[#c8d5c4]"
          }`}
          aria-pressed={droneAvailable}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
              droneAvailable ? "left-7" : "left-1"
            }`}
          />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setQueueTab("drone")}
          className={`flex items-center justify-center gap-1.5 rounded-[1.15rem] border px-3 py-2.5 text-[12px] font-semibold transition ${
            queueTab === "drone"
              ? "border-[#1a5f3b] bg-white text-[#1a5f3b] shadow-[0_4px_14px_rgba(26,95,59,0.12)]"
              : "border-transparent bg-[#e8ebe4] text-[#5a6b62]"
          }`}
        >
          <ShopperDroneGlyph className="h-4 w-4 shrink-0" active={queueTab === "drone"} />
          <span className="truncate">Drone Priority ({droneOrders.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setQueueTab("standard")}
          className={`flex items-center justify-center gap-1.5 rounded-[1.15rem] border px-3 py-2.5 text-[12px] font-semibold transition ${
            queueTab === "standard"
              ? "border-[#1a5f3b] bg-white text-[#1a5f3b] shadow-[0_4px_14px_rgba(26,95,59,0.12)]"
              : "border-transparent bg-[#e8ebe4] text-[#5a6b62]"
          }`}
        >
          <ShopperTruckGlyph className="h-4 w-4 shrink-0" active={queueTab === "standard"} />
          <span className="truncate">Standard ({standardOrders.length})</span>
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {tabOrders.length ? (
          tabOrders.map((order) => (
            <ShopperQueueOrderCard
              key={order.id}
              order={order}
              selected={selectedOrder?.id === order.id}
              onSelect={() => onSelectOrder(order.id)}
            />
          ))
        ) : (
          <div className="rounded-[1.2rem] border border-dashed border-[#d6e8d4] bg-white px-4 py-8 text-center text-xs text-[#6a8772]">
            {queueTab === "drone"
              ? "No drone orders in queue. Check Standard or wait for new assignments."
              : "No standard orders in queue. Check Drone or wait for new assignments."}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-[1.3rem] border border-[#e2efe0] bg-white p-4">
        {selectedOrder ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#17301f]">{selectedOrder.id}</p>
              <p className="text-xs text-[#6a8772]">ETA {selectedOrder.eta}</p>
            </div>
            <p className="mt-2 text-xs text-[#5a7b65]">
              {selectedOrder.fallbackReason
                ? selectedOrder.fallbackReason
                : getStatusLabel(selectedOrder.status)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedOrder.status === "created" && (
                <ActionButton label="Start picking" onClick={() => onStartPicking(selectedOrder.id)} />
              )}
              {selectedOrder.status === "picking" && !selectedOrder.pickedAt && (
                <ActionButton label="Mark as picked" onClick={() => onMarkPicked(selectedOrder.id)} />
              )}
              {selectedOrder.status === "picking" && selectedOrder.pickedAt && (
                <ActionButton
                  label="Ready for dispatch"
                  onClick={() => onReadyForDispatch(selectedOrder.id)}
                />
              )}
              {(selectedOrder.status === "packed" || selectedOrder.status === "fallback") && (
                <ActionButton
                  label={
                    selectedOrder.deliveryMode === "drone"
                      ? "Dispatch Drone"
                      : "Dispatch Courier"
                  }
                  onClick={() => onDispatch(selectedOrder.id)}
                />
              )}
              {selectedOrder.status === "out_for_delivery" && (
                <ActionButton label="Mark delivered" onClick={() => onDelivered(selectedOrder.id)} />
              )}
            </div>
          </>
        ) : (
          <p className="text-xs text-[#6a8772]">Select an order to start picking.</p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center text-[10px] font-semibold text-[#6a8772]">
        <div className="rounded-[1rem] bg-[#f5f2ec] py-3">Scan items</div>
        <div className="rounded-[1rem] bg-[#f5f2ec] py-3">Pack & verify</div>
        <div className="rounded-[1rem] bg-[#f5f2ec] py-3">Handoff to drone</div>
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-[1.3rem] bg-[#1a5f3b] px-4 py-3 text-sm font-semibold text-white"
        onClick={() => selectedOrder && onStartPicking(selectedOrder.id)}
        disabled={!selectedOrder}
      >
        Start picking
      </button>
    </div>
  );
}

function shopperOrderShortId(id: string) {
  return id.replace(/^ORD-/, "#");
}

/** Deterministic SLA-style clock for demo (orange timer in queue cards). */
function shopperSlaClock(order: Order): string {
  if (order.slaDisplay) return order.slaDisplay;
  const n = order.id.replace(/\D/g, "") || "0";
  const seed = Number.parseInt(n.slice(-4), 10) || 1234;
  if (order.deliveryMode === "drone") {
    const mins = 3 + (seed % 5);
    const secs = seed % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  }
  const mins = 10 + (seed % 20);
  const secs = (seed * 7) % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function ShopperQueueOrderCard({
  order,
  selected,
  onSelect,
}: {
  order: Order;
  selected: boolean;
  onSelect: () => void;
}) {
  const isDrone = order.deliveryMode === "drone";
  const sla = shopperSlaClock(order);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-[1.35rem] border bg-white px-4 py-3.5 text-left shadow-[0_10px_28px_rgba(20,40,25,0.06)] transition ${
        selected ? "border-[#1a5f3b] ring-1 ring-[#1a5f3b]/25" : "border-[#e6e9e4]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`inline-flex max-w-[72%] items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            isDrone ? "bg-[#e6f4d9] text-[#2c6b36]" : "bg-[#e8eaed] text-[#4a4f55]"
          }`}
        >
          {isDrone ? (
            <ShopperDroneGlyph className="h-3.5 w-3.5 shrink-0" active />
          ) : (
            <ShopperTruckGlyph className="h-3.5 w-3.5 shrink-0" active />
          )}
          <span className="truncate">
            {isDrone ? "Drone" : "Standard"} · {shopperOrderShortId(order.id)}
          </span>
        </span>
        <span className="shrink-0 text-[15px] font-bold tabular-nums text-[#e07020]">{sla}</span>
      </div>

      <p className="mt-3 text-[15px] font-bold leading-tight text-[#17301f]">
        {order.itemCount} items · {order.totalWeight} lbs
      </p>

      <div className="mt-2 flex items-start gap-2 text-[12px] text-[#5a7b65]">
        <span className="mt-0.5 shrink-0 text-[#6a8772]" aria-hidden>
          📍
        </span>
        <span>
          {isDrone ? "Backyard – clear area" : "Front door · leave at door (residential)"}
        </span>
      </div>

      <div className="mt-1.5 flex items-start gap-2 text-[12px] text-[#5a7b65]">
        <span className="mt-0.5 shrink-0 text-[#6a8772]" aria-hidden>
          {isDrone ? "⚖" : "🚚"}
        </span>
        <span>{isDrone ? "≤ 5 lbs (drone limit)" : "Ground courier · no drone cap"}</span>
      </div>

      <div className="mt-3 border-t border-[#eef1ec] pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b8672]">
          Items to pick
        </p>
        <ul className="mt-2 space-y-1.5">
          {order.items.map((line) => (
            <li
              key={`${order.id}-${line.id}`}
              className="flex items-baseline justify-between gap-2 text-[12px] text-[#17301f]"
            >
              <span className="min-w-0 truncate">
                <span className="font-semibold text-[#1a5f3b]">{line.quantity}×</span> {line.name}
              </span>
              <span className="shrink-0 text-[11px] text-[#6a8772]">
                {line.weight} lb ea.
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex items-center justify-end">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8ebe4] text-[#4d6d59]">
          →
        </span>
      </div>
    </button>
  );
}

function ShopperDroneGlyph({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 3v3M7 8l-2-2M19 8l2-2M5 13h3M16 13h3M8 21h8l-1-7H9L8 21z"
        stroke={active ? "#1a5f3b" : "#6a8772"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="2.5" fill={active ? "#1a5f3b" : "#9aab9e"} />
    </svg>
  );
}

function ShopperTruckGlyph({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 16h12V8H3v8zm12 0h3l2-4V8h-2M6 18.5a1.5 1.5 0 1 0 0 .01v-.01zm10 0a1.5 1.5 0 1 0 0 .01v-.01z"
        stroke={active ? "#1a5f3b" : "#6a8772"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DeliveryOptionCard({
  title,
  eta,
  price,
  enabled,
  description,
  note,
  onSelect,
}: {
  title: string;
  eta: string;
  price: string;
  enabled: boolean;
  description: string;
  note?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!enabled}
      className={`w-full rounded-[1.3rem] border px-4 py-4 text-left ${
        enabled
          ? "border-[#e2efe0] bg-white"
          : "border-[#f0e6d3] bg-[#fff9ef] opacity-70"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={`mt-1 h-8 w-8 rounded-full ${
              enabled ? "bg-[#e7f5df]" : "bg-[#f3e9d8]"
            }`}
          />
          <div>
            <p className="text-sm font-semibold text-[#17301f]">{title}</p>
            <p className="mt-1 text-xs text-[#6a8772]">{eta}</p>
            <p className="mt-1 text-xs text-[#5a7b65]">{description}</p>
          </div>
        </div>
        <span className="text-sm font-semibold text-[#17301f]">{price}</span>
      </div>
      {note && (
        <div className="mt-3 rounded-full bg-[#eaf4e2] px-3 py-1 text-[10px] font-semibold text-[#3f6b45]">
          {note}
        </div>
      )}
    </button>
  );
}

function OrderTracking({ order }: { order: Order }) {
  if (order.deliveryMode === "standard" || order.status === "fallback") {
    return <StandardOrderTracking order={order} />;
  }

  return <DroneOrderTracking order={order} />;
}

function DroneOrderTracking({ order }: { order: Order }) {
  const activeIndex =
    order.status === "fallback"
      ? 2
      : trackingStages.findIndex((stage) => stage.key === order.status);

  return (
    <div className="space-y-4">
      <div className="rounded-[1.2rem] bg-white px-4 py-3 text-sm text-[#365646] shadow-[0_12px_28px_rgba(20,40,25,0.08)]">
        Drone is delivering your order...
      </div>

      <div className="overflow-hidden rounded-[1.3rem] border border-[#e2efe0] bg-white">
        <div className="h-40 bg-[linear-gradient(135deg,#3f7d52,#8fbb79)]" />
        <div className="border-t border-[#e2efe0] px-4 py-3 text-center text-sm text-[#365646]">
          Arriving in 3 min
        </div>
        <div className="h-48 bg-[radial-gradient(circle_at_20%_20%,rgba(26,95,59,0.2),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(26,95,59,0.18),transparent_45%),linear-gradient(180deg,#f2f6ee,#e8efe3)]" />
        <div className="border-t border-[#e2efe0] px-4 py-3 text-xs text-[#5a7b65]">
          {order.fallbackReason
            ? "Drone unavailable → switched to standard delivery"
            : "Order picked up by drone"}
        </div>
      </div>

      <div className="grid gap-3">
        {trackingStages.map((stage, index) => {
          const complete = index <= activeIndex || order.status === "delivered";
          return (
            <div
              key={stage.key}
              className={`rounded-[1.1rem] border px-4 py-3 text-sm ${
                complete
                  ? "border-[#cfe5c9] bg-[#f4fbf1] text-[#1a5f3b]"
                  : "border-[#e2efe0] bg-white text-[#6a8772]"
              }`}
            >
              {stage.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StandardOrderTracking({ order }: { order: Order }) {
  const activeIndex = trackingStages.findIndex((stage) => stage.key === order.status);

  return (
    <div className="space-y-4">
      <div className="rounded-[1.2rem] bg-white px-4 py-3 text-sm text-[#365646] shadow-[0_12px_28px_rgba(20,40,25,0.08)]">
        Courier is on the way with your order.
      </div>

      <div className="overflow-hidden rounded-[1.3rem] border border-[#e2efe0] bg-white">
        <div className="h-40 bg-[linear-gradient(135deg,#7a7f86,#a2a8b0)]" />
        <div className="border-t border-[#e2efe0] px-4 py-3 text-center text-sm text-[#365646]">
          Arriving in 20 min
        </div>
        <div className="h-48 bg-[radial-gradient(circle_at_20%_20%,rgba(120,128,138,0.2),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(120,128,138,0.16),transparent_45%),linear-gradient(180deg,#f3f4f6,#e6e8eb)]" />
        <div className="border-t border-[#e2efe0] px-4 py-3 text-xs text-[#5a7b65]">
          Standard delivery route active
        </div>
      </div>

      <div className="grid gap-3">
        {trackingStages.map((stage, index) => {
          const complete = index <= activeIndex || order.status === "delivered";
          return (
            <div
              key={stage.key}
              className={`rounded-[1.1rem] border px-4 py-3 text-sm ${
                complete
                  ? "border-[#d5dae0] bg-[#f6f7f9] text-[#38424f]"
                  : "border-[#e2e5ea] bg-white text-[#6f7b88]"
              }`}
            >
              {stage.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-[1.3rem] border border-dashed border-[#d6e8d4] bg-white px-4 py-8 text-center">
      <h3 className="text-base font-semibold text-[#17301f]">{title}</h3>
      <p className="mt-2 text-xs text-[#5a7b65]">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-[1.1rem] bg-[#1a5f3b] px-4 py-2 text-xs font-semibold text-white"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function ActionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[1.1rem] bg-[#1a5f3b] px-4 py-2 text-xs font-semibold text-white"
    >
      {label}
    </button>
  );
}
