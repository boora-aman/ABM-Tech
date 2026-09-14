import {
  Document, Page, Text, View, StyleSheet,
} from "@react-pdf/renderer";
import { computeTotals, inrMoney, amountInWords, type Line } from "@/lib/billing";

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

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 9, color: INK, fontFamily: "Helvetica" },

  topRule: { height: 3, backgroundColor: BRAND, marginBottom: 22 },

  head: { flexDirection: "row", justifyContent: "space-between", marginBottom: 26 },
  bizName: { fontSize: 17, fontFamily: "Helvetica-Bold", letterSpacing: -0.4 },
  bizLine: { fontSize: 8, color: DIM, marginTop: 2 },

  docTitle: {
    fontSize: 15, fontFamily: "Helvetica-Bold", color: BRAND,
    textAlign: "right", letterSpacing: 0.4,
  },
  docMeta: { fontSize: 8.5, color: DIM, textAlign: "right", marginTop: 3 },

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

  paidStamp: {
    marginTop: 10, alignSelf: "flex-start",
    borderWidth: 1, borderColor: "#2F7A4F", color: "#2F7A4F",
    paddingVertical: 3, paddingHorizontal: 9, borderRadius: 3,
    fontSize: 9, fontFamily: "Helvetica-Bold", letterSpacing: 1,
  },

  foot: {
    position: "absolute", bottom: 28, left: 40, right: 40,
    borderTopWidth: 0.5, borderTopColor: LINE, paddingTop: 8,
    flexDirection: "row", justifyContent: "space-between",
  },
  footText: { fontSize: 7.5, color: FAINT },
});

export type PdfBiz = {
  name: string;
  legalName: string;
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
  kind: "quotation" | "invoice";
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
  const title = isQuote ? "QUOTATION" : biz.gstin ? "TAX INVOICE" : "INVOICE";
  const paid = Number(doc.amountPaid ?? 0);
  const due = Math.max(0, t.total - paid);

  const bizAddr = [biz.line1, [biz.city, biz.region].filter(Boolean).join(", "), biz.postalCode]
    .filter(Boolean).join("\n");
  const cl = doc.client;
  const clientAddr = [cl.line1, cl.line2, [cl.city, cl.state].filter(Boolean).join(", "), cl.postalCode]
    .filter(Boolean).join("\n");

  return (
    <Document
      title={`${title} ${doc.number}`}
      author={biz.legalName}
      subject={`${title} for ${cl.company || cl.name || "client"}`}
    >
      <Page size="A4" style={s.page}>
        <View style={s.topRule} />

        <View style={s.head}>
          <View>
            <Text style={s.bizName}>{biz.legalName || biz.name}</Text>
            {bizAddr ? <Text style={s.bizLine}>{bizAddr}</Text> : null}
            <Text style={s.bizLine}>
              {biz.email}
              {biz.phoneDisplay ? `  ·  ${biz.phoneDisplay}` : ""}
            </Text>
            {biz.gstin ? <Text style={s.bizLine}>GSTIN {biz.gstin}</Text> : null}
            {biz.udyam ? <Text style={s.bizLine}>Udyam {biz.udyam}</Text> : null}
            {biz.pan ? <Text style={s.bizLine}>PAN {biz.pan}</Text> : null}
          </View>

          <View>
            <Text style={s.docTitle}>{title}</Text>
            <Text style={s.docMeta}>{doc.number}</Text>
            <Text style={s.docMeta}>Dated {dateIn(doc.issueDate)}</Text>
            {isQuote && doc.validUntil ? (
              <Text style={s.docMeta}>Valid until {dateIn(doc.validUntil)}</Text>
            ) : null}
            {!isQuote && doc.dueDate ? (
              <Text style={s.docMeta}>Due {dateIn(doc.dueDate)}</Text>
            ) : null}
          </View>
        </View>

        <View style={s.panels}>
          <View style={s.panel}>
            <Text style={s.panelLabel}>{isQuote ? "PREPARED FOR" : "BILL TO"}</Text>
            <Text style={s.panelName}>{cl.company || cl.name}</Text>
            {cl.company && cl.name ? <Text style={s.panelText}>{cl.name}</Text> : null}
            {clientAddr ? <Text style={s.panelText}>{clientAddr}</Text> : null}
            {cl.gstin ? <Text style={s.panelText}>GSTIN {cl.gstin}</Text> : null}
            {cl.email ? <Text style={s.panelText}>{cl.email}</Text> : null}
            {cl.phone ? <Text style={s.panelText}>{cl.phone}</Text> : null}
          </View>

          {!isQuote && (biz.bankAccount || biz.upi) ? (
            <View style={s.panel}>
              <Text style={s.panelLabel}>PAY TO</Text>
              {biz.bankName ? <Text style={s.panelText}>{biz.bankName}</Text> : null}
              {biz.bankAccount ? <Text style={s.panelText}>A/C {biz.bankAccount}</Text> : null}
              {biz.bankIfsc ? <Text style={s.panelText}>IFSC {biz.bankIfsc}</Text> : null}
              {biz.upi ? <Text style={s.panelText}>UPI {biz.upi}</Text> : null}
            </View>
          ) : null}
        </View>

        <View style={s.tHead}>
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

        {!isQuote && due <= 0 && paid > 0 ? (
          <Text style={s.paidStamp}>PAID IN FULL</Text>
        ) : null}

        {doc.notes ? (
          <View style={s.block}>
            <Text style={s.blockLabel}>NOTES</Text>
            <Text style={s.blockText}>{doc.notes}</Text>
          </View>
        ) : null}

        {doc.terms ? (
          <View style={s.block}>
            <Text style={s.blockLabel}>TERMS</Text>
            <Text style={s.blockText}>{doc.terms}</Text>
          </View>
        ) : null}

        {!biz.gstin ? (
          <View style={s.block}>
            <Text style={s.blockText}>
              Not registered for GST. No tax has been charged on this{" "}
              {isQuote ? "quotation" : "invoice"}.
            </Text>
          </View>
        ) : null}

        <View style={s.foot} fixed>
          <Text style={s.footText}>
            {biz.legalName || biz.name} · {biz.email}
          </Text>
          <Text
            style={s.footText}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
