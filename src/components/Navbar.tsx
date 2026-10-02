import React from 'react';
import { ShieldCheck, BarChart3, History, Sparkles, FileText, CheckCircle2, HelpCircle } from 'lucide-react';
import { OnboardingPacket } from '../types/onboarding';

interface NavbarProps {
  currentPacket: OnboardingPacket;
  onOpenAbout: () => void;
  onOpenAnalytics: () => void;
  onOpenAudit: () => void;
  onOpenAi: () => void;
  onOpenPdf: () => void;
  readinessScore: number;
  fatalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPacket,
  onOpenAbout,
  onOpenAnalytics,
  onOpenAudit,
  onOpenAi,
  onOpenPdf,
  readinessScore,
  fatalCount,
}) => {
  return (
    <header className="border-b-4 border-black bg-brutalYellow text-black px-4 py-3 sticky top-0 z-30 brutal-shadow">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-brutalPink text-white border-2 border-black p-2 brutal-shadow-sm font-extrabold text-xl flex items-center justify-center tracking-tighter">
            0N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight font-heading uppercase text-black">
                Zero<span className="bg-black text-white px-1.5 py-0.5 ml-0.5">NIGO</span>
              </h1>
              <span className="brutal-badge bg-brutalLime text-black hidden sm:inline-block">
                PRE-FLIGHT v2.4
              </span>
            </div>
            <p className="text-xs font-mono font-bold text-black/80">
              Wealth Onboarding Semantic Validation Compiler
            </p>
          </div>
        </div>

        {/* Live Packet Status Chip */}
        <div className="flex items-center gap-2 bg-canvas border-2 border-black px-3 py-1.5 brutal-shadow-sm">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono uppercase font-bold text-gray-600">Active Packet</span>
            <span className="text-xs font-mono font-extrabold">{currentPacket.packetId}</span>
          </div>
          <div className="h-6 w-[2px] bg-black mx-1" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono uppercase font-bold text-gray-600">Clearing</span>
            <span className="text-xs font-mono font-extrabold text-brutalViolet">
              {currentPacket.custodian.split('_')[0]}
            </span>
          </div>
          <div className="h-6 w-[2px] bg-black mx-1" />
          <div className="flex items-center gap-1.5">
            {fatalCount === 0 ? (
              <span className="inline-flex items-center gap-1 bg-brutalLime text-black font-extrabold text-xs px-2 py-0.5 border border-black">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% IGO
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-brutalPink text-white font-extrabold text-xs px-2 py-0.5 border border-black animate-pulse">
                <ShieldCheck className="w-3.5 h-3.5" /> {readinessScore}% ({fatalCount} NIGO)
              </span>
            )}
          </div>
        </div>

        {/* Global Action Nav */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={onOpenAbout}
            className="brutal-btn bg-black hover:bg-neutral-800 text-brutalYellow text-xs px-3 py-1.5 flex items-center gap-1.5 font-extrabold border-2 border-black"
            title="Open Master Educational Learning Deck & Systems Architecture"
          >
            <HelpCircle className="w-3.5 h-3.5 text-brutalYellow" />
            <span>Learning Deck &amp; Architecture</span>
          </button>

          <button
            onClick={onOpenPdf}
            className="brutal-btn bg-white hover:bg-brutalCyan text-black text-xs px-3 py-1.5 flex items-center gap-1.5"
            title="Inspect programmatic AcroForm coordinate projection"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Preview</span>
          </button>

          <button
            onClick={onOpenAi}
            className="brutal-btn bg-brutalPink hover:bg-pink-400 text-white text-xs px-3 py-1.5 flex items-center gap-1.5"
            title="Ask AI Compliance Officer for regulatory analysis"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Remediation</span>
          </button>

          <button
            onClick={onOpenAnalytics}
            className="brutal-btn bg-white hover:bg-brutalLime text-black text-xs px-3 py-1.5 flex items-center gap-1.5"
            title="View NIGO ROI & Cycle Time Analytics"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>ROI &amp; Analytics</span>
          </button>

          <button
            onClick={onOpenAudit}
            className="brutal-btn bg-white hover:bg-brutalViolet hover:text-white text-black text-xs px-3 py-1.5 flex items-center gap-1.5"
            title="View SEC Rule 17a-4 Immutable Audit Ledger"
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Vault</span>
          </button>
        </div>
      </div>
    </header>
  );
};
