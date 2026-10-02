# Product Specification: ZeroNIGO — Intelligent Wealth Onboarding Pre-Flight Engine

## 1. The Business Problem

In Registered Investment Advisor (RIA) firms, family offices, and broker-dealers, onboarding a High-Net-Worth (HNW) client involves orchestrating complex multi-entity legal packets (discretionary advisory agreements, custodial account applications, trust certifications, corporate resolutions, W-9/W-8BENs, and ACATS transfer forms).

The industry experiences a systemic operational failure known as **NIGO ("Not In Good Order")**, running at an industry-average rate of **30% to 45%** on initial submissions. Common triggers include:

* Minor discrepancies in entity registration titles (e.g., *"The Smith Family 2018 Revocable Living Trust"* vs. *"Smith Family Trust"* across separate schedules).
* Conditional field omission (e.g., checking "Enable Margin/Options" on page 4 without completing the regulatory risk-suitability disclosure on page 19).
* Out-of-order execution among multi-party signers (e.g., primary trustee, corporate co-trustee, financial advisor, and custodian principal).

A single NIGO packet stalls onboarding by **7 to 21 business days**, consumes between **$150 and $300+** in operational remediation labor per incident, delays fee billing, and creates friction during the client's initial experience. Because standard e-signature tools treat envelopes as passive visual overlays with basic client-side input masking rather than semantically validated state machines, invalid packets routinely pass through e-signature only to be rejected downstream by custodial clearing operations.

---

## 2. The Industry Logic

Building this product teaches a developer how back-office clearing, regulatory compliance, and document orchestration interact in wealth management:

* **FINRA Rules 2090 (Know Your Customer) & 2111 (Suitability) / Reg BI:** Understanding how an investor's stated liquidity needs, investment horizon, and risk tolerance strictly govern the conditional unlocking of margin or options permissions.
* **FinCEN Customer Due Diligence (CDD) Rules:** Validating beneficial ownership structures (identifying and collecting disclosures on any natural person holding 25% or more equity interest in a legal entity account).
* **ACATS (Automated Customer Account Transfer Service) Precision:** Learning why title, account type, and tax identifier must match clearing specifications down to the exact character to avoid clearing house rejects.
* **Architectural Pattern — Client-Side Pre-Flight Linting with State-Machine Pipeline:**
1. **Schema & Rule Graph Execution:** A deterministic validation layer (using Zod or JSON Schema) acts as an automated compliance officer, running conditional dependency trees against submitted data.
2. **Deterministic PDF AcroForm Coordinate Projection:** Instead of human-placed drag-and-drop signature boxes, the system programmatically generates filled, standard AcroForms or coordinates mapped to exact PDF tabs.
3. **Sequential State Orchestration via Webhooks:** Enforcing role-based signing workflows via webhook callbacks before clearing hand-off.



---

## 3. The Data Source

To build a working prototype without enterprise institutional agreements, a developer can use:

* **Mock Payload / Synthetic JSON Schemas:** A structured dataset modeling an HNW multi-entity account opening:
* Primary client personal data, entity data (Revocable Living Trust), and beneficial owners.
* Risk tolerance score, margin selection boolean, asset allocation mandate, and linked bank account metadata.


* **Synthetic PDF Application Forms:** Publicly available standard institutional account applications (e.g., standard IRA, Trust, or Discretionary Brokerage account applications available via public SEC disclosures or generic custodial templates).
* **APIs:**
* **DocuSign Developer Sandbox API (eSignature REST API v2.1):** Free developer account providing mock envelope creation, composite templates, dynamic tab placement, and recipient webhook triggers (Connect).
* **Open-Source PDF Engine (`pdf-lib` or `@pdf-lib/upng`):** For client-side or server-side AcroForm pre-filling, validation extraction, and programmatic coordinate binding.



---

# Substack Primer: Why B2B SaaS Fails Without Domain Knowledge — The $300 E-Signature Mistake

Every software engineer learns how to integrate an e-signature API within their first few years on the job. You install an SDK, create an envelope, place a few `SignHere` tabs, register a webhook, and trigger an email.

On paper, the problem of getting documents signed is solved.

Yet, inside wealth management firms, private banks, and RIAs managing billions of dollars in assets, managing documents remains an operational challenge. Between **30% and 45%** of all completed, digitally signed onboarding packets sent to clearing custodians are rejected within 48 hours of submission.

In the industry, this is known as **NIGO: Not In Good Order**.

When an onboarding packet is tagged NIGO, it cannot clear. The client cannot deposit capital, the advisor cannot deploy strategies, fee billing cannot begin, and a junior operations specialist must spend days tracking down the client to re-execute the document.

The problem is not that the client failed to sign. The problem is that software engineers built a **visual signature collection tool** when the enterprise needed a **semantic validation compiler**.

---

### The Anatomy of an Enterprise Bottleneck

To understand why this happens, look at how account opening works in high-net-worth wealth management.

When an individual opens a standard retail trading account, they fill out a uniform web form. The platform controls the database, the UI, and the ledger.

When an HNW client onboard with a boutique advisory firm, they rarely open an account under a single name. Instead, their wealth is held across multiple structures: a Revocable Living Trust for personal assets, an LLC for real estate holdings, a SEP-IRA for business earnings, and a corporate foundation for philanthropy.

To open these accounts, the wealth firm must generate a packet spanning 50 to 100 pages across distinct counter-parties:

1. **The Advisory Agreement:** The contract between the client and the advisory firm.
2. **The Custodial Applications:** The contract between the client and the institutional custodian (e.g., Schwab, Fidelity Institutional, BNY Mellon Pershing).
3. **The Regulatory Disclosures:** Form ADV Part 2, privacy policies, and Form CRS receipts.
4. **Tax & Legal Entity Disclosures:** W-9s, Trust Certificates, Operating Agreements, and FinCEN Beneficial Ownership filings.

Standard e-signature workflows treat these 80 pages as a static PDF image. They drop floating text boxes on top of lines, mark them "required," and send a link.

Here is where the software breaks down:

#### 1. Entity Titling Mismatches

If Page 3 of the Custodial Agreement lists the account owner as *"Robert T. Miller & Sarah L. Miller, TTEEs, Miller Family Living Trust U/A dtd 04/12/2012"*, but the Advisory Agreement on Page 24 lists the client as *"Robert Miller"*, the custodian's clearing operations desk will automatically stamp the entire packet **NIGO**.

The signatures are legally valid, but the legal entities do not align.

#### 2. Conditional Regulatory Dependencies

Under FINRA Rule 2111 (Suitability) and Rule 2090 (Know Your Customer), if an investor checks a box requesting **Margin Privileges** or **Option Trading Tier 2**, specific supporting financial disclosures become legally mandatory (e.g., Liquid Net Worth, Realized Annual Income, Years of Active Trading Experience).

If a basic e-signature envelope allows the signer to check "Enable Margin" without making the corresponding income schedule mandatory, the document gets signed, passes DocuSign validation, and is subsequently rejected by the back-office compliance officer.

#### 3. Signer State Race Conditions

Trusts and corporate entities frequently require multiple signers: the Primary Trustee, the Co-Trustee, the Advisor, and the Compliance Principal.

If an e-signature envelope routes documents concurrently rather than sequentially, Signer B may sign sections that alter the options or choices intended by Signer A. Without a deterministic state machine managing field permissions based on role hierarchy, the document corrupts itself in transit.

---

### The Product Concept: ZeroNIGO

We are building **ZeroNIGO**, an intelligent pre-flight orchestration engine for high-net-worth account onboarding.

Instead of sending PDFs to clients, ZeroNIGO splits document execution into two distinct stages:

```
[Advisor / CRM Intake] 
          │
          ▼
┌────────────────────────────────────────────────────────┐
│               ZeroNIGO Pre-Flight Engine               │
│                                                        │
│  - JSON Schema Validation (Zod)                        │
│  - Dynamic Rule Graph: Cross-Form Titling Check       │
│  - Conditional Suitability Dependencies (FINRA / SEC) │
│  - Multi-Party Sequential State Machine                │
└────────────────────────────────────────────────────────┘
          │ (Blocks submission if NIGO Risk > 0)
          ▼
┌────────────────────────────────────────────────────────┐
│             AcroForm Coordinate Projector              │
│                                                        │
│  - Injects Validated Payload into Official Custody PDF │
│  - Programmatically Pins Signature Anchor Tags         │
└────────────────────────────────────────────────────────┘
          │
          ▼
[DocuSign Developer API / E-Signature Execution]
          │
          ▼
[100% In Good Order Custodial Clearance]

```

#### Step 1: Headless Data Intake & Dynamic Rule Graph

The client interacts with a mobile-optimized, guided interface—not a raw PDF.

Every input field belongs to a relational schema:

* `account_registration_title` is defined once and distributed across all dependent forms.
* When a user toggles `margin_enabled: true`, the rule engine recalculates the form tree, making `liquid_net_worth` and `risk_tolerance_tier` strictly mandatory.

#### Step 2: Pre-Flight Linting

Before any signature packet is generated, the ZeroNIGO compiler runs a suite of "linters" against the payload:

* **The Titling Linter:** Confirms exact string matching between Trust Name, Tax ID (EIN), and Trustee Signers across all forms.
* **The Suitability Linter:** Evaluates income, net worth, and risk thresholds against custodial margin rules.
* **The Identification Linter:** Confirms CDD requirements (e.g., verifying that all 25%+ beneficial owners have uploaded driver's license numbers and SSNs).

If any rule fails, the application is blocked from submission. The interface shows the user and the advisor precisely what is missing and why, with references to the underlying requirement.

#### Step 3: Programmatic Envelope Compilation

Once the payload passes all rules, the ZeroNIGO backend uses `pdf-lib` to map the validated data directly into the exact coordinate fields of the custodial PDF templates, binds the DocuSign recipient tags to predefined anchor points, and routes the document sequentially: **Trustor $\rightarrow$ Trustee $\rightarrow$ Wealth Advisor**.

---

### The Architecture: How to "Vibe Code" This Prototype

Using AI-assisted development (Cursor, Claude, or Replit), a solo developer or student can build an end-to-end prototype of ZeroNIGO by breaking the project into focused layers:

#### 1. The Validation Engine (`schemas/onboardingSchema.ts`)

Write an expressive Zod schema that models an HNW onboarding record:

```typescript
import { z } from 'zod';

export const AccountOnboardingSchema = z.object({
  entityType: z.enum(['INDIVIDUAL', 'REVOCABLE_TRUST', 'IRREVOCABLE_TRUST', 'LLC']),
  legalTitle: z.string().min(5, "Legal title must match entity formation documents exactly."),
  taxId: z.string().regex(/^\d{2}-\d{7}$/, "EIN must follow standard format (XX-XXXXXXX)"),
  tradingPrivileges: z.object({
    marginRequested: z.boolean(),
    optionsLevel: z.enum(['NONE', 'TIER_1', 'TIER_2', 'TIER_3']),
  }),
  financialProfile: z.object({
    annualIncome: z.number(),
    liquidNetWorth: z.number(),
    riskTolerance: z.enum(['CONSERVATIVE', 'MODERATE', 'GROWTH', 'AGGRESSIVE']),
  }),
  signers: z.array(z.object({
    fullName: z.string(),
    role: z.enum(['PRIMARY_TRUSTEE', 'CO_TRUSTEE', 'ADVISOR']),
    email: z.string().email(),
  })).min(1),
}).superRefine((data, ctx) => {
  // FINRA Suitability Dependency Rule
  if (data.tradingPrivileges.marginRequested) {
    if (data.financialProfile.liquidNetWorth < 50000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['financialProfile', 'liquidNetWorth'],
        message: 'Custodial rules require at least $50,000 in liquid net worth for margin enablement.',
      });
    }
    if (data.financialProfile.riskTolerance === 'CONSERVATIVE') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['tradingPrivileges', 'marginRequested'],
        message: 'Conservative risk tolerance profiles cannot enable margin privileges.',
      });
    }
  }

  // Multi-party Signer Check
  if (data.entityType.includes('TRUST')) {
    const hasTrustee = data.signers.some(s => s.role === 'PRIMARY_TRUSTEE');
    if (!hasTrustee) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['signers'],
        message: 'Trust accounts must have at least one signer designated as PRIMARY_TRUSTEE.',
      });
    }
  }
});

```

#### 2. The DocuSign API Integration Layer (`lib/docusign.ts`)

Set up a clean service function that communicates with the DocuSign eSignature REST API using their developer sandbox:

* Create an envelope using `envelopes.create`.
* Define an `inlineTemplate` that holds the document.
* Dynamically construct `compositeTemplates` assigning specific `textTabs` for entity titles and `signHereTabs` mapped to specific signer email anchors.
* Configure sequential `routingOrder` integers so co-trustees cannot sign until primary trustees validate their entries.

#### 3. The UI Pre-Flight Dashboard

Build a clean, reactive dashboard:

* **Left Pane:** Multi-step intake wizard covering Identity, Entity Information, Investment Objectives, and Signer Assignment.
* **Right Pane:** The **ZeroNIGO Pre-Flight Monitor**. A live audit checklist showing:
* Title parity across schedules (`PASS`)
* FINRA Suitability validation (`FAIL - Margin checked with Conservative risk`)
* Signer hierarchy verified (`PENDING`)


* The final **"Generate & Route Envelope"** button remains locked until every check passes.

---

### The Impact of Domain Knowledge: Why Code Is Cheap, But Context Is Rare

It is common to believe that software engineering is primarily about writing code: mastering frameworks, optimizing queries, and configuring deployments.

In modern engineering, writing boilerplate code is largely commoditized. LLMs can generate a React form, a Next.js API route, or a standard DocuSign integration in minutes.

What AI cannot provide out of the box is the **domain context to ask the right questions**:

* It does not know that a clearing firm rejects an account if an address contains a P.O. Box without a residential backup.
* It does not know that FINRA Rule 2111 creates a direct data dependency between risk tolerance and trading permissions.
* It does not know that in an irrevocable trust, the Grantor and the Trustee often have separate signing authorities.

When software engineers do not understand the industry they are writing code for, they build shallow features that fail on real-world edge cases. They build basic e-signature flows that create thousands of hours of manual back-office clean-up.

When you invest time in learning **domain knowledge**—whether it is wealth clearing, corporate treasury, supply chain customs, or healthcare compliance—your value shifts. You stop being a ticket-taker who translates Jira specifications into code. You become a **solution architect** who designs systems that solve root business problems.

Technology without domain understanding produces brittle software. Technology built on deep industry logic creates enduring products.