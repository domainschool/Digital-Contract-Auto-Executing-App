import { OnboardingPacket } from '../types/onboarding';

export const MOCK_PACKETS: OnboardingPacket[] = [
  {
    packetId: 'PKT-9482-CLEAN',
    accountNumber: 'SW-83920194',
    custodian: 'SCHWAB_INSTITUTIONAL',
    entityType: 'INDIVIDUAL',
    legalTitle: 'Victoria Alexandra Stirling',
    advisoryAgreementTitle: 'Victoria Alexandra Stirling',
    taxId: '148-29-9302',
    targetAUM: 4500000,
    createdDate: '2026-10-01 14:15:00 UTC',
    status: 'READY_FOR_EXECUTION',
    financialProfile: {
      annualIncome: 450000,
      liquidNetWorth: 1850000,
      totalNetWorth: 5200000,
      investmentExperienceYears: 14,
      riskTolerance: 'GROWTH',
      liquidityNeeds: 'LOW',
    },
    tradingPrivileges: {
      marginRequested: true,
      optionsTier: 'TIER_2_LONG',
      shortSellingAuthorized: true,
    },
    signers: [
      {
        id: 'sgn-1',
        fullName: 'Victoria Alexandra Stirling',
        email: 'v.stirling@privatecapital.com',
        role: 'PRIMARY_TRUSTEE', // Individual owner acting as principal
        hasSigned: false,
        orderIndex: 1,
      },
      {
        id: 'sgn-2',
        fullName: 'Marcus Vance (Advisor Principal)',
        email: 'm.vance@apexwealthadvisors.com',
        role: 'WEALTH_ADVISOR',
        hasSigned: false,
        orderIndex: 2,
      },
    ],
  },
  {
    packetId: 'PKT-7193-NIGO-TRUST',
    accountNumber: 'FD-10928471',
    custodian: 'FIDELITY_IWS',
    entityType: 'REVOCABLE_TRUST',
    legalTitle: 'The Miller Family Trust', // NIGO: missing U/A DTD dates required by Custodian
    advisoryAgreementTitle: 'Robert T. & Sarah L. Miller Living Trust U/A dtd 04/12/2012', // Title mismatch!
    taxId: '82-9182301',
    targetAUM: 8200000,
    createdDate: '2026-10-01 09:30:00 UTC',
    status: 'NIGO_BLOCKED',
    financialProfile: {
      annualIncome: 120000,
      liquidNetWorth: 35000, // NIGO: Under $50k required for margin
      totalNetWorth: 9100000,
      investmentExperienceYears: 3,
      riskTolerance: 'CONSERVATIVE', // NIGO: Conservative cannot enable margin under FINRA 2111
      liquidityNeeds: 'HIGH',
    },
    tradingPrivileges: {
      marginRequested: true, // NIGO trigger!
      optionsTier: 'TIER_1_COVERED',
      shortSellingAuthorized: false,
    },
    signers: [
      {
        id: 'sgn-101',
        fullName: 'Robert T. Miller',
        email: 'rmiller@millerholdings.net',
        role: 'GRANTOR', // NIGO: Missing PRIMARY_TRUSTEE
        hasSigned: false,
        orderIndex: 1,
      },
      {
        id: 'sgn-102',
        fullName: 'Eleanor Vance (Wealth Advisor)',
        email: 'e.vance@apexwealthadvisors.com',
        role: 'WEALTH_ADVISOR',
        hasSigned: false,
        orderIndex: 2,
      },
    ],
  },
  {
    packetId: 'PKT-5821-NIGO-LLC',
    accountNumber: 'PS-49102941',
    custodian: 'BNY_PERSHING',
    entityType: 'CORPORATE_LLC',
    legalTitle: 'Cascade Peak Real Estate Holdings LLC',
    advisoryAgreementTitle: 'Cascade Peak Real Estate Holdings LLC',
    taxId: '948192019', // NIGO: Missing EIN dash format XX-XXXXXXX
    targetAUM: 12400000,
    createdDate: '2026-09-30 16:45:00 UTC',
    status: 'NIGO_BLOCKED',
    financialProfile: {
      annualIncome: 65000, // NIGO: Under $75k income required for Tier 3 Uncovered Options
      liquidNetWorth: 600000,
      totalNetWorth: 14000000,
      investmentExperienceYears: 1,
      riskTolerance: 'AGGRESSIVE',
      liquidityNeeds: 'MEDIUM',
    },
    tradingPrivileges: {
      marginRequested: true,
      optionsTier: 'TIER_3_UNCOVERED', // NIGO: Requires 3+ yrs experience and $75k+ income
      shortSellingAuthorized: true,
    },
    signers: [
      {
        id: 'sgn-201',
        fullName: 'David K. Sutherland',
        email: 'dsutherland@cascadepeak.io',
        role: 'BENEFICIAL_OWNER', // NIGO: Missing MANAGING_MEMBER
        ownershipPercentage: 65,
        ssnProvided: true,
        hasSigned: false,
        orderIndex: 1,
      },
      {
        id: 'sgn-202',
        fullName: 'Sarah Sterling (Advisor)',
        email: 's.sterling@apexwealthadvisors.com',
        role: 'WEALTH_ADVISOR',
        hasSigned: false,
        orderIndex: 2,
      },
    ],
  },
  {
    packetId: 'PKT-3304-NIGO-DYNASTY',
    accountNumber: 'SW-90218491',
    custodian: 'SCHWAB_INSTITUTIONAL',
    entityType: 'IRREVOCABLE_TRUST',
    legalTitle: 'The Montgomery 2021 Irrevocable Dynasty Trust U/A dtd 08/19/2021',
    advisoryAgreementTitle: 'The Montgomery 2021 Irrevocable Dynasty Trust U/A dtd 08/19/2021',
    taxId: '47-9201948',
    targetAUM: 28500000,
    createdDate: '2026-10-01 11:20:00 UTC',
    status: 'NIGO_BLOCKED',
    financialProfile: {
      annualIncome: 1200000,
      liquidNetWorth: 4500000,
      totalNetWorth: 31000000,
      investmentExperienceYears: 20,
      riskTolerance: 'GROWTH',
      liquidityNeeds: 'LOW',
    },
    tradingPrivileges: {
      marginRequested: false,
      optionsTier: 'TIER_1_COVERED',
      shortSellingAuthorized: false,
    },
    signers: [
      {
        id: 'sgn-301',
        fullName: 'Charles Montgomery III',
        email: 'charles@montgomerydynasty.com',
        role: 'PRIMARY_TRUSTEE',
        ownershipPercentage: 40,
        ssnProvided: false, // NIGO: FinCEN CDD Rule violation for 25%+ owner without SSN
        hasSigned: false,
        orderIndex: 1,
      },
      // NIGO: Irrevocable Trust missing second designated Co-Trustee / Corporate Trustee
    ],
  },
];
