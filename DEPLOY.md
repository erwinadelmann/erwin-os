# ERWIN OS – Deployment Anleitung

## Schritt 1: Supabase Datenbank einrichten

1. supabase.com/dashboard → Projekt `erwin-os` öffnen
2. Linke Leiste → **SQL-Editor**
3. Den Inhalt von `supabase-setup.sql` einfügen und ausführen
4. Tabellen `metrics` und `conversations` sind jetzt bereit

## Schritt 2: Vercel Deployment

1. Diesen `erwin-os-app` Ordner als neues GitHub Repository anlegen
2. vercel.com → „New Project" → GitHub Repo importieren
3. Framework: **Next.js** (automatisch erkannt)

## Schritt 3: Environment Variables in Vercel

In Vercel → Settings → Environment Variables folgendes eintragen:

| Variable | Wert |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://DEIN_PROJECT_ID.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_DEIN_KEY_HIER` |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_DEIN_KEY_HIER` |

## Schritt 4: Deploy

Vercel baut und deployed automatisch. Fertig.

---

## KI-Assistent freischalten (später)

Wenn du bereit bist:

1. Anthropic API Key erstellen: console.anthropic.com
2. In Vercel Environment Variables hinzufügen: `ANTHROPIC_API_KEY=sk-ant-...`
3. In `app/page.jsx` den KI-Assistenten-Bereich entsperren (eine Zeile ändern)
4. Ich baue dann das Chat-Backend dazu

---

## Lokale Entwicklung

```bash
cd erwin-os-app
cp .env.local.example .env.local
npm install
npm run dev
```

→ http://localhost:3000
