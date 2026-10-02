import React from 'react';
import { X, BarChart3, TrendingUp, Clock, DollarSign, ShieldCheck } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NIGO_CAUSES_DATA = [
  { cause: 'Entity Titling Mismatch', percentage: 38, count: 184 },
  { cause: 'FINRA 2111 Suitability', percentage: 27, count: 131 },
  { cause: 'Missing Signers/Trustees', percentage: 19, count: 92 },
  { cause: 'FinCEN CDD Info Omission', percentage: 11, count: 53 },
  { cause: 'Tax ID / EIN Syntax', percentage: 5, count: 24 },
];

const CYCLE_TIME_DATA = [
  { stage: 'Data Intake', legacyDays: 2.5, zeroNigoDays: 0.2 },
  { stage: 'Internal Review', legacyDays: 4.0, zeroNigoDays: 0.1 },
  { stage: 'DocuSign Routing', legacyDays: 3.5, zeroNigoDays: 1.2 },
  { stage: 'Custodial Clearing', legacyDays: 6.0, zeroNigoDays: 0.5 },
];

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-canvas border-4 border-black w-full max-w-5xl h-[88vh] brutal-shadow-xl flex flex-col">
        {/* Header */}
        <div className="bg-brutalLime text-black border-b-3 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            <div>
              <h3 className="font-heading font-extrabold text-base uppercase">
                ZeroNIGO Operational ROI &amp; Institutional Analytics
              </h3>
              <p className="text-[11px] font-mono font-bold text-black/80">
                Quantitative Remediation Labor Savings, Cycle Times &amp; IGO Velocity
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

        {/* Content */}
        <div className="flex-1 bg-white p-5 overflow-y-auto space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm">
              <div className="flex items-center justify-between text-gray-600 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase">First-Time IGO Rate</span>
                <ShieldCheck className="w-4 h-4 text-green-700" />
              </div>
              <div className="text-2xl font-extrabold font-heading text-black">98.6%</div>
              <div className="text-[10px] font-mono text-green-700 font-bold mt-1">
                &uarr; Up from 62% industry baseline
              </div>
            </div>

            <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm">
              <div className="flex items-center justify-between text-gray-600 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase">Average Cycle Time</span>
                <Clock className="w-4 h-4 text-brutalViolet" />
              </div>
              <div className="text-2xl font-extrabold font-heading text-black">2.0 Days</div>
              <div className="text-[10px] font-mono text-green-700 font-bold mt-1">
                &darr; Reduced from 16.0 days (-87%)
              </div>
            </div>

            <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm">
              <div className="flex items-center justify-between text-gray-600 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase">Labor Remediation ROI</span>
                <DollarSign className="w-4 h-4 text-brutalPink" />
              </div>
              <div className="text-2xl font-extrabold font-heading text-black">$145,200</div>
              <div className="text-[10px] font-mono text-black font-bold mt-1">
                Saved @ $300 per avoided NIGO
              </div>
            </div>

            <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm">
              <div className="flex items-center justify-between text-gray-600 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase">Active AUM Pipeline</span>
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-extrabold font-heading text-black">$53.6M</div>
              <div className="text-[10px] font-mono text-black font-bold mt-1">
                Across 4 onboarding packets
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Chart 1: Top NIGO Causes */}
            <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm space-y-2">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <h4 className="font-heading font-extrabold text-xs uppercase">
                  Top Historical NIGO Causes by Volume
                </h4>
                <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 border border-black">
                  484 Incidents Analyzed
                </span>
              </div>

              <div className="h-56 w-full font-mono text-xs pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={NIGO_CAUSES_DATA} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis type="number" stroke="#000" />
                    <YAxis dataKey="cause" type="category" width={110} tick={{ fontSize: 10, fill: '#000' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FEF08A', border: '2px solid #000', borderRadius: 0 }}
                      formatter={(val: any) => [`${val}% of Rejects`, 'Frequency']}
                    />
                    <Bar dataKey="percentage" fill="#FF2A85" stroke="#000" strokeWidth={1.5} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Cycle Time Comparison */}
            <div className="p-4 bg-canvas border-3 border-black brutal-shadow-sm space-y-2">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <h4 className="font-heading font-extrabold text-xs uppercase">
                  Cycle Time Reduction: Legacy vs ZeroNIGO (Days)
                </h4>
                <span className="text-[10px] font-mono font-bold bg-brutalLime px-2 py-0.5 border border-black">
                  87% Time Saved
                </span>
              </div>

              <div className="h-56 w-full font-mono text-xs pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CYCLE_TIME_DATA} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#000' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#000' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFDF0', border: '2px solid #000', borderRadius: 0 }}
                    />
                    <Area type="monotone" dataKey="legacyDays" name="Legacy Passive Flow" stroke="#000" fill="#FEF08A" />
                    <Area type="monotone" dataKey="zeroNigoDays" name="ZeroNIGO Pre-Flight" stroke="#000" fill="#A3E635" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-canvas border-t-2 border-black p-3 px-4 flex items-center justify-between text-xs font-mono">
          <div className="text-gray-700">
            Analytics benchmarked against SEC/FINRA clearing metrics and RIA operations studies.
          </div>
          <button
            onClick={onClose}
            className="brutal-btn bg-black text-white text-xs px-4 py-1.5"
          >
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
};
