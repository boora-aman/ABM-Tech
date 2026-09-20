import {
  Document, Page, Text, View, StyleSheet, Svg, Path, Rect,
} from "@react-pdf/renderer";
import { computeTotals, inrMoney, amountInWords, type Line } from "@/lib/billing";
import { isLongForm, type Section } from "@/lib/billing-sections";
import { SectionBlock, SignatureBlock, FactsTable } from "@/lib/pdf/Blocks";

/* The document is set in Helvetica, one of the PDF standard-14 faces, so that
   no font file has to be downloaded or embedded on every render. Those faces
   are WinAnsi-encoded and have no ₹ — printing one produced a stray superscript
   glyph on the total line. "Rs." is what the encoding can actually draw, and is
   unambiguous on an Indian invoice. */
const RUPEE = "Rs. ";

/* ==========================================================================
   PDF DOCUMENT

   Rendered with @react-pdf/renderer rather than headless Chromium: the VPS
   also runs Frappe, and a ~300MB browser spun up per download is not a fair
   thing to put on a shared box. This is pure JS with no native dependency.

   Uses the built-in Helvetica rather than the brand faces on purpose — an
   embedded font is a download and a failure mode on every render, and an
   invoice is a document that must always produce, not a marketing page.
   The brand shows in the layout and the one accent colour instead.
   ========================================================================== */

const BRAND = "#D6400F";
const INK = "#14161A";
const DIM = "#4A5058";
const FAINT = "#8A9099";
const LINE = "#DCD9D2";
const PAPER = "#F4F2ED";

/* The three bar fills and the apex datum of the real mark. Drawn as vector
   primitives rather than loaded as an image: an <Image> is a file read (or a
   fetch) on every single render, and it is the one thing on the page that can
   fail and leave a hole where the logo should be. These are the same
   coordinates as public/icon.svg, so the printed mark and the favicon are the
   same drawing. */
const HOT = "#FF4500";
const MID = "#FF6A00";
const WARM = "#FF8C00";
const TEAL = "#00F5D4";

function Mark({ size = 26 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path d="M4 31.5 L9.2 31.5 L13.4 20.5 L8.2 20.5 Z" fill={HOT} />
      <Path d="M13 31.5 L18.2 31.5 L24.4 14.5 L19.2 14.5 Z" fill={MID} />
      <Path d="M22 31.5 L27.2 31.5 L35.4 8.5 L30.2 8.5 Z" fill={WARM} />
      <Rect x="4" y="33.6" width="31.4" height="1.6" rx="0.4" fill={HOT} opacity={0.45} />
      <Rect x="34.4" y="4.6" width="3" height="3" rx="0.8" fill={TEAL} />
    </Svg>
  );
}

const s = StyleSheet.create({
  /* paddingBottom reserves the footer's band. The footer is absolutely
     positioned, so without the reservation a long terms block runs underneath
     it and the two overprint. */
  page: {
    paddingTop: 38, paddingHorizontal: 40, paddingBottom: 74,
    fontSize: 9, color: INK, fontFamily: "Helvetica",
  },

  /* The mark's own three fills, stepped across the rule — the same trick the
     logo uses to avoid a gradient id. */
  topRule: { flexDirection: "row", height: 3, marginBottom: 20 },
  topRuleA: { flex: 1, backgroundColor: HOT },
  topRuleB: { flex: 1, backgroundColor: MID },
  topRuleC: { flex: 2, backgroundColor: WARM },

  head: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },

  lockup: { flexDirection: "row", alignItems: "center", marginBottom: 9 },
  lockupText: { marginLeft: 8 },
  bizName: { fontSize: 16, fontFamily: "Helvetica-Bold", letterSpacing: -0.3 },
  bizTagline: {
    fontSize: 6, color: FAINT, letterSpacing: 1.6,
    fontFamily: "Helvetica-Bold", marginTop: 2.5,
  },
  bizLine: { fontSize: 8, color: DIM, marginTop: 2, lineHeight: 1.5 },

  /* Registration numbers sit in their own tinted strip. Stacked with the
     address they read as more address, and an auditor looking for the Udyam
     number should not have to find it inside a paragraph. */
  regs: {
    flexDirection: "row", marginTop: 9, backgroundColor: PAPER,
    borderRadius: 3, paddingVertical: 5, paddingHorizontal: 9,
  },
  reg: { marginRight: 16 },
  regLabel: { fontSize: 6, color: FAINT, letterSpacing: 0.9, fontFamily: "Helvetica-Bold" },
  regValue: { fontSize: 8, marginTop: 1.5 },

  docTitle: {
    fontSize: 15, fontFamily: "Helvetica-Bold", color: BRAND,
    textAlign: "right", letterSpacing: 0.4,
  },
  docNumber: {
    fontSize: 9.5, fontFamily: "Helvetica-Bold", textAlign: "right", marginTop: 4,
  },
  metaRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 4 },
  metaLabel: { fontSize: 7, color: FAINT, letterSpacing: 0.7, fontFamily: "Helvetica-Bold" },
  metaValue: { fontSize: 8.5, color: DIM, width: 74, textAlign: "right" },

  headRule: { height: 0.5, backgroundColor: LINE, marginTop: 16, marginBottom: 18 },

  panels: { flexDirection: "row", gap: 14, marginBottom: 20 },
  panel: { flex: 1, backgroundColor: PAPER, padding: 11, borderRadius: 3 },
  panelLabel: {
    fontSize: 7, color: FAINT, letterSpacing: 1,
    marginBottom: 5, fontFamily: "Helvetica-Bold",
  },
  panelName: { fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  panelText: { fontSize: 8.5, color: DIM, lineHeight: 1.45 },

  tHead: {
    flexDirection: "row", borderBottomWidth: 1, borderBottomColor: INK,
    paddingBottom: 5, marginBottom: 2,
  },
  tHeadCell: { fontSize: 7, color: FAINT, letterSpacing: 0.8, fontFamily: "Helvetica-Bold" },
  row: {
    flexDirection: "row", paddingVertical: 7,
    borderBottomWidth: 0.5, borderBottomColor: LINE,
  },
  cDesc: { flex: 1, paddingRight: 8 },
  cQty: { width: 52, textAlign: "right" },
  cRate: { width: 68, textAlign: "right" },
  cDisc: { width: 42, textAlign: "right" },
  cAmt: { width: 78, textAlign: "right" },
  desc: { fontSize: 9, marginBottom: 1.5 },
  sub: { fontSize: 7.5, color: FAINT },

  totals: { flexDirection: "row", justifyContent: "flex-end", marginTop: 14 },
  totalsBox: { width: 232 },
  tRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  tLabel: { fontSize: 8.5, color: DIM },
  tVal: { fontSize: 8.5 },
  grand: {
    flexDirection: "row", justifyContent: "space-between",
    borderTopWidth: 1.5, borderTopColor: INK, marginTop: 5, paddingTop: 7,
  },
  grandLabel: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  grandVal: { fontSize: 13, fontFamily: "Helvetica-Bold", color: BRAND },

  words: {
    marginTop: 12, backgroundColor: PAPER, padding: 9, borderRadius: 3,
  },
  wordsText: { fontSize: 8.5, fontFamily: "Helvetica-Bold" },

  block: { marginTop: 16 },
  blockLabel: {
    fontSize: 7, color: FAINT, letterSpacing: 1,
    marginBottom: 4, fontFamily: "Helvetica-Bold",
  },
  blockText: { fontSize: 8.5, color: DIM, lineHeight: 1.5 },
  /* Each clause gets its own row with a gap. Run together they are a wall of
     grey that nobody reads, which defeats the point of having terms. */
  clause: { flexDirection: "row", marginBottom: 3.5 },
  clauseNum: {
    width: 13, fontSize: 8.5, color: FAINT, fontFamily: "Helvetica-Bold",
  },
  clauseText: { flex: 1, fontSize: 8.5, color: DIM, lineHeight: 1.45 },

  paidStamp: {
    marginTop: 10, alignSelf: "flex-start",
    borderWidth: 1, borderColor: "#2F7A4F", color: "#2F7A4F",
    paddingVertical: 3, paddingHorizontal: 9, borderRadius: 3,
    fontSize: 9, fontFamily: "Helvetica-Bold", letterSpacing: 1,
  },

  foot: {
    position: "absolute", bottom: 26, left: 40, right: 40,
    borderTopWidth: 0.5, borderTopColor: LINE, paddingTop: 8,
  },
  footTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  footLockup: { flexDirection: "row", alignItems: "center" },
  footName: { fontSize: 8, fontFamily: "Helvetica-Bold", marginLeft: 5 },
  footText: { fontSize: 7.5, color: FAINT },
  footDetail: { fontSize: 7, color: FAINT, marginTop: 3.5, lineHeight: 1.5 },
});

export type PdfBiz = {
  name: string;
  legalName: string;
  /** Printed in the header and footer — a document is a marketing surface too. */
  url?: string;
  tagline?: string;
  email: string;
  phoneDisplay: string;
  line1?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  gstin?: string;
  udyam?: string;
  pan?: string;
  bankName?: string;
  bankAccount?: string;
  bankIfsc?: string;
  upi?: string;
};

export type PdfDoc = {
  kind: "quotation" | "invoice" | "proposal" | "agreement";
  number: string;
  issueDate: string;
  validUntil?: string;
  dueDate?: string;
  client: Record<string, string | undefined>;
  lines: Line[];
  discountPct: number;
  taxRate: number;
  taxMode: "none" | "cgst_sgst" | "igst";
  notes?: string;
  terms?: string;
  status?: string;
  amountPaid?: number;
  /** Proposals and agreements: the prose, already edited by the operator. */
  sections?: Section[];
  /** The quotation or proposal this document is raised against. */
  sowRef?: string;
};

const dateIn = (v?: string) => {
  if (!v) return "";
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? v
    : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export function InvoiceDoc({ doc, biz }: { doc: PdfDoc; biz: PdfBiz }) {
  const t = computeTotals(doc.lines, doc.discountPct, doc.taxRate, doc.taxMode);
  const isQuote = doc.kind === "quotation";
  const long = isLongForm(doc.kind);
  const isAgreement = doc.kind === "agreement";
  const title =
    doc.kind === "proposal"
      ? "SERVICE PROPOSAL"
      : isAgreement
        ? "MASTER SERVICE AGREEMENT"
        : isQuote
          ? "QUOTATION"
          : biz.gstin
            ? "TAX INVOICE"
            : "INVOICE";

  const sections = doc.sections ?? [];
  const noun =
    doc.kind === "proposal"
      ? "proposal"
      : doc.kind === "agreement"
        ? "agreement"
        : isQuote
          ? "quotation"
          : "invoice";
  /* An agreement has no price. A proposal usually does, but can be sent before
     the numbers settle, so the money block is driven by whether there are
     lines rather than by the kind. */
  const hasMoney = doc.lines.length > 0 && !isAgreement;
  const paid = Number(doc.amountPaid ?? 0);
  const due = Math.max(0, t.total - paid);

  const bizAddrParts = [
    biz.line1,
    [biz.city, biz.region].filter(Boolean).join(", "),
    biz.postalCode,
  ].filter(Boolean);
  const bizAddr = bizAddrParts.join("\n");
  const bizAddrOneLine = bizAddrParts.join(", ");
  /* The scheme is noise on paper — nobody types it and it lengthens the line.
     A trailing slash likewise. */
  const webHost = (biz.url ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "");

  const regs = [
    biz.gstin ? { label: "GSTIN", value: biz.gstin } : null,
    biz.udyam ? { label: "UDYAM / MSME", value: biz.udyam } : null,
    biz.pan ? { label: "PAN", value: biz.pan } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const terms = (doc.terms ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const cl = doc.client;
  const clientAddr = [cl.line1, cl.line2, [cl.city, cl.state].filter(Boolean).join(", "), cl.postalCode]
    .filter(Boolean).join("\n");

  const partyLabel = isAgreement
    ? "THE CLIENT"
    : isQuote || doc.kind === "proposal"
      ? "PREPARED FOR"
      : "BILL TO";

  /* The facts a long document is read against: who, when, until when, and
     which quotation it sits on top of. On an invoice the same facts live in
     the header, where there is room for them because there is no prose. */
  const facts: [string, string][] = long
    ? ([
        [isAgreement ? "Agreement no." : "Proposal no.", doc.number],
        [isAgreement ? "Agreement date" : "Date", dateIn(doc.issueDate)],
        doc.validUntil ? ["Valid until", dateIn(doc.validUntil)] : null,
        [isAgreement ? "Client" : "Prepared for", cl.company || cl.name || ""],
        cl.email || cl.phone
          ? ["Client contact", [cl.name, cl.email, cl.phone].filter(Boolean).join("  ·  ")]
          : null,
        [isAgreement ? "Provider" : "Prepared by", biz.legalName || biz.name],
        doc.sowRef ? [isAgreement ? "Project / SOW" : "Against quotation", doc.sowRef] : null,
      ].filter(Boolean) as [string, string][])
    : [];


  return (
    <Document
      title={`${title} ${doc.number}`}
      author={biz.legalName}
      subject={`${title} for ${cl.company || cl.name || "client"}`}
    >
      <Page size="A4" style={s.page}>
        <View style={s.topRule}>
          <View style={s.topRuleA} />
          <View style={s.topRuleB} />
          <View style={s.topRuleC} />
        </View>

        <View style={s.head}>
          <View>
            <View style={s.lockup}>
              <Mark size={28} />
              <View style={s.lockupText}>
                <Text style={s.bizName}>{biz.legalName || biz.name}</Text>
                {biz.tagline ? (
                  <Text style={s.bizTagline}>{biz.tagline.toUpperCase()}</Text>
                ) : null}
              </View>
            </View>

            {bizAddr ? <Text style={s.bizLine}>{bizAddr}</Text> : null}
            <Text style={s.bizLine}>
              {[biz.phoneDisplay, biz.email].filter(Boolean).join("  ·  ")}
            </Text>
            {webHost ? <Text style={s.bizLine}>{webHost}</Text> : null}
          </View>

          <View>
            <Text style={s.docTitle}>{title}</Text>
            <Text style={s.docNumber}>{doc.number}</Text>
            <View style={s.metaRow}>
              <Text style={s.metaLabel}>DATED</Text>
              <Text style={s.metaValue}>{dateIn(doc.issueDate)}</Text>
            </View>
            {isQuote && doc.validUntil ? (
              <View style={s.metaRow}>
                <Text style={s.metaLabel}>VALID UNTIL</Text>
                <Text style={s.metaValue}>{dateIn(doc.validUntil)}</Text>
              </View>
            ) : null}
            {!isQuote && doc.dueDate ? (
              <View style={s.metaRow}>
                <Text style={s.metaLabel}>DUE</Text>
                <Text style={s.metaValue}>{dateIn(doc.dueDate)}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {regs.length ? (
          <View style={s.regs}>
            {regs.map((r) => (
              <View key={r.label} style={s.reg}>
                <Text style={s.regLabel}>{r.label}</Text>
                <Text style={s.regValue}>{r.value}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={s.headRule} />

        <View style={s.panels}>
          <View style={s.panel}>
            <Text style={s.panelLabel}>{partyLabel}</Text>
            <Text style={s.panelName}>{cl.company || cl.name}</Text>
            {cl.company && cl.name ? <Text style={s.panelText}>{cl.name}</Text> : null}
            {clientAddr ? <Text style={s.panelText}>{clientAddr}</Text> : null}
            {cl.gstin ? <Text style={s.panelText}>GSTIN {cl.gstin}</Text> : null}
            {cl.email ? <Text style={s.panelText}>{cl.email}</Text> : null}
            {cl.phone ? <Text style={s.panelText}>{cl.phone}</Text> : null}
          </View>

          {/* An agreement is between two named parties, so the second panel
              names the provider rather than asking for money. */}
          {isAgreement ? (
            <View style={s.panel}>
              <Text style={s.panelLabel}>THE PROVIDER</Text>
              <Text style={s.panelName}>{biz.legalName || biz.name}</Text>
              {bizAddr ? <Text style={s.panelText}>{bizAddr}</Text> : null}
              {biz.email ? <Text style={s.panelText}>{biz.email}</Text> : null}
              {biz.phoneDisplay ? <Text style={s.panelText}>{biz.phoneDisplay}</Text> : null}
            </View>
          ) : !isQuote && !long && (biz.bankAccount || biz.upi) ? (
            <View style={s.panel}>
              <Text style={s.panelLabel}>PAY TO</Text>
              {biz.bankName ? <Text style={s.panelText}>{biz.bankName}</Text> : null}
              {biz.bankAccount ? <Text style={s.panelText}>A/C {biz.bankAccount}</Text> : null}
              {biz.bankIfsc ? <Text style={s.panelText}>IFSC {biz.bankIfsc}</Text> : null}
              {biz.upi ? <Text style={s.panelText}>UPI {biz.upi}</Text> : null}
            </View>
          ) : null}
        </View>

        {long ? <FactsTable rows={facts} /> : null}

        {hasMoney ? (
          <>
        <View style={[s.tHead, long ? { marginTop: 22 } : {}]}>
          <Text style={[s.tHeadCell, s.cDesc]}>DESCRIPTION</Text>
          <Text style={[s.tHeadCell, s.cQty]}>QTY</Text>
          <Text style={[s.tHeadCell, s.cRate]}>RATE</Text>
          <Text style={[s.tHeadCell, s.cDisc]}>DISC</Text>
          <Text style={[s.tHeadCell, s.cAmt]}>AMOUNT</Text>
        </View>

        {doc.lines.map((l, i) => (
          <View key={i} style={s.row} wrap={false}>
            <View style={s.cDesc}>
              <Text style={s.desc}>{l.description}</Text>
              {l.hsn ? <Text style={s.sub}>SAC/HSN {l.hsn}</Text> : null}
            </View>
            <Text style={[s.desc, s.cQty]}>
              {l.qty} {l.unit || ""}
            </Text>
            <Text style={[s.desc, s.cRate]}>{inrMoney(l.rate)}</Text>
            <Text style={[s.desc, s.cDisc]}>{l.discountPct ? `${l.discountPct}%` : "—"}</Text>
            <Text style={[s.desc, s.cAmt]}>{inrMoney(t.lineTotals[i] ?? 0)}</Text>
          </View>
        ))}

        <View style={s.totals}>
          <View style={s.totalsBox}>
            <View style={s.tRow}>
              <Text style={s.tLabel}>Subtotal</Text>
              <Text style={s.tVal}>{inrMoney(t.subtotal)}</Text>
            </View>
            {t.discount > 0 ? (
              <View style={s.tRow}>
                <Text style={s.tLabel}>Discount ({doc.discountPct}%)</Text>
                <Text style={s.tVal}>−{inrMoney(t.discount)}</Text>
              </View>
            ) : null}
            {doc.taxMode === "cgst_sgst" ? (
              <>
                <View style={s.tRow}>
                  <Text style={s.tLabel}>CGST ({doc.taxRate / 2}%)</Text>
                  <Text style={s.tVal}>{inrMoney(t.cgst)}</Text>
                </View>
                <View style={s.tRow}>
                  <Text style={s.tLabel}>SGST ({doc.taxRate / 2}%)</Text>
                  <Text style={s.tVal}>{inrMoney(t.sgst)}</Text>
                </View>
              </>
            ) : null}
            {doc.taxMode === "igst" ? (
              <View style={s.tRow}>
                <Text style={s.tLabel}>IGST ({doc.taxRate}%)</Text>
                <Text style={s.tVal}>{inrMoney(t.igst)}</Text>
              </View>
            ) : null}
            {t.roundOff !== 0 ? (
              <View style={s.tRow}>
                <Text style={s.tLabel}>Round off</Text>
                <Text style={s.tVal}>
                  {t.roundOff > 0 ? "+" : "−"}
                  {inrMoney(Math.abs(t.roundOff))}
                </Text>
              </View>
            ) : null}

            <View style={s.grand}>
              <Text style={s.grandLabel}>{isQuote ? "Estimate" : "Total"}</Text>
              <Text style={s.grandVal}>{RUPEE}{inrMoney(t.total)}</Text>
            </View>

            {!isQuote && paid > 0 ? (
              <>
                <View style={s.tRow}>
                  <Text style={s.tLabel}>Paid</Text>
                  <Text style={s.tVal}>−{inrMoney(paid)}</Text>
                </View>
                <View style={s.tRow}>
                  <Text style={[s.tLabel, { fontFamily: "Helvetica-Bold", color: INK }]}>
                    Balance due
                  </Text>
                  <Text style={[s.tVal, { fontFamily: "Helvetica-Bold" }]}>
                    {RUPEE}{inrMoney(due)}
                  </Text>
                </View>
              </>
            ) : null}
          </View>
        </View>

        <View style={s.words}>
          <Text style={s.wordsText}>{amountInWords(t.total)}</Text>
        </View>

        {!isQuote && !long && due <= 0 && paid > 0 ? (
          <Text style={s.paidStamp}>PAID IN FULL</Text>
        ) : null}
          </>
        ) : null}

        {sections.map((sec, i) => (
          <SectionBlock key={sec.id || i} section={sec} index={i + 1} />
        ))}

        {doc.notes ? (
          <View style={s.block}>
            <Text style={s.blockLabel}>NOTES</Text>
            <Text style={s.blockText}>{doc.notes}</Text>
          </View>
        ) : null}

        {terms.length ? (
          <View style={s.block}>
            <Text style={s.blockLabel}>TERMS &amp; CONDITIONS</Text>
            {terms.map((line, i) => {
              /* The composer numbers them; the number is pulled out so wrapped
                 text hangs under the text rather than under the digit. */
              const m = /^(\d+)\.\s*(.*)$/.exec(line);
              return (
                <View key={i} style={s.clause} wrap={false}>
                  <Text style={s.clauseNum}>{m ? `${m[1]}.` : "\u00B7"}</Text>
                  <Text style={s.clauseText}>{m ? m[2] : line}</Text>
                </View>
              );
            })}
          </View>
        ) : null}

        {/* Only where there is money to not have taxed. An agreement states no
            price at all, so a line about tax on it is nonsense. */}
        {!biz.gstin && hasMoney ? (
          <View style={s.block}>
            <Text style={s.blockText}>
              Not registered for GST. No tax has been charged on this {noun}.
            </Text>
          </View>
        ) : null}

        {long ? (
          <SignatureBlock
            left={biz.legalName || biz.name}
            right={cl.company || cl.name || "Client"}
            leftLabel={isAgreement ? "FOR THE PROVIDER" : "FOR " + (biz.legalName || biz.name).toUpperCase()}
            rightLabel={isAgreement ? "FOR THE CLIENT" : "ACCEPTED BY THE CLIENT"}
          />
        ) : null}

        {/* `fixed` repeats this on every page. A two-page invoice whose second
            sheet carries no contact details is a second sheet nobody can act
            on. */}
        <View style={s.foot} fixed>
          <View style={s.footTop}>
            <View style={s.footLockup}>
              <Mark size={12} />
              <Text style={s.footName}>{biz.legalName || biz.name}</Text>
            </View>
            {/* The number rides in the footer so that a second sheet, separated
                from the first in somebody's pile of paper, still says which
                document it belongs to. */}
            <Text
              style={s.footText}
              render={({ pageNumber, totalPages }) =>
                `${doc.number}   ·   Page ${pageNumber} of ${totalPages}`
              }
            />
          </View>
          <Text style={s.footDetail}>
            {[bizAddrOneLine, webHost, biz.email, biz.phoneDisplay]
              .filter(Boolean)
              .join("   ·   ")}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
