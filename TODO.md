# Frontend Fix Plan Tracker

- [ ] Step 1: Add shared realtime/dashboard UI components under `src/components/dashboard/` (charts, tables, loading states, websocket simulation, motion helpers)
- [ ] Step 2: Replace required page files with full UI: Home already OK; implement Dashboard, Leaderboard, Submission, Analytics, Architecture, Admin
- [ ] Step 3: Ensure every chart/table component is a client component where hooks are used ("use client")
- [ ] Step 4: Wire pages to `useRealtimeStream` for TPS/latency/container stats + animated loading states
- [ ] Step 5: Add drag-and-drop upload UI + progress bar + submission history + deployment status (mock realtime)
- [ ] Step 6: Add interactive architecture diagram + animated network flow + Kafka/Redis/bot fleet visualization (mock state)
- [ ] Step 7: Verify Tailwind/Recharts/Framer Motion compile; run `npm run dev` and check for blank pages
- [ ] Step 8: If runtime errors occur, patch imports/paths/hydration/layout issues
- [ ] Step 9: Final verification: all required routes show non-empty UI with responsive layout

