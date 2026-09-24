/* ==========================================================================
   BRAND — everything the reel says and looks like, pulled from the site.

   The copy is imported, not retyped. pillars.ts and faq.ts are the same files
   the website renders its six systems and its commitments from, and both are
   free of imports, so the bundler can reach them from here. Edit a pillar
   name on the site and the next render says the new thing. A reel with its
   own copy of the words is a reel that is out of date by the next edit.
   ========================================================================== */

import { loadFont as loadSyne } from "@remotion/google-fonts/Syne";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { pillars } from "../../src/lib/content/pillars";
import { commitments } from "../../src/lib/content/faq";
import { site } from "../../src/lib/site.config";

/* The site's three faces, same as layout.tsx loads them. */
const syne = loadSyne("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const inter = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["500", "700"], subsets: ["latin"] });

export const fonts = {
  display: syne.fontFamily,
  sans: inter.fontFamily,
  mono: mono.fontFamily,
};

/** Resolves once every face is usable — text is measured only after this. */
export const fontsReady = () =>
  Promise.all([syne.waitUntilDone(), inter.waitUntilDone(), mono.waitUntilDone()]);

/* The mark's own fills (components/brand/Logo.tsx) and the dark ground from
   public/icon.svg. The teal is the one cold pixel in the identity, used once
   per scene at most — that restraint is what makes it read as a signal. */
export const color = {
  ground: "#0D0E12",
  panel: "#161820",
  ink: "#F4F5F7",
  dim: "#9BA1AD",
  faint: "#5E6470",
  line: "rgba(255,255,255,0.08)",
  hot: "#FF4500",
  mid: "#FF6A00",
  warm: "#FF8C00",
  teal: "#00F5D4",
};

export const brand = {
  name: site.name,
  tagline: site.tagline,
  promise: site.promise,
  url: site.url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
  phone: site.contact.phoneDisplay,
  city: `${site.address.locality} · India`,
};

export const systems = pillars.map((p) => ({
  index: p.index,
  name: p.name,
  question: p.question,
}));

export const promises = commitments.map((c) => c.title);
