import React, { useState, useMemo } from 'react';
import { OnboardingPacket, NigoIssue, AuditRecord } from './types/onboarding';
import { MOCK_PACKETS } from './data/mockPackets';
import { runNigoComplianceLinter } from './lib/linters/nigoEngine';
import { Navbar } from './components/Navbar';
import { IntakeForm } from './components/IntakeForm';
import { ComplianceConsole } from './components/ComplianceConsole';
import { PdfViewerModal } from './components/PdfViewerModal';
import { DocuSignModal } from './components/DocuSignModal';
import { AiRemediationDrawer } from './components/AiRemediationDrawer';
import { AuditLedgerModal } from './components/AuditLedgerModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { AboutModal } from './components/AboutModal';
import { EnvelopeSession } from './lib/docusign/orchestrator';

export const App: React.FC = () => {
  // Active packet state (starts with NIGO Trust test case to showcase pre-flight power)
  const [currentPacket, setCurrentPacket] = useState<OnboardingPacket>(MOCK_PACKETS[1]);

  // Modal open states
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isDocuSignModalOpen, setIsDocuSignModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

  // SEC 17a-4 Audit Trail Log
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([
    {
      id: 'AUD-001',
      packetId: MOCK_PACKETS[1].packetId,
      timestamp: '2026-10-01 09:30:15 UTC',
      actor: 'CRM Ingestion Engine',
      action: 'VALIDATION_CHECK',
      details: 'Ingested raw HNW packet from advisor intake. Pre-flight compiler initialized.',
      severity: 'INFO',
      hashFingerprint: 'sha256:8f4c2e917a10293b8e4f1a',
    },
    {
      id: 'AUD-002',
      packetId: MOCK_PACKETS[1].packetId,
      timestamp: '2026-10-01 09:30:16 UTC',
      actor: 'ZeroNIGO Engine',
      action: 'VALIDATION_CHECK',
      details: 'Fatal NIGO Detected: Title mismatch & FINRA Rule 2111 margin suitability violation.',
      severity: 'ALERT',
      hashFingerprint: 'sha256:3d9182ab47c10294e82f1b',
    },
  ]);

  // Synchronous real-time pre-flight compliance execution
  const linterResult = useMemo(() => {
    return runNigoComplianceLinter(currentPacket);
  }, [currentPacket]);

  // Handle Packet Updates & Audit Logging
  const handleUpdatePacket = (updated: OnboardingPacket, reason?: string) => {
    setCurrentPacket(updated);

    if (reason) {
      const newAudit: AuditRecord = {
        id: `AUD-${Date.now()}`,
        packetId: updated.packetId,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        actor: 'Advisor Principal (ID #802)',
        action: 'MANUAL_EDIT',
        details: reason,
        severity: 'INFO',
        hashFingerprint: `sha256:${Math.random().toString(36).substring(2, 15)}`,
      };
      setAuditLogs(prev => [newAudit, ...prev]);
    }
  };

  const handleSelectPreset = (preset: OnboardingPacket) => {
    setCurrentPacket(preset);
    const newAudit: AuditRecord = {
      id: `AUD-${Date.now()}`,
      packetId: preset.packetId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      actor: 'System Switcher',
      action: 'VALIDATION_CHECK',
      details: `Switched active intake scenario to ${preset.packetId} (${preset.legalTitle}).`,
      severity: 'INFO',
      hashFingerprint: `sha256:${Math.random().toString(36).substring(2, 15)}`,
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // 1-Click Quick Fix
  const handleApplyQuickFix = (issue: NigoIssue) => {
    if (issue.quickFixAction) {
      const updated = issue.quickFixAction(currentPacket);
      setCurrentPacket(updated);

      const newAudit: AuditRecord = {
        id: `AUD-${Date.now()}`,
        packetId: updated.packetId,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        actor: '1-Click Quick Fix Engine',
        action: 'QUICK_FIX_APPLIED',
        details: `Auto-remediated ${issue.ruleCode}: ${issue.title}. State sanitized for custodial clearing.`,
        severity: 'SUCCESS',
        hashFingerprint: `sha256:${Math.random().toString(36).substring(2, 15)}`,
      };
      setAuditLogs(prev => [newAudit, ...prev]);
    }
  };

  // Auto-Sanitize All Issues
  const handleApplyAllQuickFixes = () => {
    let updated = currentPacket;
    for (const issue of linterResult.issues) {
      if (issue.quickFixAction) {
        updated = issue.quickFixAction(updated);
      }
    }
    setCurrentPacket(updated);

    const newAudit: AuditRecord = {
      id: `AUD-${Date.now()}`,
      packetId: updated.packetId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      actor: 'Batch Sanitizer',
      action: 'QUICK_FIX_APPLIED',
      details: `Batch-remediated all ${linterResult.issues.length} compliance blockers. Packet readiness at 100% IGO.`,
      severity: 'SUCCESS',
      hashFingerprint: `sha256:${Math.random().toString(36).substring(2, 15)}`,
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // When Envelope completes and clears
  const handleEnvelopeCompleted = (session: EnvelopeSession) => {
    const updatedPacket: OnboardingPacket = {
      ...currentPacket,
      status: 'COMPLETED_IGO',
    };
    setCurrentPacket(updatedPacket);

    const newAudit: AuditRecord = {
      id: `AUD-${Date.now()}`,
      packetId: currentPacket.packetId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      actor: 'DocuSign REST Webhook & Custodial Node',
      action: 'CUSTODIAL_CLEARANCE',
      details: `Envelope ${session.envelopeId} cleared by ${currentPacket.custodian}. Ack: ${session.custodianAckNumber}. 0 NIGO Rejections.`,
      severity: 'SUCCESS',
      hashFingerprint: `sha256:${Math.random().toString(36).substring(2, 15)}`,
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  return (
    <div className="min-h-screen bg-canvas bg-grid-pattern text-black flex flex-col font-mono selection:bg-brutalPink selection:text-white">
      {/* Top Neo-Brutalist Navigation */}
      <Navbar
        currentPacket={currentPacket}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsModalOpen(true)}
        onOpenAudit={() => setIsAuditModalOpen(true)}
        onOpenAi={() => setIsAiDrawerOpen(true)}
        onOpenPdf={() => setIsPdfModalOpen(true)}
        readinessScore={linterResult.score}
        fatalCount={linterResult.fatalCount}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Intake Form (7 cols) */}
          <div className="lg:col-span-7">
            <IntakeForm
              packet={currentPacket}
              onUpdatePacket={handleUpdatePacket}
              onSelectPreset={handleSelectPreset}
            />
          </div>

          {/* Right Column: Pre-Flight Compliance Console (5 cols) */}
          <div className="lg:col-span-5">
            <ComplianceConsole
              linterResult={linterResult}
              onApplyQuickFix={handleApplyQuickFix}
              onApplyAllQuickFixes={handleApplyAllQuickFixes}
              onOpenPdf={() => setIsPdfModalOpen(true)}
              onOpenDocuSign={() => setIsDocuSignModalOpen(true)}
              onOpenAi={() => setIsAiDrawerOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Footer Banner */}
      <footer className="border-t-3 border-black bg-white py-4 px-6 text-center text-xs font-mono font-bold">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            ZeroNIGO &bull; High-Net-Worth Wealth Onboarding Semantic Compiler
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="text-brutalViolet hover:underline font-extrabold"
            >
              (?) Master Learning Deck &amp; Architecture
            </button>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">
              FINRA 2111/2090 Suitability &bull; FinCEN CDD &bull; AcroForm Projector
            </span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <PdfViewerModal
        packet={currentPacket}
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

      <DocuSignModal
        packet={currentPacket}
        isOpen={isDocuSignModalOpen}
        onClose={() => setIsDocuSignModalOpen(false)}
        onEnvelopeCompleted={handleEnvelopeCompleted}
      />

      <AiRemediationDrawer
        packet={currentPacket}
        issues={linterResult.issues}
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
      />

      <AuditLedgerModal
        auditLogs={auditLogs}
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        packetId={currentPacket.packetId}
      />

      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
      />
    </div>
  );
};
