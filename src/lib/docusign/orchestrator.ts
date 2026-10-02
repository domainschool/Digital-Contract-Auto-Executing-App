import { OnboardingPacket, Signer } from '../../types/onboarding';

export interface EnvelopeRecipient {
  recipientId: string;
  name: string;
  email: string;
  routingOrder: number;
  role: string;
  status: 'WAITING' | 'SENT' | 'DELIVERED' | 'SIGNED' | 'DECLINED';
  signedAt?: string;
  tabTag: string;
}

export interface EnvelopeSession {
  envelopeId: string;
  packetId: string;
  status: 'CREATED' | 'SENT' | 'PROCESSING' | 'COMPLETED' | 'DECLINED' | 'CLEARED_BY_CUSTODIAN';
  createdDateTime: string;
  recipients: EnvelopeRecipient[];
  currentRoutingOrder: number;
  clearedByCustodian: boolean;
  custodianAckNumber?: string;
}

export function initializeEnvelopeSession(packet: OnboardingPacket): EnvelopeSession {
  const envelopeId = `ENV-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Sort signers by orderIndex to enforce sequential routingOrder
  const sortedSigners = [...packet.signers].sort((a, b) => a.orderIndex - b.orderIndex);

  const recipients: EnvelopeRecipient[] = sortedSigners.map((s: Signer, idx: number) => ({
    recipientId: s.id,
    name: s.fullName,
    email: s.email,
    routingOrder: s.orderIndex || idx + 1,
    role: s.role,
    status: idx === 0 ? 'SENT' : 'WAITING',
    tabTag: `/sn${idx + 1}/`,
  }));

  return {
    envelopeId,
    packetId: packet.packetId,
    status: 'SENT',
    createdDateTime: new Date().toISOString(),
    recipients,
    currentRoutingOrder: 1,
    clearedByCustodian: false,
  };
}

export function advanceSignerState(
  session: EnvelopeSession, 
  recipientId: string, 
  action: 'SIGN' | 'DECLINE'
): EnvelopeSession {
  const updatedRecipients = session.recipients.map(r => {
    if (r.recipientId === recipientId) {
      return {
        ...r,
        status: action === 'SIGN' ? ('SIGNED' as const) : ('DECLINED' as const),
        signedAt: action === 'SIGN' ? new Date().toISOString() : undefined,
      };
    }
    return r;
  });

  if (action === 'DECLINE') {
    return {
      ...session,
      recipients: updatedRecipients,
      status: 'DECLINED',
    };
  }

  // Check if current routing order is completely signed
  const activeSigner = updatedRecipients.find(r => r.recipientId === recipientId);
  const nextOrder = (activeSigner?.routingOrder ?? 1) + 1;
  const hasPendingRecipients = updatedRecipients.some(r => r.status !== 'SIGNED');

  if (!hasPendingRecipients) {
    // All signed -> Completed & ready for automated Custodian clearing
    return {
      ...session,
      recipients: updatedRecipients,
      status: 'COMPLETED',
      clearedByCustodian: true,
      custodianAckNumber: `CLR-ACK-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };
  }

  // Activate the next recipient in sequence
  const nextRecipients = updatedRecipients.map(r => {
    if (r.routingOrder === nextOrder && r.status === 'WAITING') {
      return { ...r, status: 'SENT' as const };
    }
    return r;
  });

  return {
    ...session,
    recipients: nextRecipients,
    currentRoutingOrder: nextOrder,
    status: 'PROCESSING',
  };
}
