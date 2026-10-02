import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { OnboardingPacket } from '../../types/onboarding';

export interface CoordinateAnchor {
  page: number;
  label: string;
  tag: string;
  x: number;
  y: number;
  width: number;
  height: number;
  signerRole: string;
}

export async function generateCustodialPdf(packet: OnboardingPacket): Promise<{
  pdfBytes: Uint8Array;
  blobUrl: string;
  anchors: CoordinateAnchor[];
}> {
  const pdfDoc = await PDFDocument.create();
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const courier = await pdfDoc.embedFont(StandardFonts.Courier);

  const black = rgb(0.04, 0.04, 0.04);
  const brutalPink = rgb(1, 0.16, 0.52);
  const brutalYellow = rgb(0.99, 0.94, 0.54);
  const slateGray = rgb(0.4, 0.4, 0.4);

  // -------------------------------------------------------------
  // PAGE 1: INSTITUTIONAL ACCOUNT REGISTRATION & ENTITY TITLING
  // -------------------------------------------------------------
  const page1 = pdfDoc.addPage([612, 792]); // Standard US Letter
  const { width: p1W, height: p1H } = page1.getSize();

  // Header Box
  page1.drawRectangle({
    x: 36,
    y: p1H - 90,
    width: p1W - 72,
    height: 54,
    color: brutalYellow,
    borderColor: black,
    borderWidth: 2,
  });

  page1.drawText('ZERONIGO PRE-FLIGHT DISCLOSURE & CUSTODIAL MASTER PACKET', {
    x: 48,
    y: p1H - 60,
    size: 11,
    font: helveticaBold,
    color: black,
  });

  page1.drawText(`Clearing Custodian: ${packet.custodian} | Packet ID: ${packet.packetId}`, {
    x: 48,
    y: p1H - 78,
    size: 9,
    font: courier,
    color: black,
  });

  // Section 1: Entity Titling (Coordinate projection)
  let currY = p1H - 125;
  page1.drawText('SECTION 1: LEGAL ENTITY REGISTRATION & ACCOUNT TITLING', {
    x: 36,
    y: currY,
    size: 10,
    font: helveticaBold,
    color: black,
  });

  currY -= 35;
  // Field: Legal Title Box
  page1.drawRectangle({
    x: 36,
    y: currY - 5,
    width: 340,
    height: 30,
    borderColor: black,
    borderWidth: 1.5,
  });
  page1.drawText('Account Legal Registration Title (Exact Formation Document Parity)', {
    x: 42,
    y: currY + 14,
    size: 7,
    font: helveticaBold,
    color: slateGray,
  });
  page1.drawText(packet.legalTitle.slice(0, 48), {
    x: 42,
    y: currY + 2,
    size: 9,
    font: helveticaBold,
    color: black,
  });

  // Field: Tax ID Box
  page1.drawRectangle({
    x: 390,
    y: currY - 5,
    width: 186,
    height: 30,
    borderColor: black,
    borderWidth: 1.5,
  });
  page1.drawText('Tax Identifier (EIN / SSN)', {
    x: 396,
    y: currY + 14,
    size: 7,
    font: helveticaBold,
    color: slateGray,
  });
  page1.drawText(packet.taxId, {
    x: 396,
    y: currY + 2,
    size: 10,
    font: courier,
    color: black,
  });

  currY -= 45;
  // Field: Entity Type
  page1.drawRectangle({
    x: 36,
    y: currY - 5,
    width: 250,
    height: 30,
    borderColor: black,
    borderWidth: 1.5,
  });
  page1.drawText('Entity Structure Type', {
    x: 42,
    y: currY + 14,
    size: 7,
    font: helveticaBold,
    color: slateGray,
  });
  page1.drawText(packet.entityType, {
    x: 42,
    y: currY + 2,
    size: 9,
    font: courier,
    color: black,
  });

  // Field: Target AUM
  page1.drawRectangle({
    x: 300,
    y: currY - 5,
    width: 276,
    height: 30,
    borderColor: black,
    borderWidth: 1.5,
  });
  page1.drawText('Target Inbound Asset Mandate (AUM)', {
    x: 306,
    y: currY + 14,
    size: 7,
    font: helveticaBold,
    color: slateGray,
  });
  page1.drawText(`$${packet.targetAUM.toLocaleString()} USD`, {
    x: 306,
    y: currY + 2,
    size: 10,
    font: courier,
    color: black,
  });

  // Cross-form titling reconciliation watermark
  currY -= 65;
  page1.drawRectangle({
    x: 36,
    y: currY - 10,
    width: p1W - 72,
    height: 45,
    color: rgb(0.96, 0.96, 0.96),
    borderColor: black,
    borderWidth: 1,
  });
  page1.drawText('ACATS / CUSTODIAL RECONCILIATION AUDIT TRACE', {
    x: 46,
    y: currY + 20,
    size: 8,
    font: helveticaBold,
    color: black,
  });
  page1.drawText(`Advisory Agreement Matching Title: "${packet.advisoryAgreementTitle}"`, {
    x: 46,
    y: currY + 6,
    size: 8,
    font: courier,
    color: slateGray,
  });
  page1.drawText(`Pre-Flight Parity Status: ${packet.legalTitle === packet.advisoryAgreementTitle ? 'VERIFIED MATCH (100% IGO)' : 'FATAL_NIGO MISMATCH DETECTED'}`, {
    x: 46,
    y: currY - 6,
    size: 8,
    font: helveticaBold,
    color: packet.legalTitle === packet.advisoryAgreementTitle ? rgb(0.1, 0.6, 0.2) : brutalPink,
  });

  // -------------------------------------------------------------
  // PAGE 2: FINRA RULE 2111 / 2090 SUITABILITY & MARGIN MATRIX
  // -------------------------------------------------------------
  const page2 = pdfDoc.addPage([612, 792]);
  const { height: p2H } = page2.getSize();

  page2.drawRectangle({
    x: 36,
    y: p2H - 70,
    width: p1W - 72,
    height: 35,
    color: brutalYellow,
    borderColor: black,
    borderWidth: 2,
  });
  page2.drawText('SECTION 2: FINANCIAL SUITABILITY & TRADING PERMISSIONS', {
    x: 48,
    y: p2H - 48,
    size: 10,
    font: helveticaBold,
    color: black,
  });

  let p2Y = p2H - 100;
  // Financial Grid
  const financialFields = [
    { label: 'Realized Annual Income', val: `$${packet.financialProfile.annualIncome.toLocaleString()}` },
    { label: 'Declared Liquid Net Worth', val: `$${packet.financialProfile.liquidNetWorth.toLocaleString()}` },
    { label: 'Total Investable Net Worth', val: `$${packet.financialProfile.totalNetWorth.toLocaleString()}` },
    { label: 'Active Trading Experience', val: `${packet.financialProfile.investmentExperienceYears} Years` },
    { label: 'Declared Risk Mandate', val: packet.financialProfile.riskTolerance },
    { label: 'Liquidity Needs Horizon', val: packet.financialProfile.liquidityNeeds },
  ];

  financialFields.forEach((field, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const boxX = col === 0 ? 36 : 300;
    const boxY = p2Y - (row * 40) - 25;

    page2.drawRectangle({
      x: boxX,
      y: boxY,
      width: 270,
      height: 32,
      borderColor: black,
      borderWidth: 1.2,
    });
    page2.drawText(field.label, {
      x: boxX + 8,
      y: boxY + 18,
      size: 7,
      font: helveticaBold,
      color: slateGray,
    });
    page2.drawText(field.val, {
      x: boxX + 8,
      y: boxY + 5,
      size: 9,
      font: courier,
      color: black,
    });
  });

  p2Y -= 150;
  page2.drawText('REGULATORY TRADING PRIVILEGES & CREDIT EXTENSION (REG T)', {
    x: 36,
    y: p2Y,
    size: 10,
    font: helveticaBold,
    color: black,
  });

  p2Y -= 40;
  // Margin Checkbox coordinate simulation (X: 45, Y: p2Y)
  page2.drawRectangle({
    x: 36,
    y: p2Y,
    width: 20,
    height: 20,
    borderColor: black,
    borderWidth: 2,
    color: packet.tradingPrivileges.marginRequested ? brutalYellow : rgb(1, 1, 1),
  });
  if (packet.tradingPrivileges.marginRequested) {
    page2.drawText('X', { x: 41, y: p2Y + 4, size: 14, font: helveticaBold, color: black });
  }
  page2.drawText('Margin Borrowing Privileges Requested (Subject to FINRA Rule 2111 Minimums)', {
    x: 65,
    y: p2Y + 6,
    size: 8,
    font: helveticaBold,
    color: black,
  });

  p2Y -= 35;
  // Options Tier
  page2.drawRectangle({
    x: 36,
    y: p2Y,
    width: 20,
    height: 20,
    borderColor: black,
    borderWidth: 2,
    color: packet.tradingPrivileges.optionsTier !== 'NONE' ? brutalYellow : rgb(1, 1, 1),
  });
  if (packet.tradingPrivileges.optionsTier !== 'NONE') {
    page2.drawText('X', { x: 41, y: p2Y + 4, size: 14, font: helveticaBold, color: black });
  }
  page2.drawText(`Options Trading Authorization Level: [ ${packet.tradingPrivileges.optionsTier} ]`, {
    x: 65,
    y: p2Y + 6,
    size: 8,
    font: helveticaBold,
    color: black,
  });

  // -------------------------------------------------------------
  // PAGE 3: SEQUENTIAL SIGNER ROSTER & COORDINATE ANCHOR TAGS
  // -------------------------------------------------------------
  const page3 = pdfDoc.addPage([612, 792]);
  const { height: p3H } = page3.getSize();

  page3.drawRectangle({
    x: 36,
    y: p3H - 70,
    width: p1W - 72,
    height: 35,
    color: brutalYellow,
    borderColor: black,
    borderWidth: 2,
  });
  page3.drawText('SECTION 3: MULTI-PARTY SIGNATORY EXECUTION & ANCHOR TAGS', {
    x: 48,
    y: p3H - 48,
    size: 10,
    font: helveticaBold,
    color: black,
  });

  let p3Y = p3H - 110;
  const anchors: CoordinateAnchor[] = [];

  packet.signers.forEach((signer, idx) => {
    const anchorTag = `/sn${idx + 1}/`;
    const boxY = p3Y - (idx * 85) - 65;

    // Outer signer card on PDF
    page3.drawRectangle({
      x: 36,
      y: boxY,
      width: p1W - 72,
      height: 70,
      borderColor: black,
      borderWidth: 1.5,
    });

    page3.drawText(`SIGNER #${idx + 1} (Routing Order: ${signer.orderIndex}) — Role: ${signer.role}`, {
      x: 46,
      y: boxY + 52,
      size: 8,
      font: helveticaBold,
      color: black,
    });

    page3.drawText(`Full Legal Name: ${signer.fullName} | Email: ${signer.email}`, {
      x: 46,
      y: boxY + 38,
      size: 8,
      font: courier,
      color: slateGray,
    });

    // Signature Tab Box (Anchor Coordinate Area)
    const sigX = p1W - 200;
    const sigY = boxY + 10;
    const sigW = 150;
    const sigH = 32;

    page3.drawRectangle({
      x: sigX,
      y: sigY,
      width: sigW,
      height: sigH,
      borderColor: brutalPink,
      borderWidth: 2,
      color: rgb(1, 0.95, 0.98),
    });

    page3.drawText(`DOCUSIGN TAB ANCHOR: ${anchorTag}`, {
      x: sigX + 6,
      y: sigY + 18,
      size: 7,
      font: helveticaBold,
      color: brutalPink,
    });

    page3.drawText(signer.hasSigned ? '[ SIGNED & EXECUTED ]' : '[ PENDING SEQUENTIAL ROUTE ]', {
      x: sigX + 6,
      y: sigY + 6,
      size: 7,
      font: courier,
      color: black,
    });

    anchors.push({
      page: 3,
      label: signer.fullName,
      tag: anchorTag,
      x: sigX,
      y: sigY,
      width: sigW,
      height: sigH,
      signerRole: signer.role,
    });
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);

  return {
    pdfBytes,
    blobUrl,
    anchors,
  };
}
