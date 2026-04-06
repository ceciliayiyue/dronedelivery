# Instacart Drone Delivery MVP

Minimal autonomous grocery delivery demo built with Next.js App Router, React, TypeScript, Tailwind CSS, and local mock data.

## How to run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## What the MVP includes

- Customer flow: product list, cart, checkout, and order tracking
- Shopper flow: order queue, order detail, picking, packing, dispatch, and delivery completion
- Shared in-memory order state so both roles stay in sync locally
- Three guided demo scenarios:
  - eligible drone success
  - ineligible standard-only order
  - eligible order with drone fallback

## Eligibility logic

`checkDroneEligibility(order)` returns:

```ts
{
  eligible: boolean,
  reason: string
}
```

Rules:

- total weight must be `<= 5 lbs`
- item count must be `<= 10`
- every item must have `droneEligible === true`

If any rule fails, the function returns `eligible: false` and explains the first blocking reason.

## Fallback logic

- Orders can be placed in `drone` or `standard` mode
- Shopper dashboard includes a `Drone available` toggle
- When a shopper dispatches a drone order:
  - if drone is available, order status becomes `out_for_delivery`
  - if drone is unavailable, order status becomes `fallback`, the delivery mode switches to `standard`, and ETA updates to `45–60 min`
- The customer tracking UI shows: `Drone unavailable → switched to standard delivery`

## Order state machine

- `created`
- `picking`
- `packed`
- `out_for_delivery`
- `delivered`
- `fallback`

## Folder structure

```text
app/
  globals.css
  layout.tsx
  page.tsx
components/
  app-state-provider.tsx
  mvp-app.tsx
lib/
  data.ts
  eligibility.ts
  types.ts
  utils.ts
```
