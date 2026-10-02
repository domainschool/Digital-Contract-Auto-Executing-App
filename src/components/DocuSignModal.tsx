import React, { useState, useEffect } from 'react';
import { OnboardingPacket } from '../types/onboarding';
import { initializeEnvelopeSession, advanceSignerState, EnvelopeSession } from '../lib/docusign/orchestrator';
import { X, Send, CheckCircle2, UserCheck, RefreshCw, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DocuSignModalProps {
  packet: OnboardingPacket;
  isOpen: boolean;
  onClose: () => void;
  onEnvelopeCompleted: (session: EnvelopeSession) => void;
}

export const DocuSignModal: React.FC<DocuSignModalProps> = ({
  packet,
  isOpen,
  onClose,
  onEnvelopeCompleted,
}) => {
  const [session, setSession] = useState<EnvelopeSession | null>(null);
  const [webhookLogs, setWebhookLogs] = useState<Array<{ timestamp: string; event: string; detail: string }>>([]);

  useEffect(() => {
    if (isOpen) {
      const initial = initializeEnvelopeSession(packet);
      setSession(initial);
      setWebhookLogs([
        {
          timestamp: new Date().toLocaleTimeString(),
          event: 'ENVELOPE_CREATED',
          detail: `DocuSign REST API: Envelope ${initial.envelopeId} created with ${initial.recipients.length} sequential signers.`,
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          event: 'NOTIFICATION_DISPATCHED',
          detail: `Email sent to Signer #1 (${initial.recipients[0]?.name}) at ${initial.recipients[0]?.email}.`,
        },
      ]);
    }
  }, [isOpen, packet]);

  if (!isOpen || !session) return null;

  const handleSignAction = (recipientId: string, action: 'SIGN' | 'DECLINE') => {
    const updated = advanceSignerState(session, recipientId, action);
    setSession(updated);

    const target = session.recipients.find(r => r.recipientId === recipientId);

    const newLog = {
      timestamp: new Date().toLocaleTimeString(),
      event: action === 'SIGN' ? 'RECIPIENT_SIGNED' : 'RECIPIENT_DECLINED',
      detail: `${target?.name} (${target?.role}) ${action === 'SIGN' ? 'digitally signed and authenticated' : 'declined envelope'}.`,
    };

    const nextRecipient = updated.recipients.find(r => r.status === 'SENT');
    const logsToAdd = [newLog];

    if (nextRecipient && action === 'SIGN') {
      logsToAdd.push({
        timestamp: new Date().toLocaleTimeString(),
        event: 'SEQUENTIAL_STEP_ADVANCED',
        detail: `Sequential routingOrder advanced. Dispatched notification to Signer #${nextRecipient.routingOrder} (${nextRecipient.name}).`,
      });
    }

    if (updated.clearedByCustodian) {
      logsToAdd.push({
        timestamp: new Date().toLocaleTimeString(),
        event: 'CUSTODIAL_AUTO_CLEARANCE',
        detail: `100% IN GOOD ORDER: Custodial Clearing operations accepted packet. Ack #: ${updated.custodianAckNumber}`,
      });

      // Confetti celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      onEnvelopeCompleted(updated);
    }

    setWebhookLogs(prev => [...logsToAdd, ...prev]);
  };

  const handleFastForwardAll = () => {
    let curr = session;
    for (const r of curr.recipients) {
      if (r.status !== 'SIGNED') {
        curr = advanceSignerState(curr, r.recipientId, 'SIGN');
      }
    }
    setSession(curr);
    setWebhookLogs(prev => [
      {
        timestamp: new Date().toLocaleTimeString(),
        event: 'CUSTODIAL_AUTO_CLEARANCE',
        detail: `FAST-FORWARD: All multi-party signatures executed. Custodian clearing acknowledged (${curr.custodianAckNumber}).`,
      },
      ...prev,
    ]);
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
    onEnvelopeCompleted(curr);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-canvas border-4 border-black w-full max-w-4xl h-[88vh] brutal-shadow-xl flex flex-col">
        {/* Header */}
        <div className="bg-brutalPink text-white border-b-3 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            <div>
              <h3 className="font-heading font-extrabold text-base uppercase">
                DocuSign Sequential Execution Orchestrator
              </h3>
              <p className="text-[11px] font-mono text-white/90">
                Live State Machine: Role-Based Routing Order (Primary Trustee &rarr; Co-Trustee &rarr; RIA Advisor)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFastForwardAll}
              className="brutal-btn bg-brutalLime text-black text-xs px-3 py-1.5 flex items-center gap-1.5 font-extrabold"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>Simulate All Signatures</span>
            </button>

            <button
              onClick={onClose}
              className="brutal-btn bg-white hover:bg-black hover:text-white text-black p-1.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 bg-white p-5 overflow-y-auto space-y-6">
          {/* Envelope Status Strip */}
          <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase text-gray-500">
                DocuSign Envelope ID
              </div>
              <div className="font-mono font-extrabold text-sm text-black">
                {session.envelopeId}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase text-gray-500">
                Current Routing Status
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`brutal-badge text-xs ${
                    session.clearedByCustodian
                      ? 'bg-brutalLime text-black'
                      : session.status === 'DECLINED'
                      ? 'bg-red-500 text-white'
                      : 'bg-brutalYellow text-black'
                  }`}
                >
                  {session.clearedByCustodian
                    ? '100% IN GOOD ORDER - CLEARED BY CUSTODIAN'
                    : `ROUTING STAGE: ORDER #${session.currentRoutingOrder}`}
                </span>
              </div>
            </div>

            {session.custodianAckNumber && (
              <div className="space-y-1 text-right">
                <div className="text-[10px] font-mono font-bold uppercase text-gray-500">
                  Clearing Ack #
                </div>
                <div className="font-mono font-extrabold text-xs text-brutalViolet">
                  {session.custodianAckNumber}
                </div>
              </div>
            )}
          </div>

          {/* Sequential Recipient Pipeline */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-sm uppercase">
              Sequential Recipient Pipeline (`routingOrder`)
            </h4>

            <div className="space-y-3">
              {session.recipients.map((recipient) => {
                const isCurrent = recipient.status === 'SENT';
                const isSigned = recipient.status === 'SIGNED';
                const isWaiting = recipient.status === 'WAITING';
                const isDeclined = recipient.status === 'DECLINED';

                return (
                  <div
                    key={recipient.recipientId}
                    className={`p-4 border-2 border-black transition-all ${
                      isCurrent
                        ? 'bg-brutalYellow brutal-shadow'
                        : isSigned
                        ? 'bg-lime-50 border-brutalLime'
                        : isDeclined
                        ? 'bg-pink-50 border-brutalPink'
                        : 'bg-canvas opacity-70'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 border-2 border-black font-mono font-extrabold flex items-center justify-center text-xs ${
                            isSigned
                              ? 'bg-brutalLime text-black'
                              : isCurrent
                              ? 'bg-black text-white'
                              : 'bg-white text-black'
                          }`}
                        >
                          {isSigned ? <CheckCircle2 className="w-5 h-5" /> : `#${recipient.routingOrder}`}
                        </div>

                        <div>
                          <div className="font-heading font-extrabold text-sm text-black">
                            {recipient.name}
                          </div>
                          <div className="text-xs font-mono text-gray-700">
                            {recipient.role} &bull; {recipient.email} &bull; Tab: <span className="font-bold text-brutalViolet">{recipient.tabTag}</span>
                          </div>
                        </div>
                      </div>

                      {/* Recipient Actions */}
                      <div className="flex items-center gap-2">
                        {isWaiting && (
                          <span className="text-[11px] font-mono text-gray-500 font-bold bg-gray-200 px-2.5 py-1 border border-black">
                            WAITING FOR PREVIOUS SIGNER
                          </span>
                        )}

                        {isSigned && (
                          <div className="text-right">
                            <span className="brutal-badge bg-brutalLime text-black text-[10px]">
                              DIGITALLY SIGNED &amp; VERIFIED
                            </span>
                            <div className="text-[9px] font-mono text-gray-500 mt-0.5">
                              {recipient.signedAt ? new Date(recipient.signedAt).toLocaleTimeString() : 'Verified'}
                            </div>
                          </div>
                        )}

                        {isCurrent && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSignAction(recipient.recipientId, 'SIGN')}
                              className="brutal-btn bg-brutalLime hover:bg-lime-400 text-black text-xs px-3 py-1.5 flex items-center gap-1 font-extrabold"
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>Execute E-Signature</span>
                            </button>
                            <button
                              onClick={() => handleSignAction(recipient.recipientId, 'DECLINE')}
                              className="brutal-btn bg-white hover:bg-brutalPink hover:text-white text-black text-xs px-2.5 py-1.5"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Webhook & Event Log Terminal */}
          <div className="space-y-2">
            <h4 className="font-heading font-extrabold text-sm uppercase flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-brutalViolet" />
              DocuSign Connect &amp; Custodial Webhook Stream
            </h4>
            <div className="bg-black text-green-400 p-3 font-mono text-[11px] border-2 border-black h-36 overflow-y-auto space-y-1">
              {webhookLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-gray-500">[{log.timestamp}]</span>
                  <span className="text-yellow-400 font-bold">{log.event}:</span>
                  <span className="text-gray-200">{log.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-canvas border-t-2 border-black p-3 px-4 flex items-center justify-between">
          <div className="text-xs font-mono text-gray-700">
            {session.clearedByCustodian
              ? '✅ Zero NIGO Guaranteed: Account active at Custodian clearing house.'
              : 'Sequential signing state machine prevents signer race conditions.'}
          </div>
          <button
            onClick={onClose}
            className="brutal-btn bg-black text-white text-xs px-4 py-1.5"
          >
            Close Orchestrator
          </button>
        </div>
      </div>
    </div>
  );
};
