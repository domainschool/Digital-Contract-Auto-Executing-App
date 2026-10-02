import React from 'react';
import { OnboardingPacket, AccountEntity, RiskTolerance, OptionsTier, SignerRole } from '../types/onboarding';
import { MOCK_PACKETS } from '../data/mockPackets';
import { Building2, Landmark, ShieldAlert, Plus, Trash2, CheckSquare, Square } from 'lucide-react';

interface IntakeFormProps {
  packet: OnboardingPacket;
  onUpdatePacket: (updated: OnboardingPacket, reason?: string) => void;
  onSelectPreset: (preset: OnboardingPacket) => void;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({
  packet,
  onUpdatePacket,
  onSelectPreset,
}) => {
  const handleTextChange = (field: keyof OnboardingPacket, val: any) => {
    onUpdatePacket({ ...packet, [field]: val }, `Updated ${String(field)} to "${val}"`);
  };

  const handleFinancialChange = (field: keyof OnboardingPacket['financialProfile'], val: any) => {
    onUpdatePacket(
      {
        ...packet,
        financialProfile: {
          ...packet.financialProfile,
          [field]: val,
        },
      },
      `Updated financial profile: ${String(field)}`
    );
  };

  const handleTradingChange = (field: keyof OnboardingPacket['tradingPrivileges'], val: any) => {
    onUpdatePacket(
      {
        ...packet,
        tradingPrivileges: {
          ...packet.tradingPrivileges,
          [field]: val,
        },
      },
      `Updated trading privilege: ${String(field)}`
    );
  };

  const handleSignerChange = (idx: number, field: string, val: any) => {
    const updatedSigners = packet.signers.map((s, i) => {
      if (i === idx) {
        return { ...s, [field]: val };
      }
      return s;
    });
    onUpdatePacket({ ...packet, signers: updatedSigners }, `Updated signer #${idx + 1} (${field})`);
  };

  const handleAddSigner = () => {
    const newSigner = {
      id: `sgn-${Date.now()}`,
      fullName: 'New Co-Trustee / Member',
      email: 'new.signer@holdings.com',
      role: 'CO_TRUSTEE' as SignerRole,
      hasSigned: false,
      orderIndex: packet.signers.length + 1,
      ssnProvided: true,
      ownershipPercentage: 0,
    };
    onUpdatePacket({ ...packet, signers: [...packet.signers, newSigner] }, 'Added new signer to roster');
  };

  const handleRemoveSigner = (idx: number) => {
    if (packet.signers.length <= 1) return;
    const updated = packet.signers.filter((_, i) => i !== idx);
    onUpdatePacket({ ...packet, signers: updated }, `Removed signer #${idx + 1}`);
  };

  return (
    <div className="space-y-6">
      {/* Preset Test Scenarios Selector */}
      <div className="bg-white border-3 border-black p-4 brutal-shadow">
        <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-black" />
            <h2 className="text-sm font-extrabold font-heading uppercase">
              1. Select Test Onboarding Scenario
            </h2>
          </div>
          <span className="text-[11px] font-mono text-gray-500 font-bold">SYNTHETIC RIA PACKETS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MOCK_PACKETS.map(preset => {
            const isSelected = preset.packetId === packet.packetId;
            const isClean = preset.packetId.includes('CLEAN');
            return (
              <button
                key={preset.packetId}
                onClick={() => onSelectPreset(preset)}
                className={`text-left p-2.5 border-2 border-black transition-all ${
                  isSelected
                    ? 'bg-brutalYellow font-extrabold brutal-shadow'
                    : 'bg-canvas hover:bg-canvasMuted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold">{preset.packetId}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 border border-black ${
                      isClean ? 'bg-brutalLime text-black' : 'bg-brutalPink text-white'
                    }`}
                  >
                    {isClean ? 'CLEAN (100% IGO)' : 'NIGO TEST CASE'}
                  </span>
                </div>
                <div className="text-xs font-heading font-extrabold truncate mt-1">
                  {preset.legalTitle}
                </div>
                <div className="text-[10px] font-mono text-gray-600 mt-0.5">
                  {preset.entityType} | {preset.custodian.split('_')[0]} | ${ (preset.targetAUM / 1000000).toFixed(1) }M AUM
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Intake Editor */}
      <div className="bg-white border-3 border-black p-5 brutal-shadow space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brutalViolet" />
            <h2 className="text-base font-extrabold font-heading uppercase">
              2. Account Registration & Entity Titling
            </h2>
          </div>
          <span className="brutal-badge bg-brutalCyan text-black">
            Intake Layer
          </span>
        </div>

        {/* Entity Type & Custodian Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Entity Structure Type</label>
            <select
              value={packet.entityType}
              onChange={e => handleTextChange('entityType', e.target.value as AccountEntity)}
              className="brutal-input w-full font-bold"
            >
              <option value="INDIVIDUAL">INDIVIDUAL (Single Principal)</option>
              <option value="REVOCABLE_TRUST">REVOCABLE LIVING TRUST</option>
              <option value="IRREVOCABLE_TRUST">IRREVOCABLE DYNASTY TRUST</option>
              <option value="CORPORATE_LLC">CORPORATE LLC / ENTITY</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Clearing Custodian Platform</label>
            <select
              value={packet.custodian}
              onChange={e => handleTextChange('custodian', e.target.value)}
              className="brutal-input w-full font-bold"
            >
              <option value="SCHWAB_INSTITUTIONAL">Charles Schwab Institutional</option>
              <option value="FIDELITY_IWS">Fidelity Institutional Wealth Services</option>
              <option value="BNY_PERSHING">BNY Mellon Pershing Advisor Solutions</option>
            </select>
          </div>
        </div>

        {/* Cross-Schedule Titling Test Area */}
        <div className="p-3 bg-canvas border-2 border-black space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-brutalPink" />
              Cross-Schedule Titling Alignment (ACATS / Custody)
            </span>
            <button
              onClick={() => handleTextChange('legalTitle', packet.advisoryAgreementTitle)}
              className="text-[10px] bg-brutalLime border border-black px-2 py-0.5 font-bold hover:underline"
              title="Sync title character-for-character"
            >
              Sync Titling
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-gray-700">
              A. Custodial Application Account Title:
            </label>
            <input
              type="text"
              value={packet.legalTitle}
              onChange={e => handleTextChange('legalTitle', e.target.value)}
              className="brutal-input w-full font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-gray-700">
              B. RIA Discretionary Advisory Agreement Title:
            </label>
            <input
              type="text"
              value={packet.advisoryAgreementTitle}
              onChange={e => handleTextChange('advisoryAgreementTitle', e.target.value)}
              className="brutal-input w-full font-mono text-xs bg-gray-50"
            />
          </div>

          {packet.legalTitle !== packet.advisoryAgreementTitle && (
            <div className="text-[11px] font-mono text-red-700 font-bold bg-red-100 p-2 border border-red-500">
              ⚠️ TITLING MISMATCH DETECTED: Custodian title does not match Advisory Agreement title. Will trigger automatic NIGO rejection.
            </div>
          )}
        </div>

        {/* Tax ID & Target AUM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">
              Tax ID (EIN for Entity / SSN for Individual)
            </label>
            <input
              type="text"
              value={packet.taxId}
              onChange={e => handleTextChange('taxId', e.target.value)}
              placeholder="XX-XXXXXXX or XXX-XX-XXXX"
              className="brutal-input w-full font-mono text-sm"
            />
            <span className="text-[10px] font-mono text-gray-500 mt-1 block">
              Format: EIN `12-3456789` or SSN `123-45-6789`
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Target Account AUM ($ USD)</label>
            <input
              type="number"
              value={packet.targetAUM}
              onChange={e => handleTextChange('targetAUM', Number(e.target.value))}
              className="brutal-input w-full font-mono text-sm"
            />
          </div>
        </div>

        {/* Section 2: FINRA 2111 Suitability & Financial Profile */}
        <div className="border-t-2 border-black pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold font-heading uppercase">
              3. FINRA Rule 2111 / 2090 Financial Suitability Profile
            </h3>
            <span className="brutal-badge bg-brutalYellow text-black">Reg BI Suite</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase mb-1">Annual Realized Income ($)</label>
              <input
                type="number"
                value={packet.financialProfile.annualIncome}
                onChange={e => handleFinancialChange('annualIncome', Number(e.target.value))}
                className="brutal-input w-full font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase mb-1">Liquid Net Worth ($)</label>
              <input
                type="number"
                value={packet.financialProfile.liquidNetWorth}
                onChange={e => handleFinancialChange('liquidNetWorth', Number(e.target.value))}
                className="brutal-input w-full font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase mb-1">Total Net Worth ($)</label>
              <input
                type="number"
                value={packet.financialProfile.totalNetWorth}
                onChange={e => handleFinancialChange('totalNetWorth', Number(e.target.value))}
                className="brutal-input w-full font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase mb-1">Risk Tolerance Mandate</label>
              <select
                value={packet.financialProfile.riskTolerance}
                onChange={e => handleFinancialChange('riskTolerance', e.target.value as RiskTolerance)}
                className="brutal-input w-full text-xs font-bold"
              >
                <option value="CONSERVATIVE">CONSERVATIVE (Capital Pres.)</option>
                <option value="MODERATE">MODERATE (Balanced Income)</option>
                <option value="GROWTH">GROWTH (Capital Apprec.)</option>
                <option value="AGGRESSIVE">AGGRESSIVE (Max Speculation)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase mb-1">Trading Experience</label>
              <select
                value={packet.financialProfile.investmentExperienceYears}
                onChange={e => handleFinancialChange('investmentExperienceYears', Number(e.target.value))}
                className="brutal-input w-full text-xs font-bold"
              >
                <option value={0}>&lt; 1 Year (Novice)</option>
                <option value={2}>2 Years (Intermediate)</option>
                <option value={5}>5 Years (Experienced)</option>
                <option value={15}>15+ Years (Veteran / Pro)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase mb-1">Liquidity Needs</label>
              <select
                value={packet.financialProfile.liquidityNeeds}
                onChange={e => handleFinancialChange('liquidityNeeds', e.target.value)}
                className="brutal-input w-full text-xs font-bold"
              >
                <option value="LOW">LOW (&gt; 5 Year Horizon)</option>
                <option value="MEDIUM">MEDIUM (2 - 5 Years)</option>
                <option value="HIGH">HIGH (&lt; 2 Years)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Regulatory Trading Privileges */}
        <div className="border-t-2 border-black pt-4 space-y-4">
          <h3 className="text-sm font-extrabold font-heading uppercase">
            4. Regulatory Trading Privileges & Credit Extension
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => handleTradingChange('marginRequested', !packet.tradingPrivileges.marginRequested)}
              className={`p-3 border-2 border-black cursor-pointer flex items-center justify-between transition-all ${
                packet.tradingPrivileges.marginRequested ? 'bg-brutalYellow brutal-shadow' : 'bg-white'
              }`}
            >
              <div>
                <div className="font-heading font-extrabold text-xs uppercase">
                  Margin Borrowing Authorization
                </div>
                <div className="text-[10px] font-mono text-gray-600 mt-0.5">
                  Requires &gt;=$50k liquid net worth &amp; Non-Conservative risk
                </div>
              </div>
              <div>
                {packet.tradingPrivileges.marginRequested ? (
                  <CheckSquare className="w-5 h-5 text-black" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase mb-1">Options Authorization Tier</label>
              <select
                value={packet.tradingPrivileges.optionsTier}
                onChange={e => handleTradingChange('optionsTier', e.target.value as OptionsTier)}
                className="brutal-input w-full text-xs font-bold"
              >
                <option value="NONE">NONE (No Options Privileges)</option>
                <option value="TIER_1_COVERED">TIER 1 (Covered Equity Calls/Cash-Sec Puts)</option>
                <option value="TIER_2_LONG">TIER 2 (Long Calls, Puts &amp; Straddles)</option>
                <option value="TIER_3_UNCOVERED">TIER 3 (Uncovered Naked Writes &amp; Spreads)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Multi-Signer Matrix & Sequential Routing Order */}
        <div className="border-t-2 border-black pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold font-heading uppercase">
                5. Multi-Party Signatory Roster &amp; Routing Hierarchy
              </h3>
              <p className="text-[10px] font-mono text-gray-500">
                DocuSign `routingOrder` executes sequentially (1 -&gt; 2 -&gt; 3)
              </p>
            </div>
            <button
              onClick={handleAddSigner}
              className="brutal-btn bg-brutalLime text-black text-xs px-2.5 py-1 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Signer</span>
            </button>
          </div>

          <div className="space-y-3">
            {packet.signers.map((signer, idx) => (
              <div
                key={signer.id}
                className="p-3 bg-canvas border-2 border-black brutal-shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-white font-mono text-xs px-1.5 py-0.5 font-bold">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold uppercase">Routing Order: {signer.orderIndex}</span>
                  </div>
                  {packet.signers.length > 1 && (
                    <button
                      onClick={() => handleRemoveSigner(idx)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Remove Signer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase">Full Legal Name</label>
                    <input
                      type="text"
                      value={signer.fullName}
                      onChange={e => handleSignerChange(idx, 'fullName', e.target.value)}
                      className="brutal-input w-full text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase">Email Address</label>
                    <input
                      type="email"
                      value={signer.email}
                      onChange={e => handleSignerChange(idx, 'email', e.target.value)}
                      className="brutal-input w-full text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase">Signatory Role</label>
                    <select
                      value={signer.role}
                      onChange={e => handleSignerChange(idx, 'role', e.target.value as SignerRole)}
                      className="brutal-input w-full text-xs font-bold"
                    >
                      <option value="PRIMARY_TRUSTEE">PRIMARY TRUSTEE</option>
                      <option value="CO_TRUSTEE">CO-TRUSTEE / CORPORATE</option>
                      <option value="GRANTOR">GRANTOR / SETTLOR</option>
                      <option value="MANAGING_MEMBER">MANAGING MEMBER (LLC)</option>
                      <option value="BENEFICIAL_OWNER">BENEFICIAL OWNER (&gt;=25%)</option>
                      <option value="WEALTH_ADVISOR">WEALTH ADVISOR (Countersign)</option>
                    </select>
                  </div>
                </div>

                {/* Beneficial Ownership FinCEN CDD Fields */}
                <div className="flex items-center gap-4 text-xs font-mono pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={signer.ssnProvided ?? true}
                      onChange={e => handleSignerChange(idx, 'ssnProvided', e.target.checked)}
                      className="w-3.5 h-3.5 accent-black"
                    />
                    <span>FinCEN SSN / ID Disclosed</span>
                  </label>

                  <div className="flex items-center gap-1">
                    <span>Equity Ownership %:</span>
                    <input
                      type="number"
                      value={signer.ownershipPercentage ?? 0}
                      onChange={e => handleSignerChange(idx, 'ownershipPercentage', Number(e.target.value))}
                      className="w-16 px-1 py-0.5 border border-black font-mono text-xs"
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
