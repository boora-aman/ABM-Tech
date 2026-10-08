import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { inrMoney, amountInWords } from "@/lib/billing";
import type { ReceiptData } from "@/lib/billing-repo";
import {
  Letterhead,
  Footer,
  s as base,
  dateIn,
  RUPEE,
  BRAND,
  INK,
  DIM,
  FAINT,
  LINE,
  PAPER,
  type PdfBiz,
} from "@/lib/pdf/InvoiceDoc";

/* ==========================================================================
   PAYMENT RECEIPT

   One per payment, not one per invoice. A client who pays an invoice in
   three parts gets three receipts, each saying what was received that day
   and what was still owed after it. That is what a receipt is for: the
   client's proof that a specific sum changed hands, which they may need long
   after the invoice itself is settled.

   Same letterhead and footer as every other document, through the shared
   components, so it cannot drift into looking like it came from someone else.
   ========================================================================== */

const METHOD: Record<string, string> = {
  upi: "UPI",
  neft: "NEFT",
  imps: "IMPS",
  rtgs: "RTGS",
  cash: "Cash",
  cheque: "Cheque",
  card: "Card",
  other: "Other",
};

const r = StyleSheet.create({
  hero: {
    marginTop: 4,
    marginBottom: 18,
    backgroundColor: PAPER,
    borderRadius: 3,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  heroLabel: {
    fontSize: 7, color: FAINT, letterSpacing: 1, fontFamily: "Helvetica-Bold", marginBottom: 5,
  },
  heroAmount: { fontSize: 24, fontFamily: "Helvetica-Bold", color: BRAND, letterSpacing: -0.3 },
  heroWords: { fontSize: 8.5, color: DIM, marginTop: 5, maxWidth: 300 },
  badge: {
    borderWidth: 1, borderRadius: 3, paddingVertical: 4, paddingHorizontal: 9,
    fontSize: 8.5, fontFamily: "Helvetica-Bold", letterSpacing: 1,
  },

  tLabelCol: { width: "62%", fontSize: 8.5, color: DIM, paddingVertical: 6, paddingHorizontal: 8 },
  tValCol: { width: "38%", fontSize: 8.5, color: INK, paddingVertical: 6, paddingHorizontal: 8, textAlign: "right" },
  tr: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: LINE },
  trStrong: { flexDirection: "row", borderTopWidth: 1.2, borderTopColor: INK },
  strong: { fontFamily: "Helvetica-Bold", color: INK },

  sign: { marginTop: 34, alignSelf: "flex-end", width: 200 },
  signFor: { fontSize: 8.5, fontFamily: "Helvetica-Bold", marginBottom: 30 },
  signRule: { borderBottomWidth: 0.5, borderBottomColor: INK },
  signLabel: { fontSize: 7, color: FAINT, marginTop: 3 },
});

export function ReceiptDoc({ receipt, biz }: { receipt: ReceiptData; biz: PdfBiz }) {
  const cl = receipt.invoice.client;
  const clientAddr = [cl.line1, cl.line2, [cl.city, cl.state].filter(Boolean).join(", "), cl.postalCode]
    .filter(Boolean)
    .join("\n");
  const settled = receipt.balanceAfter <= 0;
  const part = !settled;

  const rows: [string, string, boolean?][] = [
    ["Invoice total", RUPEE + inrMoney(receipt.invoice.total)],
    ["Received before this receipt", RUPEE + inrMoney(receipt.paidBefore)],
    ["This receipt", RUPEE + inrMoney(receipt.amount), true],
    ["Total received to date", RUPEE + inrMoney(receipt.paidToDate)],
  ];

  return (
    <Document
      title={`PAYMENT RECEIPT ${receipt.number}`}
      author={biz.legalName}
      subject={`Receipt against ${receipt.invoice.number}`}
    >
      <Page size="A4" style={base.page}>
        <Letterhead
          biz={biz}
          title="PAYMENT RECEIPT"
          number={receipt.number}
          meta={[
            ["RECEIVED", dateIn(receipt.date)],
            ["AGAINST", receipt.invoice.number],
          ]}
        />

        <View style={base.panels}>
          <View style={base.panel}>
            <Text style={base.panelLabel}>RECEIVED FROM</Text>
            <Text style={base.panelName}>{cl.company || cl.name}</Text>
            {cl.company && cl.name ? <Text style={base.panelText}>{cl.name}</Text> : null}
            {clientAddr ? <Text style={base.panelText}>{clientAddr}</Text> : null}
            {cl.email ? <Text style={base.panelText}>{cl.email}</Text> : null}
          </View>
          <View style={base.panel}>
            <Text style={base.panelLabel}>PAYMENT DETAILS</Text>
            <Text style={base.panelText}>Method  ·  {METHOD[receipt.method] ?? receipt.method}</Text>
            {receipt.reference ? (
              <Text style={base.panelText}>Reference  ·  {receipt.reference}</Text>
            ) : null}
            <Text style={base.panelText}>Date  ·  {dateIn(receipt.date)}</Text>
            <Text style={base.panelText}>Invoice  ·  {receipt.invoice.number}</Text>
            <Text style={base.panelText}>Invoice date  ·  {dateIn(receipt.invoice.issueDate)}</Text>
          </View>
        </View>

        <View style={r.hero}>
          <View>
            <Text style={r.heroLabel}>AMOUNT RECEIVED</Text>
            <Text style={r.heroAmount}>
              {RUPEE}
              {inrMoney(receipt.amount)}
            </Text>
            <Text style={r.heroWords}>{amountInWords(receipt.amount)}</Text>
          </View>
          {/* Settled reads green, part payment reads in the brand colour. A
              client should be able to tell from across a desk which kind of
              receipt they are holding. */}
          <Text
            style={[
              r.badge,
              settled
                ? { borderColor: "#2F7A4F", color: "#2F7A4F" }
                : { borderColor: BRAND, color: BRAND },
            ]}
          >
            {settled ? "PAID IN FULL" : "PART PAYMENT"}
          </Text>
        </View>

        <View style={{ borderTopWidth: 0.5, borderTopColor: LINE }}>
          {rows.map(([k, v, strong]) => (
            <View key={k} style={r.tr}>
              <Text style={[r.tLabelCol, strong ? r.strong : {}]}>{k}</Text>
              <Text style={[r.tValCol, strong ? r.strong : {}]}>{v}</Text>
            </View>
          ))}
          <View style={r.trStrong}>
            <Text style={[r.tLabelCol, r.strong, { fontSize: 10 }]}>
              {part ? "Balance still due" : "Balance due"}
            </Text>
            <Text style={[r.tValCol, r.strong, { fontSize: 10, color: part ? BRAND : INK }]}>
              {RUPEE}
              {inrMoney(receipt.balanceAfter)}
            </Text>
          </View>
        </View>

        {part && receipt.invoice.dueDate ? (
          <View style={base.block}>
            <Text style={base.blockText}>
              The balance of {RUPEE}
              {inrMoney(receipt.balanceAfter)} on invoice {receipt.invoice.number} is due by{" "}
              {dateIn(receipt.invoice.dueDate)}.
            </Text>
          </View>
        ) : null}

        {receipt.note ? (
          <View style={base.block}>
            <Text style={base.blockLabel}>NOTE</Text>
            <Text style={base.blockText}>{receipt.note}</Text>
          </View>
        ) : null}

        <View style={base.block}>
          <Text style={base.blockText}>
            This receipt acknowledges payment received against the invoice named above. It is
            not a tax invoice.
          </Text>
        </View>

        <View style={r.sign} wrap={false}>
          <Text style={r.signFor}>For {biz.legalName || biz.name}</Text>
          <View style={r.signRule} />
          <Text style={r.signLabel}>Authorised signatory</Text>
        </View>

        <Footer biz={biz} number={receipt.number} />
      </Page>
    </Document>
  );
}
