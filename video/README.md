# ABM Tech — brand reel

A 30-second brand video, written as code with [Remotion](https://www.remotion.dev)
and rendered to MP4. Two cuts from one source:

| Composition | Size | For |
|---|---|---|
| `BrandReel` | 1080×1920 | Instagram and Facebook Reels, YouTube Shorts, WhatsApp status |
| `BrandReelSquare` | 1080×1080 | Feed posts, the Google Business Profile video slot |

```bash
npm install
npm run studio        # live preview, scrub the timeline
npm run render:all    # both MP4s and the cover image into out/
```

Remotion downloads its own headless Chrome on first render. To use one that is
already installed, add `--browser-executable=/usr/bin/google-chrome`.

## The words come from the site

`src/brand.ts` imports the six systems from `src/lib/content/pillars.ts`, the
commitments from `src/lib/content/faq.ts`, and the name, promise, phone and URL
from `src/lib/site.config.ts` — the same files the website renders. Rename a
pillar on the site and the next render says the new name. Nothing here holds
its own copy of the copy.

That only works because those three files import nothing through the `@/`
alias. Keep it that way, or this bundle stops resolving them.

## Headlines size themselves

Every large line is measured in the DOM and set to the biggest size that fits
its column (`useFit` in `src/Reel.tsx`). Syne at weight 800 is wide enough that
hand-picked sizes were wrong by a third, and since the copy is imported, a
longer pillar name has to shrink rather than run off the frame. Canvas-based
measurement was tried first and measured this face ~33% too wide.

## Safe zones

Text stays out of the top band (account name), the right edge (like, comment,
share) and the bottom third (the caption expands over it). The margins are in
`useLayout`.

## Audio

Deliberately silent. Add a trending track inside Instagram or Facebook when
posting — native audio is favoured by the feed, and a baked-in track is a
licence you would otherwise have to own.

## Output

H.264, `yuv420p`, BT.709, CRF 16. The platforms re-encode on upload; starting
near-lossless means their compression is the only one that shows. Rendered
files go to `out/`, which is gitignored.

## Licence

Remotion is free for individuals and for companies of up to three people.
Above that it needs a company licence — check remotion.dev/license.
