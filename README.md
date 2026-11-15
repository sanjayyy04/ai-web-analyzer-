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
- Dedicated `/analyze` progress page for live wireframing and scanning, followed by `/report` with scores, charts, findings, and report exports
- HTML content signals (title, meta, headings, alt text, word count)
- UX heuristics bundle
- AI humanized reports with fixes and sample code (when `GEMINI_API_KEY` is set) or rule-based fallback
- Pure-black theme, sticky header, wireframe loading state

## Deploy frontend to GitHub Pages

The `Deploy frontend to GitHub Pages` workflow builds and publishes the Vite client on pushes to `main` and on manual runs. Enable **Settings → Pages → Build and deployment → GitHub Actions** in the repository to activate it. The build configures the repository subpath and preserves the `/analyze` and `/report` routes on refresh.

GitHub Pages hosts only the static frontend; it does not run the Express/Lighthouse API. To enable audits on the deployed site, add a repository Actions variable named `VITE_API_BASE_URL` with the public origin of a separately hosted API (for example, `https://api.example.com`). Configure that API's `CLIENT_ORIGIN` to allow `https://sanjayyy04.github.io`. If the variable is omitted, the frontend still deploys, but audit requests need a reachable API.

## Deploy backend to Render

Create a Render Web Service using the repository root as the build context and `Dockerfile` as the Dockerfile path. The image installs Chromium for Lighthouse, runs the API only, and listens on Render's `PORT`. Set the optional Render health check path to `/api/health`.

Set `CLIENT_ORIGIN` to `https://sanjayyy04.github.io` in the Render environment (add other permitted frontend origins if needed). After Render provides the service URL, set the GitHub repository variable `VITE_API_BASE_URL` to that origin and rerun the Pages workflow. Set `GEMINI_API_KEY` in Render only if AI-enhanced reports are desired.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | API + Vite dev servers |
| `npm run build` | Build client + compile server TypeScript |
| `npm run start` | Run production server (serves UI + API) |
