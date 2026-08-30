# TripBuddy — SIH 2026 | KaizenX | TRV22

**Problem Statement:** SIH26207 — Travel & Tourism

TripBuddy is an **Agentic AI Copilot for End-to-End Travel**. The product demo turns a natural-language travel brief into a personalised, budget-aware and group-aware itinerary, then demonstrates route optimisation, disruption recovery and a safe execution/booking hand-off.

## SIH feature coverage

| SIH concept | Working demo surface |
|---|---|
| Multi-modal input | Natural-language brief + browser voice input + inspiration/Reels link field |
| Travel DNA Profiler | Travel DNA page with pace, budget and interest profile |
| Smart Route Optimiser | Smart Route page with geographic route visual and optimisation rationale |
| Group Mediation Engine | Group Hub with traveller preferences and consensus API |
| Self-Healing Itinerary | Itinerary → Simulate disruption → repaired activity |
| Autonomous Execution | Execution Hub with flight/stay/dining reservation simulation + approval gate |
| Micro-budget constraints | Budget engine and category breakdown |
| UPI multi-payer concept | Budget & Split → Generate split |
| Agentic traceability | Agent trace shown beside the generated itinerary |
| Judge-safe demo | Core flow works with deterministic backend intelligence and no paid API key |

## Tech stack

- React + Vite frontend
- Node.js + Express backend
- Responsive custom CSS
- Browser Web Speech API when available
- LocalStorage for latest trip persistence
- PWA manifest + service worker
- GitHub Actions CI
- Deployment manifests for Vercel and Render

## Repository structure

```text
TripBuddy-SIH2026/
├── frontend/                 # React/Vite application
│   ├── public/assets/        # visuals extracted from the team's PPT
│   ├── public/manifest.webmanifest
│   ├── public/sw.js
│   └── src/
├── backend/                  # Express REST API
│   └── src/
├── docs/PITCH.md             # 3-minute judge demo script
├── .github/workflows/ci.yml  # build checks
└── README.md
```

## Run locally

### Backend

```bash
cd backend
npm install
npm run dev
```

API: `http://localhost:5050`

### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend defaults to `http://localhost:5050/api`.

For a deployed API, create `frontend/.env`:

```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
```

## Judge demo sequence

1. **Command Center** — establish the problem and product story.
2. **Create Trip** — enter `4 days in Andhra Pradesh, ₹18,000, relaxed, heritage + food + nature` or use the structured controls.
3. **Agentic Run** — show the agent stages.
4. **Itinerary** — explain that the output is personalised and budget constrained.
5. **Simulate disruption** — trigger the self-healing path.
6. **Smart Route** — show geographic clustering and pace reasoning.
7. **Group Hub** — show conflicting traveller preferences and run mediation.
8. **Execution Hub** — demonstrate flight/stay/dining reservation hand-off with approval gate.
9. **Budget & Split** — generate the UPI-style group split.
10. **Travel DNA** — close by showing how the profile makes the system personalised rather than generic.

## Deployment

### Frontend — Vercel

Deploy the `frontend` directory as the project root.

Environment variable:

```text
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
```

`frontend/vercel.json` provides SPA fallback routing.

### Backend — Render

Deploy the `backend` directory. The included `backend/render.yaml` provides the basic service configuration.

Set:

```text
PORT=5050
```

## What is simulated vs production

The supplied SIH deck proposes live transit APIs, dynamic weather adaptation, flight/stay/dining reservations and UPI multi-payer billing. This repository intentionally provides **safe simulations** of booking and payment actions so a hackathon presentation never depends on secret credentials or real financial transactions.

For a production version, replace the provider service functions with authenticated flight/hotel/maps/weather/payment integrations while keeping the frontend contracts unchanged.

## GitHub upload

Create a repository named `TripBuddy-SIH2026`, then upload the **contents** of this folder.

```bash
git init
git add .
git commit -m "feat: TripBuddy SIH 2026 MVP"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/TripBuddy-SIH2026.git
git push -u origin main
```

## Team

**KaizenX · TRV22**

SIH 2026 · Travel & Tourism · Software
