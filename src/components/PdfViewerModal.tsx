import React, { useEffect, useState } from 'react';
import { OnboardingPacket } from '../types/onboarding';
import { generateCustodialPdf, CoordinateAnchor } from '../lib/pdf/coordinateMapper';
import { X, Download, FileCode, RefreshCw } from 'lucide-react';

interface PdfViewerModalProps {
  packet: OnboardingPacket;
  isOpen: boolean;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  packet,
  isOpen,
  onClose,
}) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [anchors, setAnchors] = useState<CoordinateAnchor[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'PDF' | 'COORDINATES'>('PDF');

  useEffect(() => {
    if (isOpen) {
      handleGenerate();
    }
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [isOpen, packet]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { blobUrl, anchors: genAnchors } = await generateCustodialPdf(packet);
      setPdfBlobUrl(blobUrl);
      setAnchors(genAnchors);
    } catch (err) {
      console.error('PDF Generation Failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-canvas border-4 border-black w-full max-w-5xl h-[88vh] brutal-shadow-xl flex flex-col">
        {/* Modal Header */}
        <div className="bg-brutalYellow border-b-3 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-black" />
            <div>
              <h3 className="font-heading font-extrabold text-base uppercase">
                AcroForm Coordinate Projector &amp; PDF Compiler
              </h3>
              <p className="text-[11px] font-mono text-gray-700">
                Programmatically binds validated data to custodial coordinate bounding boxes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white border-2 border-black flex">
              <button
                onClick={() => setActiveTab('PDF')}
                className={`px-3 py-1 text-xs font-mono font-bold ${
                  activeTab === 'PDF' ? 'bg-black text-white' : 'hover:bg-gray-100'
                }`}
              >
                Rendered PDF Preview
              </button>
              <button
                onClick={() => setActiveTab('COORDINATES')}
                className={`px-3 py-1 text-xs font-mono font-bold ${
                  activeTab === 'COORDINATES' ? 'bg-black text-white' : 'hover:bg-gray-100'
                }`}
              >
                Anchor Coordinates ({anchors.length})
              </button>
            </div>

            {pdfBlobUrl && (
              <a
                href={pdfBlobUrl}
                download={`ZeroNIGO-${packet.packetId}-Custodial-Application.pdf`}
                className="brutal-btn bg-brutalLime text-black text-xs px-3 py-1.5 flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="brutal-btn bg-white hover:bg-brutalPink hover:text-white p-1.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 bg-white p-4 overflow-hidden flex flex-col">
          {isGenerating ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-brutalPink" />
              <div className="font-mono text-xs font-bold uppercase">
                Compiling multi-page AcroForm coordinate matrix with `pdf-lib`...
              </div>
            </div>
          ) : activeTab === 'PDF' ? (
            pdfBlobUrl ? (
              <div className="flex-1 border-2 border-black relative">
                <iframe
                  src={pdfBlobUrl}
                  title="PDF Preview"
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center font-mono text-xs">
                Failed to load PDF preview.
              </div>
            )
          ) : (
            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="bg-canvas border-2 border-black p-3">
                <h4 className="font-heading font-extrabold text-xs uppercase mb-1">
                  Programmatic Tab Anchor Specifications
                </h4>
                <p className="text-xs font-mono text-gray-700">
                  ZeroNIGO automatically calculates absolute coordinate bounding boxes for DocuSign composite templates, preventing misaligned e-signature overlays.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {anchors.map((anchor, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white border-2 border-black brutal-shadow-sm space-y-1 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold bg-brutalViolet text-white px-1.5 py-0.5 border border-black text-[10px]">
                        {anchor.tag}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500">Page {anchor.page}</span>
                    </div>
                    <div className="font-bold text-sm text-black">{anchor.label}</div>
                    <div className="text-gray-600 text-[11px]">Role: {anchor.signerRole}</div>
                    <div className="grid grid-cols-4 gap-1 bg-canvas p-1.5 border border-black/30 text-[10px] mt-2">
                      <div><span className="text-gray-500">X:</span> {anchor.x}px</div>
                      <div><span className="text-gray-500">Y:</span> {anchor.y}px</div>
                      <div><span className="text-gray-500">W:</span> {anchor.width}px</div>
                      <div><span className="text-gray-500">H:</span> {anchor.height}px</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="bg-canvas border-t-2 border-black p-2.5 px-4 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold">Target Form:</span> Standard Custodial Master Onboarding Application v4.2
          </div>
          <div className="text-gray-600 font-bold">
            Status: Ready for Composite Template Injection
          </div>
        </div>
      </div>
    </div>
  );
};
