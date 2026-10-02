# ZeroNIGO — Intelligent Wealth Onboarding Pre-Flight Engine

> **Semantic Validation Compiler & Programmatic AcroForm Pre-Flight Orchestrator for High-Net-Worth (HNW) Wealth Management**

---

## 🎯 Overview
In Wealth Management, Registered Investment Advisors (RIAs), Family Offices, and Broker-Dealers face a systemic **30% to 45% NIGO ("Not In Good Order")** rejection rate when onboarding High-Net-Worth multi-entity legal packets across clearing custodians (Schwab, Fidelity Institutional, BNY Mellon Pershing).

A single NIGO packet stalls onboarding by **7 to 21 business days**, consumes **$150 to $300+** in operational remediation labor per incident, and delays fee billing on millions in AUM.

**ZeroNIGO** transforms passive e-signatures into an active, semantic validation compiler and pre-flight state machine that eliminates NIGO rejections prior to DocuSign envelope generation and custodial dispatch.

---

## 🎨 Neo-Brutalist Design System
- **Background Canvas:** Stark off-white (`#FFFDF0`) with grid texture and pale yellow (`#FEF08A`) accent cards.
- **Borders & Corners:** Thick solid black borders (`border-2 border-black` / `border-4 border-black`) with sharp corners (`rounded-none`).
- **Hard Offset Shadows:** Physical non-blurred shadows (`4px 4px 0px #000` / `6px 6px 0px #000`).
- **Vibrant Accents:** Hot Pink (`#FF2A85`), Lime Green (`#A3E635`), Bright Violet (`#8B5CF6`), Electric Cyan (`#00F0FF`), Signal Amber (`#FFE600`).
- **Typography:** Headings in **Space Grotesk** (geometric sans 800/900); Metadata/Rules/Audit in **JetBrains Mono**.

---

## ⚡ Key Capabilities
1. **Deterministic Rule Graph AST Engine:**
   - **FINRA Rule 2111 & 2090 (Suitability / Reg BI):** Strict validation of margin leverage requirements ($\ge\$50\text{k}$ liquid net worth, non-conservative risk profile) and options trading tiers.
   - **FinCEN CDD (31 CFR § 1010.230):** 25%+ beneficial ownership identification and mandatory SSN disclosure.
   - **Cross-Schedule Titling Parity:** Exact character-for-character string matching for Revocable/Irrevocable Trusts (`U/A dtd MM/DD/YYYY`) and Corporate LLC resolutions.
2. **1-Click Quick-Fix Sanitizers:** Instantly remedies compliance violations and clears packets to 100% In Good Order (IGO).
3. **AcroForm Programmatic Coordinate Mapping (`pdf-lib`):** Injects validated schema values into multi-page custodial applications and pins programmatic anchor tags (`/sn1/`, `/sn2/`, `/sn3/`) with live in-browser PDF preview and download.
4. **DocuSign Sequential Orchestrator:** Live state machine enforcing sequential `routingOrder` (Primary Trustee $\rightarrow$ Co-Trustee $\rightarrow$ RIA Advisor) with real-time DocuSign Connect webhook stream and automated Custodial Clearing ACK.
5. **AI Compliance Copilot:** Explains why custodians reject files with regulatory citations and generates 1-click copyable polite client email drafts.
6. **SEC Rule 17a-4 Immutable Audit Ledger:** WORM-compliant event ledger with UTC timestamps and SHA-256 state fingerprints.
7. **Operational Analytics Dashboard (`recharts`):** Real-time metrics for top NIGO causes, 87% cycle time reduction (16 days $\rightarrow$ 2 days), and dollar ROI ($300/incident labor model).
8. **Master Educational Learning Deck (About Page):** 8 interactive curriculum modules covering business problems, domain laws, systems architecture, stakeholder personas, commercial consulting valuations ($190k-$275k), college resume strategies, and the prompt runway.

---

## 🛠️ Tech Stack
- **Framework:** React 18 + TypeScript (`strict: true`) + Vite
- **Styling:** Tailwind CSS + Custom Neo-Brutalist Theme Tokens
- **Icons:** `lucide-react`
- **PDF Engine:** `pdf-lib`
- **Charts:** `recharts`
- **Confetti:** `canvas-confetti`
- **Package Manager:** `pnpm`
- **Deployment:** GitHub Pages (`gh-pages`)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js &ge; 18
- `pnpm` &ge; 9

### Installation
```bash
# Clone the repository
git clone https://github.com/domainschool/Digital-Contract-Auto-Executing-App.git

# Enter project directory
cd Digital-Contract-Auto-Executing-App

# Install dependencies
pnpm install

# Start local development server
pnpm run dev
```

Open [http://localhost:5174](http://localhost:5174) in your browser.

---

## 📦 Building & Deploying to GitHub Pages

### Build for Production
```bash
pnpm run build
```

### Deploy to GitHub Pages
```bash
pnpm run deploy
```

---

## 📜 License
MIT &copy; 2026 Domain School
