import React, { useState } from 'react';
import { OnboardingPacket, NigoIssue } from '../types/onboarding';
import { X, Sparkles, Copy, Check, ShieldAlert, BookOpen, Mail } from 'lucide-react';

interface AiRemediationDrawerProps {
  packet: OnboardingPacket;
  issues: NigoIssue[];
  isOpen: boolean;
  onClose: () => void;
}

export const AiRemediationDrawer: React.FC<AiRemediationDrawerProps> = ({
  packet,
  issues,
  isOpen,
  onClose,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
      <div className="bg-canvas border-l-4 border-black w-full max-w-2xl h-full brutal-shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-brutalPink text-white border-b-3 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <div>
              <h3 className="font-heading font-extrabold text-base uppercase">
                AI Compliance Officer &amp; Remediation Copilot
              </h3>
              <p className="text-[11px] font-mono text-white/90">
                Regulatory Analysis, Institutional Risk Citations &amp; Client Communication
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="brutal-btn bg-white hover:bg-black hover:text-white text-black p-1.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 bg-white p-5 overflow-y-auto space-y-6">
          {/* Executive Overview */}
          <div className="p-4 bg-canvas border-2 border-black space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-gray-700">
              <BookOpen className="w-4 h-4 text-brutalViolet" />
              <span>Diagnostic Assessment: Packet {packet.packetId}</span>
            </div>
            <p className="text-xs font-mono text-gray-800 leading-relaxed">
              ZeroNIGO evaluated <span className="font-bold">{packet.legalTitle}</span> against clearing requirements for <span className="font-bold text-brutalViolet">{packet.custodian}</span>. Detected <span className="font-bold text-red-600">{issues.length} compliance violation(s)</span> requiring immediate pre-flight remediation before client dispatch.
            </p>
          </div>

          {/* Issue Explanations & Draft Communications */}
          <div className="space-y-4">
            {issues.length === 0 ? (
              <div className="p-6 bg-lime-50 border-2 border-black text-center space-y-2 font-mono">
                <div className="font-bold text-sm text-green-800 uppercase">
                  Zero Compliance Risks Detected
                </div>
                <p className="text-xs text-gray-600">
                  This onboarding packet satisfies all FINRA suitability, FinCEN CDD beneficial ownership, and custodial titling standards. No remediation communications required.
                </p>
              </div>
            ) : (
              issues.map((issue, idx) => {
                const clientEmailDraft = `Subject: Quick clarification regarding your ${packet.entityType.replace('_', ' ')} account opening documents\n\nDear ${packet.signers[0]?.fullName || 'Client'},\n\nWe are preparing your custodial onboarding packet for ${packet.custodian.replace('_', ' ')}.\n\nTo ensure your application clears custodial compliance without delays under ${issue.regulatoryCitation}, we need to make one quick adjustment:\n\n• Required Update: ${issue.remediationHint}\n• Background: ${issue.message}\n\nPlease let us know if you have any questions, and we will update your registration immediately.\n\nWarm regards,\n${packet.signers.find(s => s.role === 'WEALTH_ADVISOR')?.fullName || 'Apex Wealth Advisory Operations'}`;

                return (
                  <div
                    key={issue.id}
                    className="p-4 bg-canvas border-3 border-black brutal-shadow-sm space-y-3"
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between">
                      <span className="brutal-badge bg-brutalPink text-white text-[10px]">
                        {issue.severity}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-gray-500">
                        {issue.ruleCode}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h4 className="font-heading font-extrabold text-sm text-black">
                        {issue.title}
                      </h4>
                      <p className="text-xs font-mono text-gray-700 mt-1">
                        {issue.message}
                      </p>
                    </div>

                    {/* Regulatory Context */}
                    <div className="p-2.5 bg-yellow-50 border border-black/40 text-[11px] font-mono text-gray-800 space-y-1">
                      <div className="font-bold text-black flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        Regulatory Framework:
                      </div>
                      <div>{issue.regulatoryCitation}</div>
                      <div className="text-gray-600 text-[10px] italic">
                        Why Custodians Reject This: Cleared accounts without strict alignment face immediate audit inquiries and regulatory fines under SEC/FINRA supervisory rules.
                      </div>
                    </div>

                    {/* Client Communication Draft */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase flex items-center gap-1 text-gray-700">
                          <Mail className="w-3.5 h-3.5 text-brutalPink" />
                          Client-Facing Email Communication Draft:
                        </span>
                        <button
                          onClick={() => handleCopy(clientEmailDraft, idx)}
                          className="brutal-btn bg-white hover:bg-brutalLime text-black text-[10px] px-2 py-0.5 flex items-center gap-1"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3 h-3 text-green-700" />
                              <span className="font-bold text-green-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Draft</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="p-2.5 bg-white border border-black font-mono text-[10px] text-gray-800 whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
                        {clientEmailDraft}
                      </pre>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-brutalYellow border-t-2 border-black p-3 px-4 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-black">
            Powered by ZeroNIGO FinTech Regulatory Intelligence
          </span>
          <button
            onClick={onClose}
            className="brutal-btn bg-black text-white text-xs px-4 py-1.5"
          >
            Close Copilot
          </button>
        </div>
      </div>
    </div>
  );
};
