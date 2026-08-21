/* ==========================================================================
   SHOWCASE — the product carousel.

   Each slide is a real product or deployment. `image` points at a screenshot
   in /public/showcase/; when it is empty the carousel renders a labelled
   placeholder frame instead, so the section looks intentional before the
   screenshots arrive rather than broken.

   To add a screenshot: drop the file in public/showcase/ and set `image`.
   Recommended 1600×1000 (16:10), WebP, under 250 KB.
   ========================================================================== */

export type Slide = {
  id: string;
  title: string;
  /** One line under the title. */
  kicker: string;
  /** What the client got out of it. */
  summary: string;
  /** Chips shown on the frame. */
  tags: string[];
  /** Path under /public, or "" for a placeholder frame. */
  image: string;
  /** Links to the service that delivers this. */
  serviceSlug: string;
  /** Optional live URL. */
  liveUrl?: string;
};

export const slides: Slide[] = [
  {
    id: "frappe-crm",
    title: "Frappe CRM",
    kicker: "Sales pipeline, deployed and customised",
    summary:
      "A self-hosted CRM on the Frappe framework — pipeline stages, lead assignment, quotations and dashboards, customised to the client's own sales process rather than a vendor's template. No per-seat licence.",
    tags: ["Frappe", "Python", "MariaDB", "Self-hosted"],
    image: "",
    serviceSlug: "crm",
  },
  {
    id: "erpnext",
    title: "ERPNext Deployment",
    kicker: "Inventory, purchasing and GST billing",
    summary:
      "ERPNext deployed and customised with the modules the business actually uses — stock, purchase, sales and GST-compliant invoicing — with print formats matching the documents they already issue.",
    tags: ["ERPNext", "Custom DocTypes", "Jinja print", "GST"],
    image: "",
    serviceSlug: "erp-system",
  },
  {
    id: "moveeasy",
    title: "MoveEasy — Movers Platform",
    kicker: "Survey to delivery, in one system",
    summary:
      "A relocation platform covering the whole job: an offline-capable survey app that produces volume-based quotes, consignment paperwork, a dispatch board with real capacity, and customer tracking links.",
    tags: ["React", "Node", "MongoDB", "React Native"],
    image: "",
    serviceSlug: "billing-platform-app",
  },
  {
    id: "pharmacare",
    title: "Pharmacare",
    kicker: "Batch inventory and expiry control",
    summary:
      "A pharmacy system running 100–150 transactions a day on batch-level stock, with first-expiry-first-out dispensing, tiered expiry alerts grouped by supplier, and WhatsApp refill reminders.",
    tags: ["React", "Node", "MongoDB", "WhatsApp API"],
    image: "",
    serviceSlug: "erp-system",
  },
  {
    id: "herbal-care",
    title: "Herbal Care",
    kicker: "Product catalogue and orders",
    summary:
      "A product-led site with an admin panel for catalogue, pricing and enquiries — built so the team updates products themselves without a developer in the loop.",
    tags: ["Next.js", "Admin panel", "Catalogue"],
    image: "",
    serviceSlug: "dynamic-website",
  },
  {
    id: "billing-app",
    title: "Billing Web App",
    kicker: "Invoices, payments and reconciliation",
    summary:
      "GST-correct invoicing with part-payments, credit notes and a payment gateway wired with idempotency, so a provider outage can never double-charge or lose a transaction.",
    tags: ["Next.js", "PostgreSQL", "Razorpay"],
    image: "",
    serviceSlug: "billing-platform-app",
  },
];
