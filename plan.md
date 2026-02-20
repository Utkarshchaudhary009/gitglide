Integrations Task
Phase 1: Merge PR #6
 Squash-merge PR #6 into main with clean outcome-focused commit message
Phase 2: Integration Types & Lib
 Create src/lib/integrations/types.ts
 Create src/lib/integrations/metadata.ts (vercel + jules providers)
Phase 3: API Routes
 src/app/api/integrations/vercel/connect/route.ts
 src/app/api/integrations/vercel/disconnect/route.ts
 src/app/api/integrations/vercel/status/route.ts
 src/app/api/integrations/vercel/token/validate/route.ts
 src/app/api/integrations/jules/connect/route.ts
 src/app/api/integrations/jules/disconnect/route.ts
 src/app/api/integrations/jules/status/route.ts
 src/app/api/integrations/jules/token/validate/route.ts
Phase 4: UI Components
 src/components/integrations/connection-card.tsx
 src/components/integrations/token-wizard/wizard-progress.tsx
 src/components/integrations/token-wizard/step-introduction.tsx
 src/components/integrations/token-wizard/step-create-token.tsx
 src/components/integrations/token-wizard/step-paste-token.tsx
 src/components/integrations/token-wizard/step-verify.tsx
 src/components/integrations/token-wizard/token-wizard-modal.tsx
Phase 5: Integration Page
 src/app/app/integrations/integrations-list.tsx
 src/app/app/integrations/page.tsx
Phase 6: Compliance & Verification
 ESLint + TSC per changed file
 Commit + PR
 Wait 120s + check deployment logs

 Integrations Page — Implementation Plan
Add a fully functional Integrations page to GitGlide where users connect their Vercel and Jules accounts via API tokens, modelled closely on the cloudcode reference implementation.

Proposed Changes
Step 0 — Squash-merge PR #6
Merge feat/clerk-auth-setup (PR #6) into main with a single squash commit. The commit message will summarise outcomes:

feat: add Clerk authentication, protected app layout, Zustand session store, and sidebar navigation
Lib Layer
[NEW] src/lib/integrations/types.ts
Shared TypeScript types:

IntegrationProvider = 'vercel' | 'jules'
ProviderMetadata
 — id, name, description, tokenCreateUrl, tokenNote
ConnectionInfo
 — connected status, username, connectedAt
[NEW] src/lib/integrations/metadata.ts
Provider registry with metadata for both integrations:

Vercel: tokenCreateUrl = 'https://vercel.com/account/settings/tokens', tokenNote = Full Account
Jules: tokenCreateUrl = 'https://jules.google.com/settings' (Settings → API Keys, max 3), tokenNote = Read/Write
API Routes
The routes read/write to the existing UserSettings Prisma model (fields vercelToken and julesApiKey), both encrypted at rest via 
src/lib/security/encryption.ts
. Auth via Clerk auth().

[NEW] src/app/api/integrations/vercel/connect/route.ts
POST — validate token via Vercel REST API (https://api.vercel.com/v2/user), then save encrypted token + username to UserSettings.

[NEW] src/app/api/integrations/vercel/disconnect/route.ts
DELETE — clear vercelToken in UserSettings.

[NEW] src/app/api/integrations/vercel/status/route.ts
GET — return { connected, username } from UserSettings.

[NEW] src/app/api/integrations/vercel/token/validate/route.ts
POST — streaming NDJSON response that validates token against Vercel API and streams progress messages (same pattern as cloudcode).

[NEW] src/app/api/integrations/jules/connect/route.ts
POST — validate token via Jules API (https://jules.google.com/api/v1/user with X-Goog-Api-Key header), save encrypted key.

[NEW] src/app/api/integrations/jules/disconnect/route.ts
DELETE — clear julesApiKey in UserSettings.

[NEW] src/app/api/integrations/jules/status/route.ts
GET — return { connected, username } from UserSettings.

[NEW] src/app/api/integrations/jules/token/validate/route.ts
POST — streaming NDJSON validation. Jules uses simple API key (no teams), so no scope-selection step.

UI Components (adapted from cloudcode)
All components live in src/components/integrations/.

[NEW] connection-card.tsx
Card showing connected/disconnected state with Connect/Reconnect/Disconnect actions. Triggers 
TokenWizardModal
.

[NEW] token-wizard/wizard-progress.tsx
Step progress bar (Intro → Create → Connect → Done).

[NEW] token-wizard/step-introduction.tsx
Intro screen explaining what the integration does and what you need.

[NEW] token-wizard/step-create-token.tsx
Guide to creating the token in the external service, with direct link button.

Jules instructions: go to Settings → API Keys → New API Key (note: max 3 keys allowed)
Vercel instructions: Full Account scope
[NEW] token-wizard/step-paste-token.tsx
Token input with verify button.

Vercel: after verify, shows team/personal scope selector
Jules: after verify, no scope step (Jules is key-only)
[NEW] token-wizard/step-verify.tsx
Success/Done screen.

[NEW] token-wizard/token-wizard-modal.tsx
Orchestrates all steps. Accepts provider: IntegrationProvider.

Page
[NEW] src/app/app/integrations/page.tsx
Simple page wrapper with metadata and <IntegrationsList />.

[NEW] src/app/app/integrations/integrations-list.tsx
Fetches both provider statuses in parallel on mount. Renders <ConnectionCard> for each provider. No subscription management needed (GitGlide uses Jules sessions, not Vercel subscriptions).

Verification Plan
Automated
bash
# Per file lint + type check (after all files created):
bun --bun eslint src/lib/integrations/types.ts src/lib/integrations/metadata.ts
bun --bun eslint src/app/api/integrations/vercel/connect/route.ts
bun --bun eslint src/app/api/integrations/vercel/status/route.ts
bun --bun eslint src/app/api/integrations/vercel/disconnect/route.ts
bun --bun eslint src/app/api/integrations/vercel/token/validate/route.ts
bun --bun eslint src/app/api/integrations/jules/connect/route.ts
bun --bun eslint src/app/api/integrations/jules/status/route.ts
bun --bun eslint src/app/api/integrations/jules/disconnect/route.ts
bun --bun eslint src/app/api/integrations/jules/token/validate/route.ts
bun --bun eslint src/components/integrations/connection-card.tsx
bun --bun eslint src/components/integrations/token-wizard/token-wizard-modal.tsx
bun --bun eslint src/app/app/integrations/page.tsx
bun --bun eslint src/app/app/integrations/integrations-list.tsx
# TSC checks same files
Post-deploy
Commit to new branch, open PR, wait 120s, run bun logs:deployment
Fix any build errors before review