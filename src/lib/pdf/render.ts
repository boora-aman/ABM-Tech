import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import { InvoiceDoc, type PdfBiz, type PdfDoc } from "./InvoiceDoc";

/**
 * Render a billing document to a PDF buffer. Node runtime only.
 *
 * The cast is needed because renderToBuffer is typed against a Document
 * element, while InvoiceDoc is a component that RETURNS one — TypeScript has
 * no way to see through the component boundary to know the result is a
 * Document. The relationship is guaranteed by InvoiceDoc's own return type.
 */
export async function renderDocPdf(doc: PdfDoc, biz: PdfBiz): Promise<Buffer> {
  const el = createElement(InvoiceDoc, { doc, biz }) as unknown as ReactElement<DocumentProps>;
  return renderToBuffer(el);
}

/** Filename a browser or mail client should save it as. */
export function pdfFilename(doc: { kind: string; number: string }) {
  return `${doc.number.replace(/\//g, "-")}.pdf`;
}
