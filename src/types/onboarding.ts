export type AccountEntity = 
  | 'INDIVIDUAL' 
  | 'REVOCABLE_TRUST' 
  | 'IRREVOCABLE_TRUST' 
  | 'CORPORATE_LLC';

export type RiskTolerance = 
  | 'CONSERVATIVE' 
  | 'MODERATE' 
  | 'GROWTH' 
  | 'AGGRESSIVE';

export type OptionsTier = 
  | 'NONE' 
  | 'TIER_1_COVERED' 
  | 'TIER_2_LONG' 
  | 'TIER_3_UNCOVERED';

export type SignerRole = 
  | 'PRIMARY_TRUSTEE' 
  | 'CO_TRUSTEE' 
  | 'GRANTOR' 
  | 'MANAGING_MEMBER' 
  | 'BENEFICIAL_OWNER' 
  | 'WEALTH_ADVISOR';

export interface Signer {
  id: string;
  fullName: string;
  email: string;
  role: SignerRole;
  ownershipPercentage?: number; // for LLC / CDD beneficial ownership checks
  ssnProvided?: boolean;
  hasSigned: boolean;
  orderIndex: number;
}

export interface FinancialProfile {
  annualIncome: number;
  liquidNetWorth: number;
  totalNetWorth: number;
  investmentExperienceYears: number;
  riskTolerance: RiskTolerance;
  liquidityNeeds: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface TradingPrivileges {
  marginRequested: boolean;
  optionsTier: OptionsTier;
  shortSellingAuthorized: boolean;
}

export type PacketStatus = 
  | 'DRAFT' 
  | 'NIGO_BLOCKED' 
  | 'READY_FOR_EXECUTION' 
  | 'ROUTING_IN_PROGRESS' 
  | 'COMPLETED_IGO';

export interface OnboardingPacket {
  packetId: string;
  accountNumber: string;
  custodian: 'SCHWAB_INSTITUTIONAL' | 'FIDELITY_IWS' | 'BNY_PERSHING';
  entityType: AccountEntity;
  legalTitle: string;
  advisoryAgreementTitle: string; // Used to test cross-form mismatch
  taxId: string; // EIN or SSN
  financialProfile: FinancialProfile;
  tradingPrivileges: TradingPrivileges;
  signers: Signer[];
  status: PacketStatus;
  createdDate: string;
  targetAUM: number;
}

export type NigoSeverity = 'FATAL_NIGO' | 'WARNING';

export type NigoCategory = 
  | 'ENTITY_INTEGRITY' 
  | 'FINRA_SUITABILITY' 
  | 'CDD_BENEFICIAL_OWNERSHIP' 
  | 'SIGNER_HIERARCHY' 
  | 'TAX_ID_SYNTAX';

export interface NigoIssue {
  id: string;
  severity: NigoSeverity;
  category: NigoCategory;
  ruleCode: string;
  title: string;
  message: string;
  regulatoryCitation: string;
  remediationHint: string;
  quickFixAvailable: boolean;
  targetField?: string;
  quickFixAction?: (packet: OnboardingPacket) => OnboardingPacket;
}

export interface LinterResult {
  score: number; // 0 to 100%
  fatalCount: number;
  warningCount: number;
  isExecutable: boolean;
  issues: NigoIssue[];
}

export interface AuditRecord {
  id: string;
  packetId: string;
  timestamp: string;
  actor: string;
  action: 'VALIDATION_CHECK' | 'QUICK_FIX_APPLIED' | 'MANUAL_EDIT' | 'ENVELOPE_DISPATCHED' | 'SIGNER_ACTION' | 'CUSTODIAL_CLEARANCE';
  details: string;
  severity: 'INFO' | 'ALERT' | 'SUCCESS' | 'WARNING';
  hashFingerprint: string;
}
