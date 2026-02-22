# OpenAI Integration

Dieses Projekt enthält GPT-4 Integration für erweiterte Marktanalysen.

## Setup

1. Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```bash
OPENAI_API_KEY=dein-api-key-hier
```

**Hinweis:** Dein echter API Key sollte nie im Code committed werden!

2. Für Vercel Deployment:
   - Gehe zu Project Settings → Environment Variables
   - Füge `OPENAI_API_KEY` hinzu

## Features

- **GPT-4 Marktanalyse**: Klicke auf "Marktanalyse" für eine KI-Einschätzung
- **Trading Signals**: Klicke auf "Signal" für BUY/HOLD/SELL Empfehlungen

## Hinweis

Die OpenAI-Integration ist optional. Ohne API Key funktioniert das Dashboard normal, zeigt aber keine GPT-Analysen an.
