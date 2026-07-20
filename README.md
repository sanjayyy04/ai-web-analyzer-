# AI Website Analyzer

Production-ready web app: enter a URL, run Lighthouse audits (SEO, accessibility, performance, best practices), and get a developer-friendly report with optional AI summaries.

## Prerequisites

- **Node.js 18+**
- **Google Chrome** (required for Lighthouse headless audits)

## Quick start (development)

```bash
npm run install:all
copy server\.env.example server\.env
npm run dev
```

- **UI:** http://localhost:5173  
- **API:** http://localhost:8787/api/health  

## Production build & run

```bash
npm run install:all
npm run build
npm run start
```

Open **http://localhost:8787** — the server serves the built React app and API on one port.

Set in `server/.env`:

```env
NODE_ENV=production
PORT=8787
GEMINI_API_KEY=your_key_here
CLIENT_ORIGIN=https://your-domain.com
```

## Project structure

| Path | Role |
|------|------|
| `client/` | React + Vite + Tailwind frontend |
| `server/` | Express API, Lighthouse, Cheerio, Google Gemini |
| `package.json` | Root scripts (`dev`, `build`, `start`) |

## Features

- URL analysis via Lighthouse (Performance, Accessibility, SEO, Best Practices)
- HTML content signals (title, meta, headings, alt text, word count)
- UX heuristics bundle
- AI humanized reports with fixes and sample code (when `GEMINI_API_KEY` is set) or rule-based fallback
- Dark / light theme, sticky header, wireframe loading state

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | API + Vite dev servers |
| `npm run build` | Build client + compile server TypeScript |
| `npm run start` | Run production server (serves UI + API) |
