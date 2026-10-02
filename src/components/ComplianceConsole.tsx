import React from 'react';
import { LinterResult, NigoIssue } from '../types/onboarding';
import { 
  Wrench, 
  Send, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  ArrowRight,
  Zap
} from 'lucide-react';

interface ComplianceConsoleProps {
  linterResult: LinterResult;
  onApplyQuickFix: (issue: NigoIssue) => void;
  onApplyAllQuickFixes: () => void;
  onOpenPdf: () => void;
  onOpenDocuSign: () => void;
  onOpenAi: () => void;
}

export const ComplianceConsole: React.FC<ComplianceConsoleProps> = ({
  linterResult,
  onApplyQuickFix,
  onApplyAllQuickFixes,
  onOpenPdf,
  onOpenDocuSign,
  onOpenAi,
}) => {
  const { score, fatalCount, isExecutable, issues } = linterResult;

  const getScoreColor = () => {
    if (score === 100) return 'bg-brutalLime text-black';
    if (score >= 70) return 'bg-brutalYellow text-black';
    return 'bg-brutalPink text-white';
  };

  return (
    <div className="bg-white border-4 border-black p-5 brutal-shadow-lg sticky top-20 space-y-6">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b-3 border-black pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-gray-500 tracking-wider">
            Automated Clearing Pre-Flight Monitor
          </span>
          <h2 className="text-xl font-extrabold font-heading uppercase text-black">
            Compliance Console
          </h2>
        </div>
        <div className={`brutal-badge ${getScoreColor()} text-sm px-3 py-1 font-extrabold`}>
          {score}% IGO READINESS
        </div>
      </div>

      {/* Live Readiness Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono font-bold">
          <span>CLEAN PACKET CONFIDENCE</span>
          <span>{fatalCount === 0 ? 'IGO READY' : `${fatalCount} FATAL BLOCKERS`}</span>
        </div>
        <div className="w-full h-5 bg-canvas border-2 border-black relative overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              score === 100 ? 'bg-brutalLime' : score >= 70 ? 'bg-brutalYellow' : 'bg-brutalPink'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Operational Impact Quick Metric Strip */}
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="p-2.5 bg-canvas border-2 border-black">
          <div className="text-[10px] font-mono font-bold text-gray-600 uppercase">Est. Clearing Delay</div>
          <div className="text-lg font-heading font-extrabold text-black">
            {fatalCount > 0 ? `${fatalCount * 7 + 7} Days` : 'Instant (0 Days)'}
          </div>
        </div>
        <div className="p-2.5 bg-canvas border-2 border-black">
          <div className="text-[10px] font-mono font-bold text-gray-600 uppercase">Remediation Cost</div>
          <div className="text-lg font-heading font-extrabold text-brutalPink">
            {fatalCount > 0 ? `$${fatalCount * 300}` : '$0 (Clean)'}
          </div>
        </div>
      </div>

      {/* Quick Action Bar for Remediation */}
      {issues.length > 0 && (
        <div className="flex items-center gap-2">
          <button
            onClick={onApplyAllQuickFixes}
            className="brutal-btn bg-brutalLime hover:bg-lime-400 text-black text-xs px-3 py-2 flex-1 flex items-center justify-center gap-1.5"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>Auto-Sanitize All ({issues.length})</span>
          </button>

          <button
            onClick={onOpenAi}
            className="brutal-btn bg-brutalCyan hover:bg-cyan-300 text-black text-xs px-3 py-2 flex items-center gap-1"
            title="Get AI regulatory explainer and email drafts"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Copilot</span>
          </button>
        </div>
      )}

      {/* Detailed Issues List */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {issues.length === 0 ? (
          <div className="p-4 bg-lime-50 border-2 border-black text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-brutalLime mx-auto fill-black" />
            <div className="font-heading font-extrabold text-sm uppercase text-black">
              100% In Good Order (IGO)
            </div>
            <p className="text-xs font-mono text-gray-700">
              All FINRA 2111/2090 suitability rules, titling reconciliations, and CDD requirements verified. Envelope is ready for sequential multi-party execution.
            </p>
          </div>
        ) : (
          issues.map(issue => {
            const isFatal = issue.severity === 'FATAL_NIGO';
            return (
              <div
                key={issue.id}
                className={`p-3 border-2 border-black brutal-shadow-sm space-y-2 ${
                  isFatal ? 'bg-pink-50 border-brutalPink' : 'bg-amber-50 border-amber-500'
                }`}
              >
                {/* Badge Header */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[9px] font-bold font-mono px-1.5 py-0.5 border border-black ${
                        isFatal ? 'bg-brutalPink text-white' : 'bg-brutalYellow text-black'
                      }`}
                    >
                      {issue.severity}
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-white px-1.5 py-0.5 border border-black text-gray-700">
                      {issue.category}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-gray-500 font-bold">{issue.ruleCode}</span>
                </div>

                {/* Title & Message */}
                <div>
                  <h4 className="text-xs font-extrabold font-heading text-black">{issue.title}</h4>
                  <p className="text-[11px] font-mono text-gray-800 mt-1 leading-snug">
                    {issue.message}
                  </p>
                </div>

                {/* Citation */}
                <div className="text-[10px] font-mono text-gray-600 bg-white p-1.5 border border-black/40">
                  <span className="font-bold text-black">Citation: </span>
                  {issue.regulatoryCitation}
                </div>

                {/* Remediation Action */}
                {issue.quickFixAvailable && (
                  <div className="pt-1 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onApplyQuickFix(issue)}
                      className="brutal-btn bg-brutalLime hover:bg-lime-400 text-black text-[10px] px-2.5 py-1 flex items-center gap-1"
                    >
                      <Wrench className="w-3 h-3" />
                      <span>Run Quick Fix</span>
                    </button>
                    <span className="text-[10px] font-mono text-gray-500 truncate">
                      {issue.remediationHint}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Primary Action Dispatch Buttons */}
      <div className="space-y-2 border-t-3 border-black pt-4">
        <button
          onClick={onOpenPdf}
          className="brutal-btn bg-white hover:bg-brutalCyan text-black text-xs w-full py-2.5 flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>Inspect AcroForm Coordinates (/sn1/, /sn2/)</span>
        </button>

        <button
          onClick={onOpenDocuSign}
          disabled={!isExecutable}
          className={`brutal-btn text-xs w-full py-3 flex items-center justify-center gap-2 ${
            isExecutable
              ? 'bg-brutalPink hover:bg-pink-600 text-white font-extrabold cursor-pointer animate-bounce'
              : 'bg-gray-300 text-gray-600 border-gray-500 cursor-not-allowed shadow-none'
          }`}
        >
          {isExecutable ? (
            <>
              <Send className="w-4 h-4" />
              <span>GENERATE &amp; SEND ENVELOPE (DOCUSIGN)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>SUBMISSION BLOCKED — RESOLVE {fatalCount} FATAL NIGO</span>
            </>
          )}
        </button>

        {!isExecutable && (
          <p className="text-[10px] font-mono text-center text-red-600 font-bold">
            🔒 Pre-flight compiler strictly prohibits envelope dispatch until all fatal rules clear.
          </p>
        )}
      </div>
    </div>
  );
};
