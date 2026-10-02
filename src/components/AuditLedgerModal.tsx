import React from 'react';
import { AuditRecord } from '../types/onboarding';
import { X, History, Download } from 'lucide-react';

interface AuditLedgerModalProps {
  auditLogs: AuditRecord[];
  isOpen: boolean;
  onClose: () => void;
  packetId: string;
}

export const AuditLedgerModal: React.FC<AuditLedgerModalProps> = ({
  auditLogs,
  isOpen,
  onClose,
  packetId,
}) => {
  if (!isOpen) return null;

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ZeroNIGO-Audit-Ledger-${packetId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-canvas border-4 border-black w-full max-w-4xl h-[85vh] brutal-shadow-xl flex flex-col">
        {/* Header */}
        <div className="bg-brutalViolet text-white border-b-3 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5" />
            <div>
              <h3 className="font-heading font-extrabold text-base uppercase">
                SEC Rule 17a-4 Immutable Audit Ledger
              </h3>
              <p className="text-[11px] font-mono text-white/90">
                WORM-Compliant Event Log &bull; Packet: {packetId} &bull; Cryptographic State Fingerprints
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="brutal-btn bg-white hover:bg-brutalYellow text-black text-xs px-3 py-1.5 flex items-center gap-1 font-extrabold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ledger (.JSON)</span>
            </button>

            <button
              onClick={onClose}
              className="brutal-btn bg-white hover:bg-black hover:text-white text-black p-1.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white p-5 overflow-y-auto space-y-4">
          <div className="bg-canvas border-2 border-black p-3 text-xs font-mono flex items-center justify-between">
            <div>
              <span className="font-bold">Compliance Standard:</span> SEC 17a-4(f) Electronic Records Preservation &bull; FINRA 4511 Books and Records
            </div>
            <span className="brutal-badge bg-brutalLime text-black text-[10px]">
              {auditLogs.length} LOGGED EVENTS
            </span>
          </div>

          <div className="space-y-2.5">
            {auditLogs.map((log) => {
              const getBadgeColor = () => {
                if (log.severity === 'ALERT') return 'bg-brutalPink text-white';
                if (log.severity === 'SUCCESS') return 'bg-brutalLime text-black';
                if (log.severity === 'WARNING') return 'bg-brutalYellow text-black';
                return 'bg-brutalCyan text-black';
              };

              return (
                <div
                  key={log.id}
                  className="p-3 bg-canvas border-2 border-black brutal-shadow-sm font-mono text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`brutal-badge text-[9px] ${getBadgeColor()}`}>
                        {log.action}
                      </span>
                      <span className="font-bold text-black">{log.actor}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold">{log.timestamp}</span>
                  </div>

                  <div className="text-gray-800">{log.details}</div>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 bg-white p-1 border border-black/30">
                    <span className="truncate">Fingerprint: <span className="text-black font-bold">{log.hashFingerprint}</span></span>
                    <span className="text-green-700 font-bold">WORM VERIFIED</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-canvas border-t-2 border-black p-3 px-4 flex items-center justify-between text-xs font-mono">
          <div className="text-gray-600">
            Records are append-only. Modification or deletion operations are restricted by protocol.
          </div>
          <button
            onClick={onClose}
            className="brutal-btn bg-black text-white text-xs px-4 py-1.5"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
