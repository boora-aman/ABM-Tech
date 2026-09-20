import { Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Section } from "@/lib/billing-sections";

/* ==========================================================================
   LONG-FORM BLOCKS — the parts a proposal and an agreement need and an
   invoice does not: numbered sections, prose, bullets, tables, checklists and
   a signature block.

   Kept apart from InvoiceDoc because it is a different job. An invoice is one
   page of arithmetic; a proposal is a document that breaks across pages, and
   the rules that matter here are about not orphaning a heading from the first
   line under it.
   ========================================================================== */

const INK = "#14161A";
const DIM = "#4A5058";
const FAINT = "#8A9099";
const LINE = "#DCD9D2";
const PAPER = "#F4F2ED";
const BRAND = "#D6400F";

const s = StyleSheet.create({
  section: { marginTop: 16 },
  headRow: { flexDirection: "row", alignItems: "baseline", marginBottom: 6 },
  num: { fontSize: 9, color: BRAND, fontFamily: "Helvetica-Bold", width: 16 },
  heading: { fontSize: 10.5, fontFamily: "Helvetica-Bold", flex: 1 },

  para: { fontSize: 9, color: DIM, lineHeight: 1.55, marginBottom: 6, marginLeft: 16 },

  bullet: { flexDirection: "row", marginBottom: 4, marginLeft: 16 },
  dot: { width: 10, fontSize: 9, color: FAINT },
  bulletText: { flex: 1, fontSize: 9, color: DIM, lineHeight: 1.5 },

  box: { width: 8, height: 8, borderWidth: 0.8, borderColor: FAINT, marginTop: 1.5, marginRight: 7 },

  table: { marginLeft: 16, borderTopWidth: 0.5, borderTopColor: LINE },
  tr: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: LINE },
  th: {
    backgroundColor: PAPER, fontSize: 7, letterSpacing: 0.7, color: FAINT,
    fontFamily: "Helvetica-Bold", paddingVertical: 5, paddingHorizontal: 6,
  },
  td: { fontSize: 8.5, color: DIM, lineHeight: 1.45, paddingVertical: 5, paddingHorizontal: 6 },
  tdFirst: { color: INK },

  signWrap: { marginTop: 26, flexDirection: "row", gap: 26 },
  signCol: { flex: 1 },
  signFor: {
    fontSize: 7, letterSpacing: 1, color: FAINT,
    fontFamily: "Helvetica-Bold", marginBottom: 10,
  },
  signParty: { fontSize: 9.5, fontFamily: "Helvetica-Bold", marginBottom: 14 },
  signField: { marginBottom: 12 },
  signRule: { borderBottomWidth: 0.5, borderBottomColor: INK, height: 16 },
  signLabel: { fontSize: 7, color: FAINT, marginTop: 3 },
});

function Table({ columns, rows }: { columns?: string[]; rows?: string[][] }) {
  const cols = columns ?? [];
  const width = (i: number) =>
    /* The first column is a label and the rest carry the sentences, so an even
       split wastes the page. Two columns give the label a third. */
    cols.length === 2 ? (i === 0 ? "32%" : "68%") : `${100 / Math.max(cols.length, 1)}%`;

  const header = cols.length ? (
    <View style={s.tr}>
      {cols.map((c, i) => (
        <Text key={i} style={[s.th, { width: width(i) }]}>
          {c.toUpperCase()}
        </Text>
      ))}
    </View>
  ) : null;

  const dataRow = (r: string[], ri: number) => (
    /* A row split across a page break puts the label on one sheet and its
       answer on the next. */
    <View key={ri} style={s.tr} wrap={false}>
      {r.map((cell, ci) => (
        <Text key={ci} style={[s.td, ci === 0 ? s.tdFirst : {}, { width: width(ci) }]}>
          {cell}
        </Text>
      ))}
    </View>
  );

  const all = rows ?? [];

  return (
    <View style={s.table}>
      {/* Not `fixed`. A fixed header is laid out per page and would print
          alone at the foot of a page with every row overleaf. The caller
          groups the header with the section heading instead. */}
      {header}
      {all.map((r, i) => dataRow(r, i))}
    </View>
  );
}

export function SectionBlock({ section, index }: { section: Section; index: number }) {
  const head = (
    <View style={s.headRow}>
      <Text style={s.num}>{index}.</Text>
      <Text style={s.heading}>{section.heading}</Text>
    </View>
  );

  const paras =
    section.kind === "text"
      ? (section.body ?? "")
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter(Boolean)
      : [];

  const items = section.kind === "bullets" || section.kind === "checklist"
    ? (section.items ?? [])
    : [];

  const bullet = (it: string, i: number) => (
    <View key={i} style={s.bullet} wrap={false}>
      {section.kind === "checklist" ? <View style={s.box} /> : <Text style={s.dot}>&#183;</Text>}
      <Text style={s.bulletText}>{it}</Text>
    </View>
  );

  /* The heading is physically bound to its first chunk of content in one
     unbreakable group, rather than asking the layout to reserve space with
     minPresenceAhead — which react-pdf honours inconsistently once the
     content that follows is a sibling rather than a child, and which left
     headings stranded at the foot of a page with their table overleaf. */
  const table = section.kind === "table"
    ? <Table columns={section.columns} rows={section.rows} />
    : null;

  return (
    <View style={s.section}>
      <View wrap={false}>
        {head}
        {paras.length ? <Text style={s.para}>{paras[0]}</Text> : null}
        {items.length ? bullet(items[0], 0) : null}
        {table}
      </View>

      {paras.slice(1).map((p, i) => (
        <Text key={i} style={s.para}>
          {p}
        </Text>
      ))}
      {items.slice(1).map((it, i) => bullet(it, i + 1))}
    </View>
  );
}

/**
 * The signature block.
 *
 * Both columns carry the same four fields. A block where one side has fewer
 * lines than the other invites somebody to sign without dating it.
 */
export function SignatureBlock({
  left,
  right,
  leftLabel = "FOR THE PROVIDER",
  rightLabel = "FOR THE CLIENT",
}: {
  left: string;
  right: string;
  leftLabel?: string;
  rightLabel?: string;
}) {
  const fields = ["Signature", "Name", "Designation", "Date"];
  return (
    <View style={s.signWrap} wrap={false}>
      {[
        { label: leftLabel, party: left },
        { label: rightLabel, party: right },
      ].map((col) => (
        <View key={col.label} style={s.signCol}>
          <Text style={s.signFor}>{col.label}</Text>
          <Text style={s.signParty}>{col.party}</Text>
          {fields.map((f) => (
            <View key={f} style={s.signField}>
              <View style={s.signRule} />
              <Text style={s.signLabel}>{f}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

/** The small facts table under the header: who, what, when, against which SOW. */
export function FactsTable({ rows }: { rows: [string, string][] }) {
  return (
    <View style={[s.table, { marginLeft: 0 }]}>
      {rows.map(([k, v]) => (
        <View key={k} style={s.tr} wrap={false}>
          <Text style={[s.th, { width: "32%" }]}>{k.toUpperCase()}</Text>
          <Text style={[s.td, s.tdFirst, { width: "68%" }]}>{v}</Text>
        </View>
      ))}
    </View>
  );
}
