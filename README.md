# Pulse — real-time chat application

Pulse is a responsive React and TypeScript chat workspace built with Vinext, Tailwind CSS, D1, R2, REST endpoints, and a reconnecting WebSocket client.

## Run locally

1. Install Node.js 22.13 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and provide your WebSocket endpoint when connecting a live backend.
4. Run `npm run dev`, then open the printed local URL.

Use `npm run build` for a production build. The included interface runs with realistic seeded data and demonstrates optimistic sending, delivery/read transitions, offline failure feedback, upload progress, reactions, message actions, typing and presence UI, search, unread badges, older-message pagination affordances, dark mode, and mobile navigation. Server-side authentication helpers protect `/account` and the REST message API. D1 holds chat metadata and R2 is configured for file bytes.

## Structure

- `app/page.tsx` — responsive chat workspace and interaction state
- `app/api/messages/route.ts` — authenticated REST message endpoints
- `app/account/page.tsx` — protected route example
- `lib/chat-types.ts` — shared domain contracts
- `lib/reconnecting-websocket.ts` — exponential-backoff WebSocket client
- `db/schema.ts` — relational chat schema and query indexes
- `components/ui` — reusable accessible interface primitives

For production, point `NEXT_PUBLIC_WEBSOCKET_URL` to an authenticated WebSocket service and persist the API operations with the supplied D1 schema. Never trust author or user IDs from the client; derive identity from authenticated request headers.
