# ZeroNIGO: Incremental Implementation Prompts

Use these prompts sequentially with an AI builder (Cursor, Lovable, Claude Code, or Replit Agent). Each tier builds directly upon the architecture of the previous one.

---

## Tier 1: MVP 1 — Zero-Config Setup, Local State & Schema-Driven Linting

### Prompt 1.1: Project Scaffold, Domain Types & Mock State

```text
Act as a Principal Frontend Architect. Scaffold a Next.js (App Router), Tailwind CSS, and Lucide React application for "ZeroNIGO" — a pre-flight validation engine for High-Net-Worth (HNW) wealth management onboarding.

No backend or external API keys should be used for this step. Everything must run in-memory with zero-config local state.

1. Create a `types/onboarding.ts` file containing strict TypeScript interfaces for:
   - AccountEntity: 'INDIVIDUAL' | 'REVOCABLE_TRUST' | 'IRREVOCABLE_TRUST' | 'CORPORATE_LLC'
   - FinancialProfile: annualIncome (number), liquidNetWorth (number), riskTolerance ('CONSERVATIVE' | 'MODERATE' | 'GROWTH' | 'AGGRESSIVE')
   - TradingPrivileges: marginRequested (boolean), optionsTier ('NONE' | 'TIER_1_COVERED' | 'TIER_2_LONG' | 'TIER_3_UNCOVERED')
   - SignerRole: 'PRIMARY_TRUSTEE' | 'CO_TRUSTEE' | 'GRANTOR' | 'MANAGING_MEMBER' | 'WEALTH_ADVISOR'
   - Signer: id, fullName, email, role, hasSigned (boolean), orderIndex (number)
   - OnboardingPacket: packetId, entityType, legalTitle, taxId, financialProfile, tradingPrivileges, signers, status ('DRAFT' | 'NIGO_BLOCKED' | 'READY_FOR_EXECUTION')

2. Create a `data/mockPackets.ts` file exporting three test records:
   - Record A (Clean Individual): Ready for execution, margin requested with >$100k liquid net worth, Aggressive risk.
   - Record B (NIGO Trust): Revocable Trust with legalTitle mismatched ("The Miller Family Trust" vs missing agreement suffix), Margin requested with "CONSERVATIVE" risk tolerance (FINRA violation), missing CO_TRUSTEE.
   - Record C (NIGO LLC): Corporate LLC with no signers marked as MANAGING_MEMBER and invalid EIN format.

3. Build a two-column responsive layout in `app/page.tsx`:
   - Left Column: An interactive intake form allowing the user to switch between the mock records or edit fields in real time (entity type, title, tax ID, margin toggle, risk tolerance, and signer array).
   - Right Column: A sticky "Pre-Flight Compliance Console" that displays immediate state changes, a live readiness score (0-100%), and a locked primary action button: "Generate & Send Envelope".

```

### Prompt 1.2: Deterministic Pre-Flight Linter Engine (Client-Side)

```text
Implement the core domain validation logic for ZeroNIGO using client-side TypeScript and Zod.

1. Create `lib/linters/nigoEngine.ts`:
   Implement an automated compliance engine that accepts an `OnboardingPacket` and returns a list of granular validation issues:
   - Severity: 'FATAL_NIGO' (blocks submission) | 'WARNING' (advisory)
   - Rule Category: 'ENTITY_INTEGRITY' | 'FINRA_SUITABILITY' | 'CDD_BENEFICIAL_OWNERSHIP' | 'SIGNER_HIERARCHY'
   - Message: Plain-English explanation referencing the specific compliance rule.
   - RemediationHint: Specific instruction on how to fix the error.

2. Enforce the following wealth management domain rules:
   - Rule 1 (FINRA 2111 Suitability): If `tradingPrivileges.marginRequested === true`:
     * `financialProfile.liquidNetWorth` must be >= 50,000.
     * `financialProfile.riskTolerance` cannot be 'CONSERVATIVE'.
     * If violated, flag FATAL_NIGO: "FINRA Rule 2111: Margin trading cannot be enabled for Conservative risk profiles or accounts with <$50,000 liquid net worth."
   - Rule 2 (Options Disclosures): If `tradingPrivileges.optionsTier` is 'TIER_2_LONG' or higher:
     * `financialProfile.annualIncome` must be >= 75,000.
   - Rule 3 (Trust Entity Naming Standard): If `entityType` contains 'TRUST':
     * `legalTitle` must contain either 'Trust', 'U/A', 'DTD', or 'Agreement'.
     * Must have at least one signer with role 'PRIMARY_TRUSTEE'.
     * If `entityType === 'IRREVOCABLE_TRUST'`, must have at least two signers.
   - Rule 4 (Tax ID Formatting): 
     * `taxId` must match standard EIN `^\d{2}-\d{7}$` or SSN `^\d{3}-\d{2}-\d{4}$`.

3. Wire this engine directly to the `app/page.tsx` state:
   - As the user types or toggles checkboxes, the engine runs synchronously without debouncing or page refreshes.
   - The Pre-Flight Console must group errors by category, render clear red badges for FATAL_NIGO, amber badges for WARNING, and disable the "Generate & Send Envelope" button whenever any FATAL_NIGO exists.
   - Provide a "Run Quick Fix" action next to each rule that automatically sanitizes the mock state (e.g., bumps liquid net worth to $50,000 or adjusts risk tolerance) so the user can watch the NIGO status clear in real time.

```

---

## Tier 2: MVP 2 — Server-Side Pipeline, DocuSign Sandbox & AI NIGO Remediation

### Prompt 2.1: Server Actions, Next.js API Routes & Mock PDF Coordinate Mapping

```text
Upgrade ZeroNIGO from client-only state to a live Next.js App Router server-side execution pipeline.

1. Environment Configuration:
   Set up `.env.local` schema validation in `lib/env.ts` checking for:
   - `DOCUSIGN_ACCOUNT_ID`
   - `DOCUSIGN_INTEGRATION_KEY`
   - `DOCUSIGN_USER_ID`
   - `DOCUSIGN_RSA_PRIVATE_KEY`
   - `GEMINI_API_KEY` or `OPENAI_API_KEY`

2. Server Action (`app/actions/validatePacket.ts`):
   - Move the Zod/NIGO compliance engine execution to the server layer.
   - Create a clean Server Action that receives the packet payload, validates data integrity, and simulates a 400ms custodial clearing check.
   - Add loading skeleton animations (`components/ui/SkeletonCard.tsx`) to the Pre-Flight Console while validation executes.

3. PDF Coordinate & AcroForm Service (`lib/pdf/coordinateMapper.ts`):
   - Using `pdf-lib`, create a helper service that takes the validated `OnboardingPacket` data and projects values onto fixed coordinates of a synthetic multi-page custodial application:
     * Page 1: Legal Title (X: 120, Y: 650), Tax ID (X: 400, Y: 650)
     * Page 2: Margin Checkbox (X: 85, Y: 430 if true), Risk Profile Radio (X: 85, Y: 390)
     * Page 3: Primary Signer Tab Anchor (`/sn1/`), Co-Signer Anchor (`/sn2/`)
   - Return a flattened PDF buffer or Base64 string for immediate preview in an embedded `<iframe>` modal.

```

### Prompt 2.2: DocuSign Sandbox Integration & LLM-Powered Compliance Assistant

```text
Integrate live DocuSign eSignature REST API routing and an LLM-assisted NIGO remediation co-pilot.

1. DocuSign Service (`lib/docusign/envelopeService.ts`):
   - Implement JWT Bearer grant authentication using `docusign-esign` to exchange credentials for a temporary access token.
   - Build `createOnboardingEnvelope(packet: OnboardingPacket)`:
     * Assemble an envelope with composite templates using the PDF generated from Prompt 2.1.
     * Enforce strict sequential signing order via `routingOrder`:
       1. Primary Trustee / Account Owner (`routingOrder: 1`)
       2. Co-Trustee / Managing Member (`routingOrder: 2`)
       3. Wealth Advisor / RIA Principal (`routingOrder: 3`)
     * Place programmatic signature tabs (`SignHereTabs`) anchored to string tags (`/sn1/`, `/sn2/`).
   - Create a Next.js API route `/api/webhooks/docusign` to receive status events (`Sent`, `Delivered`, `Completed`, `Declined`) and update envelope status badges.

2. LLM Compliance Explainer (`app/api/ai/remediate/route.ts`):
   - Create an endpoint that receives the raw NIGO error array and packet metadata.
   - Call Gemini 1.5 Pro / GPT-4o with a strict system prompt:
     "You are a Senior Broker-Dealer Compliance Officer and Wealth Operations Principal. Analyze the following NIGO validation failures. Explain clearly to the wealth advisor: (1) why the custodian will reject this file, citing relevant regulatory rules (FINRA, SEC, FinCEN), and (2) give a polite, client-ready email snippet explaining the required change without overwhelming the client."
   - Display this output inside an expandable "AI Compliance Advisory" drawer in the UI with a 1-click "Copy Client Communication" button.

```

---

## Tier 3: Scaling for Enterprises — Persistence, Role Guards, Analytics & Audit

### Prompt 3.1: Supabase Database, Row-Level Security & Role-Based Middleware

```text
Scale ZeroNIGO into a multi-tenant enterprise system with persistent database storage and secure access controls using Supabase and Next.js Middleware.

1. Database Schema (`supabase/migrations/001_init_wealth_onboarding.sql`):
   Create tables with PostgreSQL constraints and Row-Level Security (RLS):
   - `advisory_firms`: id (uuid, PK), name, crd_number (SEC/FINRA identifier), created_at.
   - `user_profiles`: id (uuid, PK, references auth.users), firm_id (FK), role ('ADVISOR' | 'COMPLIANCE_OFFICER' | 'OPERATIONS_STAFF'), full_name, email.
   - `onboarding_packets`: id (uuid, PK), firm_id (FK), advisor_id (FK), packet_payload (jsonb), nigo_status ('DRAFT' | 'NIGO_BLOCKED' | 'SUBMITTED' | 'CLEARED'), docusign_envelope_id, created_at, updated_at.
   - `audit_logs`: id (uuid, PK), packet_id (FK), actor_id (FK), action_type ('VALIDATION_RUN' | 'ENVELOPE_CREATED' | 'OVERRIDE_ATTEMPTED' | 'CLEARED'), metadata (jsonb), timestamp (timestamptz).

2. Row-Level Security (RLS) Policies:
   - Advisors can only read and write onboarding packets belonging to their own `firm_id`.
   - Only users with role `COMPLIANCE_OFFICER` can execute a compliance override flag.
   - `audit_logs` must be strictly append-only (WORM compliant for SEC Rule 17a-4). No updates or deletions allowed.

3. Next.js Auth Middleware (`middleware.ts`):
   - Protect all `/dashboard/*` and `/api/*` routes using `@supabase/ssr`.
   - Verify active session token; if expired or unauthenticated, redirect to `/login`.
   - Inspect user metadata role: restrict `/dashboard/compliance-audit` strictly to `COMPLIANCE_OFFICER` and `OPERATIONS_STAFF` roles.

```

### Prompt 3.2: Operational Analytics (Recharts), Audit Vault & Enterprise Theme

```text
Finalize ZeroNIGO for institutional presentation with real-time operational analytics, a regulatory audit timeline, and enterprise design Polish.

1. Analytics & NIGO Metrics Dashboard (`components/dashboard/AnalyticsOverview.tsx`):
   Using `recharts`, build high-density reporting widgets:
   - Bar Chart: "Top NIGO Causes" (categorizing Entity Titling, FINRA Margin Suitability, Missing Signers, Invalid EIN).
   - Area Chart: "Onboarding Cycle Time (Days)" comparing pre-ZeroNIGO (average 16 days) vs post-ZeroNIGO (average 2 days).
   - KPI Metric Cards:
     * First-Time In Good Order (IGO) Rate (target >95%).
     * Total Operational Hours Saved (calculated at 2.5 hours per resolved NIGO).
     * Total AUM Pending in Pipeline ($ volume of accounts in 'READY_FOR_EXECUTION').

2. SEC Rule 17a-4 Immutable Audit Timeline (`components/packet/AuditTrail.tsx`):
   - Build a visual, chronological audit ledger for each packet.
   - Display micro-events with exact UTC timestamps, actor IP addresses, and hash fingerprints:
     * e.g., "Oct 01, 2026 14:22:01 UTC - Schema Validation Failed: FINRA Rule 2111 (Actor: System Engine)"
     * e.g., "Oct 01, 2026 14:25:30 UTC - Data Rectified: Liquid Net Worth adjusted to $75,000 (Actor: Advisor ID #802)"
     * e.g., "Oct 01, 2026 14:26:15 UTC - Envelope #48192 Dispatched to Primary Trustee (Actor: DocuSign API)"

3. Enterprise UX & Dark Mode Design System:
   - Implement `next-themes` with a clean, institutional palette:
     * Light: Clean slate, crisp borders, high-contrast typography suitable for financial operations.
     * Dark: Deep navy/charcoal (`#0B0F17`) inspired by institutional terminals (Bloomberg, Addepar).
   - Include a header bar with an instant theme toggle, active firm switcher (multi-office support), and an interactive "Simulate Custodian Webhook" debugging tool to test clearing notifications live.

```