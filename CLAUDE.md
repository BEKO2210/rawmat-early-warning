# RawMat Early Warning System

## Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: TailwindCSS + shadcn/ui (Radix UI)
- **Charts**: Recharts
- **Themes**: next-themes (light/dark)
- **Deployment**: Vercel (native Next.js support, no static export)

## Project Structure
```
app/              # Next.js App Router pages
  page.tsx        # Dashboard (client component)
  layout.tsx      # Root layout with ThemeProvider
  alerts/         # Alerts page
  settings/       # Settings page
  market/[name]/  # Dynamic market detail pages
components/       # React components (market-card, theme-provider, ui/)
lib/              # Shared logic
  types.ts        # TypeScript interfaces & constants
  scoring.ts      # Scoring algorithms & sample data generation
  hooks.ts        # Custom hooks (useMarkets, useAlerts, useSettings)
  utils.ts        # Utility functions
```

## Build & Dev
```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
```

## Key Architecture Decisions
- **Client-side only**: All data stored in browser localStorage, no backend API
- **No `output: 'export'`**: Vercel handles Next.js natively; static export causes issues with dynamic routes
- **Google Fonts via `<link>` tags**: Not via `next/font/google` (avoids build-time font fetch failures)
- **German locale (de-DE)**: All UI text and date formatting in German

## Vercel Configuration
- `vercel.json` should only contain `{ "framework": "nextjs" }`
- Do NOT set `outputDirectory` or `distDir` - Vercel manages this automatically
- Do NOT use `output: 'export'` in next.config.js
