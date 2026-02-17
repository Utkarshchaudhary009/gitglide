# GitGlide — Project Goal

## What Is GitGlide?

GitGlide is a **premium UI/UX wrapper** around [Jules](https://jules.google.com/) — Google's autonomous coding agent that ships with a REST API (`v1alpha`). Jules can create coding sessions, generate plans, write code, and open pull requests — all programmatically.

GitGlide takes that raw API power and wraps it in a **beautiful, production-grade dashboard** with two killer integration features:

1. **GitHub Code Review** — When a PR is opened on a connected repo, GitGlide automatically spins up a Jules session to review the code and post feedback.
2. **Vercel Deploy Fix** — When a Vercel deployment fails, GitGlide automatically creates a Jules session to diagnose the failure, fix it, and open a PR.

---

## Core Philosophy

| Principle | Description |
|---|---|
| **API-First** | Jules API is the single source of truth for sessions, activities, plans, and outputs. Our DB stores only what Jules doesn't: user preferences, integration configs, and webhook state. |
| **Minimal DB Surface** | NeonDB (Postgres via Prisma) stores: user settings, integration configs, webhook logs. No session data duplication. |
| **Stage Independence** | Each development stage is self-contained and shippable. Stage N+1 never requires rewriting Stage N. |
| **Max Reuse** | shadcn/ui components everywhere. No custom primitives when a shadcn component exists. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, RSC) |
| **Runtime** | Bun |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Auth** | Clerk |
| **Database** | NeonDB (Postgres) |
| **ORM** | Prisma |
| **State** | Zustand (client-side) |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |
| **Toasts** | Sonner |
| **External APIs** | Jules REST API, GitHub API, Vercel API |

---

## 5-Stage Build Plan

### Stage 1 — Foundation & Setup
All infrastructure, zero features. After this stage, every tool is installed, configured, and wired up. A developer can run `bun dev` and see a working authenticated shell.

- Next.js project scaffold ✅ (done)
- Clerk auth (sign-in/up, middleware, protected routes)
- NeonDB + Prisma schema (User settings, IntegrationConfig, WebhookLog)
- Zustand stores (sidebar state, theme, toasts)
- Jules API client (`src/lib/jules-client.ts`) with encryption for API keys
- shadcn/ui init + core components
- App shell: sidebar, topbar, layout
- Design system: dark theme, CSS tokens, typography

### Stage 2 — Jules API & UI
The complete Jules experience. Every API endpoint wrapped, every session state visualized.

- Dashboard page (stats, recent sessions, activity feed)
- Sessions list (DataTable, filters, state badges)
- Session detail (activity timeline, plan viewer, chat, PR output)
- Create session flow (repo picker, prompt editor, options)
- Sources/repos browser page
- Settings page (API keys, connection tests)

### Stage 3 — Vercel Integration
Deployment failure detection → automatic fix → PR creation.

- Vercel token config in Settings
- Vercel integration config page (enable/disable, project selector, fix prompt template)
- Vercel webhook endpoint (`/api/webhooks/vercel`)
- Webhook → Jules session creation pipeline
- Deployment status monitoring UI

### Stage 4 — GitHub Integration
PR-triggered code review powered by Jules.

- GitHub token config in Settings
- GitHub integration config page (enable/disable, repo selector, review prompt template)
- GitHub webhook endpoint (`/api/webhooks/github`)
- Webhook → Jules code review session pipeline
- Review results display in integration dashboard

### Stage 5 — Polish & Hardening
Production readiness.

- Error boundaries on every route
- Loading skeletons on every data-fetch
- Rate limiting on webhook endpoints
- Comprehensive logging (webhook events, API call traces)
- SEO meta tags
- README and user documentation
- Final visual QA and performance audit

---

## What Lives in the DB vs. the API

| Data | Source | Why |
|---|---|---|
| Sessions, Activities, Plans, Sources | **Jules API** (live fetch) | Jules is the source of truth |
| User preferences (theme, default repo) | **NeonDB** | Jules doesn't store this |
| Integration configs (enabled repos, prompt templates) | **NeonDB** | Custom to GitGlide |
| Webhook event logs | **NeonDB** | Audit trail for debugging |
| API keys (Jules, GitHub, Vercel) | **NeonDB** (encrypted) | Per-user secret storage |
