import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  BookOpen, 
  Compass, 
  Database, 
  Users, 
  DollarSign, 
  GraduationCap, 
  Code2, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  ShieldCheck, 
  Layers, 
  Terminal, 
  Zap,
  Building2,
  FileText
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabKey = 
  | 'PROBLEM'
  | 'DOMAIN'
  | 'ARCHITECTURE'
  | 'STAKEHOLDERS'
  | 'VALUATION'
  | 'RESUME'
  | 'PROMPTS'
  | 'ENHANCEMENTS';

interface PromptItem {
  id: string;
  tier: string;
  title: string;
  description: string;
  promptText: string;
}

const VIBE_PROMPTS: PromptItem[] = [
  {
    id: 'P1.1',
    tier: 'Tier 1: MVP 1',
    title: 'Prompt 1.1: Project Scaffold, Domain Types & Mock State',
    description: 'Initializes strict TypeScript interfaces, mock high-net-worth onboarding packets, and responsive dual-pane Neo-Brutalist UI.',
    promptText: `Act as a Principal Frontend Architect. Scaffold a React/Vite, TypeScript, Tailwind CSS, and Lucide React application for "ZeroNIGO" — a pre-flight validation engine for High-Net-Worth (HNW) wealth management onboarding.

No backend or external API keys should be used for this step. Everything must run in-memory with zero-config local state.

1. Create a \`types/onboarding.ts\` file containing strict TypeScript interfaces for:
   - AccountEntity: 'INDIVIDUAL' | 'REVOCABLE_TRUST' | 'IRREVOCABLE_TRUST' | 'CORPORATE_LLC'
   - FinancialProfile: annualIncome, liquidNetWorth, totalNetWorth, investmentExperienceYears, riskTolerance
   - TradingPrivileges: marginRequested, optionsTier ('NONE' | 'TIER_1_COVERED' | 'TIER_2_LONG' | 'TIER_3_UNCOVERED')
   - SignerRole: 'PRIMARY_TRUSTEE' | 'CO_TRUSTEE' | 'GRANTOR' | 'MANAGING_MEMBER' | 'BENEFICIAL_OWNER' | 'WEALTH_ADVISOR'
   - Signer: id, fullName, email, role, hasSigned, orderIndex, ssnProvided, ownershipPercentage
   - OnboardingPacket: packetId, accountNumber, custodian, entityType, legalTitle, advisoryAgreementTitle, taxId, financialProfile, tradingPrivileges, signers, status

2. Create a \`data/mockPackets.ts\` file exporting four test records:
   - Record A (Clean Individual): 100% IGO ready for execution, margin requested with >$100k liquid net worth, Growth risk.
   - Record B (NIGO Trust): Revocable Trust with legalTitle mismatched vs advisory agreement, Margin requested with "CONSERVATIVE" risk tolerance (FINRA violation), missing CO_TRUSTEE.
   - Record C (NIGO LLC): Corporate LLC with no signers marked as MANAGING_MEMBER and invalid EIN format.
   - Record D (NIGO Dynasty Trust): Irrevocable Trust failing FinCEN CDD 25%+ beneficial owner SSN disclosure.

3. Build a two-column responsive layout:
   - Left Column: An interactive intake form allowing the user to switch between mock records or edit fields in real time.
   - Right Column: A sticky "Pre-Flight Compliance Console" that displays immediate state changes, a live readiness score (0-100%), and a locked primary action button: "Generate & Send Envelope".`,
  },
  {
    id: 'P1.2',
    tier: 'Tier 1: MVP 1',
    title: 'Prompt 1.2: Deterministic Pre-Flight Linter Engine & Quick-Fixes',
    description: 'Implements the automated domain rules for FINRA 2111/2090, FinCEN CDD, Entity Titling parity, and 1-click Quick Fix sanitizers.',
    promptText: `Implement the core domain validation logic for ZeroNIGO using client-side TypeScript.

1. Create \`lib/linters/nigoEngine.ts\`:
   Implement an automated compliance engine that accepts an \`OnboardingPacket\` and returns granular validation issues:
   - Severity: 'FATAL_NIGO' (blocks submission) | 'WARNING' (advisory)
   - Category: 'ENTITY_INTEGRITY' | 'FINRA_SUITABILITY' | 'CDD_BENEFICIAL_OWNERSHIP' | 'SIGNER_HIERARCHY' | 'TAX_ID_SYNTAX'
   - RegulatoryCitation: Specific FINRA / SEC / FinCEN rule.
   - QuickFixAction: An executable sanitization function that updates state.

2. Enforce the following wealth management domain rules:
   - Rule 1 (FINRA 2111 Suitability): If marginRequested is true:
     * liquidNetWorth must be >= $50,000.
     * riskTolerance cannot be 'CONSERVATIVE'.
   - Rule 2 (Options Disclosures): If optionsTier is 'TIER_2_LONG' or 'TIER_3_UNCOVERED':
     * annualIncome must be >= $75,000 and experience >= 2 years.
   - Rule 3 (Trust Entity Naming Standard): If entityType contains 'TRUST':
     * legalTitle must match advisoryAgreementTitle exactly.
     * Must have at least one signer with role 'PRIMARY_TRUSTEE'.
     * If IRREVOCABLE_TRUST, must have >= 2 signers.
   - Rule 4 (FinCEN CDD): Beneficial owners with >= 25% equity must disclose SSN.
   - Rule 5 (Tax ID): Validate EIN (XX-XXXXXXX) and SSN (XXX-XX-XXXX).

3. Wire this engine directly to the UI:
   - Console displays red FATAL_NIGO badges and disables envelope dispatch when any fatal errors exist.
   - Provide 1-click "Run Quick Fix" buttons next to each violation so the user can watch NIGO status clear in real time.`,
  },
  {
    id: 'P2.1',
    tier: 'Tier 2: Production Pipeline',
    title: 'Prompt 2.1: AcroForm Programmatic Coordinate Mapping (pdf-lib)',
    description: 'Programmatically projects validated intake data and DocuSign /sn1/, /sn2/ anchor coordinates directly onto standard PDF templates.',
    promptText: `Implement programmatic AcroForm coordinate projection using \`pdf-lib\`.

1. Create \`lib/pdf/coordinateMapper.ts\`:
   - Generate a synthetic 3-page Custodial Account Application PDF:
     * Page 1: Legal Entity Titling (X: 42, Y: currY), Tax ID (X: 396), Entity Type, and Cross-Schedule Titling Audit stamp.
     * Page 2: Financial Suitability Grid & Margin Checkbox Coordinate bounding box.
     * Page 3: Sequential Signer Roster & Programmatic DocuSign Anchor Tags (/sn1/, /sn2/, /sn3/).
   - Return a generated PDF Uint8Array, Blob URL, and array of exact anchor coordinate bounding boxes.

2. Build an in-browser PDF preview modal with toggleable tabs:
   - Tab A: Rendered PDF document viewer via embedded iframe.
   - Tab B: Programmatic Coordinate Inspector displaying X, Y, Width, and Height for each DocuSign composite anchor tag.
   - Add a 1-click "Download PDF" action.`,
  },
  {
    id: 'P2.2',
    tier: 'Tier 2: Production Pipeline',
    title: 'Prompt 2.2: DocuSign Sequential Orchestrator & AI Remediation Copilot',
    description: 'Models multi-party sequential routingOrder state machine, live webhooks, and AI regulatory advisory drawer with client email drafts.',
    promptText: `Build the DocuSign sequential execution orchestrator and AI regulatory assistant.

1. Create \`lib/docusign/orchestrator.ts\`:
   - Enforce sequential signing order via \`routingOrder\`:
     1. Primary Trustee / Account Owner (\`routingOrder: 1\`)
     2. Co-Trustee / Corporate Member (\`routingOrder: 2\`)
     3. RIA Wealth Advisor Countersign (\`routingOrder: 3\`)
   - Simulate state transitions: SENT -> DELIVERED -> SIGNED -> CLEARED_BY_CUSTODIAN.
   - Include interactive webhook log feed capturing simulated DocuSign Connect events.

2. Build the AI Compliance Officer & Remediation Assistant:
   - Analyzes raw NIGO violations and provides regulatory context (citing FINRA 2111/2090, SEC Custody Rule, FinCEN CDD).
   - Generates client-facing, polite email drafts explaining required updates with 1-click copy functionality.`,
  },
  {
    id: 'P3.1',
    tier: 'Tier 3: Enterprise Architecture',
    title: 'Prompt 3.1: SEC Rule 17a-4 Immutable Audit Vault & Recharts Analytics',
    description: 'Adds WORM-compliant immutable event ledger and high-density financial operational analytics.',
    promptText: `Implement institutional compliance auditing and operational analytics.

1. Build SEC Rule 17a-4 Immutable Audit Ledger (\`components/AuditLedgerModal.tsx\`):
   - Record append-only chronological log of all schema evaluations, 1-click quick-fixes, manual edits, and DocuSign webhooks.
   - Include UTC timestamps, actor roles, and cryptographic SHA-256 state fingerprints.
   - Provide 1-click JSON export for regulatory examiners.

2. Build Operational Analytics Dashboard (\`components/AnalyticsModal.tsx\`):
   - Bar Chart: Top Historical NIGO Causes by Volume (Titling Mismatch, FINRA Suitability, Missing Signers).
   - Area Chart: Onboarding Cycle Time Reduction (16.0 days down to 2.0 days).
   - KPI Cards: First-Time IGO Rate (98.6%), Total Remediation Labor ROI ($145,200 saved @ $300/incident), Active AUM Pipeline.`,
  },
];

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('PROBLEM');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>('P1.1');

  if (!isOpen) return null;

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const navItems: Array<{ key: TabKey; label: string; icon: React.ReactNode }> = [
    { key: 'PROBLEM', label: '1. Problem & Core Concept', icon: <Compass className="w-4 h-4" /> },
    { key: 'DOMAIN', label: '2. Required Domain Knowledge', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'ARCHITECTURE', label: '3. Data Pipeline & Architecture', icon: <Database className="w-4 h-4" /> },
    { key: 'STAKEHOLDERS', label: '4. Stakeholders & Personas', icon: <Users className="w-4 h-4" /> },
    { key: 'VALUATION', label: '5. Commercial Valuations', icon: <DollarSign className="w-4 h-4" /> },
    { key: 'RESUME', label: '6. College & Resume Strategy', icon: <GraduationCap className="w-4 h-4" /> },
    { key: 'PROMPTS', label: '7. AI Vibe-Coding Prompts', icon: <Code2 className="w-4 h-4" /> },
    { key: 'ENHANCEMENTS', label: '8. Further Enhancements', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-canvas border-4 border-black w-full max-w-6xl h-[92vh] brutal-shadow-xl flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="bg-brutalYellow border-b-3 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-black text-white p-1.5 border border-black font-extrabold text-xs flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-brutalYellow" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-base sm:text-lg uppercase text-black tracking-tight">
                ZeroNIGO Learning Deck &amp; Systems Architecture
              </h2>
              <p className="text-[11px] font-mono text-black/80 font-bold">
                Comprehensive Master Guide for Students, Engineers &amp; FinTech Architects
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="brutal-btn bg-white hover:bg-brutalPink hover:text-white text-black p-1.5"
            title="Close Learning Deck"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Area: Sidebar + Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-canvas">
          {/* Left Tab Navigation */}
          <aside className="w-full md:w-64 bg-white border-b-3 md:border-b-0 md:border-r-3 border-black p-3 space-y-1.5 overflow-y-auto shrink-0">
            <div className="text-[10px] font-mono uppercase font-bold text-gray-500 px-2 py-1">
              Curriculum Modules
            </div>
            {navItems.map(item => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full text-left px-3 py-2 text-xs font-mono font-bold border-2 border-black flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'bg-brutalViolet text-white brutal-shadow-sm -translate-x-0.5 -translate-y-0.5'
                      : 'bg-canvas hover:bg-canvasMuted text-black'
                  }`}
                >
                  <span className={isActive ? 'text-brutalYellow' : 'text-black'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </aside>

          {/* Right Scrollable Content Pane */}
          <main className="flex-1 bg-white p-5 sm:p-7 overflow-y-auto space-y-6">
            {/* 1. PROBLEM & CORE CONCEPT */}
            {activeTab === 'PROBLEM' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 border-b-2 border-black pb-3">
                  <Compass className="w-6 h-6 text-brutalPink" />
                  <h3 className="font-heading font-extrabold text-xl uppercase text-black">
                    1. The Business Problem: The $300 E-Signature Mistake
                  </h3>
                </div>

                <div className="p-4 bg-yellow-50 border-2 border-black space-y-2">
                  <div className="text-xs font-mono font-extrabold uppercase text-amber-900">
                    The Wealth Management Onboarding Bottleneck
                  </div>
                  <p className="text-xs font-mono text-gray-800 leading-relaxed">
                    In High-Net-Worth (HNW) wealth advisory firms, family offices, and broker-dealers, opening an account requires orchestrating 50 to 100 pages of legal contracts across custodians (Schwab, Fidelity, Pershing). The industry suffers from a systemic operational failure known as <span className="font-bold text-black bg-brutalYellow px-1">NIGO ("Not In Good Order")</span>, occurring on <span className="font-bold text-red-700">30% to 45%</span> of all submissions.
                  </p>
                </div>

                {/* Problem Flow Visual Diagram */}
                <div className="bg-canvas border-3 border-black p-4 brutal-shadow space-y-3">
                  <div className="text-xs font-heading font-extrabold uppercase text-black">
                    The Problem &amp; Solution Flow:
                  </div>

                  {/* Legacy vs ZeroNIGO Flow */}
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 border-2 border-red-500 space-y-2">
                      <div className="text-[11px] font-mono font-bold text-red-800 uppercase flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-red-600" />
                        <span>Legacy Passive E-Signature (30-45% Rejections)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-[10px] font-mono font-bold">
                        <div className="p-2 bg-white border border-red-300">Client Intake Form</div>
                        <div className="p-2 bg-white border border-red-300 flex items-center justify-center">&rarr; Visual Signature Drag &amp; Drop &rarr;</div>
                        <div className="p-2 bg-red-200 border border-red-500 text-red-900">Signed with Mismatches / Violations</div>
                        <div className="p-2 bg-red-600 text-white flex items-center justify-center">NIGO REJECT (7-21 Day Stall)</div>
                      </div>
                    </div>

                    <div className="p-3 bg-lime-50 border-2 border-black space-y-2">
                      <div className="text-[11px] font-mono font-bold text-green-900 uppercase flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-green-700" />
                        <span>ZeroNIGO Pre-Flight Compiler (100% In Good Order Clearance)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-[10px] font-mono font-bold">
                        <div className="p-2 bg-white border border-black">Client Intake Stream</div>
                        <div className="p-2 bg-brutalYellow border border-black text-black">ZeroNIGO Semantic Linter Graph</div>
                        <div className="p-2 bg-brutalViolet text-white border border-black">AcroForm Coordinate Projection</div>
                        <div className="p-2 bg-brutalLime text-black border border-black">100% IGO Custodial Clearance</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Root Causes Table */}
                <div className="space-y-3">
                  <h4 className="font-heading font-extrabold text-sm uppercase">
                    The Anatomy of Common NIGO Triggers
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3 bg-canvas border-2 border-black space-y-1">
                      <div className="font-bold text-brutalPink">1. Entity Titling Discrepancies</div>
                      <p className="text-gray-700 text-[11px]">
                        "The Miller Family Trust" on Page 2 vs "Robert T. Miller Living Trust U/A dtd 04/12/2012" on Page 24. Automatic custodial rejection.
                      </p>
                    </div>

                    <div className="p-3 bg-canvas border-2 border-black space-y-1">
                      <div className="font-bold text-amber-700">2. FINRA 2111 Suitability Omission</div>
                      <p className="text-gray-700 text-[11px]">
                        Signer requests Margin privileges while declaring a "Conservative" risk profile or &lt;$50k liquid net worth. Violates Reg BI.
                      </p>
                    </div>

                    <div className="p-3 bg-canvas border-2 border-black space-y-1">
                      <div className="font-bold text-brutalViolet">3. Signer State Race Conditions</div>
                      <p className="text-gray-700 text-[11px]">
                        Multi-party trusts require sequential execution: Primary Trustee &rarr; Co-Trustee &rarr; RIA Principal. Concurrent routing corrupts state.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Core Thesis */}
                <div className="p-4 bg-black text-white border-2 border-black space-y-1 font-mono text-xs">
                  <div className="text-brutalYellow font-extrabold uppercase">
                    The Architectural Takeaway:
                  </div>
                  <p className="text-gray-200 leading-relaxed">
                    Standard e-signature tools treat envelopes as passive visual overlays with basic client-side input masking. ZeroNIGO reimagines wealth onboarding as a **semantic validation compiler** that deterministically validates legal entity schemas, regulatory suitability, and signer state before dispatching contracts.
                  </p>
                </div>
              </div>
            )}

            {/* 2. REQUIRED DOMAIN KNOWLEDGE */}
            {activeTab === 'DOMAIN' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 border-b-2 border-black pb-3">
                  <BookOpen className="w-6 h-6 text-brutalViolet" />
                  <h3 className="font-heading font-extrabold text-xl uppercase text-black">
                    2. Required Domain Knowledge &amp; Regulatory Frameworks
                  </h3>
                </div>

                <p className="text-xs font-mono text-gray-700">
                  Building enterprise financial software requires mastering the exact laws, regulatory rules, and clearing mechanisms that govern high-net-worth wealth management:
                </p>

                <div className="space-y-4">
                  {/* Rule 1 */}
                  <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="brutal-badge bg-brutalPink text-white text-[10px]">
                        FINRA RULE 2111 &amp; RULE 2090
                      </span>
                      <span className="text-[10px] font-mono font-bold text-gray-500">Know Your Customer &amp; Suitability / Reg BI</span>
                    </div>
                    <h4 className="font-heading font-extrabold text-sm text-black">
                      Conditional Suitability &amp; Margin Leverage Dependencies
                    </h4>
                    <p className="text-xs font-mono text-gray-700 leading-relaxed">
                      Broker-dealers and RIAs are legally obligated to match investment privileges with client suitability. If an investor enables **Margin Borrowing**, federal Regulation T and custodial rules strictly mandate: (1) Liquid Net Worth &ge; $50,000, and (2) Investment Risk Tolerance must be Moderate, Growth, or Aggressive (never Conservative).
                    </p>
                  </div>

                  {/* Rule 2 */}
                  <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="brutal-badge bg-brutalYellow text-black text-[10px]">
                        FINCEN 31 CFR § 1010.230
                      </span>
                      <span className="text-[10px] font-mono font-bold text-gray-500">Customer Due Diligence (CDD) Rule</span>
                    </div>
                    <h4 className="font-heading font-extrabold text-sm text-black">
                      Beneficial Ownership Identification for Legal Entities
                    </h4>
                    <p className="text-xs font-mono text-gray-700 leading-relaxed">
                      Financial institutions must identify and verify the identity of the **beneficial owners** of all legal entity customers (LLCs, Partnerships, Corporations). Any natural person holding **25% or more equity interest** must disclose their full legal name, date of birth, residential address, and SSN/passport before account opening.
                    </p>
                  </div>

                  {/* Rule 3 */}
                  <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="brutal-badge bg-brutalLime text-black text-[10px]">
                        ACATS &amp; CUSTODIAL TITLING
                      </span>
                      <span className="text-[10px] font-mono font-bold text-gray-500">Clearing Operations Rule 401</span>
                    </div>
                    <h4 className="font-heading font-extrabold text-sm text-black">
                      Automated Customer Account Transfer Service (ACATS) Precision
                    </h4>
                    <p className="text-xs font-mono text-gray-700 leading-relaxed">
                      When transferring assets from another institution, clearing houses (DTCC/NSCC) require exact character-for-character title parity. For Trusts, this includes formation execution markers (e.g. "U/A dtd MM/DD/YYYY"). A single omitted suffix causes an automated transfer reject.
                    </p>
                  </div>

                  {/* Rule 4 */}
                  <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="brutal-badge bg-brutalCyan text-black text-[10px]">
                        SEC RULE 17A-4
                      </span>
                      <span className="text-[10px] font-mono font-bold text-gray-500">Electronic Books &amp; Records</span>
                    </div>
                    <h4 className="font-heading font-extrabold text-sm text-black">
                      Immutable WORM (Write Once, Read Many) Audit Trails
                    </h4>
                    <p className="text-xs font-mono text-gray-700 leading-relaxed">
                      All modifications, schema validation events, and client approvals must be preserved in a tamper-evident audit ledger with exact UTC timestamps and cryptographic fingerprints for regulatory examinations.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. DATA PIPELINE & SYSTEMS ARCHITECTURE */}
            {activeTab === 'ARCHITECTURE' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 border-b-2 border-black pb-3">
                  <Database className="w-6 h-6 text-brutalLime" />
                  <h3 className="font-heading font-extrabold text-xl uppercase text-black">
                    3. High-Level Data Flow &amp; Systems Architecture
                  </h3>
                </div>

                {/* Architecture ASCII Flow */}
                <div className="bg-black text-green-400 p-4 border-3 border-black font-mono text-[11px] overflow-x-auto leading-relaxed">
                  <pre>{`[ADVISOR CRM INTAKE STREAM]
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│              ZERONIGO PRE-FLIGHT LINTER ENGINE              │
│                                                             │
│  1. AST Rule Graph: Cross-Form Titling Parity Check         │
│  2. FINRA 2111/2090 Suitability & Margin Liquidity AST     │
│  3. FinCEN CDD 25%+ Beneficial Ownership Verification       │
│  4. Multi-Party Sequential Role-Based State Machine         │
│  5. Tax ID Regex & IRS Format Validator                     │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Blocks if Fatal NIGO > 0)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          ACROFORM PROGRAMMATIC COORDINATE PROJECTOR         │
│                                                             │
│  - Uses 'pdf-lib' to inject validated schema into PDF       │
│  - Maps absolute bounding boxes & anchor tags (/sn1/, /sn2/)│
│  - Returns flattened PDF & composite template payload       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│         DOCUSIGN REST API & SEQUENTIAL EXECUTION            │
│                                                             │
│  - routingOrder: 1 (Primary Trustee) -> 2 (Co-Trustee) ->   │
│                  3 (Wealth Advisor Countersign)             │
│  - Real-time Webhook Stream (DocuSign Connect)              │
│  - SEC Rule 17a-4 Immutable WORM Audit Fingerprinting       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│        100% IN GOOD ORDER (IGO) CUSTODIAL CLEARANCE         │
│         (Schwab / Fidelity / BNY Mellon Pershing)           │
└─────────────────────────────────────────────────────────────┘`}</pre>
                </div>

                {/* Architectural Breakdown Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-canvas border-2 border-black space-y-2">
                    <div className="font-heading font-extrabold text-xs uppercase flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-brutalViolet" />
                      Deterministic Rule Graph AST
                    </div>
                    <p className="text-xs font-mono text-gray-700">
                      Evaluates complex relational dependencies synchronously as users type. Unlike simple form validators, it checks cross-entity relationships (e.g. if Entity is an Irrevocable Trust, minimum 2 trustees are enforced).
                    </p>
                  </div>

                  <div className="p-4 bg-canvas border-2 border-black space-y-2">
                    <div className="font-heading font-extrabold text-xs uppercase flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-brutalPink" />
                      Programmatic AcroForm Mapping
                    </div>
                    <p className="text-xs font-mono text-gray-700">
                      Replaces manual drag-and-drop signature boxes with exact coordinate projections calculated on the fly. Generates composite templates matching institutional PDF grids down to the millimeter.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. STAKEHOLDERS & PERSONAS */}
            {activeTab === 'STAKEHOLDERS' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 border-b-2 border-black pb-3">
                  <Users className="w-6 h-6 text-brutalCyan" />
                  <h3 className="font-heading font-extrabold text-xl uppercase text-black">
                    4. Stakeholders, User Personas &amp; Daily Workflows
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="brutal-badge bg-brutalViolet text-white text-[10px]">
                        PRIMARY USER
                      </span>
                      <span className="text-[10px] font-mono font-bold text-gray-500">Front-Office</span>
                    </div>
                    <h4 className="font-heading font-extrabold text-sm text-black">
                      Wealth Advisor / RIA Principal
                    </h4>
                    <p className="text-xs font-mono text-gray-700">
                      <span className="font-bold">Goal:</span> Onboard high-net-worth clients quickly without embarrassing back-and-forth re-signatures.<br/>
                      <span className="font-bold">How they use it:</span> Inputs client mandate, reviews pre-flight readiness score, uses 1-click Quick Fixes, and dispatches compliant envelopes with confidence.
                    </p>
                  </div>

                  <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="brutal-badge bg-brutalPink text-white text-[10px]">
                        GOVERNANCE
                      </span>
                      <span className="text-[10px] font-mono font-bold text-gray-500">Compliance</span>
                    </div>
                    <h4 className="font-heading font-extrabold text-sm text-black">
                      Chief Compliance Officer (CCO)
                    </h4>
                    <p className="text-xs font-mono text-gray-700">
                      <span className="font-bold">Goal:</span> Ensure zero regulatory fines and 100% compliance with FINRA Rule 2111/2090 and FinCEN CDD.<br/>
                      <span className="font-bold">How they use it:</span> Audits the SEC Rule 17a-4 immutable ledger, monitors firm-wide suitability scores, and inspects regulatory citations.
                    </p>
                  </div>

                  <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="brutal-badge bg-brutalYellow text-black text-[10px]">
                        OPERATIONS
                      </span>
                      <span className="text-[10px] font-mono font-bold text-gray-500">Back-Office</span>
                    </div>
                    <h4 className="font-heading font-extrabold text-sm text-black">
                      Operations Specialist / CSA
                    </h4>
                    <p className="text-xs font-mono text-gray-700">
                      <span className="font-bold">Goal:</span> Eliminate the 2.5 hours of manual paper chasing and clearing remediation per NIGO packet.<br/>
                      <span className="font-bold">How they use it:</span> Leverages the AI Copilot to generate pre-formatted client emails and monitors clearing webhook acknowledgments.
                    </p>
                  </div>

                  <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="brutal-badge bg-brutalLime text-black text-[10px]">
                        CLEARING HOUSE
                      </span>
                      <span className="text-[10px] font-mono font-bold text-gray-500">Custodian</span>
                    </div>
                    <h4 className="font-heading font-extrabold text-sm text-black">
                      Institutional Clearing Ops (Schwab/Fidelity)
                    </h4>
                    <p className="text-xs font-mono text-gray-700">
                      <span className="font-bold">Goal:</span> Receive 100% formatted, character-matched AcroForm packets that pass ACATS clearing without manual review.<br/>
                      <span className="font-bold">How they use it:</span> Automated straight-through processing (STP) triggers instant account clearance.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 5. COMMERCIAL VALUATION */}
            {activeTab === 'VALUATION' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 border-b-2 border-black pb-3">
                  <DollarSign className="w-6 h-6 text-green-700" />
                  <h3 className="font-heading font-extrabold text-xl uppercase text-black">
                    5. Commercial Valuation &amp; Consulting Cost Analysis
                  </h3>
                </div>

                <p className="text-xs font-mono text-gray-700">
                  If an enterprise wealth management firm or tier-1 broker-dealer hired an external management and technology consulting firm (such as Accenture, Slalom, Thoughtworks, or a specialized FinTech systems integrator) to design, architect, build, and deploy ZeroNIGO from scratch, here is the realistic commercial quotation:
                </p>

                {/* Consulting Breakdown Table */}
                <div className="border-3 border-black brutal-shadow overflow-hidden">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="bg-brutalYellow border-b-2 border-black">
                        <th className="p-3 border-r-2 border-black font-extrabold text-black">Phase &amp; Scope of Work</th>
                        <th className="p-3 border-r-2 border-black font-extrabold text-black">Timeline</th>
                        <th className="p-3 border-r-2 border-black font-extrabold text-black">Staffing Model</th>
                        <th className="p-3 font-extrabold text-black">Cost Estimate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-black bg-white">
                      <tr>
                        <td className="p-3 border-r-2 border-black">
                          <span className="font-bold">1. Discovery &amp; Regulatory Rule Modeling</span><br/>
                          <span className="text-[11px] text-gray-600">FINRA 2111/2090 mapping, FinCEN CDD workflows, custodian ACATS requirements.</span>
                        </td>
                        <td className="p-3 border-r-2 border-black">3 - 4 Weeks</td>
                        <td className="p-3 border-r-2 border-black">1 Lead Solution Architect + 1 Regulatory SME</td>
                        <td className="p-3 font-bold text-black">$35,000 - $50,000</td>
                      </tr>

                      <tr>
                        <td className="p-3 border-r-2 border-black">
                          <span className="font-bold">2. Full-Stack Compiler &amp; PDF Engine</span><br/>
                          <span className="text-[11px] text-gray-600">Deterministic AST engine, pdf-lib AcroForm coordinate projection, reactive console.</span>
                        </td>
                        <td className="p-3 border-r-2 border-black">8 - 10 Weeks</td>
                        <td className="p-3 border-r-2 border-black">2 Senior Full-Stack Engineers + 1 UI/UX Designer</td>
                        <td className="p-3 font-bold text-black">$85,000 - $120,000</td>
                      </tr>

                      <tr>
                        <td className="p-3 border-r-2 border-black">
                          <span className="font-bold">3. DocuSign REST API &amp; SEC 17a-4 Vault</span><br/>
                          <span className="text-[11px] text-gray-600">Sequential routingOrder, webhook event handlers, WORM audit trail.</span>
                        </td>
                        <td className="p-3 border-r-2 border-black">4 - 5 Weeks</td>
                        <td className="p-3 border-r-2 border-black">1 Systems Engineer + 1 Security/QA Specialist</td>
                        <td className="p-3 font-bold text-black">$45,000 - $65,000</td>
                      </tr>

                      <tr>
                        <td className="p-3 border-r-2 border-black">
                          <span className="font-bold">4. Custodial Testing &amp; Production Deploy</span><br/>
                          <span className="text-[11px] text-gray-600">Synthetic mock test harnesses, CI/CD pipeline, performance tuning.</span>
                        </td>
                        <td className="p-3 border-r-2 border-black">3 Weeks</td>
                        <td className="p-3 border-r-2 border-black">1 DevOps Engineer + 1 Solution Architect</td>
                        <td className="p-3 font-bold text-black">$25,000 - $40,000</td>
                      </tr>

                      <tr className="bg-brutalLime font-bold">
                        <td className="p-3 border-r-2 border-black uppercase">Total Consulting Budget</td>
                        <td className="p-3 border-r-2 border-black">18 - 22 Weeks (4-5 Mos)</td>
                        <td className="p-3 border-r-2 border-black">Cross-Functional Agile Pod</td>
                        <td className="p-3 text-sm text-black font-extrabold">$190,000 - $275,000+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-canvas border-2 border-black space-y-1 font-mono text-xs">
                  <div className="font-bold text-black uppercase">
                    Annual Firm ROI Calculation:
                  </div>
                  <p className="text-gray-700">
                    A mid-sized advisory firm onboarding 500 accounts annually experiences ~200 NIGO incidents ($60,000 in direct labor waste) and 14 days of delayed AUM fee billing per account ($180,000 in delayed revenue). **ZeroNIGO pays for itself in under 14 months.**
                  </p>
                </div>
              </div>
            )}

            {/* 6. COLLEGE & RESUME STRATEGY */}
            {activeTab === 'RESUME' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 border-b-2 border-black pb-3">
                  <GraduationCap className="w-6 h-6 text-brutalViolet" />
                  <h3 className="font-heading font-extrabold text-xl uppercase text-black">
                    6. College Admissions &amp; FinTech Resume Differentiation
                  </h3>
                </div>

                <div className="p-4 bg-violet-50 border-2 border-black space-y-2">
                  <div className="text-xs font-mono font-extrabold uppercase text-violet-900">
                    Why This Project Stands Out from 99% of Student Portfolios
                  </div>
                  <p className="text-xs font-mono text-gray-800 leading-relaxed">
                    Most college applicants and junior developers showcase generic todo apps, weather widgets, or basic e-commerce clones. ZeroNIGO demonstrates **deep domain literacy in enterprise FinTech**, systems architecture, and regulatory engineering.
                  </p>
                </div>

                {/* Resume Bullet Points */}
                <div className="space-y-3">
                  <h4 className="font-heading font-extrabold text-sm uppercase">
                    Ready-to-Use Resume Bullet Points (Copy &amp; Paste):
                  </h4>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-3 bg-canvas border-2 border-black">
                      <span className="font-bold text-black">&bull; FinTech Rule Graph Architecture: </span>
                      <span>Engineered a real-time deterministic compliance compiler in TypeScript validating FINRA Rule 2111/2090 suitability, FinCEN CDD beneficial ownership, and custodial titling standards, eliminating 30-45% NIGO onboarding errors.</span>
                    </div>

                    <div className="p-3 bg-canvas border-2 border-black">
                      <span className="font-bold text-black">&bull; Programmatic AcroForm Mapping: </span>
                      <span>Built an automated PDF projection engine utilizing \`pdf-lib\` to dynamically bind validated schema data onto custodial coordinate bounding boxes, generating composite templates for DocuSign REST execution.</span>
                    </div>

                    <div className="p-3 bg-canvas border-2 border-black">
                      <span className="font-bold text-black">&bull; Sequential State Orchestration: </span>
                      <span>Designed a multi-party signing state machine enforcing strict sequential \`routingOrder\` (Primary Trustee &rarr; Co-Trustee &rarr; RIA Principal), preventing signer race conditions and enabling instant custodial clearing.</span>
                    </div>
                  </div>
                </div>

                {/* Interview Talking Points */}
                <div className="p-4 bg-canvas border-3 border-black brutal-shadow space-y-2 font-mono text-xs">
                  <div className="font-bold text-brutalPink uppercase">
                    Key Interview Talking Point for Top Tech / Wall Street:
                  </div>
                  <p className="text-gray-800 leading-relaxed italic">
                    "I didn't just build an e-signature integration—I built a semantic validation compiler. In wealth management, the bottleneck isn't getting a document signed; it's preventing the $300 NIGO error when Page 3 has a title mismatch with Page 24 or when margin leverage is enabled with a conservative risk profile."
                  </p>
                </div>
              </div>
            )}

            {/* 7. AI VIBE-CODING PROMPTS */}
            {activeTab === 'PROMPTS' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 border-b-2 border-black pb-3">
                  <Code2 className="w-6 h-6 text-brutalPink" />
                  <h3 className="font-heading font-extrabold text-xl uppercase text-black">
                    7. AI Vibe-Coding Prompt Runway
                  </h3>
                </div>

                <p className="text-xs font-mono text-gray-700">
                  Click any prompt block below to inspect and copy the exact engineering prompts used to construct this enterprise application from scratch:
                </p>

                <div className="space-y-3">
                  {VIBE_PROMPTS.map((prompt) => {
                    const isExpanded = expandedPromptId === prompt.id;
                    const isCopied = copiedPromptId === prompt.id;

                    return (
                      <div
                        key={prompt.id}
                        className="border-3 border-black bg-white brutal-shadow-sm transition-all"
                      >
                        {/* Prompt Accordion Header */}
                        <div
                          onClick={() => setExpandedPromptId(isExpanded ? null : prompt.id)}
                          className="p-3 bg-canvas hover:bg-canvasMuted cursor-pointer flex items-center justify-between gap-3 border-b-2 border-black"
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="brutal-badge bg-black text-white text-[10px]">
                              {prompt.id}
                            </span>
                            <span className="brutal-badge bg-brutalYellow text-black text-[9px]">
                              {prompt.tier}
                            </span>
                            <span className="font-heading font-extrabold text-xs sm:text-sm text-black">
                              {prompt.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyPrompt(prompt.id, prompt.promptText);
                              }}
                              className="brutal-btn bg-white hover:bg-brutalLime text-black text-[10px] px-2.5 py-1 flex items-center gap-1 font-bold"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-green-700" />
                                  <span className="text-green-700">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="p-4 bg-white space-y-3 font-mono text-xs animate-in fade-in duration-100">
                            <p className="text-gray-600 text-[11px]">
                              {prompt.description}
                            </p>

                            <div className="relative">
                              <pre className="p-3 bg-black text-green-400 border-2 border-black overflow-x-auto text-[11px] whitespace-pre-wrap leading-relaxed max-h-72">
                                {prompt.promptText}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 8. FURTHER ENHANCEMENTS */}
            {activeTab === 'ENHANCEMENTS' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 border-b-2 border-black pb-3">
                  <Sparkles className="w-6 h-6 text-brutalYellow fill-black" />
                  <h3 className="font-heading font-extrabold text-xl uppercase text-black">
                    8. Future Enhancements &amp; Production Roadmap
                  </h3>
                </div>

                <p className="text-xs font-mono text-gray-700">
                  To transition ZeroNIGO into a multi-million-dollar B2B FinTech SaaS platform, the following architectural extensions can be implemented:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-brutalPink font-bold uppercase">
                      <Zap className="w-4 h-4" />
                      1. Multimodal AI Trust Agreement Parser
                    </div>
                    <p className="text-gray-700">
                      Integrate Google Gemini 1.5 Pro multimodal OCR to ingest 80-page scanned Trust Agreements, automatically extract the exact legal title, date of execution, grantor names, and trustee powers, and pre-fill the onboarding packet.
                    </p>
                  </div>

                  <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-brutalViolet font-bold uppercase">
                      <Building2 className="w-4 h-4" />
                      2. Live Plaid &amp; Open Banking Integration
                    </div>
                    <p className="text-gray-700">
                      Connect Plaid Identity and Assets APIs to verify client liquid net worth and bank account routing in real-time, eliminating manual financial disclosures for FINRA 2111 suitability.
                    </p>
                  </div>

                  <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-green-700 font-bold uppercase">
                      <Terminal className="w-4 h-4" />
                      3. Direct ACATS &amp; DTCC Clearing Bridge
                    </div>
                    <p className="text-gray-700">
                      Direct integration with DTCC Settlement Web Services and FIX protocols to initiate automated account transfers directly from the app without relying on custodian intermediate processing.
                    </p>
                  </div>

                  <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-amber-700 font-bold uppercase">
                      <ShieldCheck className="w-4 h-4" />
                      4. Multi-Tenant Enterprise Role Hierarchy
                    </div>
                    <p className="text-gray-700">
                      Supabase PostgreSQL with Row-Level Security (RLS), SAML 2.0 SSO (Okta/Entra ID), and role-based access for Advisors, Supervisory Principals, and Compliance Officers.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Modal Footer */}
        <div className="bg-canvas border-t-3 border-black p-3 px-5 flex items-center justify-between">
          <div className="text-xs font-mono text-gray-700 hidden sm:block">
            ZeroNIGO Educational Master Architecture &bull; Designed for Domain School of FinTech
          </div>
          <button
            onClick={onClose}
            className="brutal-btn bg-black text-white text-xs px-5 py-2 font-heading font-extrabold uppercase ml-auto"
          >
            Close Learning Deck
          </button>
        </div>
      </div>
    </div>
  );
};
