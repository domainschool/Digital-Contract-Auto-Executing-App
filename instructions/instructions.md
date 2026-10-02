```markdown
# Agent Instructions: ZeroNIGO — Intelligent Wealth Onboarding Pre-Flight Engine

Follow these instructions strictly when developing the application. You must operate as an expert Full-Stack Solution Architect and FinTech Systems Specialist.

---

## Step 1: Define the Project First

Before writing or modifying any implementation code, you must:

1. Create a file called `project_specs.md` in the root directory.
2. Clearly define the following items based on the ZeroNIGO product concept:
   - **Inputs:** Client personal data, legal entity types (Trusts, LLCs, Individual), financial profiles (net worth, income, risk tolerance), trading privileges (margin, options), tax identifiers (EIN/SSN), and multi-signer rosters.
   - **Workflows:** 
     1. Interactive client/advisor intake wizard.
     2. Real-time deterministic pre-flight compliance linting engine (FINRA 2111/2090, CDD beneficial ownership, cross-form titling reconciliation).
     3. AcroForm programmatic coordinate mapping.
     4. DocuSign envelope generation with sequential role routing (`routingOrder`).
     5. Post-execution status tracking via webhooks.
   - **Tools & Libraries:** Vite + React / Next.js, TypeScript, Tailwind CSS, Lucide React, Zod, `pdf-lib`, DocuSign Developer REST API (sandbox), Gemini/OpenAI API (for remediation advice), and `pnpm`.
   - **Outputs:** Evaluated compliance status (Readiness Score 0-100%, FATAL_NIGO vs WARNING badges), downloadable pre-filled PDF preview with mapped anchors, generated DocuSign envelope status, and client-facing communication drafts.
   - **Data Storage:** Tier 1 in-memory local state; Tier 2 local storage / server action mocks; Tier 3 Supabase PostgreSQL with RLS.
   - **Deployment Target:** GitHub Pages via `gh-pages` branch build.
   - **Definition of "Done":** Application loads cleanly without errors, validates all FINRA and entity titling rules deterministically, blocks signing execution on any fatal NIGO error, and cleanly exports/signs compliant packets.
3. Present the contents of `project_specs.md` directly to the user.
4. **Wait for explicit user approval.**

> **CRITICAL RULE:** No application code, components, or logic files should be created or updated until `project_specs.md` is approved by the user.

---

## Step 2: Universal Coding Standards

* **Strict TypeScript:** All code must be written in TypeScript with `strict: true`. Avoid `any`. Define granular interfaces and types for all entities, form schemas, validation errors, and API payloads.
* **Modularity:** Keep UI components small, pure, and decoupled. Extract domain business logic, linters, and network calls into reusable custom hooks (`useNigoLinter`, `useEnvelopeStatus`) or dedicated utility modules.
* **Environment Security:** Never hardcode credentials, keys, or private certificates. Read all integration points from environment variables using a typed validation schema (`lib/env.ts`). Always provide a complete `.env.example`.
* **Incremental Development:** Follow the 3-Tier maturity plan:
  - **Tier 1:** Zero-config in-memory state, deterministic schema checks, responsive layout, instant quick fixes.
  - **Tier 2:** Server-side actions, `pdf-lib` coordinate mapping, DocuSign sandbox integration, and AI-powered remediation advice.
  - **Tier 3:** Database persistence (Supabase), RLS, role-based guards, Recharts analytics, and dark mode.
* **Graceful Error Handling:** Implement comprehensive error boundaries and loading skeleton states (`SkeletonCard`). If an external API or file parser fails, render a clear fallback with actionable remediation steps rather than breaking the application tree.
* **Package Manager:** **ALWAYS** use `pnpm` (never `npm` or `yarn`) for package additions (`pnpm add`), project scaffolds, and scripts (`pnpm run dev`, `pnpm run build`).

---

## Step 3: Git, Testing & GitHub Pages Deployment Standards

### Local Testing Before Git Push
> **MANDATORY CONFIRMATION:** Before moving or pushing any code change to GitHub, you **MUST** ask for user confirmation first. The user must test and verify changes locally. Do not run git push commands or move code to production without explicit prior approval.

### Deployment Configuration for Vite & GitHub Pages
When building and deploying to GitHub Pages, you must enforce the following setup:

1. **Base Path (`vite.config.ts`):**
   The `base` property must match the repository name exactly to ensure all static assets (CSS, JS, media) resolve correctly:
   ```ts
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';

   export default defineConfig({
     plugins: [react()],
     base: '/ZeroNIGO/', // Replace with actual repository name with leading and trailing slash
   });

```

2. **Deployment Dependencies & Scripts:**
Install `gh-pages` using `pnpm`:
```bash
pnpm add -D gh-pages

```


Ensure `package.json` contains:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "predeploy": "pnpm run build",
    "deploy": "gh-pages -d dist"
  }
}

```


3. **Deployment Sequence (Only upon explicit user confirmation):**
* Step 1: Commit and push source files to the `main` branch.
* Step 2: Run `pnpm run deploy` to compile into `dist` and deploy to the `gh-pages` branch.
* Step 3: Verify GitHub Repository Settings > Pages points to the `gh-pages` branch.


4. **Troubleshooting & Quality Checks:**
* **Clean Build:** Run `pnpm run build` locally to ensure the TypeScript compiler (`tsc`) passes without unused variables or type errors.
* **Asset Verification:** If assets 404 on the hosted site, verify the `base` path in `vite.config.ts`.



---

## Step 4: Living Documentation Maintenance

1. **`explainer.md`:** Maintain a living documentation file explaining the wealth onboarding domain rules, NIGO cost calculations, FINRA compliance guidelines, and system architecture for developers and students.
2. **`Prompts.md`:** Update this file whenever new features, architectural refactors, or incremental prompts are executed during the product's development lifecycle.
