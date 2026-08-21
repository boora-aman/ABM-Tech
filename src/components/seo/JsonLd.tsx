/**
 * Emits JSON-LD in the initial HTML. Kept a server component deliberately —
 * structured data injected after hydration is unreliable for crawlers and
 * invisible to most LLM retrievers.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Built from our own typed builders, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
