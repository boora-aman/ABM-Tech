/* ==========================================================================
   WORK — deliberately short.

   Four engagements, described by capability and outcome rather than by client
   name. Anonymised is the honest default for commercial work under NDA, and a
   thin truthful list reads better than a padded one.

   `guts` is what the X-ray interaction exposes beneath each showcase: the real
   structure under the interface. That is the proof the design is making.
   ========================================================================== */

export type Project = {
  slug: string;
  index: string;
  title: string;
  sector: string;
  year: string;
  /** One line for the rack spine. */
  spine: string;
  summary: string;
  problem: string;
  built: string;
  outcomes: { metric: string; value: string }[];
  stack: string[];
  /** Exposed by the X-ray hover: tables, endpoints, jobs. */
  guts: { label: string; items: string[] }[];
  serviceSlug: string;
};

export const projects: Project[] = [
  {
    slug: "pharmacy-erp",
    index: "01",
    title: "Pharmacy ERP",
    sector: "Healthcare retail",
    year: "2025",
    spine: "Batch inventory · expiry control · GST billing",
    serviceSlug: "erp-system",
    summary:
      "A retail pharmacy running 100–150 transactions a day on batch-level inventory, with expiry control and prescription-gated dispensing.",
    problem:
      "Generic billing software treats a medicine as one product. The same SKU actually sits on the shelf in three batches at three expiry dates and sometimes three printed MRPs, so batch tracking lived in a paper notebook beside the till — which meant expiry losses were discovered during stock-taking, after the supplier return window had closed.",
    built:
      "Inventory modelled at batch level from the ground up, with first-expiry-first-out selection at billing so old stock clears before it becomes a write-off. Expiry alerts fire in 90/60/30-day tiers grouped by supplier, so one return covers a dozen items. Schedule H dispensing is blocked server-side until the prescribing doctor and prescription reference are captured. Reorder points compute from real sales velocity against supplier lead time rather than a fixed minimum.",
    outcomes: [
      { metric: "Daily transactions", value: "100–150" },
      { metric: "Inventory granularity", value: "Per batch" },
      { metric: "Expiry write-offs", value: "Caught in window" },
      { metric: "Compliance gate", value: "Server-enforced" },
    ],
    stack: ["Next.js", "MongoDB", "Node", "WhatsApp API", "node-cron"],
    guts: [
      { label: "Collections", items: ["items", "batches", "invoices", "invoice_lines", "suppliers", "purchase_orders", "prescriptions", "ledger"] },
      { label: "Endpoints", items: ["POST /bill", "GET /stock/fefo", "POST /grn", "GET /reports/expiry", "POST /prescription/verify"] },
      { label: "Scheduled jobs", items: ["expiry:tier-scan (daily 02:00)", "reorder:suggest (daily 06:00)", "refill:whatsapp (daily 10:00)"] },
    ],
  },
  {
    slug: "field-service-crm",
    index: "02",
    title: "Field Service CRM",
    sector: "Home services",
    year: "2025",
    spine: "Pipeline · dispatch · technician app",
    serviceSlug: "crm",
    summary:
      "Enquiry-to-invoice for a service business with technicians in the field, replacing a WhatsApp group and a shared spreadsheet.",
    problem:
      "Enquiries arrived across three phone numbers and a website form, were copied into a spreadsheet when someone remembered, and got assigned to technicians in a WhatsApp group. Nobody could say how many jobs were open, which technician was free, or why a customer from ten days ago had never been called back.",
    built:
      "A single pipeline with stage-gated required fields and an owner on every record. Overdue follow-ups escalate to the manager's board rather than sitting silently on a rep's list. Technicians get a mobile view of their assigned jobs that works offline in basements and stairwells, with photo capture on completion feeding straight into the invoice.",
    outcomes: [
      { metric: "Lead sources unified", value: "4 → 1" },
      { metric: "Follow-up visibility", value: "Escalating" },
      { metric: "Field app", value: "Offline-first" },
      { metric: "Job to invoice", value: "Same day" },
    ],
    stack: ["Next.js", "PostgreSQL", "React Native", "Expo", "Auth.js"],
    guts: [
      { label: "Tables", items: ["leads", "stages", "assignments", "jobs", "job_photos", "invoices", "technicians", "activity_log"] },
      { label: "Endpoints", items: ["POST /leads/intake", "PATCH /leads/:id/stage", "GET /jobs/mine", "POST /jobs/:id/complete"] },
      { label: "Rules", items: ["stage_required_fields", "auto_assign_by_area", "overdue_escalation_24h", "margin_floor_check"] },
    ],
  },
  {
    slug: "billing-platform",
    index: "03",
    title: "Billing Platform + App",
    sector: "Fuel & retail",
    year: "2024",
    spine: "Shift reconciliation · 30+ reports · 3 sites",
    serviceSlug: "billing-platform-app",
    summary:
      "Multi-site billing and reconciliation where every shift closes with an attributed variance instead of a next-day paper argument.",
    problem:
      "Fuel retail reconciles in a way no standard billing module expects: dip readings against nozzle totalisers against cash collected against credit issued, per shift, per attendant. Across three sites this happened on paper the following morning, by which point nobody could say which shift a shortfall belonged to.",
    built:
      "Nozzle-level entry capturing opening and closing totaliser readings, tank dips and density, reconciled against cash, card and credit at shift close — so a variance is attributed while the attendant is still on site. Credit customers carry limits enforced at the point of sale rather than reviewed monthly. Thirty-plus reports built from what the operators actually asked for each morning.",
    outcomes: [
      { metric: "Sites live", value: "3" },
      { metric: "Custom reports", value: "30+" },
      { metric: "Variance attribution", value: "Per shift" },
      { metric: "Credit control", value: "At point of sale" },
    ],
    stack: ["Frappe", "Python", "MariaDB", "Jinja print", "Query reports"],
    guts: [
      { label: "DocTypes", items: ["Shift", "Nozzle Reading", "Tank Dip", "Fuel Invoice", "Credit Customer", "Variance Entry"] },
      { label: "Reports", items: ["daily_summary", "credit_ageing", "attendant_wise_sales", "nozzle_throughput", "shift_variance"] },
      { label: "Controls", items: ["credit_limit_at_sale", "role_split_cashier_manager", "reading_immutable_after_close"] },
    ],
  },
  {
    slug: "document-automation",
    index: "04",
    title: "Invoice Extraction Pipeline",
    sector: "Distribution",
    year: "2026",
    spine: "PDF → structured data · human review",
    serviceSlug: "ai-automation",
    summary:
      "An extraction pipeline replacing hours of daily retyping, with a confidence threshold that routes anything uncertain to a person.",
    problem:
      "A staff member spent most of each morning opening supplier invoice PDFs and retyping line items, quantities and rates into a spreadsheet. High volume, entirely mechanical, and error-prone in exactly the way that produces disputes with suppliers three weeks later.",
    built:
      "Invoices land in a watched inbox, get parsed to structured line items, and are written straight through when extraction confidence is high. Anything below the threshold — a scanned copy, an unusual layout, a smudged total — goes to a review queue where one click confirms or corrects it. Accuracy is logged per supplier, and drift raises an alert rather than quietly corrupting a quarter of data.",
    outcomes: [
      { metric: "Manual retyping", value: "Mostly removed" },
      { metric: "Low-confidence path", value: "Human review" },
      { metric: "Accuracy tracking", value: "Per supplier" },
      { metric: "Failure mode", value: "Queue, not silence" },
    ],
    stack: ["Next.js", "AI SDK", "Vision OCR", "Queues", "Postgres"],
    guts: [
      { label: "Pipeline", items: ["inbox:watch", "pdf:split", "ocr:extract", "schema:validate", "confidence:gate", "review:queue", "commit:ledger"] },
      { label: "Guards", items: ["confidence_threshold=0.92", "totals_must_reconcile", "duplicate_invoice_hash", "supplier_drift_alert"] },
      { label: "Endpoints", items: ["POST /ingest", "GET /review/pending", "POST /review/:id/confirm"] },
    ],
  },
];

export const projectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);
