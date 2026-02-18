# Repository Guidelines

## Communication Style:
- Support user feedback; suggest 5 unique, researched paths for every task.
- before starting any edit task create a MASTER-PLAN.md and after the task is completed delete it. 
- User strongly values clear, architectural explanations behind code changes. Keep tone professional yet deeply descriptive of the "what and why"

## Before You Start
- Do not read `README.md` by default. First state why it is needed, then spawn a subagent to read and summarize only relevant parts.
- invoke skills as you get to know what are you working on.
- Use subagents for docs, research, internet exploration, or any non-coding tasks. Give subagents precise, scoped instructions.
- Use `rg`/targeted reads for specific info to avoid context bloat.
- Docs references: Bun in `refrence/bun`, Vercel SDK in `refrence/vercelsdk`, Jules API in `refrence/jules`.

## Project Structure & Module Organization
- `src/app/` uses the Next.js App Router (route groups like `src/app/(auth)` and `src/app/(jules)` plus `api/` routes).
- Shared UI goes in `src/components/`, utilities in `src/lib/`, global state in `src/stores/`, and shared types in `src/types/`.
- Global styling lives in `src/app/globals.css`; static assets in `public/`.
- Database schema is in `prisma/schema.prisma`.
- Docs and supporting materials live in `docs/` and `refrence/`.

## Build, Test, and Development Commands
Run via Bun (preferred) or npm.
- `bun dev`: start the local dev server at `http://localhost:3000`.
- `bun build`: production build.
- `bun start`: run the production server.
- `bun lint`: ESLint (Next.js core-web-vitals + TypeScript).
- `bun format`: Prettier write.
- `bun format:check`: Prettier check only.
- `bun type-check`: TypeScript type checking.

## Coding Style & Naming Conventions
- Follow Next.js App Router conventions: route segments in `src/app`, `page.tsx`/`layout.tsx` files, and route groups in parentheses.

### Use shadcn CLI for UI Components

**When adding UI components, check if a shadcn/ui component exists and install it via CLI instead of writing it manually.**
bunx --bun shadcn@latest add <component-name>
Existing components are in `components/ui/`. See [shadcn/ui docs](https://ui.shadcn.com/) for available components.

### If any errors are found while running Compliance Checklist:

1. **Type errors**: Fix TypeScript type errors by correcting type annotations, adding missing imports, or fixing type mismatches
2. **Lint errors**: Fix ESLint errors by following the suggested fixes or adjusting the code to meet the linting rules
3. **Do not skip or ignore errors** - all errors must be resolved before considering the task complete

This ensures all code follows the project's formatting standards, type safety requirements, and linting rules, preventing issues in pull requests.

## Commit & Pull Request Guidelines
- Always create a new branch for work.
- After work is complete verify Compliance Checklist then, ask: "Should I create a pull request?" If yes, then commit and open a detailed PR.
- PRs should include: summary, key changes list, testing results (commands + status), and screenshots for UI changes.

## Security & Configuration Tips
- Copy `.env.example` to `.env` and populate Clerk/Prisma values before running locally.
- Do not commit secrets; prefer environment variables and update `.env.example` when new keys are required.
- When introducing a new API key, add a clear example entry in `.env.example` (with safe placeholder values).

## Compliance Checklist

Before submitting changes, verify:

- [ ] .env.example is upto date if new key is used.
- [ ] All logger calls use static strings
- [ ] All console calls use static strings (for user-facing logs)
- [ ] No sensitive data in error messages
- [ ] Tested in UI to confirm no data leakage
- [ ] Server-side debugging logs don't expose credentials
- [ ] Ran `bun run format` and code is properly formatted
- [ ] Ran `bun run format:check` to verify formatting
- [ ] Ran `bun run type-check` and all type errors are fixed
- [ ] Ran `ollama launch claude -p "Review the code like a senior code devloper" --model glm-5:cloud` then `ollama launch claude -p "Review the code like a senior code devloper" --model kimi-k2.5:cloud`  and to review the written code and fix if any bug.
- [ ] Ran `bun run lint` and all linting errors are fixed
- [ ] Ran `bun run build` to verify production build succeeds

