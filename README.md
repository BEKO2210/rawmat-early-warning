# RawMat Early Warning System

Ein vollständig kostenloses Rohstoff-Frühwarnsystem Dashboard.

## Features

- **6 Märkte**: Copper, Nickel, Cobalt, Lithium, Magnesium, Aluminium
- **Signal Engine**: Demand/Supply Index, Z-Score, EMA, Mismatch Score
- **Alerts**: Automatische Warnungen bei kritischen Werten
- **Offline-first**: Lokale Speicherung, keine API-Keys nötig
- **Dark/Light Mode**: Automatischer Theme-Switch

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- Recharts
- LocalStorage / IndexedDB

## Quick Start

```bash
# Clone repository
git clone https://github.com/BEKO2210/rawmat-early-warning.git
cd rawmat-early-warning

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deploy auf Vercel

1. Push zu GitHub
2. Importiere in Vercel
3. Build Command: `npm run build`
4. Fertig – keine Environment Variables nötig!

## Datenquellen

- Primary: datahub.io (kostenlos)
- Fallback: Lokale Sample-Daten

## Lizenz

MIT
