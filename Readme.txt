Commands to run
Development (UI + API)
cd "e:\programs\projects\AI website analyzer"
npm run install:all
copy server\.env.example server\.env
npm run dev
App: http://localhost:5173
API: http://localhost:8787/api/health
Production
cd "e:\programs\projects\AI website analyzer"
npm run install:all
npm run build
npm run start
Everything on: http://localhost:8787 (UI + API)
Optional in server\.env:

GEMINI_API_KEY=your_key   # https://aistudio.google.com/apikey
PORT=8787
CLIENT_ORIGIN=http://localhost:8787
Project layout (production-ready)
ai-website-analyzer/
├── client/          # React frontend → builds to client/dist
├── server/          # Express + Lighthouse API
├── package.json     # Root scripts
└── README.md        # Full setup guide
If npm run dev in client still fails, run npm run install:all from the project root first, not only inside client.