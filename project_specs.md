# Project Specification & Implementation Plan: ZeroNIGO
## Intelligent Wealth Onboarding Pre-Flight Engine & Semantic Validation Compiler

---

### 1. Executive Summary & Problem Domain
In Wealth Management (RIAs, Family Offices, Broker-Dealers), onboarding High-Net-Worth (HNW) clients requires compiling multi-entity legal packets across custodians (Schwab, Fidelity Institutional, Pershing). 

**The Industry Failure (NIGO - Not In Good Order):**
- **30% to 45%** of all completed, digitally signed onboarding packets are rejected by clearing operations within 48 hours.
- Causes: Minor entity title mismatches between advisory and custodial schedules, unchecked suitability constraints (e.g., Margin enabled without mandatory liquidity/risk disclosures under FINRA Rule 2111/2090), and signer race conditions in multi-trustee packets.
- Impact: Stalls onboarding by **7 to 21 business days**, costs **$150 to $300+** in operational remediation labor per incident, and delays fee billing on millions in AUM.

**The Solution:**
**ZeroNIGO** transforms passive e-signatures into an active, semantic validation compiler and pre-flight state machine that eliminates NIGO rejections prior to DocuSign envelope generation and custodial dispatch.

---

### 2. Design System: Neo-Brutalist FinTech Operational Terminal
Per explicit specifications, the UI follows a bold **Neo-Brutalist** design system designed to convey raw operational authority and high-density precision:

| Design Token | Specification | Implementation Detail |
| :--- | :--- | :--- |
| **Canvas Background** | Stark off-white & pale yellow | `#FFFDF0` canvas with `#FEF08A` & `#F4F4F5` accent blocks |
| **Borders** | Thick solid black | `border-2 border-black` / `border-4 border-black` (`#000000`) |
| **Shadows** | Hard, non-blurred offset | `shadow-[4px_4px_0px_0px_#000]` & `shadow-[6px_6px_0px_0px_#000]` (hover: `-translate-x-0.5 -translate-y-0.5 shadow-[6px_6px_0px_0px_#000]`, active: `translate-x-1 translate-y-1 shadow-none`) |
| **Border Radius** | Completely sharp | `rounded-none` (`border-radius: 0px` globally) |
| **High-Contrast Accents**| Saturated vibrant pop | **Hot Pink** (`#FF2A85` / `#EC4899`), **Lime Green** (`#A3E635` / `#84CC16`), **Bright Violet** (`#8B5CF6`), **Electric Cyan** (`#00F0FF`), **Warning Amber** (`#FFE600`) |
| **Typography** | Dual Hierarchy | **Headings:** Bold geometric sans-serif (`Space Grotesk` / `Syne` 800/900 weight, uppercase badges)<br/>**Body & Data/Logs:** Monospace (`JetBrains Mono` / `Space Mono` for compliance rules, tax IDs, coordinate anchors, audit traces) |

---

### 3. System Architecture & Workflows

```
┌────────────────────────────────────────────────────────────────────────┐
│             ADVISOR & CLIENT DATA INTAKE (Neo-Brutalist UI)           │
│  - Entity Switcher (Individual, Revocable Trust, Irrevocable, LLC)     │
│  - Financial Profiles (Liquid Net Worth, Income, Horizon, Risk Tier)   │
│  - Trading Privileges (Margin Toggle, Options Tier 1-3)               │
│  - Multi-Party Signer Hierarchy (Trustee, Co-Trustee, Advisor)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Real-time Stream
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             ZERONIGO PRE-FLIGHT COMPLIANCE ENGINE (LINTER)             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 1. FINRA Rule 2111/2090 (Suitability & Margin Liquidity >= $50k) │  │
│  │ 2. CDD FinCEN Beneficial Ownership (25%+ Threshold Audit)        │  │
│  │ 3. Cross-Schedule Entity Titling Exact Parity Check               │  │
│  │ 4. Multi-Signer Hierarchy & Sequential Routing Dependency Engine │  │
│  │ 5. Tax ID Syntax & Legal Formation Consistency (EIN/SSN)        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│    Outputs: Readiness Score (0-100%), FATAL_NIGO Blocks, Quick Fixes   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Passes Pre-Flight (100% IGO)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             ACROFORM PROGRAMMATIC COORDINATE PROJECTOR                 │
│  - Uses `pdf-lib` to map validated fields directly onto PDF canvas     │
│  - Generates exact anchor tags (/sn1/, /sn2/, /sn3/)                   │
│  - Live Interactive In-Browser PDF Preview with Toggleable Tab Anchors │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│         DOCUSIGN REST API & SEQUENTIAL EXECUTION ORCHESTRATOR          │
│  - Sequential routingOrder: Primary Trustee -> Co-Trustee -> Advisor   │
│  - Webhook Listener / Simulator for Status (Sent/Delivered/Completed)  │
│  - LLM AI Remediation Co-Pilot (Citing FINRA/SEC & Client Drafts)     │
│  - SEC Rule 17a-4 Append-Only Immutable Audit Trail                    │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 4. Technical Stack & Libraries
- **Framework:** Vite + React 18 + TypeScript (`strict: true`) for instant reactivity, zero lag, and clean GitHub Pages static bundling.
- **Styling:** Tailwind CSS with custom Neo-Brutalist design tokens (hard shadows, brutalist color scheme, custom typography).
- **Icons:** `lucide-react`.
- **Validation Engine:** `zod` with deep custom refinement AST & domain-specific linter classes.
- **PDF Engine:** `pdf-lib` + `@pdf-lib/fontkit` for client/server side AcroForm generation, coordinate projection, and live visual mapping.
- **Charts & Reporting:** `recharts` for high-density NIGO cost calculations, cycle time savings, and compliance audit analytics.
- **Package Manager:** `pnpm` (strictly enforced).
- **Deployment:** GitHub Pages automated build via `gh-pages` / standard static deploy.

---

### 5. Detailed Implementation Plan & Phased Milestones

#### **Phase 1: Foundation, Domain Models & Neo-Brutalist Layout (MVP 1)**
- [x] Create project specification `project_specs.md`.
- [ ] Scaffold Vite + React + TypeScript + Tailwind CSS project with `pnpm`.
- [ ] Configure Neo-Brutalist design tokens in `tailwind.config.js` and `index.css` (Google Fonts: Space Grotesk + JetBrains Mono, brutalist shadows, sharp corners, bold borders).
- [ ] Build strict TypeScript domain models in `src/types/onboarding.ts`:
  - `AccountEntity`, `FinancialProfile`, `TradingPrivileges`, `Signer`, `OnboardingPacket`, `NigoIssue`, `AuditRecord`.
- [ ] Create synthetic test packets in `src/data/mockPackets.ts`:
  - **Packet A (Clean Individual - IGO 100%):** Ready for execution, margin with $250k liquid net worth, Aggressive risk.
  - **Packet B (NIGO Revocable Trust):** Title mismatch ("Miller Trust" vs "Miller Family Living Trust U/A dtd 04/12/2012"), Margin requested with Conservative risk (FINRA violation), missing Co-Trustee signer.
  - **Packet C (NIGO Corporate LLC):** No Managing Member designated, invalid EIN format, Options Tier 3 with insufficient income.
  - **Packet D (Irrevocable Dynasty Trust with FinCEN CDD failure):** Beneficial owner without SSN/passport disclosure.
- [ ] Build responsive dual-pane Neo-Brutalist layout:
  - **Left Pane:** Interactive Multi-Section Intake Form (Entity Details, Financial & Suitability, Trading Privileges, Signer Matrix).
  - **Right Pane:** Sticky "Pre-Flight Compliance Console" with real-time Readiness Score Gauge (0-100%), FATAL_NIGO / WARNING badges, categorized breakdown, and locked "Generate & Execute Envelope" button.

#### **Phase 2: Deterministic Pre-Flight Linter Engine & Interactive Quick-Fixes**
- [ ] Build `src/lib/linters/nigoEngine.ts` with granular domain linters:
  - **Titling Parity Linter:** Cross-schedule string reconciliation (Trust name vs schedules, U/A DTD suffixes).
  - **FINRA 2111 / 2090 Suitability Linter:** Margin >= $50,000 liquid net worth + Non-Conservative risk; Options Tier 2/3 income thresholds.
  - **CDD Beneficial Ownership Linter:** FinCEN 25%+ equity disclosure requirements.
  - **Signer Hierarchy Linter:** Trust require Primary Trustee; Irrevocable Trusts require 2+ signers; LLC requires Managing Member.
  - **Tax ID / EIN Linter:** Strict regex and format verification.
- [ ] Build **1-Click "Quick-Fix" Sanitizers** allowing users to click a button next to any NIGO issue to instantly rectify the data and watch the readiness score leap to 100%.

#### **Phase 3: AcroForm Coordinate Projector & Interactive PDF Viewer**
- [ ] Build `src/lib/pdf/coordinateMapper.ts` using `pdf-lib`:
  - Dynamically synthesizes an institutional custodial application packet (Advisory Agreement, Custodial Application, Trust Certificate, Form CRS).
  - Projects exact data coordinates and visual anchor tags (`/sn1/`, `/sn2/`, `/sn3/`) onto the document.
  - Exports downloadable PDF and interactive Base64 / Blob preview with zoom and coordinate debug overlay.
- [ ] Build interactive PDF Modal with Neo-Brutalist preview frame.

#### **Phase 4: DocuSign Multi-Signer Sequential Orchestrator & AI Remediation Co-Pilot**
- [ ] Build `src/lib/docusign/orchestrator.ts`:
  - Sequential `routingOrder` simulation with state machine (Draft -> Routing to Signer 1 -> Signed by Trustee -> Routing to Co-Trustee -> Signed by Advisor -> Cleared by Custodian).
  - Interactive Webhook Dispatcher to trigger live status transitions.
- [ ] Build **AI Compliance Officer & Remediation Assistant**:
  - Explains the regulatory root cause (FINRA/SEC/FinCEN citations).
  - Generates client-ready, polite email drafts explaining required modifications with 1-click copy.

#### **Phase 5: SEC Rule 17a-4 Audit Vault, Recharts Operational Analytics & Polish**
- [ ] Build Immutable Audit Timeline Ledger (`src/components/AuditTrail.tsx`) with UTC timestamps, actor badges, and SHA-256 state fingerprints.
- [ ] Build Operational Analytics Dashboard (`src/components/AnalyticsOverview.tsx`) with `recharts`:
  - Top NIGO Failure Causes distribution.
  - Cycle Time Reduction comparison (16 days down to 2 days).
  - Dollar ROI & Labor Hours Saved calculator ($300/incident labor model).
- [ ] Add comprehensive test suites and finalize GitHub Pages configuration (`vite.config.ts` base path).

---

### 6. Definition of "Done"
1. Zero TypeScript errors with strict typechecking (`tsc --noEmit`).
2. Real-time deterministic validation blocking execution whenever any FATAL_NIGO issue exists.
3. 100% compliance with the requested Neo-Brutalist aesthetic (stark off-white/pale yellow canvas, thick black borders, hard non-blurred offset shadows, sharp corners, vibrant high-contrast accents, bold geometric sans + monospace typography).
4. Interactive mock packets with instant 1-click quick-fixes demonstrating live NIGO remediation.
5. Fully functional PDF coordinate generation and sequential DocuSign state machine simulation.
