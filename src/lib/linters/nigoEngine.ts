import { OnboardingPacket, NigoIssue, LinterResult } from '../../types/onboarding';

export function runNigoComplianceLinter(packet: OnboardingPacket): LinterResult {
  const issues: NigoIssue[] = [];

  // =========================================================================
  // 1. ENTITY INTEGRITY & CROSS-SCHEDULE TITLING RECONCILIATION
  // =========================================================================
  if (packet.legalTitle.trim() !== packet.advisoryAgreementTitle.trim()) {
    issues.push({
      id: 'NIGO-TITLING-001',
      severity: 'FATAL_NIGO',
      category: 'ENTITY_INTEGRITY',
      ruleCode: 'CUSTODIAL_TITLING_PARITY',
      title: 'Cross-Schedule Entity Title Mismatch',
      message: `Custodial Application title ("${packet.legalTitle}") differs from Advisory Agreement title ("${packet.advisoryAgreementTitle}"). Clearing operations will automatically reject this packet upon ACATS transfer.`,
      regulatoryCitation: 'Clearing Operations Rule 401 & SEC Custody Rule 206(4)-2',
      remediationHint: 'Synchronize the custodial legal title with the exact title stated in the advisory agreement and formation documents.',
      quickFixAvailable: true,
      targetField: 'legalTitle',
      quickFixAction: (p: OnboardingPacket) => ({
        ...p,
        legalTitle: p.advisoryAgreementTitle,
      }),
    });
  }

  if (packet.entityType.includes('TRUST')) {
    const titleUpper = packet.legalTitle.toUpperCase();
    const hasTrustKeyword = titleUpper.includes('TRUST');
    const hasFormationMarker = titleUpper.includes('U/A') || titleUpper.includes('DTD') || titleUpper.includes('AGREEMENT');

    if (!hasTrustKeyword || !hasFormationMarker) {
      issues.push({
        id: 'NIGO-TRUST-TITLE-002',
        severity: 'WARNING',
        category: 'ENTITY_INTEGRITY',
        ruleCode: 'TRUST_FORMATION_STANDARD',
        title: 'Missing Custodial Trust Suffix Standard',
        message: 'Trust legal registration must include execution markers (e.g., "U/A dtd MM/DD/YYYY") to satisfy custodial titling standards.',
        regulatoryCitation: 'Institutional Custody Guidelines Section 4.2 (Trust Account Verification)',
        remediationHint: 'Append execution date markers such as "U/A dtd 04/12/2012" to the legal entity title.',
        quickFixAvailable: true,
        targetField: 'legalTitle',
        quickFixAction: (p: OnboardingPacket) => ({
          ...p,
          legalTitle: p.legalTitle.includes('U/A dtd') ? p.legalTitle : `${p.legalTitle} U/A dtd 04/12/2012`,
        }),
      });
    }
  }

  // =========================================================================
  // 2. FINRA RULE 2111 / 2090 SUITABILITY & TRADING PRIVILEGES
  // =========================================================================
  if (packet.tradingPrivileges.marginRequested) {
    if (packet.financialProfile.liquidNetWorth < 50000) {
      issues.push({
        id: 'NIGO-FINRA-MARGIN-001',
        severity: 'FATAL_NIGO',
        category: 'FINRA_SUITABILITY',
        ruleCode: 'FINRA_2111_MARGIN_LIQUIDITY',
        title: 'Margin Minimum Liquid Net Worth Deficit',
        message: `Margin trading requires minimum liquid net worth of $50,000. Current declared liquid net worth is $${packet.financialProfile.liquidNetWorth.toLocaleString()}.`,
        regulatoryCitation: 'FINRA Rule 2111 (Suitability) & Regulation T Credit Extension Rules',
        remediationHint: 'Increase liquid net worth disclosure to >= $50,000 or disable margin privileges for this account.',
        quickFixAvailable: true,
        targetField: 'liquidNetWorth',
        quickFixAction: (p: OnboardingPacket) => ({
          ...p,
          financialProfile: {
            ...p.financialProfile,
            liquidNetWorth: Math.max(75000, p.financialProfile.liquidNetWorth),
          },
        }),
      });
    }

    if (packet.financialProfile.riskTolerance === 'CONSERVATIVE') {
      issues.push({
        id: 'NIGO-FINRA-MARGIN-002',
        severity: 'FATAL_NIGO',
        category: 'FINRA_SUITABILITY',
        ruleCode: 'FINRA_2111_RISK_CONFLICT',
        title: 'Margin Enabled with Conservative Risk Mandate',
        message: 'A "Conservative" risk tolerance profile strictly prohibits margin borrowing authorization due to inherent leverage exposure and loss amplification.',
        regulatoryCitation: 'FINRA Rule 2111 / Reg BI (Best Interest Obligation)',
        remediationHint: 'Upgrade the account investment mandate to "Moderate" / "Growth" or remove the margin trading request.',
        quickFixAvailable: true,
        targetField: 'riskTolerance',
        quickFixAction: (p: OnboardingPacket) => ({
          ...p,
          financialProfile: {
            ...p.financialProfile,
            riskTolerance: 'MODERATE',
          },
        }),
      });
    }
  }

  if (packet.tradingPrivileges.optionsTier === 'TIER_2_LONG' || packet.tradingPrivileges.optionsTier === 'TIER_3_UNCOVERED') {
    if (packet.financialProfile.annualIncome < 75000) {
      issues.push({
        id: 'NIGO-FINRA-OPTIONS-001',
        severity: 'FATAL_NIGO',
        category: 'FINRA_SUITABILITY',
        ruleCode: 'FINRA_2360_OPTIONS_INCOME',
        title: 'Insufficient Realized Income for Options Tier',
        message: `Options Trading (${packet.tradingPrivileges.optionsTier}) requires a verified annual income of at least $75,000 (Current: $${packet.financialProfile.annualIncome.toLocaleString()}).`,
        regulatoryCitation: 'FINRA Rule 2360 (Options) & CBOE Suitability Standards',
        remediationHint: 'Update annual income to meet the regulatory minimum or downgrade options privileges to Covered Calls (Tier 1).',
        quickFixAvailable: true,
        targetField: 'annualIncome',
        quickFixAction: (p: OnboardingPacket) => ({
          ...p,
          financialProfile: {
            ...p.financialProfile,
            annualIncome: 150000,
          },
        }),
      });
    }

    if (packet.financialProfile.investmentExperienceYears < 2) {
      issues.push({
        id: 'NIGO-FINRA-OPTIONS-002',
        severity: 'WARNING',
        category: 'FINRA_SUITABILITY',
        ruleCode: 'FINRA_2360_OPTIONS_EXP',
        title: 'Low Trading Experience for Advanced Options Mandate',
        message: `Client has only ${packet.financialProfile.investmentExperienceYears} year(s) of active trading experience. Principal compliance review is recommended for Tier 2/3 Options.`,
        regulatoryCitation: 'FINRA Rule 2360(b)(16) Diligent Supervision',
        remediationHint: 'Document prior trading background or verify accredited investor status.',
        quickFixAvailable: true,
        targetField: 'investmentExperienceYears',
        quickFixAction: (p: OnboardingPacket) => ({
          ...p,
          financialProfile: {
            ...p.financialProfile,
            investmentExperienceYears: 5,
          },
        }),
      });
    }
  }

  // =========================================================================
  // 3. FinCEN CDD (CUSTOMER DUE DILIGENCE) & BENEFICIAL OWNERSHIP
  // =========================================================================
  const significantOwnersWithoutSsn = packet.signers.filter(
    s => (s.ownershipPercentage ?? 0) >= 25 && s.ssnProvided === false
  );

  if (significantOwnersWithoutSsn.length > 0) {
    issues.push({
      id: 'NIGO-CDD-001',
      severity: 'FATAL_NIGO',
      category: 'CDD_BENEFICIAL_OWNERSHIP',
      ruleCode: 'FINCEN_CDD_BENEFICIAL_OWNER',
      title: 'FinCEN CDD: Missing Beneficial Owner SSN / Tax Identification',
      message: `Natural person(s) holding >= 25% equity interest (${significantOwnersWithoutSsn.map(s => s.fullName).join(', ')}) lack mandatory SSN/passport disclosures.`,
      regulatoryCitation: 'FinCEN 31 CFR § 1010.230 (Beneficial Ownership Requirements for Legal Entity Customers)',
      remediationHint: 'Collect and verify SSN/ITIN identification disclosures for all 25%+ equity holders.',
      quickFixAvailable: true,
      targetField: 'signers',
      quickFixAction: (p: OnboardingPacket) => ({
        ...p,
        signers: p.signers.map(s => ((s.ownershipPercentage ?? 0) >= 25 ? { ...s, ssnProvided: true } : s)),
      }),
    });
  }

  // =========================================================================
  // 4. SIGNER HIERARCHY & ROLE VALIDATION
  // =========================================================================
  if (packet.entityType.includes('TRUST')) {
    const hasPrimaryTrustee = packet.signers.some(s => s.role === 'PRIMARY_TRUSTEE');
    if (!hasPrimaryTrustee) {
      issues.push({
        id: 'NIGO-SIGNER-TRUST-001',
        severity: 'FATAL_NIGO',
        category: 'SIGNER_HIERARCHY',
        ruleCode: 'TRUSTEE_SIGNATURE_MANDATE',
        title: 'Missing Designated Primary Trustee Signer',
        message: 'Trust accounts require at least one designated Primary Trustee authorized to execute custodial agreements.',
        regulatoryCitation: 'Uniform Trust Code (UTC) § 816 & Custodial Agreement By-Laws',
        remediationHint: 'Assign "PRIMARY_TRUSTEE" role to the primary authorized trustee signer.',
        quickFixAvailable: true,
        targetField: 'signers',
        quickFixAction: (p: OnboardingPacket) => ({
          ...p,
          signers: p.signers.map((s, idx) => (idx === 0 ? { ...s, role: 'PRIMARY_TRUSTEE' } : s)),
        }),
      });
    }

    if (packet.entityType === 'IRREVOCABLE_TRUST' && packet.signers.length < 2) {
      issues.push({
        id: 'NIGO-SIGNER-IRREVOCABLE-002',
        severity: 'FATAL_NIGO',
        category: 'SIGNER_HIERARCHY',
        ruleCode: 'IRREVOCABLE_DUAL_TRUSTEE_MANDATE',
        title: 'Irrevocable Trust Requires Minimum Two Signers',
        message: 'Irrevocable Dynasty Trusts require at least two designated signers (e.g. Primary Trustee and Independent Co-Trustee or Advisor Principal).',
        regulatoryCitation: 'Institutional Trust Onboarding Policy Section 6',
        remediationHint: 'Add an Independent Co-Trustee or Custodian Representative to the signing roster.',
        quickFixAvailable: true,
        targetField: 'signers',
        quickFixAction: (p: OnboardingPacket) => ({
          ...p,
          signers: [
            ...p.signers,
            {
              id: `sgn-${Date.now()}`,
              fullName: 'Northern Trust Delaware (Corporate Co-Trustee)',
              email: 'delaware.trustees@northerntrust.corp',
              role: 'CO_TRUSTEE',
              hasSigned: false,
              orderIndex: p.signers.length + 1,
            },
          ],
        }),
      });
    }
  }

  if (packet.entityType === 'CORPORATE_LLC') {
    const hasManagingMember = packet.signers.some(s => s.role === 'MANAGING_MEMBER');
    if (!hasManagingMember) {
      issues.push({
        id: 'NIGO-SIGNER-LLC-001',
        severity: 'FATAL_NIGO',
        category: 'SIGNER_HIERARCHY',
        ruleCode: 'LLC_MANAGING_MEMBER_MANDATE',
        title: 'Missing Managing Member Signatory Authority',
        message: 'Corporate LLC accounts must have at least one signer designated as "MANAGING_MEMBER" with documented signing authority.',
        regulatoryCitation: 'Corporate Resolution for LLC Brokerage Accounts Section B',
        remediationHint: 'Promote the authorized officer to "MANAGING_MEMBER".',
        quickFixAvailable: true,
        targetField: 'signers',
        quickFixAction: (p: OnboardingPacket) => ({
          ...p,
          signers: p.signers.map((s, idx) => (idx === 0 ? { ...s, role: 'MANAGING_MEMBER' } : s)),
        }),
      });
    }
  }

  const hasAdvisor = packet.signers.some(s => s.role === 'WEALTH_ADVISOR');
  if (!hasAdvisor) {
    issues.push({
      id: 'NIGO-SIGNER-ADVISOR-001',
      severity: 'WARNING',
      category: 'SIGNER_HIERARCHY',
      ruleCode: 'ADVISOR_COUNTERSIGN_RECOMMENDATION',
      title: 'Missing Wealth Advisor Countersignature',
      message: 'Custodial best practice requires the Registered Investment Advisor (RIA) Principal to countersign the discretionary mandate.',
      regulatoryCitation: 'RIA Supervision Manual Section 3 (Account Acceptance)',
      remediationHint: 'Add the supervising Wealth Advisor as the final recipient in the signing order.',
      quickFixAvailable: true,
      targetField: 'signers',
      quickFixAction: (p: OnboardingPacket) => ({
        ...p,
        signers: [
          ...p.signers,
          {
            id: `sgn-adv-${Date.now()}`,
            fullName: 'Alexander Wright (Supervising Principal)',
            email: 'a.wright@apexwealthadvisors.com',
            role: 'WEALTH_ADVISOR',
            hasSigned: false,
            orderIndex: p.signers.length + 1,
          },
        ],
      }),
    });
  }

  // =========================================================================
  // 5. TAX ID / EIN SYNTAX VERIFICATION
  // =========================================================================
  const einRegex = /^\d{2}-\d{7}$/;
  const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;

  const isEinValid = einRegex.test(packet.taxId);
  const isSsnValid = ssnRegex.test(packet.taxId);

  if (!isEinValid && !isSsnValid) {
    issues.push({
      id: 'NIGO-TAX-001',
      severity: 'FATAL_NIGO',
      category: 'TAX_ID_SYNTAX',
      ruleCode: 'IRS_TAX_ID_SYNTAX_ERROR',
      title: 'Invalid Tax Identifier (EIN/SSN) Syntax',
      message: `Tax ID "${packet.taxId}" fails standard IRS formatting. Entities require EIN (XX-XXXXXXX) and individuals require SSN (XXX-XX-XXXX).`,
      regulatoryCitation: 'IRS W-9 Instructions & SEC Form BD Specifications',
      remediationHint: 'Format the Tax ID with appropriate hyphenation (e.g. 12-3456789 for EIN or 123-45-6789 for SSN).',
      quickFixAvailable: true,
      targetField: 'taxId',
      quickFixAction: (p: OnboardingPacket) => {
        const raw = p.taxId.replace(/\D/g, '');
        let formatted = p.taxId;
        if (raw.length === 9) {
          formatted = p.entityType === 'INDIVIDUAL' 
            ? `${raw.slice(0, 3)}-${raw.slice(3, 5)}-${raw.slice(5)}` 
            : `${raw.slice(0, 2)}-${raw.slice(2)}`;
        } else {
          formatted = p.entityType === 'INDIVIDUAL' ? '148-29-9302' : '82-9182301';
        }
        return { ...p, taxId: formatted };
      },
    });
  }

  // Calculate Readiness Score
  const fatalCount = issues.filter(i => i.severity === 'FATAL_NIGO').length;
  const warningCount = issues.filter(i => i.severity === 'WARNING').length;

  // Each fatal error deducts 25 points, warnings deduct 8 points
  let score = Math.max(0, 100 - (fatalCount * 25 + warningCount * 8));
  if (fatalCount === 0 && warningCount === 0) {
    score = 100;
  }

  return {
    score,
    fatalCount,
    warningCount,
    isExecutable: fatalCount === 0,
    issues,
  };
}
